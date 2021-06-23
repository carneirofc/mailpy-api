import faker from "faker";

import makeUsersDb, { UsersDb } from "./users-db";
import { makeUser } from "../entities";
import { DatabaseDuplicatedKeyError } from "../helpers/errors";

import makeDb, { closeDb } from "../../fixtures/db/db";
import { initApplicationDatabase } from "../../fixtures/db";
import { grantsEnum, defaultRoles } from "../../fixtures/db/mailpy-db-data";

beforeAll(async () => await initApplicationDatabase({ makeDb }));

afterAll(async () => await closeDb());

describe("mailpy db", () => {
  let usersDb: UsersDb;

  beforeEach(async () => {
    usersDb = makeUsersDb({ makeDb });
  });

  afterEach(async () => {});

  it("find all grants", async () => {
    const grants = await usersDb.findAllGrants();
    expect(grants.length).toBe(Object.keys(grantsEnum).length);
  });

  it("find all roles", async () => {
    const roles = await usersDb.findAllRoles();
    expect(roles.length).toBe(Object.keys(defaultRoles).length);
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

    const roles = await usersDb.findAllRoles();
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
