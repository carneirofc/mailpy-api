import { Db, ObjectID } from "mongodb";
import { collections } from "./setup";
import { GrantName, ConditionName } from "../../../src/entities";
import { listFromObjects } from "../../../src/helpers";
const { grants, roles, users } = collections;

export const conditionsEnum = {
  outOfrange: {
    _id: new ObjectID(),
    name: ConditionName.OUT_OF_RANGE,
    desc: "Must remain within the specified range.",
  },
  superiorThan: {
    _id: new ObjectID(),
    name: ConditionName.SUPERIOR_THAN,
    desc: "Must remain superior than.",
  },
  inferiorThan: {
    _id: new ObjectID(),
    name: ConditionName.INFERIOR_THAN,
    desc: "Must remain inferior than.",
  },
  increasingStep: {
    _id: new ObjectID(),
    name: ConditionName.INCREASING_STEP,
    desc: "Each increasing step triggers an alarm.",
  },
  decreasingStep: {
    _id: new ObjectID(),
    name: ConditionName.DECREASING_STEP,
    desc: "Each decreasing step triggers an alarm.",
  },
};

export const grantsEnum = {
  entriesDelete: {
    _id: new ObjectID(),
    name: GrantName.ENTRIES_DELETE,
    desc: "Delete an entry",
  },
  entriesInsert: {
    _id: new ObjectID(),
    name: GrantName.ENTRIES_INSERT,
    desc: "Insert a new entry",
  },
  entriesUpdate: {
    _id: new ObjectID(),
    name: GrantName.ENTRIES_UPDATE,
    desc: "Update every aspect of an entry",
  },
  groupsDelete: {
    _id: new ObjectID(),
    name: GrantName.GROUPS_DELETE,
    desc: "Delete a group",
  },
  groupsDisable: {
    _id: new ObjectID(),
    name: GrantName.GROUPS_DISABLE,
    desc: "Disable monitoring for a group",
  },
  groupsInsert: {
    _id: new ObjectID(),
    name: GrantName.GROUPS_INSERT,
    desc: "Add groups",
  },
  groupsUpdate: {
    _id: new ObjectID(),
    name: GrantName.GROUPS_UPDATE,
    desc: "Update every aspect of a group",
  },
  usersUpdate: {
    _id: new ObjectID(),
    name: GrantName.USERS_UPDATE,
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

const insertGrants = async (db: Db) => {
  const collection = db.collection(grants);
  const items = listFromObjects(grantsEnum);
  await collection.deleteMany({});
  await collection.insertMany(items);
};

const insertRoles = async (db: Db) => {
  const collection = db.collection(roles);
  const items = listFromObjects(defaultRoles);
  await collection.deleteMany({});
  await collection.insertMany(items);
};

export async function insertData(db: Db) {
  await insertGrants(db);
  await insertRoles(db);
}
