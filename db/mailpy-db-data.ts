import { Db, ObjectID } from "mongodb";
import { collections } from "./mailpy-db-setup";

const { conditions, entries, grants, groups, roles, users } = collections;

export const conditionsEnum = {
  outOfrange: {
    _id: new ObjectID(),
    name: "out of range",
    desc: "Must remain within the specified range.",
  },
  superiorThan: {
    _id: new ObjectID(),
    name: "superior than",
    desc: "Must remain superior than.",
  },
  inferiorThan: {
    _id: new ObjectID(),
    name: "inferior than",
    desc: "Must remain inferior than.",
  },
  increasingStep: {
    _id: new ObjectID(),
    name: "increasing step",
    desc: "Each increasing step triggers an alarm.",
  },
  decreasingStep: {
    _id: new ObjectID(),
    name: "decreasing step",
    desc: "Each decreasing step triggers an alarm.",
  },
};

export const grantsEnum = {
  entriesDelete: {
    _id: new ObjectID(),
    name: "entries.delete",
    desc: "Delete an entry",
  },
  entriesInsert: {
    _id: new ObjectID(),
    name: "entries.insert",
    desc: "Insert a new entry",
  },
  entriesUpdate: {
    _id: new ObjectID(),
    name: "entries.update",
    desc: "Update every aspect of an entry",
  },
  groupsDelete: {
    _id: new ObjectID(),
    name: "groups.delete",
    desc: "Delete a group",
  },
  groupsDisable: {
    _id: new ObjectID(),
    name: "groups.disable",
    desc: "Disable monitoring for a group",
  },
  groupsInsert: {
    _id: new ObjectID(),
    name: "groups.insert",
    desc: "Add groups",
  },
  groupsUpdate: {
    _id: new ObjectID(),
    name: "groups.update",
    desc: "Update every aspect of a group",
  },
  usersUpdate: {
    _id: new ObjectID(),
    name: "users.update",
    desc: "Update user attributes",
  },
};

interface Role {
  name: string;
  desc: string;
  grants: ObjectID[];
}
export const defaultRoles: { [key: string]: Role } = {
  Admin: {
    name: "Admin",
    desc: "Full control over the system",
    grants: [
      grantsEnum.entriesDelete._id,
      grantsEnum.entriesInsert._id,
      grantsEnum.entriesUpdate._id,
      grantsEnum.groupsDelete._id,
      grantsEnum.groupsDisable._id,
      grantsEnum.groupsInsert._id,
      grantsEnum.groupsUpdate._id,
      grantsEnum.usersUpdate._id,
    ],
  },
  Guest: {
    name: "Guest",
    desc: "Read-only",
    grants: [],
  },
};

const listFromObjects = (objs: any) => {
  /** Given an object where the key is the corresponding entry name, obtain a list */
  const items = [];
  for (let name in objs) {
    const obj = objs[name];
    items.push({ ...obj });
  }
  return items;
};

const insertConditions = async (db: Db) => {
  const collection = db.collection(conditions);
  const items = listFromObjects(conditionsEnum);
  return collection.insertMany(items);
};

const insertGrants = async (db: Db) => {
  const collection = db.collection(grants);
  const items = listFromObjects(grantsEnum);
  return await collection.insertMany(items);
};

const insertRoles = async (db: Db) => {
  const collection = db.collection(roles);
  const items = listFromObjects(defaultRoles);
  return await collection.insertMany(items);
};

export default function makeMailpyDbData({ makeDb }: { makeDb: () => Promise<Db> }) {
  const insertData = async () => {
    // console.log(`Initial database data`);
    const db = await makeDb();

    await insertConditions(db);
    await insertGrants(db);
    await insertRoles(db);
  };

  return Object.freeze({
    insertData,
  });
}
