import { ObjectID } from "mongodb";
import { collections } from "../../db/mailpy-db-setup";
import { DatabaseDuplicatedKeyError, InvalidPropertyError } from "../helpers/errors";
import { CodeDuplicatedKey } from "./error-codes";
const { users } = collections;

export default function makeUsersDb({ makeDb }) {
  const findByUUID = async ({ uuid }) => {
    /** using aggregate to also get the roles (left join) */
    const db = await makeDb();
    const results = await db
      .collection(users)
      .aggregate([
        { $match: { uuid: uuid } },
        {
          $lookup: {
            from: "roles",
            localField: "roles",
            foreignField: "_id",
            as: "roles",
          },
        },
      ])
      .toArray();

    if (results.length === 1) {
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
  };

  const insert = async ({ uuid, email, name, roles }) => {
    const db = await makeDb();
    const rolesId = roles.map(({ id }) => {
      _id: ObjectID(id);
    });
    const result = await db
      .collection(users)
      .insertOne({
        uuid: uuid,
        email: email,
        name: name,
        roles: rolesId,
      })
      .catch((error) => {
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

  const deleteByUUID = async ({ uuid }) => {
    if (!uuid) {
      throw new InvalidPropertyError("UUI cannot be null");
    }
    const db = await makeDb();
    const result = await db.collection(users).deleteOne({
      uuid: { $eq: uuid },
    });
    return result.deletedCount;
  };

  return Object.freeze({
    deleteByUUID,
    findByUUID,
    insert,
  });
}
