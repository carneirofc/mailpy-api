import { Db } from "mongodb";

const users = "users";
const roles = "roles";
const grants = "grants";

export const collections = Object.freeze({ users, roles, grants });

export async function setup(db: Db) {
  // Authorization
  await createGrants(db);
  await createRoles(db);
  await createUsers(db);
}

async function createGrants(db: Db) {
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

async function createUsers(db: Db) {
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
}

async function createRoles(db: Db) {
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
}
