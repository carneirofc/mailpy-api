import { Condition, ConditionName, ConditionNameHas, Entry, Event, Group, makeEntry, makeGroup } from "../entities";
import { collections } from "../../fixtures/db/mailpy-db-setup";
import { MakeDb } from "./interfaces";
import { ObjectId, Timestamp } from "mongodb";
import { DatabaseDuplicatedKeyError, DatabaseError, InvalidPropertyError } from "../helpers/errors";
import { deepCopy } from "../helpers/deep-copy";
import { CodeDuplicatedKey } from "./error-codes";

const { conditions, entries, groups } = collections;

export interface MailpyDB {
  findAllConditions: () => Promise<Condition[]>;
  findAllEntries: () => Promise<Entry[]>;
  findAllGroups: () => Promise<Group[]>;
  findAllEvents: () => Promise<Event[]>;

  findConditionById: (id: string) => Promise<Condition>;
  findConditionByName: (name: string) => Promise<Condition>;
  findEntryById: (id: string) => Promise<Entry>;
  findGroupById: (id: string) => Promise<Group>;

  createGroup: (group: Group) => Promise<Group>;
  createEntry: (entry: Entry) => Promise<Entry>;

  updateGroup: (group: Group) => Promise<Group>;
  updateEntry: (entry: Entry) => Promise<Entry>;

  deleteGroupById: (id: string) => Promise<boolean>;
  deleteGroup: (group: Group) => Promise<boolean>;

  deleteEntryById: (id: string) => Promise<boolean>;
}

export default function makeMailpyDb({ makeDb }: { makeDb: MakeDb }): MailpyDB {
  type GroupJsonObj = {
    _id: ObjectId;
    name: string;
    desc: string;
    enabled: boolean;
  };

  type ConditionJsonObj = {
    _id: ObjectId;
    name: ConditionName;
    desc: string;
  };

  type EntryJsonObj = {
    _id: ObjectId;
    alarm_values: string;
    condition: string;
    condition_lookup?: ConditionJsonObj;
    email_timeout: number;
    emails: string;
    group?: string;
    group_id: ObjectId;
    group_lookup?: GroupJsonObj;
    pvname: string;
    subject: string;
    unit: string;
    warning_message: string;
  };

  type EventJsonObj = {
    type: number;
    ts: Timestamp;
    _id: ObjectId;
  };

  function parseEvent({ _id, ts, type, ...data }: EventJsonObj): Event {
    return { id: _id.toHexString(), ts: new Date(ts.getHighBits() * 1000), type, data };
  }

  function parseGroup({ _id, name, desc, enabled }: GroupJsonObj): Group {
    return makeGroup({ id: _id.toHexString(), desc: desc ? desc : `Group ${name}`, name, enabled });
  }

  function parseCondition({ _id, name, desc }: ConditionJsonObj): Condition {
    if (!ConditionNameHas(name)) {
      throw new InvalidPropertyError(`Condition name "${name}" is invalid ${ConditionName}`);
    }
    return { id: _id.toHexString(), name, desc };
  }

  function parseEntry({ _id, condition, group, condition_lookup, emails, group_lookup, ...data }: EntryJsonObj): Entry {
    console.log({ _id, condition, group, condition_lookup, emails, group_lookup, ...data });

    return makeEntry({
      id: _id.toHexString(),
      emails: emails.split(";"),
      group: parseGroup(group_lookup),
      condition: parseCondition(condition_lookup),
      ...data,
    });
  }

  class MailpyDBImpl implements MailpyDB {
    async deleteEntryById(id: string): Promise<boolean> {
      if (id === null || id === undefined) {
        throw new InvalidPropertyError(`Cannot delete entry with undefined id "${id}"`);
      }
      const db = await makeDb();
      const res = await db.collection<EntryJsonObj>(entries).deleteOne({ _id: new ObjectId(id) });
      return res.deletedCount === 1;
    }

    async getGroupUsedCount(id: string): Promise<number> {
      const db = await makeDb();
      const res = await db
        .collection(groups)
        .aggregate([
          { $match: { _id: new ObjectId(id) } },
          /* due to compatibility reasons, the field group_id and group may be present in a document */
          { $lookup: { from: entries, localField: "_id", foreignField: "group_id", as: "entries_lookup" } },
          {
            $project: {
              count: { $cond: { if: { $isArray: "$entries_lookup" }, then: { $size: "$entries_lookup" }, else: 0 } },
            },
          },
        ])
        .toArray();
      return res[0]?.count;
    }

    async deleteGroupById(id: string): Promise<boolean> {
      if (id === null || id === undefined) {
        throw new InvalidPropertyError(`Cannot delete group with undefined id "${id}"`);
      }

      const count = await this.getGroupUsedCount(id);
      if (count !== undefined && count !== 0) {
        console.warn(`Cannot delete group that is being used. Use count ${count}`);
        return false;
      }

      const db = await makeDb();
      const res = await db.collection<GroupJsonObj>(groups).deleteOne({ _id: new ObjectId(id) });
      return res.deletedCount === 1;
    }

    async deleteGroup(group: Group): Promise<boolean> {
      return await this.deleteGroupById(group.id);
    }

    async updateGroup(group: Group): Promise<Group> {
      const db = await makeDb();

      if (group.id === null || group.id === undefined) {
        throw new InvalidPropertyError(`Cannot update group without an id ${group}`);
      }

      const res = await db
        .collection<GroupJsonObj>(groups)
        .updateOne(
          { _id: new ObjectId(group.id) },
          { $set: { name: group.name, enabled: group.enabled, desc: group.desc } }
        );
      if (res.result.nModified !== 1) {
        throw new DatabaseError(`Failure on group update "${group}"`);
      }
      return await this.findGroupById(group.id);
    }

    async updateEntry(entry: Entry): Promise<Entry> {
      if (entry.id === undefined || entry.id === null) {
        throw new InvalidPropertyError(`Failed to update entry, id cannot be empty`);
      }
      if (!entry.group) {
        throw new InvalidPropertyError(`Failed to update entry ${entry.id}, group is required `);
      }

      const db = await makeDb();
      const { id, group, condition, emails, ...data } = entry;
      const res = await db
        .collection<EntryJsonObj>(entries)
        .updateOne(
          { _id: new ObjectId(entry.id) },
          { $set: { ...data, emails: emails.join(";"), condition: condition.name, group_id: new ObjectId(group.id) } }
        );
      if (res.result.nModified !== 1) {
        throw new DatabaseError(`Failure on group update "${group}"`);
      }
      return await this.findEntryById(entry.id);
    }

    async createEntry(entry: Entry): Promise<Entry> {
      const db = await makeDb();

      const groupCheck = await db.collection<GroupJsonObj>(groups).findOne({ _id: new ObjectId(entry.group.id) });
      if (!groupCheck) {
        throw new InvalidPropertyError(`Cannot create entry, group is invalid "${entry.group.id} ${entry.group.name}"`);
      }

      const res = await db.collection<EntryJsonObj>(entries).insertOne({
        alarm_values: entry.alarm_values,
        email_timeout: entry.email_timeout,
        emails: entry.emails.join(";"),
        pvname: entry.pvname,
        warning_message: entry.warning_message,
        subject: entry.subject,
        unit: entry.unit,
        condition: entry.condition.name,
        group_id: new ObjectId(entry.group.id),
      });
      const entryResult = res.ops[0];
      const newEntry = deepCopy(entry);
      newEntry.id = entryResult._id.toHexString();
      return newEntry;
    }

    async createGroup(group: Group): Promise<Group> {
      const db = await makeDb();
      const res = await db
        .collection<GroupJsonObj>(groups)
        .insertOne({
          name: group.name,
          desc: group.desc,
          enabled: group.enabled,
        })
        .catch((error) => {
          const { code, message } = error;
          if (code == CodeDuplicatedKey) {
            throw new DatabaseDuplicatedKeyError(message);
          }
          throw error;
        });

      return parseGroup(res.ops[0]);
    }

    async findConditionByName(name: ConditionName): Promise<Condition> {
      const db = await makeDb();
      const res = await db.collection<ConditionJsonObj>(conditions).findOne({ name: name });
      return parseCondition(res);
    }

    async findConditionById(id: string): Promise<Condition> {
      const db = await makeDb();
      const res = await db.collection<ConditionJsonObj>(conditions).findOne({ _id: new ObjectId(id) });
      return parseCondition(res);
    }

    async findEntryById(id: string): Promise<Entry> {
      const db = await makeDb();
      const res = await db
        .collection<EntryJsonObj>(entries)
        .aggregate([
          { $match: { _id: new ObjectId(id) } },
          { $lookup: { from: conditions, localField: "condition", foreignField: "name", as: "condition_lookup" } },
          { $unwind: { path: "$condition_lookup", preserveNullAndEmptyArrays: true } },
          { $lookup: { from: groups, localField: "group_id", foreignField: "_id", as: "group_lookup" } },
          { $unwind: { path: "$group_lookup", preserveNullAndEmptyArrays: true } },
        ])
        .toArray();
      if (res.length !== 1) {
        return null;
      }
      return parseEntry(res[0]);
    }

    async findAllEvents(): Promise<Event[]> {
      const db = await makeDb();
      const res = await db.collection<EventJsonObj>("events").find({}).toArray();
      return res.map((e) => parseEvent(e));
    }

    async findGroupById(id: string): Promise<Group> {
      const db = await makeDb();
      const res = await db.collection<GroupJsonObj>(groups).findOne({ _id: new ObjectId(id) });
      return parseGroup(res);
    }

    async findAllConditions(): Promise<Condition[]> {
      const db = await makeDb();
      const result = await db.collection<ConditionJsonObj>(conditions).find({}).toArray();
      return result.map((conditionJson: ConditionJsonObj) => parseCondition(conditionJson));
    }

    async findAllGroups(): Promise<Group[]> {
      const db = await makeDb();
      const result = await db.collection<GroupJsonObj>(groups).find({}).toArray();
      return result.map((groupJson: GroupJsonObj) => parseGroup(groupJson));
    }

    async findAllEntries(): Promise<Entry[]> {
      const db = await makeDb();
      const result = await db
        .collection(entries)
        .aggregate([
          /* due to compatibility reasons, the field group_id and group may be present in a document */
          { $lookup: { from: "groups", localField: "group_id", foreignField: "_id", as: "group_lookup" } },
          { $unwind: { path: "$group_lookup", preserveNullAndEmptyArrays: true } },
          { $lookup: { from: conditions, localField: "condition", foreignField: "name", as: "condition_lookup" } },
          { $unwind: { path: "$condition_lookup", preserveNullAndEmptyArrays: true } },
        ])
        .toArray();
      return result.map((entryJson) => parseEntry(entryJson));
    }
  }
  return Object.freeze(new MailpyDBImpl());
}
