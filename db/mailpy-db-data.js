import {
  collections
} from "./mailpy-db-setup";

const {
  conditions,
  entries,
  grants,
  groups,
  roles,
  users
} = collections;

export const conditionsEnum = {
  "out of range": { desc: "Must remain within the specified range." },
  "superior than": { desc: "Must remain superior than." },
  "inferior than": { desc: "Must remain inferior than." },
  "increasing step": { desc: "Each increasing step triggers an alarm." },
  "decreasing step": { desc: "Each decreasing step triggers an alarm." },
};

export const grantsEnum = {
  "entries.delete": { desc: "Delete an entry" },
  "entries.insert": { desc: "Insert a new entry" },
  "entries.update": { desc: "Update every aspect of an entry" },
  "groups.delete": { desc: "Delete a group" },
  "groups.disable": { desc: "Disable monitoring for a group" },
  "groups.insert": { desc: "Add groups" },
  "groups.update": { desc: "Update every aspect of a group" },
  "users.update": { desc: "Update user attributes" },
};

export const defaultRoles = {
  Admin: {
    desc: "Full control over the system",
    grants: [
      grantsEnum["entries.delete"],
      grantsEnum["entries.insert"],
      grantsEnum["entries.update"],
      grantsEnum["groups.delete"],
      grantsEnum["groups.disable"],
      grantsEnum["groups.insert"],
      grantsEnum["groups.update"],
      grantsEnum["users.update"]
    ]
  },
  Guest: {
    desc: "Read-only",
    grants: []
  }
};

const listFromObjects = (objs) => {
  /** Given an object where the key is the corresponding entry name, obtain a list */
  const items = [];
  for (let name in objs) {
    const obj = objs[name];
    items.push({ ...obj, name: name });
  }
  return items;
}

const insertConditions = async (db) => {
  const collection = db.collection(conditions);
  const items = listFromObjects(conditionsEnum);
  return collection.insertMany(items);
}

const insertGrants = async (db) => {
  const collection = db.collection(grants);
  const items = listFromObjects(grantsEnum);
  return await collection.insertMany(items);
}

const insertRoles = async (db) => {
  const collection = db.collection(roles);
  const items = listFromObjects(defaultRoles);
  return await collection.insertMany(items);
}


export default function makeMailpyDbData({ makeDb }) {
  const insertData = async () => {
    console.log(`Initial database data`);
    const db = await makeDb();

    await insertConditions(db);
    await insertGrants(db);
    await insertRoles(db);

  }

  return Object.freeze({
    insertData
  });
}