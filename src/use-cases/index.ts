import { mailpyDb, usersDb } from "../data-access";

import makeListConditions from "./list-conditions";
import makeListGroups from "./list-groups";
import makeListEntries from "./list-entries";
import makeUserLogin from "./login-user";
import makeAddGroup from "./add-group";
import makeAddEntry from "./add-entry";

import { getAzureUserInfo as getExternalUserInfo } from "../helpers/azure";

export const listConditions = makeListConditions({ mailpyDb });
export const listGroups = makeListGroups({ mailpyDb });
export const listEntries = makeListEntries({ mailpyDb });
export const addGroup = makeAddGroup({ mailpyDb });
export const addEntry = makeAddEntry({ mailpyDb });

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
