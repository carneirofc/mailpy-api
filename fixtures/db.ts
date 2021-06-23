import { Db, MongoClient } from "mongodb";

let connection: MongoClient = null;
let db: Db = null;

export default async function makeDb(): Promise<Db> {
  connection =
    connection ||
    (await MongoClient.connect((global as any).__MONGO_URI__, { useNewUrlParser: true, useUnifiedTopology: true }));
  db = db || connection.db((global as any).__MONGO_DB_NAME);
  return db;
}

export const closeDb = async () => {
  await connection.close();
  // await db.close(); // No need to ?
};
export { connection, db };
