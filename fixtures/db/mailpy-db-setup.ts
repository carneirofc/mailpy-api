import { Db } from "mongodb";

const conditions = "conditions";
const groups = "groups";
const entries = "entries";

const users = "users";
const roles = "roles";
const grants = "grants";

export const databaseCollections: { [key: string]: string } = Object.freeze({
  conditions,
  entries,
  groups,
  users,
  roles,
  grants,
});

const createConditions = async (db: Db) => {
  // console.log(`Creating ${conditions}`);
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
};

const createGrants = async (db: Db) => {
  // console.log(`Creating ${grants}`);
  await db.createCollection(grants, {
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
  const collection = db.collection(grants);
  await collection.createIndex({ name: 1 }, { unique: true });
};

const crateGroups = async (db: Db) => {
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
};

const createEntries = async (db: Db) => {
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
          group: { bsonType: "string" },
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
};

const createUsers = async (db: Db) => {
  // console.log(`Creating ${users}`);
  db.createCollection(users, {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["uuid", "name", "email", "roles"],
        properties: {
          uuid: {
            bsonType: "string",
            description: "Universal unique ID, the link to the external identity provider",
          },
          name: {
            bsonType: "string",
            description: "Required string type",
          },
          email: {
            bsonType: "string",
            description: "Required string type",
          },
          roles: {
            bsonType: "array",
            description: "User roles",
          },
        },
      },
    },
  });
  const collection = db.collection(users);
  await collection.createIndex({ uuid: 1 }, { unique: true });
};

const createRoles = async (db: Db) => {
  db.createCollection(roles, {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name", "desc", "grants"],
        properties: {
          name: {
            description: "Role name",
            bsonType: "string",
          },
          desc: {
            description: "Role description",
            bsonType: "string",
          },
          grants: {
            bsonType: "array",
            description: "Role grants",
          },
        },
      },
    },
  });
  const collection = db.collection(roles);
  await collection.createIndex({ name: 1 }, { unique: true });
};

export default function makeMailpyDbSetup({ makeDb }: { makeDb: () => Promise<Db> }) {
  const createDatabase = async () => {
    const db = await makeDb();

    // Authorization
    await createGrants(db);
    await createRoles(db);
    await createUsers(db);

    // App bahaviour
    await createConditions(db); // Alarm conditions
    await createEntries(db); // Entries
    await crateGroups(db); // Group of entries
  };

  const clearDatabase = async () => {
    const db = await makeDb();

    for (let key in databaseCollections) {
      const res = await db.collection(key).deleteMany({});
      console.log(`Delete ${key}`, res.deletedCount, res.result);
    }
  };

  return Object.freeze({
    clearDatabase,
    createDatabase,
  });
}
