const config = require("../config");
const monk = require("monk");
const { Logger } = require("mongodb");

const db = monk(config.db.MONGODB_URI);
const conditionsCollection = db.get("conditions");
const entriesCollection = db.get("entries");
const groupsCollection = db.get("groups");
const usersCollection = db.get("users");
const grantsCollection = db.get("grants");

const getUser = async (id) => {
    return usersCollection.findOne({
        "id": { "$eq": id }
    });
}
const createUser = async (id, name, email, grants) => {
    return usersCollection.insert({
        "id": id,
        "email": email,
        "name": name,
        "grants": grants
    });
}
const getGrants = async () => grantsCollection.find({});
const getConditions = async () => conditionsCollection.find({});
const getGroups = async () => groupsCollection.find({});
const getEntries = async () => entriesCollection.find({});


module.exports = {
    getUser: getUser,
    createUser: createUser,
    getGrants: getGrants,
    getConditions: getConditions,
    getEntries: getEntries,
    getGroups: getGroups,
}
