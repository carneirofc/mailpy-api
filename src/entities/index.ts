import buildMakeUser from "./user";
import { buildMakeGroup, buildMakeEntry, buildMakeCondition } from "./mailpy";

export * from "./user";
export * from "./mailpy";

export const makeUser = buildMakeUser({});

export const makeCondition = buildMakeCondition({});
export const makeGroup = buildMakeGroup({});
export const makeEntry = buildMakeEntry({});
