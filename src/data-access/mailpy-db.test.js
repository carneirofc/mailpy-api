import makeDb from "../../fixtures/db";
import makeMailpyDb from "./mailpy-db";
import makeMailpyDbSetup from "../../db/mailpy-db-setup";
import { makeUser } from "../entities";

import faker from "faker";

import makeMailpyDbData, {
  conditionsEnum,
  grantsEnum,
  defaultRoles
} from "../../db/mailpy-db-data";
import { DatabaseDuplicatedKeyError } from "../helpers/errors";

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
    mailpyDb = makeMailpyDb({
      makeDb
    });
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

  it("Add a user", async () => {
    const user = makeUser({
      name: faker.name.findName(),
      uuid: faker.random.uuid()
    });
    const result = await mailpyDb.insertUser({
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      roles: user.roles
    });
    expect(result.name).toBe(user.name);
    expect(result.uuid).toBe(user.uuid);
    expect(result.email).toBe(user.email);
    expect(result.roles).toBe(user.roles);

    await expect(async () => {
      await mailpyDb.insertUser({
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        roles: user.roles
      });
    }).rejects.toThrow(DatabaseDuplicatedKeyError)

    const result = await mailpyDb.deleteUserByUUID({ uuid: user.uuid });
    expect(result).toBe(1);
  })

})