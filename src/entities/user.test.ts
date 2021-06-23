import faker from "faker";
import { makeUser } from "./index";
import { InvalidPropertyError } from "../helpers/errors";

describe("User entity tests", () => {
  it("Create user", () => {
    makeUser({
      name: faker.name.findName(),
      email: faker.internet.email(),
      uuid: faker.datatype.uuid(),
      roles: [],
    });
  });

  it("Empty Name", () => {
    expect(() => {
      makeUser({
        name: "",
        uuid: faker.datatype.uuid(),
      });
    }).toThrow(InvalidPropertyError);
  });

  it("No Spacing", () => {
    expect(() => {
      makeUser({
        name: " \t\t  \r \t \r\r       ",
        uuid: faker.datatype.uuid(),
      });
    }).toThrow(InvalidPropertyError);
  });

  it("Name null check", () => {
    expect(() => {
      makeUser({
        name: null,
        uuid: faker.datatype.uuid(),
      });
    }).toThrow(InvalidPropertyError);
  });
});
