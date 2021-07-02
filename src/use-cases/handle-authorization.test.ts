import faker from "faker";

import makeDb, { closeDb } from "../../fixtures/db/db";
import { initApplicationDatabase } from "../../fixtures/db";

import makeMailpyDb, { MailpyDB } from "../data-access/mailpy-db";
import makeUsersDb, { UsersDb } from "../data-access/users-db";

beforeAll(async () => await initApplicationDatabase({ makeDb }));

afterAll(async () => await closeDb());

describe("test user authorization", () => {
  let mailpyDb: MailpyDB;
  let usersDb: UsersDb;

  beforeEach(async () => {
    mailpyDb = makeMailpyDb({ makeDb });
    usersDb = makeUsersDb({ makeDb });
  });
  it("@todo", () => {});
});
