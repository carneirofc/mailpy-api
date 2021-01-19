const conditions = "conditions";
const groups = "groups";
const entries = "entries";
const users = "users";

export default function makeMailpyDb({ makeDb }) {

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
    findUserById,
    insertUser
  });

};