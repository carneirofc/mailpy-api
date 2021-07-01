import faker from "faker";

import makeUsersDb, { UsersDb } from "./users-db";
import { makeUser, Grant } from "../entities";
import { DatabaseDuplicatedKeyError } from "../helpers/errors";

import makeDb, { closeDb } from "../../fixtures/db/db";
import { initApplicationDatabase } from "../../fixtures/db";
import { grantsEnum, defaultRoles } from "../../fixtures/db/authorization";

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
    const tmpUser = makeUser({
      name: faker.name.findName(),
      uuid: faker.datatype.uuid(),
    });

    // create a fresh user
    const newUser = await usersDb.insertUser(tmpUser);
    expect(newUser.name).toBe(tmpUser.name);
    expect(newUser.uuid).toBe(tmpUser.uuid);
    expect(newUser.email).toBe(tmpUser.email);
    expect(newUser.roles).toStrictEqual(tmpUser.roles);
    expect(newUser.id).toBeDefined();

    // find the user from db
    const foundUser = await usersDb.findUserByUUID(newUser.uuid);
    expect(foundUser).toBeDefined();
    expect(foundUser.id).toBe(newUser.id);
    expect(foundUser.uuid).toBe(newUser.uuid);
    expect(foundUser).toStrictEqual(newUser);

    // Cannot insert the same user
    await expect(async () => {
      await usersDb.insertUser(tmpUser);
    }).rejects.toThrow(DatabaseDuplicatedKeyError);

    // delete the user
    let deleteCount = await usersDb.deleteUserByUUID(tmpUser.uuid);
    expect(deleteCount).toBe(1);

    deleteCount = await usersDb.deleteUserByUUID(tmpUser.uuid);
    expect(deleteCount).toBe(0);
  });

  it("insert user with roles", async () => {
    const roles = await usersDb.findAllRoles();

    const tmpRoleUser = makeUser({
      name: faker.name.findName(),
      uuid: faker.datatype.uuid(),
    });

    tmpRoleUser.roles.push(roles[0]);
    const newRoleUser = await usersDb.insertUser(tmpRoleUser);
    expect(newRoleUser.roles.length).toBe(1);

    newRoleUser.roles.push(roles[1]);
    let updateResult = await usersDb.updateUser(newRoleUser);
    expect(updateResult).toBe(true);

    const foundNewRoleUser = await usersDb.findUserByUUID(newRoleUser.uuid);
    expect(foundNewRoleUser.roles.length).toBe(2);

    const deleteCount = await usersDb.deleteUserByUUID(foundNewRoleUser.uuid);
    expect(deleteCount).toBe(1);
  });

  it("find grants", async () => {
    const roles = await usersDb.findAllRoles();

    const tmpUser = makeUser({
      name: faker.name.findName(),
      uuid: faker.datatype.uuid(),
    });

    tmpUser.roles.push(roles[0]);
    tmpUser.roles.push(roles[1]);

    const newRoleUser = await usersDb.insertUser(tmpUser);
    expect(newRoleUser.roles.length).toBe(2);

    const grants = await usersDb.findUserGrants(tmpUser.uuid);
  });
});
