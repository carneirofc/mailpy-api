import faker from "faker";
import { InvalidPropertyError } from "../helpers/errors";
import { makeGroup } from "./index";

describe("Create a group", () => {
  it("Must have a name", () => {
    makeGroup({
      name: faker.name.jobArea(),
      desc: faker.lorem.sentence(),
    });
  });
  it("Name cannot be null", () => {
    expect(() => makeGroup({})).toThrow(InvalidPropertyError);
  });
  it("Name cannot be empty", () => {
    expect(() => makeGroup({ name: "  \t\t \r \r \t    " })).toThrow(InvalidPropertyError);
  });
});
