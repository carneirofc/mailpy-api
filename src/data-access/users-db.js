import { ObjectID } from "mongodb";
import { collections } from "../../db/mailpy-db-setup";
import { DatabaseDuplicatedKeyError, InvalidPropertyError } from "../helpers/errors";
import { CodeDuplicatedKey } from "./error-codes";
const { users } = collections;

export default function makeUsersDb({ makeDb }) {
  /** Get a set of grants that this user has */
  const findGrants = async ({ uuid }) => {
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
        {
          $lookup: {
            from: "grants",
            localField: "roles.grants",
            foreignField: "_id",
            as: "grants",
          },
        },
        {
          $project: {
            "roles.grants": 0,
            "roles._id": 0,
            "roles.desc": 0,
            "grants.desc": 0,
          },
        },
      ])
      .toArray();

    if (results.length === 1) {
      const grants = new Set();
      results[0].grants.forEach((grant) => {
        grants.add(grant.name);
      });
      return grants;
    }
    return null;
  };

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
        roles: result.roles,
        grants: result.grants,
      });
    }
    return null;
  };

  const update = async ({ uuid, email, name, roles }) => {
    const db = await makeDb();
    const rolesId = roles.map((role) => new ObjectID(role));
    const result = await db.collection(users).updateOne(
      { uuid: uuid },
      {
        $set: {
          email: email,
          name: name,
          roles: rolesId,
        },
      }
    );
    return result.result.ok === 1 && result.result.n === 1;
  };

  const insert = async ({ uuid, email, name, roles }) => {
    const db = await makeDb();
    const rolesId = roles.map(({ id }) => new ObjectID(id));
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
    return { id: _id.toString(), ...data, roles: data.roles.map((id) => id.toString()) };
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
    findGrants,
    insert,
    update,
  });
}
