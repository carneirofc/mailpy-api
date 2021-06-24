import makeMailpyDb, { MailpyDB } from "./mailpy-db";

import { initApplicationDatabase } from "../../fixtures/db";
import makeDb, { closeDb } from "../../fixtures/db/db";
import { conditionsEnum, grantsEnum, defaultRoles } from "../../fixtures/db/mailpy-db-data";

beforeAll(async () => await initApplicationDatabase({ makeDb }));

afterAll(async () => {
  await closeDb();
});

describe("mailpy db", () => {
  let mailpyDb: MailpyDB;

  beforeEach(async () => {
    mailpyDb = makeMailpyDb({
      makeDb,
    });
  });

  it("find all conditions", async () => {
    const conditions = await mailpyDb.findAllConditions();
    expect(conditions.length).toBe(Object.keys(conditionsEnum).length);
  });
});
