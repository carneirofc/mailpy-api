import { ObjectID } from "mongodb";

import { databaseCollections } from "../../fixtures/db/mailpy-db-setup";
import { DatabaseDuplicatedKeyError, InvalidPropertyError } from "../helpers/errors";
import { Grant, Role, User } from "../entities/user";
import { CodeDuplicatedKey } from "./error-codes";
import { MakeDb } from "./interfaces";
import { deepCopy } from "../helpers/deep-copy";

const { users, grants, roles } = databaseCollections;

export interface UsersDb {
  findAllGrants: () => Promise<Grant[]>;
  findAllRoles: () => Promise<Role[]>;

  findUserGrants: (uuid: string) => Promise<Set<string> | null>;
  findUserByUUID: (uuid: string) => Promise<User | null>;

  updateUser: (user: User) => Promise<boolean>;
  insertUser: (user: User) => Promise<User | null>;
  deleteUser: (user: User) => Promise<number>;
  deleteUserByUUID: (uuid: string) => Promise<number>;
}

export default function makeUsersDb({ makeDb }: { makeDb: MakeDb }) {
  /** Get a set of grants that this user has */
  type GrantJsonObj = { _id: ObjectID; name: string; desc: string };
  type RoleJsonObj = { _id: ObjectID; name: string; desc: string; grants: GrantJsonObj[] };
  type UserJsonObj = { _id: ObjectID; name: string; uuid: string; email: string; roles: RoleJsonObj[] };

  const parseGrant = ({ _id, name, desc }: GrantJsonObj): Grant => {
    return { id: _id.toString(), name, desc };
  };
  const parseRole = ({ _id, name, desc, grants }: RoleJsonObj): Role => {
    const validGrants = grants.filter((grant) => grant._id !== undefined);
    return { id: _id.toString(), name, desc, grants: validGrants.map(parseGrant) };
  };
  const parseUser = ({ _id, name, email, roles, uuid }: UserJsonObj): User => {
    const validRoles = roles.filter((role) => role._id !== undefined);
    return { id: _id.toString(), name, email, uuid, roles: validRoles.map(parseRole) };
  };

  class UsersDbImpl implements UsersDb {
    async findAllRoles(): Promise<Role[]> {
      const db = await makeDb();
      const result: RoleJsonObj[] = await db
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
      return result.map(parseRole);
    }

    async findAllGrants(): Promise<Grant[]> {
      const db = await makeDb();
      const result: GrantJsonObj[] = await db.collection(grants).find({}).toArray();
      return result.map(parseGrant);
    }

    async findUserGrants(uuid: string): Promise<Set<string> | null> {
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

    async findUserByUUID(uuid: string): Promise<User> {
      /** using aggregate to also get the roles (left join) */
      const db = await makeDb();
      const results = await db
        .collection(users)
        .aggregate([
          { $match: { uuid: uuid } },
          { $lookup: { from: "roles", localField: "roles", foreignField: "_id", as: "roles" } },
          { $unwind: { path: "$roles", preserveNullAndEmptyArrays: true } },
          { $lookup: { from: "grants", localField: "roles.grants", foreignField: "_id", as: "roles.grants" } },
          {
            $group: {
              _id: "$_id",
              uuid: { $first: "$uuid" },
              email: { $first: "$email" },
              name: { $first: "$name" },
              desc: { $first: "$desc" },
              roles: { $push: "$roles" },
            },
          },
        ])
        .toArray();

      if (results.length !== 1) {
        return null;
      }

      const result: UserJsonObj = results[0];

      return Object.freeze(parseUser(result));
    }

    async updateUser(user: User): Promise<boolean> {
      const db = await makeDb();
      const rolesId = user.roles.map((role) => new ObjectID(role.id));
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

    async insertUser(user: User): Promise<User> {
      const db = await makeDb();
      const rolesId = user.roles.map((role) => new ObjectID(role.id));
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

      // Return the inserted object with the new id
      const { _id } = result.ops[0];
      const copyUser = deepCopy(user);
      return { ...copyUser, id: _id.toString() };
    }

    async deleteUserByUUID(uuid: string): Promise<number> {
      if (!uuid) {
        throw new InvalidPropertyError("UUI cannot be null");
      }
      const db = await makeDb();
      const result = await db.collection(users).deleteOne({
        uuid: { $eq: uuid },
      });
      return result.deletedCount;
    }

    async deleteUser(user: User): Promise<number> {
      const uuid = user.uuid;
      return await this.deleteUserByUUID(uuid);
    }
  }
  return new UsersDbImpl();
}
