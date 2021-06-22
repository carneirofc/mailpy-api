import { InvalidPropertyError } from "../helpers/errors";

export type Group = {
  name: string;
  desc: string;
};

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
