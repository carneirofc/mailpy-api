import { InvalidPropertyError } from "../helpers/errors";

export enum ConditionName {
  OUT_OF_RANGE = "out of range",
  SUPERIOR_THAN = "superior than",
  INFERIOR_THAN = "inferior than",
  INCREASING_STEP = "increasing step",
  DECREASING_STEP = "decreasing step",
}

export const ConditionNameHas = (value: string): boolean => {
  const res = Object.values(ConditionName).includes(value as any);
  return res;
};

export interface Condition {
  id: string;
  name: ConditionName;
  desc: string;
}

export interface Group {
  name: string;
  desc: string;
}

export interface Entry {
  condition: Condition;
  email_timeout: number;
  alarm_values: string; // @todo: Parse string from db into a valid object ...
  emails: string[];
  group: Group;
  subject: string;
  unit: string;
  warning_message: string;
}

export function buildMakeCondition({}) {
  return function makeCondition(name: string, desc: string): Condition {
    if (!ConditionNameHas(name)) {
      throw "Cannot create condition, name is invalid";
    }
    return { desc, id: undefined, name: name as ConditionName };
  };
}

export function buildMakeEntry({}) {
  interface MakeEntry {
    alarm_values: string;
    condition: Condition;
    email_timeout: number;
    emails: string[];
    group: Group;
    subject: string;
    unit: string;
    warning_message: string;
  }
  const isIncreasingStepValid = (stringValue: string): boolean => {
    const values = stringValue.split(":").map((val) => Number(val));

    if (values.length <= 1) {
      return false;
    }

    let currentVal = undefined;
    for (const value of values) {
      if (Number.isNaN(value)) {
        return false;
      }

      if (currentVal === undefined) {
        currentVal = value;
        continue;
      }

      if (currentVal >= value) {
        // current value must always be the smallest value
        return false;
      }
      currentVal = value;
    }
    return true;
  };

  const isConditionOutOfRangeValid = (stringValue: string): boolean => {
    const values = stringValue.split(":").map((val) => Number(val));
    if (values.length != 2) {
      return false;
    }
    for (const value of values) {
      if (Number.isNaN(value)) {
        return false;
      }
    }
    const [v1, v2] = values;
    return v1 !== v2 && v1 < v2;
  };

  const isAlarmValueValid = (stringValue: string, condition: ConditionName): boolean => {
    if (!stringValue) {
      return false;
    }

    switch (condition) {
      case ConditionName.DECREASING_STEP:
        throw new InvalidPropertyError(`condition "${condition}" is not impplemented`);

      case ConditionName.SUPERIOR_THAN:
      case ConditionName.INFERIOR_THAN:
        return !Number.isNaN(Number(stringValue));

      case ConditionName.INCREASING_STEP:
        return isIncreasingStepValid(stringValue);

      case ConditionName.OUT_OF_RANGE:
        return isConditionOutOfRangeValid(stringValue);

      default:
        throw new InvalidPropertyError(`Condition "${stringValue}" is invalid`);
    }
  };
  return function makeEntry(data: MakeEntry): Entry {
    if (!isAlarmValueValid(data.alarm_values, data.condition.name)) {
      throw new InvalidPropertyError(
        `Failed to create entry, "${data.alarm_values}" is not compatible with the condition "${data.condition.name}"`
      );
    }
    return { ...data };
  };
}

export function buildMakeGroup({}) {
  return function makeGroup({ name, desc = "" }: { name: string; desc?: string }): Group {
    if (!name || name.replace(/\s+/g, "").length === 0) {
      throw new InvalidPropertyError("Name cannot be empty");
    }
    if (!desc) {
      throw new InvalidPropertyError("Desc cannot be null");
    }
    return Object.freeze({
      name,
      desc,
    });
  };
}
