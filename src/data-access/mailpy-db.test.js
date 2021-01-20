import makeDb from "../../fixtures/db";
import makeMailpyDb from "./mailpy-db";
import makeMailpyDbSetup, { conditionsEnum, grantsEnum } from "../../db/mailpy-db-setup";

beforeAll(async () => {
  const setup = makeMailpyDbSetup({ makeDb });
  await setup.createDatabase();
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

})