const conditions = "conditions";
const groups = "groups";
const entries = "entries";
const users = "users";
const roles = "roles";
const grants = "grants";

export const collections = Object.freeze({
  conditions,
  entries,
  groups,
  users,
  roles,
  grants
});


const listFromObjects = (objs) => {
  /** Given an object where the key is the corresponding entry name, obtain a list */
  const items = [];
  for (let name in objs) {
    const obj = objs[name];
    items.push({ ...obj, name: name });
  }
  return items;
}

const createConditions = async (db) => {
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
}

const createGrants = async (db) => {
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
}

const crateGroups = async (db) => {
  // console.log(`Creating ${groups}`);
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

const createEntries = async (db) => {
  // console.log(`Creating ${entries}`);
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
  await collection.createIndex(
    { pvname: 1, emails: 1, condition: 1, alarm_values: 1 },
    { unique: true }
  );
}

const createUsers = async (db) => {
  // console.log(`Creating ${users}`);
  db.createCollection(users, {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["id", "name", "email", "roles"],
        properties: {
          id: {
            bsonType: "string",
            description: "Required string type",
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
          }
        },
      },
    },
  });
  const collection = db.collection(users);
  await collection.createIndex({ id: 1 }, { unique: true });
}

const createRoles = async (db) => {
  // console.log(`Creating ${roles}`);
  db.createCollection(roles, {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "name",
          "desc",
          "grants",
        ],
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
            description: "Role grants"
          }
        }
      }
    }
  });
  const collection = db.collection(roles);
  await collection.createIndex({ name: 1 }, { unique: true })
}


export default function makeMailpyDbSetup({ makeDb }) {
  const createDatabase = async () => {
    console.log(`Initialising database`);
    const db = await makeDb();

    // Authorization
    await createGrants(db);
    await createRoles(db);
    await createUsers(db);

    // App bahaviour
    await createConditions(db); // Alarm conditions
    await createEntries(db);    // Entries
    await crateGroups(db);      // Group of entries

  }

  const resetDatabase = async () => {
    console.log(`Reseting collections`);
    const db = await makeDb();

    for (let key in collections) {
      // console.log(`Erasing collection ${collections[key]}`);
      await db.dropCollection(collections[key]);
    }
  }

  return Object.freeze({
    createDatabase,
    resetDatabase
  });
}