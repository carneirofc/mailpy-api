import { Db } from "mongodb";
import { insertData as insertDataMailpy } from "./mailpy";
import { insertData as insertDataAuth } from "./authorization";

export default function makeMailpyDbData({ makeDb }: { makeDb: () => Promise<Db> }) {
  const insertData = async () => {
    const db = await makeDb();
    await insertDataMailpy(db);
    await insertDataAuth(db);
  };

  return Object.freeze({
    insertData,
  });
}
