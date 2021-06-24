import { InvalidPropertyError } from "../helpers/errors";

export interface Condition {
  id: string;
  name: string;
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

export default function buildMakeGroup({}) {
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
