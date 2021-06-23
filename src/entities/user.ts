import { InvalidPropertyError } from "../helpers/errors";

export interface ExternalUserInfo {
  uuid: string;
  email: string;
  name: string;
  login: string;
}

export type User = {
  id: string | undefined;
  name: string;
  uuid: string;
  email: string;
  roles: string[];
};

export default function buildMakeUser({}) {
  return function makeUser({
    id,
    name,
    uuid,
    email = "",
    roles = [],
  }: {
    id?: string;
    name: string;
    uuid: string;
    email?: string;
    roles?: any[];
  }): User {
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
      roles,
    });
  };
}
