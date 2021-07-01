import { Condition, ConditionName, Entry, Group, makeCondition, makeEntry, makeGroup } from "../entities";
import { collections } from "../../fixtures/db/mailpy-db-setup";
import { MakeDb } from "./interfaces";
import { ObjectId } from "mongodb";
const { conditions, entries, groups } = collections;

export interface MailpyDB {
  findAllConditions: () => Promise<Condition[]>;
  findAllEntries: () => Promise<Entry[]>;
  findAllGroups: () => Promise<Group[]>;

  findCondition: (id: string) => Promise<Condition>;
  findEntry: (id: string) => Promise<Entry>;
  findGroup: (id: string) => Promise<Group>;

  createGroup: (group: Group) => Promise<Group>;
  createEntry: (entry: Entry) => Promise<Entry>;

  updateGroup: (group: Group) => Promise<Group>;
  updateEntry: (entry: Entry) => Promise<Entry>;
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
    return makeGroup({ desc, name, enabled });
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
    async updateGroup(group: Group): Promise<Group> {
      throw "Not Impplemented";
    }
    async updateEntry(entry: Entry): Promise<Entry> {
      throw "Not Impplemented";
    }
    async createEntry(entry: Entry): Promise<Entry> {
      throw "Not Impplemented";
    }

    async createGroup(group: Group): Promise<Group> {
      throw "Not Impplemented";
    }

    async findCondition(id: string): Promise<Condition> {
      const db = await makeDb();
      throw "Not Impplemented";
    }

    async findEntry(id: string): Promise<Entry> {
      const db = await makeDb();
      throw "Not Impplemented";
    }

    async findGroup(id: string): Promise<Group> {
      const db = await makeDb();
      throw "Not Impplemented";
    }

    async findAllConditions(): Promise<Condition[]> {
      const db = await makeDb();
      const result = await db.collection(conditions).find({}).toArray();
      return result.map(({ _id: id, desc, name }: ConditionJsonObj) => {
        return {
          id: id.toHexString(),
          desc,
          name,
        };
      });
    }

    async findAllGroups(): Promise<Group[]> {
      const db = await makeDb();
      const result = await db.collection(groups).find({}).toArray();
      return result.map(({ _id: id, name, desc, enabled }: GroupJsonObj) => {
        return { id: id.toHexString(), name, desc, enabled };
      });
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
        ])
        .toArray();
      return result.map(({ _id: id, ...data }) => {
        return { id: id.toString(), ...data };
      });
    }
  }
  return Object.freeze(new MailpyDBImpl());
}
