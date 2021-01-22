import {
  collections
} from "../../db/mailpy-db-setup";
import { DatabaseDuplicatedKeyError } from "../helpers/errors";
import { CodeDuplicatedKey } from "./error-codes";
const {
  conditions,
  entries,
  grants,
  groups,
  roles,
  users,
} = collections;


export default function makeMailpyDb({
  makeDb
}) {

  const findAllRoles = async () => {
    const db = await makeDb();
    const result = await db.collection(roles).find({}).toArray();
    return result.map(({ _id: id, ...data }) => ({ id: id.toString(), ...data }));
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

  const findUserByUUID = async (uuid) => {
    const db = await makeDb();
    const result = db.collection(users).findOne({
      uuid: { $eq: uuid },
    });
    if (result) {
      return Object.freeze({
        id: result._id.toString(),
        uuid: result.uuid,
        name: result.name,
        email: result.email,
        groups: result.groups,
      });
    }
    return null;
  }

  const insertUser = async ({ uuid, email, name, roles }) => {
    const db = await makeDb();
    const result = await db.collection(users).insertOne({
      uuid: uuid,
      email: email,
      name: name,
      roles: roles,
    }).catch(error => {
      const { code, message } = error;
      if (code == CodeDuplicatedKey) {
        throw new DatabaseDuplicatedKeyError(message);
      }
      throw new error;
    });

    // Return the inserted object
    return result.ops[0];
  };

  const deleteUserByUUID = async ({ uuid }) => {
    const db = await makeDb();
  }

  return Object.freeze({
    findAllConditions,
    findAllEntries,
    findAllGroups,
    findAllGrants,
    findAllRoles,
    findUserByUUID,
    insertUser
  });

};