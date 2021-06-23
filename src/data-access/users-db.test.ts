import makeDb, { closeDb } from "../../fixtures/db";
import makeUsersDb, { UsersDb } from "./users-db";
import makeMailpyDb, { MailpyDB } from "./mailpy-db";
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
  await closeDb();
});

describe("mailpy db", () => {
  let usersDb: UsersDb;
  let mailpyDb: MailpyDB;

  beforeEach(async () => {
    usersDb = makeUsersDb({ makeDb });
    mailpyDb = makeMailpyDb({ makeDb });
  });

  it("insert user", async () => {
    const user = makeUser({
      name: faker.name.findName(),
      uuid: faker.datatype.uuid(),
    });
    let result = await usersDb.insert(user);
    expect(result.name).toBe(user.name);
    expect(result.uuid).toBe(user.uuid);
    expect(result.email).toBe(user.email);

    expect(result.roles).toStrictEqual(user.roles);

    await expect(async () => {
      await usersDb.insert(user);
    }).rejects.toThrow(DatabaseDuplicatedKeyError);

    let deleteResult = await usersDb.deleteByUUID(user.uuid);
    expect(deleteResult).toBe(1);

    deleteResult = await usersDb.deleteByUUID(user.uuid);
    expect(deleteResult).toBe(0);

    const roles = await mailpyDb.findAllRoles();
    result = await usersDb.insert({ ...user });

    user.roles.push(roles[0].id);
    user.roles.push(roles[1].id);

    let updateResult = await usersDb.update({ ...user });
    expect(updateResult).toBe(true);

    result = await usersDb.findByUUID(user.uuid);

    expect(result.roles.length).toBe(2);
    console.log(result);

    deleteResult = await usersDb.deleteByUUID(user.uuid);
    expect(deleteResult).toBe(1);
  });
});
