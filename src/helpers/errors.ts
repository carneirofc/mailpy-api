export class InvalidPropertyError extends Error {
  constructor(msg: string) {
    super(msg);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidPropertyError);
    }
  }
}

export class DatabaseUnexpectedError extends Error {
  constructor(msg: string) {
    super(`data-access failure, unexpected error: ${msg}`);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseUnexpectedError);
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