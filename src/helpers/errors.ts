export class InvalidPropertyError extends Error {
  constructor(msg: string) {
    super(msg);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidPropertyError);
    }
  }
}

export class DatabaseError extends Error {
  constructor(msg: string) {
    super(`data-access failure: ${msg}`);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseError);
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
