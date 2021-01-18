import makeDB from "../db";

const db = await makeDB();

const conditionsCollection = db.collection("conditions");
const entriesCollection = db.collection("entries");
const groupsCollection = db.collection("groups");
const usersCollection = db.collection("users");
const grantsCollection = db.collection("grants");

const getUser = async (id) => {
  const db = await db;

  return db.collection("users").findOne({
    id: { $eq: id },
  });
};

const createUser = async (id, name, email, grants) => {
  return usersCollection.insert({
    id: id,
    email: email,
    name: name,
    grants: grants,
  });
};

export const getGrants = async () => grantsCollection.find({});
export const getConditions = async () => conditionsCollection.find({});
export const getGroups = async () => groupsCollection.find({});
export const getEntries = async () => entriesCollection.find({});
