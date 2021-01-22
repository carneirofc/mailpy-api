import makeDb from "../../fixtures/db";
import makeMailpyDb from "./mailpy-db";
import makeMailpyDbSetup from "../../db/mailpy-db-setup";
import makeMailpyDbData, {
  conditionsEnum,
  grantsEnum,
  defaultRoles
} from "../../db/mailpy-db-data";

beforeAll(async () => {
  const { createDatabase } = makeMailpyDbSetup({ makeDb });
  await createDatabase();
  const { insertData } = makeMailpyDbData({ makeDb });
  await insertData();
})

afterAll(async () => {
  const { resetDatabase } = makeMailpyDbSetup({ makeDb });
  await resetDatabase();
})

describe("mailpy db", () => {
  let mailpyDb;

  beforeEach(async () => {
    mailpyDb = makeMailpyDb({ makeDb });
  })

  it("List conditions", async () => {
    const conditions = await mailpyDb.findAllConditions();
    expect(conditions.length).toBe(Object.keys(conditionsEnum).length);
  })

  it("List grants", async () => {
    const grants = await mailpyDb.findAllGrants();
    expect(grants.length).toBe(Object.keys(grantsEnum).length);
  })

  it("List initial roles", async () => {
    const roles = await mailpyDb.findAllRoles();
    expect(roles.length).toBe(Object.keys(defaultRoles).length);
  })

})