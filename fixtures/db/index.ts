import { Db } from "mongodb";

import makeMailpyDbData from "./mailpy-db-data";
import makeMailpyDbSetup from "./mailpy-db-setup";

export const initApplicationDatabase = async ({ makeDb }: { makeDb: () => Promise<Db> }) => {
  const { createDatabase } = makeMailpyDbSetup({ makeDb });
  const { insertData } = makeMailpyDbData({ makeDb });
  try {
    await createDatabase();
  } catch (e) {
    if (e.codeName === "NamespaceExists") {
    } else {
      throw e;
    }
  }
  await insertData();
};
