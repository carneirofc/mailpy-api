import { MongoClient } from "mongodb";

let connection = null;
let db = null;

export default async function makeDb() {
  connection = connection || await MongoClient.connect(
    global.__MONGO_URI__,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  db = db || await connection.db(global.__MONGO_DB_NAME);
  return db;
}

export const closeDb = async () => {
  await connection.close();
  await db.close();
}
export { connection, db }