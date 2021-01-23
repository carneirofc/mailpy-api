import mailpyDb from "../data-access";

import makeListConditions from "./list-conditions";
import makeListGroups from "./list-groups";
import makeListEntries from "./list-entries";
import makeUserLogin from "./login-user";
import makeAddUser from "./add-user";

import { getAzureUserInfo as getExternalUserInfo } from "../helpers/azure";

export const listConditions = makeListConditions({ mailpyDb });
export const listGroups = makeListGroups({ mailpyDb });
export const listEntries = makeListEntries({ mailpyDb });
export const addUser = makeAddUser({ mailpyDb });

export const userLogin = makeUserLogin({
  mailpyDb,
  getExternalUserInfo,
  addUser,
  makeUser
});

const mailpyService = Object.freeze({
  listConditions,
  listEntries,
  listGroups,
  userLogin
});
export default mailpyService;