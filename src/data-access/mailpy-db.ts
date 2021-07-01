import { Condition, ConditionName, Entry, Group, makeCondition, makeEntry, makeGroup } from "../entities";
import { collections } from "../../fixtures/db/mailpy-db-setup";
import { MakeDb } from "./interfaces";
import { ObjectId } from "mongodb";
import { DatabaseDuplicatedKeyError, DatabaseError, InvalidPropertyError } from "../helpers/errors";
import { CodeDuplicatedKey } from "./error-codes";

const { conditions, entries, groups } = collections;

export interface MailpyDB {
  findAllConditions: () => Promise<Condition[]>;
  findAllEntries: () => Promise<Entry[]>;
  findAllGroups: () => Promise<Group[]>;

  findConditionById: (id: string) => Promise<Condition>;
  findEntryById: (id: string) => Promise<Entry>;
  findGroupById: (id: string) => Promise<Group>;

  createGroup: (group: Group) => Promise<Group>;
  createEntry: (entry: Entry) => Promise<Entry>;

  updateGroup: (group: Group) => Promise<Group>;
  updateEntry: (entry: Entry) => Promise<Entry>;

  deleteGroupById: (id: string) => Promise<boolean>;
  deleteGroup: (group: Group) => Promise<boolean>;

  deleteEntryById: (id: string) => Promise<boolean>;
  deleteEntry: (entry: Entry) => Promise<boolean>;
}

export default function makeMailpyDb({ makeDb }: { makeDb: MakeDb }): MailpyDB {
  type GroupJsonObj = { _id: ObjectId; name: string; desc: string; enabled: boolean };
  type ConditionJsonObj = { _id: ObjectId; name: ConditionName; desc: string };
  type EntryJsonObj = {
    _id: ObjectId;
    alarm_values: string;
    condition: ConditionJsonObj;
    email_timeout: number;
    emails: string;
    group: GroupJsonObj;
    pvname: string;
    subject: string;
    unit: string;
    warning_message: string;
  };

  function parseGroup({ _id, name, desc, enabled }: GroupJsonObj): Group {
    return makeGroup({ id: _id.toHexString(), desc, name, enabled });
  }
  function parseCondition({ _id, name, desc }: ConditionJsonObj): Condition {
    return { id: _id.toHexString(), name, desc };
  }
  function parseEntry({ _id, condition, emails, group, ...data }: EntryJsonObj): Entry {
    return makeEntry({
      id: _id.toHexString(),
      emails: emails.split(";"),
      group: parseGroup(group),
      condition: parseCondition(condition),
      ...data,
    });
  }

  class MailpyDBImpl implements MailpyDB {
    deleteEntryById: (id: string) => Promise<boolean>;
    deleteEntry: (entry: Entry) => Promise<boolean>;

    async deleteGroupById(id: string): Promise<boolean> {
      if (id === null || id === undefined) {
        throw new InvalidPropertyError(`Cannot delete group with undefined id "${id}"`);
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
      throw "Not Impplemented";
    }

    async createEntry(entry: Entry): Promise<Entry> {
      throw "Not Impplemented";
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

    async findConditionById(id: string): Promise<Condition> {
      const db = await makeDb();
      throw "Not Impplemented";
    }

    async findEntryById(id: string): Promise<Entry> {
      const db = await makeDb();
      throw "Not Impplemented";
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
          {
            $lookup: {
              from: "groups",
              localField: "group",
              foreignField: "name",
              as: "group",
            },
          },
          {
            $lookup: {
              from: "conditions",
              localField: "condition",
              foreignField: "name",
              as: "condition",
            },
          },
        ])
        .toArray();
      return result.map((entryJson) => parseEntry(entryJson));
    }
  }
  return Object.freeze(new MailpyDBImpl());
}
