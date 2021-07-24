export { InvalidPropertyError } from "mailpy-common";

export class DatabaseError extends Error {
  __proto__: any;
  constructor(msg: string) {
    super(`data-access failure: ${msg}`);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseError);
    }

    // restore prototype chain
    const actualProto = new.target.prototype;

    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
  }
}

export class DatabaseDuplicatedKeyError extends Error {
  constructor(msg: string) {
    super(`data-access failure: ${msg}`);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseDuplicatedKeyError);
    }
  }
}
