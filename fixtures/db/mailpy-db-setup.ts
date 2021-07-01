import { Db } from "mongodb";
import { setup as authorizationSetup, collections as authorizationCollections } from "./authorization";
import { setup as mailpySetup, collections as mailpyCollections } from "./mailpy";

export const collections: { [key: string]: string } = Object.freeze({
  ...authorizationCollections,
  ...mailpyCollections,
});

export default function makeMailpyDbSetup({ makeDb }: { makeDb: () => Promise<Db> }) {
  const createDatabase = async () => {
    const db = await makeDb();

    await authorizationSetup(db);

    await mailpySetup(db);
  };

  const clearDatabase = async () => {
    const db = await makeDb();

    for (let key in collections) {
      const res = await db.collection(key).deleteMany({});
      console.log(`Delete ${key}`, res.deletedCount, res.result);
    }
  };

  return Object.freeze({
    clearDatabase,
    createDatabase,
  });
}
