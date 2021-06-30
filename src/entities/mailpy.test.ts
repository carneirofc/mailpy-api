import faker from "faker";
import { InvalidPropertyError } from "../helpers/errors";
import { makeGroup, makeEntry, makeCondition } from "./index";
import { ConditionName, Group } from "./mailpy";

describe("Create a group", () => {
  let group: Group;
  let defaults = {
    email_timeout: 1200,
    emails: [faker.internet.email(), faker.internet.email()],
    subject: "",
    unit: "",
    warning_message: "",
  };

  beforeAll(() => {
    group = makeGroup({ name: "TestGroup", desc: "Some desc" });
  });

  it("Must have a name", () => {
    makeGroup({
      name: faker.name.jobArea(),
      desc: faker.lorem.sentence(),
    });
  });
  it("Name cannot be empty", () => {
    expect(() => makeGroup({ name: "  \t\t \r \r \t    " })).toThrow(InvalidPropertyError);
  });

  it(`condition and values: "${ConditionName.INCREASING_STEP}"`, () => {
    const condition = makeCondition(ConditionName.INCREASING_STEP, "");
    const invalidValues = ["", "FFF", "0,2", "14g", "1:1", "3:2:1"];
    invalidValues.forEach((alarm_values) => {
      expect(() =>
        makeEntry({
          alarm_values,
          condition,
          group,
          ...defaults,
        })
      ).toThrow(InvalidPropertyError);
    });

    ["1:2:4.6:723.7", "-0.5:0:5", "1:2:3"].forEach((alarm_values) => {
      const e = makeEntry({
        alarm_values,
        condition,
        group,
        ...defaults,
      });
      expect(e.alarm_values).toBe(alarm_values);
    });
  });

  it(`condition and values: "${ConditionName.OUT_OF_RANGE}"`, () => {
    const condition = makeCondition(ConditionName.OUT_OF_RANGE, "");
    const invalidValues = ["", "FFF", "0,2", "14g", "1:1", "-2,-6", "3:2:1", "1:2:3"];
    invalidValues.forEach((alarm_values) => {
      expect(() =>
        makeEntry({
          alarm_values,
          condition,
          group,
          ...defaults,
        })
      ).toThrow(InvalidPropertyError);
    });
    ["1:2", "-0.5:0.5", "0:60034.423"].forEach((alarm_values) => {
      const e = makeEntry({
        alarm_values,
        condition,
        group,
        ...defaults,
      });
      expect(e.alarm_values).toBe(alarm_values);
    });
  });

  it(`condition and values: "${ConditionName.SUPERIOR_THAN}"`, () => {
    const condition = makeCondition(ConditionName.SUPERIOR_THAN, "");
    const invalidValues = ["", "FFF", "0,2", "1:3", "3:2:1", "1:2:3", "14g"];
    invalidValues.forEach((alarm_values) => {
      expect(() =>
        makeEntry({
          alarm_values,
          condition,
          group,
          ...defaults,
        })
      ).toThrow(InvalidPropertyError);
    });

    ["0", "123.5235", "-121.51345"].forEach((alarm_values) => {
      const e = makeEntry({
        alarm_values,
        condition,
        group,
        ...defaults,
      });
      expect(e.alarm_values).toBe(alarm_values);
    });
  });

  it(`condition and values: "${ConditionName.INFERIOR_THAN}"`, () => {
    const condition = makeCondition(ConditionName.INFERIOR_THAN, "");
    const invalidValues = ["", "FFF", "0,2", "1:3", "3:2:1", "1:2:3", "14g"];
    invalidValues.forEach((alarm_values) => {
      expect(() =>
        makeEntry({
          alarm_values,
          condition,
          group,
          ...defaults,
        })
      ).toThrow(InvalidPropertyError);
    });

    ["0", "123.5235", "-121.51345"].forEach((alarm_values) => {
      const e = makeEntry({
        alarm_values,
        condition,
        group,
        ...defaults,
      });
      expect(e.alarm_values).toBe(alarm_values);
    });
  });
});
