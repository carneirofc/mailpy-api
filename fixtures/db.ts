import { Db, MongoClient } from "mongodb";

let connection: MongoClient = null;
let db: Db = null;

const MONGO_DB_URI: string = (global as any).__MONGO_URI__;
const MONGO_DB_NAME: string = (global as any).__MONGO_DB_NAME;

export default async function makeDb(): Promise<Db> {
  if (connection === null) {
    connection = await MongoClient.connect(MONGO_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  if (db === null) {
    db = connection.db(MONGO_DB_NAME);
  }
  return db;
}

export const closeDb = async () => {
  await connection.close();
};
export { connection, db };
