import { Db } from "mongodb";

const conditions = "conditions";
const groups = "groups";
const entries = "entries";

export const collections = Object.freeze({ conditions, entries, groups });

export async function setup(db: Db) {
  await createConditions(db); // Alarm conditions
  await createEntries(db); // Entries
  await crateGroups(db); // Group of entries
}

async function createConditions(db: Db) {
  db.createCollection(conditions, {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name", "desc"],
        properties: {
          name: {
            bsonType: "string",
            description: "Required string type",
          },
          desc: {
            bsonType: "string",
            description: "Required string type",
          },
        },
      },
    },
  });
  const collection = db.collection(conditions);
  await collection.createIndex({ name: 1 }, { unique: true });
}

async function crateGroups(db: Db) {
  await db.createCollection(groups, {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name", "enabled"],
        properties: {
          name: {
            bsonType: "string",
            description: "Group name",
          },
          enabled: {
            bsonType: "bool",
            description: "Is group enabled",
          },
        },
      },
    },
  });
  const collection = db.collection(groups);
  await collection.createIndex({ name: 1 }, { unique: true });
}

async function createEntries(db: Db) {
  db.createCollection(entries, {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "alarm_values",
          "condition",
          "email_timeout",
          "emails",
          "group",
          "pvname",
          "subject",
          "unit",
          "warning_message",
        ],
        properties: {
          alarm_values: { bsonType: "string" },
          condition: { bsonType: "string" },
          email_timeout: { bsonType: "int" },
          emails: { bsonType: "string" },
          group: { bsonType: "objectId" },
          pvname: { bsonType: "string" },
          subject: { bsonType: "string" },
          unit: { bsonType: "string" },
          warning_message: { bsonType: "string" },
        },
      },
    },
  });
  const collection = db.collection(entries);
  await collection.createIndex({ pvname: 1, emails: 1, condition: 1, alarm_values: 1 }, { unique: true });
}
