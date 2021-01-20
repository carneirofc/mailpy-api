import {
  collections
} from "../../db/mailpy-db-setup";

const {
  conditions,
  entries,
  grants,
  groups,
  roles,
  users,
} = collections;

export default function makeMailpyDb({ makeDb }) {

  const findAllRoles = async () => {
    const db = await makeDb();
    const result = await db.collection(roles).find({}).toArray();
    return result;
  }

  const findAllGrants = async () => {
    const db = await makeDb();
    const result = await db.collection(grants).find({}).toArray();
    return result;
  }

  const findAllConditions = async () => {
    const db = await makeDb();
    const result = await db.collection(conditions).find({}).toArray();
    return result;
  };

  const findAllEntries = async () => {
    const db = await makeDb();
    const result = await db.collection(entries).find({}).toArray();
    return result;
  };

  async function findAllGroups() {
    const db = await makeDb();
    const result = await db.collection(groups).find({}).toArray();
    return result;
  }

  const findUserById = async (id) => {
    const db = await makeDb();
    const result = db.collection(users).findOne({
      id: { $eq: id },
    });
    if (result) {
      //@todo: Have a user type
      return result;
    }
    return null;
  }

  const insertUser = async ({ id, email, name, grants }) => {
    const db = await makeDb();
    const result = await db.collection(users).insert({
      id: id,
      email: email,
      name: name,
      grants: grants,
    });

    // Return the inserted object
    return result.ops[0];
  };

  return Object.freeze({
    findAllConditions,
    findAllEntries,
    findAllGroups,
    findAllGrants,
    findAllRoles,
    findUserById,
    insertUser
  });

};