import {
  collections
} from "../../db/mailpy-db-setup";
import { DatabaseDuplicatedKeyError, InvalidPropertyError } from "../helpers/errors";
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
    return result.map(({ _id: id, ...data }) => ({ id: id.toString(), ...data }));
  }

  const findAllConditions = async () => {
    const db = await makeDb();
    const result = await db.collection(conditions).find({}).toArray();
    return result.map(({ _id: id, ...data }) => ({ id: id.toString(), ...data }));
  };

  const findAllEntries = async () => {
    const db = await makeDb();
    const result = await db.collection(entries).find({}).toArray();
    return result.map(({ _id: id, ...data }) => ({ id: id.toString(), ...data }));
  };

  async function findAllGroups() {
    const db = await makeDb();
    const result = await db.collection(groups).find({}).toArray();
    return result.map(({ _id: id, ...data }) => ({ id: id.toString(), ...data }));
  }

  const findUserByUUID = async ({ uuid }) => {
    /** using aggregate to also get the roles (left join) */
    const db = await makeDb();
    const results = await db.collection(users).aggregate(
      [
        { "$match": { "uuid": uuid } },
        {
          "$lookup": {
            "from": "roles",
            "localField": "roles",
            "foreignField": "name",
            "as": "roles"
          }
        }]).toArray();

    if (result.length === 1) {
      const result = results[0];
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
      throw error;
    });

    // Return the inserted object
    const { _id, ...data } = result.ops[0];
    return { id: _id.toString(), ...data };
  };

  const deleteUserByUUID = async ({ uuid }) => {
    if (!uuid) {
      throw new InvalidPropertyError("UUI cannot be null");
    }
    const db = await makeDb();
    const result = await db.collection(users).deleteOne({
      "uuid": { "$eq": uuid }
    });
    return result.deletedCount;
  }

  return Object.freeze({
    findAllConditions,
    findAllEntries,
    findAllGroups,
    findAllGrants,
    findAllRoles,
    findUserByUUID,
    deleteUserByUUID,
    insertUser
  });

};