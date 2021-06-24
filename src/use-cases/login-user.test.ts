import faker from "faker";

import makeDb, { closeDb } from "../../fixtures/db/db";
import { initApplicationDatabase } from "../../fixtures/db";

import makeMailpyDb, { MailpyDB } from "../data-access/mailpy-db";
import makeUsersDb, { UsersDb } from "../data-access/users-db";
import makeUserLogin from "./login-user";
import { ExternalUserInfo } from "../entities/user";

beforeAll(async () => await initApplicationDatabase({ makeDb }));

afterAll(async () => await closeDb());

describe("perform a user login", () => {
  let mailpyDb: MailpyDB;
  let usersDb: UsersDb;

  beforeEach(async () => {
    mailpyDb = makeMailpyDb({ makeDb });
    usersDb = makeUsersDb({ makeDb });
  });

  it("user login", async () => {
    const defaultFakeUser: ExternalUserInfo = Object.freeze({
      name: faker.name.findName(),
      email: faker.internet.email(),
      uuid: faker.datatype.uuid(),
      login: faker.internet.userName(),
    });

    const getExternalUserInfo = async (authorization: string) => defaultFakeUser;

    const userLogin = makeUserLogin({ mailpyDb, usersDb, getExternalUserInfo });
    const user = await userLogin(faker.lorem.sentence());

    expect(user.email).toBe(defaultFakeUser.email);
    expect(user.name).toBe(defaultFakeUser.name);
    expect(user.uuid).toBe(defaultFakeUser.uuid);
    expect(user.roles.length).toBe(0);
    expect(user.id).not.toBeNull();

    const loggedUser = await userLogin(faker.lorem.sentence());
    expect(loggedUser.uuid).toBe(user.uuid);
    expect(loggedUser.id).toBe(user.id);
  });
});
