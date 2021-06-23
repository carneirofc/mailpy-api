import makeDb from "../../fixtures/db";
import makeMailpyDb, { MailpyDB } from "./mailpy-db";
import makeMailpyDbSetup from "../../db/mailpy-db-setup";

import makeMailpyDbData, { conditionsEnum, grantsEnum, defaultRoles } from "../../db/mailpy-db-data";

beforeAll(async () => {
  const { createDatabase } = makeMailpyDbSetup({ makeDb });
  await createDatabase();
  const { insertData } = makeMailpyDbData({ makeDb });
  await insertData();
});

afterAll(async () => {
  const { resetDatabase } = makeMailpyDbSetup({ makeDb });
  await resetDatabase();
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

  it("find all grants", async () => {
    const grants = await mailpyDb.findAllGrants();
    expect(grants.length).toBe(Object.keys(grantsEnum).length);
  });

  it("find all roles", async () => {
    const roles = await mailpyDb.findAllRoles();
    expect(roles.length).toBe(Object.keys(defaultRoles).length);
  });
});
