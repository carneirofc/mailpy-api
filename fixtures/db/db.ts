import { Db, MongoClient } from "mongodb";

let client: MongoClient = null;
let db: Db = null;

const MONGO_DB_URI: string = (global as any).__MONGO_URI__;
const MONGO_DB_NAME: string = (global as any).__MONGO_DB_NAME;

export default async function makeDb(): Promise<Db> {
  if (client === null || !client.isConnected()) {
    client = await MongoClient.connect(MONGO_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = client.db(MONGO_DB_NAME);
  }
  return db;
}

export const closeDb = async () => {
  await client.close().then(() => {
    client = null;
    db = null;
  });
};
export { db };
