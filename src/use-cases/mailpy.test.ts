import faker from "faker";

import makeDb, { closeDb } from "../../fixtures/db/db";
import { initApplicationDatabase } from "../../fixtures/db";

import makeMailpyDb, { MailpyDB } from "../data-access/mailpy-db";
import makeUsersDb, { UsersDb } from "../data-access/users-db";

import { makeAddGroup, makeListGroups } from "./group";
import { makeAddEntry } from "./entry";
import { ConditionName } from "../entities";

beforeAll(async () => await initApplicationDatabase({ makeDb }));

afterAll(async () => await closeDb());

describe("perform a user login", () => {
  let mailpyDb: MailpyDB;
  let usersDb: UsersDb;

  beforeEach(async () => {
    mailpyDb = makeMailpyDb({ makeDb });
    usersDb = makeUsersDb({ makeDb });
  });

  it("create group and entry", async () => {
    const addGroup = makeAddGroup({ mailpyDb });
    const param = { name: faker.name.findName(), desc: faker.lorem.sentence(), enabled: false };
    const newGroup = await addGroup(param);
    expect(param.name).toBe(newGroup.name);
    expect(param.desc).toBe(newGroup.desc);
    expect(param.enabled).toBe(newGroup.enabled);

    const addEntry = makeAddEntry({ mailpyDb });
    const resEntry = await addEntry({
      group_id: newGroup.id,
      alarm_values: "60",
      condition_name: ConditionName.INFERIOR_THAN,
      email_timeout: faker.datatype.number(),
      emails: [faker.internet.email()],
      pvname: faker.name.findName(),
      subject: faker.name.lastName(),
      unit: faker.datatype.string(),
      warning_message: faker.datatype.string(),
    });
  });
});
