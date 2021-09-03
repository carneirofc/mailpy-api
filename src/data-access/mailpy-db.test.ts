import faker from "faker";

import { initApplicationDatabase } from "../../fixtures/db";
import makeDb, { closeDb } from "../../fixtures/db/db";
import { conditionsEnum } from "../../fixtures/db/authorization";

import makeMailpyDb, { MailpyDB } from "./mailpy-db";
import { makeGroup, ConditionName, makeEntry } from "../entities";
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

  it("create entity", async () => {
    const condition = await mailpyDb.findConditionByName(ConditionName.SUPERIOR_THAN);
    const group = await mailpyDb.createGroup(
      makeGroup({
        enabled: false,
        name: faker.name.findName(),
        desc: faker.lorem.paragraph(),
      })
    );
    const _defaults = {
      alarm_values: "50",
      email_timeout: 1600,
      emails: [""],
      subject: "",
      unit: "",
      warning_message: "",
      pvname: faker.name.title(),
    };
    const entry = makeEntry({
      condition,
      group,
      ..._defaults,
    });

    const newEntry = await mailpyDb.createEntry(entry);
    expect(newEntry.id).toBeDefined();
    expect(newEntry.group).toStrictEqual(entry.group);
    expect(newEntry.condition).toStrictEqual(entry.condition);

    expect(newEntry.alarm_values).toBe(entry.alarm_values);
    expect(newEntry.email_timeout).toBe(entry.email_timeout);
    expect(newEntry.emails).toStrictEqual(entry.emails);
    expect(newEntry.subject).toBe(entry.subject);
    expect(newEntry.unit).toBe(entry.unit);
    expect(newEntry.warning_message).toBe(entry.warning_message);
    expect(newEntry.pvname).toBe(entry.pvname);

    const foundEntry = await mailpyDb.findEntryById(newEntry.id);
    expect(foundEntry).toStrictEqual(newEntry);

    const newAlarmValues = "123.1234";
    const newEntryParams = makeEntry({ ...newEntry, alarm_values: newAlarmValues });
    const updateEntry = await mailpyDb.updateEntry(newEntryParams);
    expect(updateEntry).toStrictEqual(newEntryParams);
  });
  it("find all conditions", async () => {
    const conditions = await mailpyDb.findAllConditions();
    expect(conditions.length).toBe(Object.keys(conditionsEnum).length);
  });
});
