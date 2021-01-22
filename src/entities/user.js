import { InvalidPropertyError } from "../helpers/errors";

export default function buildMakeUser({ }) {
  return function makeUser({ id, name, uuid, email = "", roles = [] }) {

    if (!uuid) {
      throw new InvalidPropertyError("UUID is required");
    }

    if (!name || name.replace(/\s+/g, "").length === 0) {
      throw new InvalidPropertyError("Name is required and cannot be empty");
    }

    if (email === null || email === undefined) {
      throw new InvalidPropertyError("Email is required");
    }

    email = email.replace(/\s+/g, "");

    if (roles === null || roles === undefined) {
      throw new InvalidPropertyError("Roles is required");
    }
    if (!(roles instanceof Array)) {
      throw new InvalidPropertyError("Roles is required to be an array");
    }

    return Object.freeze({
      id,
      uuid,
      name,
      email,
      roles
    });
  }
}