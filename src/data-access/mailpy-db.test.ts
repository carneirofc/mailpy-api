import faker from "faker";

import { initApplicationDatabase } from "../../fixtures/db";
import makeDb, { closeDb } from "../../fixtures/db/db";
import { conditionsEnum, grantsEnum, defaultRoles } from "../../fixtures/db/authorization";

import makeMailpyDb, { MailpyDB } from "./mailpy-db";
import { makeCondition, makeGroup, Condition, Group } from "../entities";
import { DatabaseDuplicatedKeyError, InvalidPropertyError } from "../helpers/errors";

beforeAll(async () => await initApplicationDatabase({ makeDb }));

afterAll(async () => {
  await closeDb();
});

describe("mailpy db", () => {
  let mailpyDb: MailpyDB;

  beforeEach(async () => {
    mailpyDb = makeMailpyDb({
      makeDb,
    });
  });

  it("crud group", async () => {
    // create group
    const group = makeGroup({ name: faker.name.findName(), desc: faker.lorem.paragraph(), enabled: true });
    const newGroup = await mailpyDb.createGroup(group);
    expect(newGroup.id).toBeDefined();
    expect(newGroup.name).toBe(group.name);
    expect(newGroup.desc).toBe(group.desc);
    expect(newGroup.enabled).toBe(group.enabled);

    expect(async () => await mailpyDb.createGroup(group)).rejects.toThrow(DatabaseDuplicatedKeyError); // @todo: Create an exception type

    expect(async () => await mailpyDb.updateGroup(group)).rejects.toThrow(); // Ubdate group based on the id, id cannot be null

    // update group
    newGroup.name = faker.name.findName();
    newGroup.enabled = !newGroup.enabled;
    newGroup.desc = faker.lorem.lines();
    const updateGroup = await mailpyDb.updateGroup(newGroup);
    expect(updateGroup).toStrictEqual(newGroup);

    // search group
    const foundGroup = await mailpyDb.findGroupById(newGroup.id);
    expect(foundGroup).toStrictEqual(newGroup);

    // delete group
    expect(async () => await mailpyDb.deleteGroup(group)).rejects.toThrow(InvalidPropertyError);
    expect(await mailpyDb.deleteGroup(foundGroup)).toBe(true);
    expect(await mailpyDb.deleteGroup(foundGroup)).toBe(false);
  });

  it("create entity", () => {});

  it("find all conditions", async () => {
    const conditions = await mailpyDb.findAllConditions();
    expect(conditions.length).toBe(Object.keys(conditionsEnum).length);
  });
});
