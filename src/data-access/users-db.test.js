import makeDb from "../../fixtures/db";
import makeUsersDb from "./users-db";
import makeMailpyDb from "./mailpy-db";
import makeMailpyDbSetup from "../../db/mailpy-db-setup";
import { makeUser } from "../entities";

import faker from "faker";

import makeMailpyDbData, { conditionsEnum, grantsEnum, defaultRoles } from "../../db/mailpy-db-data";
import { DatabaseDuplicatedKeyError } from "../helpers/errors";

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
  let usersDb;
  let mailpyDb;

  beforeEach(async () => {
    usersDb = makeUsersDb({ makeDb });
    mailpyDb = makeMailpyDb({ makeDb });
  });

  it("insert user", async () => {
    const user = makeUser({
      name: faker.name.findName(),
      uuid: faker.random.uuid(),
    });
    let result = await usersDb.insert({
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      roles: user.roles,
    });
    expect(result.name).toBe(user.name);
    expect(result.uuid).toBe(user.uuid);
    expect(result.email).toBe(user.email);
    //@todo: check in a better way, we send the id and get the entire obj
    // expect(result.roles).toStrictEqual(user.roles);

    await expect(async () => {
      await usersDb.insert({
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        roles: user.roles,
      });
    }).rejects.toThrow(DatabaseDuplicatedKeyError);

    result = await usersDb.deleteByUUID({ uuid: user.uuid });
    expect(result).toBe(1);

    result = await usersDb.deleteByUUID({ uuid: user.uuid });
    expect(result).toBe(0);

    const roles = await mailpyDb.findAllRoles();
    user.roles.push(roles[0].id);
  });
});
