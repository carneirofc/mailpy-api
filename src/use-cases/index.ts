import { mailpyDb, usersDb } from "../data-access";

import makeListConditions from "./list-conditions";
import makeListGroups from "./list-groups";
import makeListEntries from "./list-entries";
import makeUserLogin from "./login-user";

import { getAzureUserInfo as getExternalUserInfo } from "../helpers/azure";

export const listConditions = makeListConditions({ mailpyDb });
export const listGroups = makeListGroups({ mailpyDb });
export const listEntries = makeListEntries({ mailpyDb });

export const userLogin = makeUserLogin({
  mailpyDb,
  usersDb,
  getExternalUserInfo,
});

const mailpyService = Object.freeze({
  listConditions,
  listEntries,
  listGroups,
  userLogin,
});
export default mailpyService;