import faker from "faker";
import { makeUser } from "./index";
import { InvalidPropertyError } from "../helpers/errors";

describe("User entity tests", () => {
  it("Create user", () => {
    makeUser({
      name: faker.name.findName(),
      email: faker.internet.email(),
      uuid: faker.random.uuid(),
      roles: []
    });
  })
  it("Missing uuid", () => {
    expect(() => {
      makeUser({
        name: faker.name.findName(),
      });
    }).toThrow(InvalidPropertyError);
  })

  it("Empty Name", () => {
    expect(() => {
      makeUser({
        name: "",
        uuid: faker.random.uuid(),
      });
    }).toThrow(InvalidPropertyError);
  })

  it("No Spacing", () => {
    expect(() => {
      makeUser({
        name: " \t\t  \r \t \r\r       ",
        uuid: faker.random.uuid(),
      });
    }).toThrow(InvalidPropertyError);
  })

  it("Name null check", () => {
    expect(() => {
      makeUser({
        name: null,
        uuid: faker.random.uuid(),
      });
    }).toThrow(InvalidPropertyError);
  })

  it("Roles must be an array", () => {
    expect(() => {
      makeUser({
        name: faker.name.findName(),
        uuid: faker.random.uuid(),
        roles: "Some Random Role"
      });
    }).toThrow(InvalidPropertyError);
  })
})
