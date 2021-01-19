export class InvalidPropertyError extends Error {
    constructor(msg) {
        super(msg);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidPropertyError);
        }
    }
}