import makeDb from "../../fixtures/db";
import makeMailpyDb from "../data-access/mailpy-db";
import makeUsersDb from "../data-access/users-db";
import makeMailpyDbSetup from "../../db/mailpy-db-setup";

import makeUserLogin from "./login-user";
import faker from "faker";

beforeAll(async () => {
  const { createDatabase } = makeMailpyDbSetup({ makeDb });
  await createDatabase();
});

afterAll(async () => {
  const { resetDatabase } = makeMailpyDbSetup({ makeDb });
  await resetDatabase();
});

describe("perform a user login", () => {
  let mailpyDb;
  let usersDb;

  beforeEach(async () => {
    mailpyDb = makeMailpyDb({ makeDb });
    usersDb = makeUsersDb({ makeDb });
  });

  it("user login", async () => {
    const defaultFakeUser = Object.freeze({
      name: faker.name.findName(),
      email: faker.internet.email(),
      uuid: faker.random.uuid(),
    });

    const getExternalUserInfo = (authorization) => defaultFakeUser;

    const userLogin = makeUserLogin({ mailpyDb, usersDb, getExternalUserInfo });
    const user = await userLogin(faker.lorem.sentence());

    expect(user.email).toBe(defaultFakeUser.email);
    expect(user.name).toBe(defaultFakeUser.name);
    expect(user.uuid).toBe(defaultFakeUser.uuid);
    expect(user.roles.length).toBe(0);
    expect(user.id).not.toBeNull();

    await userLogin(faker.lorem.sentence());
  });
});
