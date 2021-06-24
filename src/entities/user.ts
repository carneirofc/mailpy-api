import { InvalidPropertyError } from "../helpers/errors";

export type ExternalUserInfo = {
  uuid: string;
  email: string;
  name: string;
  login: string;
};

export type Grant = {
  id: string;
  name: string;
  desc: string;
};

export type Role = {
  id: string;
  name: string;
  desc: string;
  grants: Grant[];
};

export type User = {
  id: string | undefined;
  name: string;
  uuid: string;
  email: string;
  roles: Role[];
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
    roles?: Role[];
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
      roles = [];
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
