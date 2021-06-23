import buildMakeUser from "./user";
import buildMakeGroup from "./mailpy";

export * from "./user";
export * from "./mailpy"

export const makeUser = buildMakeUser({});
export const makeGroup = buildMakeGroup({});
