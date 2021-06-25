import { Db, MongoClient } from "mongodb";

import config from "./src/data-access/config";

import { initApplicationDatabase } from "./fixtures/db";

let client: MongoClient = null;
let db: Db = null;

async function makeDb(): Promise<Db> {
  if (client === null || !client.isConnected()) {
    console.log("Connection to dabase", config.MONGODB_URI, config.options);
    client = await MongoClient.connect(config.MONGODB_URI, config.options);
    db = client.db();
  }
  return db;
}

async function closeDb() {
  await client.close().then(() => {
    console.log("Connection closed");
    client = null;
    db = null;
  });
}

(async () => {
  console.log("Init Mongo database");
  await initApplicationDatabase({ makeDb });
  await closeDb();
})();
