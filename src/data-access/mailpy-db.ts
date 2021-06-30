import { Condition, Entry, Group } from "../entities";
import { databaseCollections } from "../../fixtures/db/mailpy-db-setup";
import { MakeDb } from "./interfaces";
const { conditions, entries, groups } = databaseCollections;

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
      return result.map(({ _id: id, desc, name }) => {
        return {
          id: id.toString(),
          desc,
          name,
        };
      });
    }

    async findAllGroups(): Promise<Group[]> {
      const db = await makeDb();
      const result = await db.collection(groups).find({}).toArray();
      return result.map(({ _id: id, name, desc, ...data }) => {
        return { id: id.toString(), name, desc };
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
