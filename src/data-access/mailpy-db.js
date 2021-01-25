import { collections } from "../../db/mailpy-db-setup";
const { conditions, entries, grants, groups, roles, users } = collections;

export default function makeMailpyDb({ makeDb }) {
  const findAllRoles = async () => {
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
  };

  const findAllGrants = async () => {
    const db = await makeDb();
    const result = await db.collection(grants).find({}).toArray();
    return result.map(({ _id: id, ...data }) => ({ id: id.toString(), ...data }));
  };

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

  return Object.freeze({
    findAllConditions,
    findAllEntries,
    findAllGroups,
    findAllGrants,
    findAllRoles,
  });
}
