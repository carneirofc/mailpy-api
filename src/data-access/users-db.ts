import { ObjectID } from "mongodb";

import { databaseCollections } from "../../fixtures/db/mailpy-db-setup";
import { DatabaseDuplicatedKeyError, InvalidPropertyError } from "../helpers/errors";
import { Grant, Role, User } from "../entities/user";
import { CodeDuplicatedKey } from "./error-codes";
import { MakeDb } from "./interfaces";

const { users, grants, roles } = databaseCollections;

export interface UsersDb {
  findAllGrants: () => Promise<Grant[]>;
  findAllRoles: () => Promise<Role[]>;
  findGrants: (uuid: string) => Promise<Set<string> | null>;
  findByUUID: (uuid: string) => Promise<User | null>;
  update: (user: User) => Promise<boolean>;
  insert: (user: User) => Promise<User | null>;
  delete: (user: User) => Promise<number>;
  deleteByUUID: (uuid: string) => Promise<number>;
}

export default function makeUsersDb({ makeDb }: { makeDb: MakeDb }) {
  /** Get a set of grants that this user has */
  class UsersDbImpl implements UsersDb {
    async findAllRoles() {
      const db = await makeDb();
      const result = await db
        .collection(roles)
        .aggregate([
          {
            $lookup: {
              from: "grants",
              localField: "grants",
              foreignField: "_id",
              as: "grants",
            },
          },
        ])
        .toArray();
      return result.map(({ _id: id, ...data }) => ({ id: id.toString(), ...data }));
    }

    async findAllGrants() {
      const db = await makeDb();
      const result = await db.collection(grants).find({}).toArray();
      return result.map(({ _id: id, ...data }) => ({ id: id.toString(), ...data }));
    }

    async findGrants(uuid: string): Promise<Set<string> | null> {
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
        const grants = new Set<string>();
        results[0].grants.forEach((grant: { desc: string; name: string; _id: ObjectID | undefined }) => {
          grants.add(grant.name);
        });
        return grants;
      }
      return null;
    }

    async findByUUID(uuid: string): Promise<User | null> {
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
    }

    async update(user: User): Promise<boolean> {
      const db = await makeDb();
      const rolesId = user.roles.map((role) => new ObjectID(role));
      const result = await db.collection(users).updateOne(
        { uuid: user.uuid },
        {
          $set: {
            email: user.email,
            name: user.name,
            roles: rolesId,
          },
        }
      );
      return result.result.ok === 1 && result.result.n === 1;
    }

    async insert(user: User): Promise<User> {
      const db = await makeDb();
      const rolesId = user.roles.map((id) => new ObjectID(id));
      const result = await db
        .collection(users)
        .insertOne({
          uuid: user.uuid,
          email: user.email,
          name: user.name,
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
      return { id: _id.toString(), ...data, roles: data.roles.map((id: any) => id.toString()) };
    }

    async deleteByUUID(uuid: string): Promise<number> {
      if (!uuid) {
        throw new InvalidPropertyError("UUI cannot be null");
      }
      const db = await makeDb();
      const result = await db.collection(users).deleteOne({
        uuid: { $eq: uuid },
      });
      return result.deletedCount;
    }

    async delete(user: User): Promise<number> {
      const uuid = user.uuid;
      return await this.deleteByUUID(uuid);
    }
  }
  return new UsersDbImpl();
}
