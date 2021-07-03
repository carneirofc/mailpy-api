import { mailpyDb, usersDb } from "../data-access";

import makeListConditions from "./list-conditions";
import * as groupUseCase from "./group";
import * as entryUseCase from "./entry";
import makeUserLogin from "./login-user";

import { getAzureUserInfo as getExternalUserInfo } from "../helpers/azure";

export const listConditions = makeListConditions({ mailpyDb });

export const listGroups = groupUseCase.makeListGroups({ mailpyDb });
export const getGroup = groupUseCase.makeGetGroup({ mailpyDb });
export const addGroup = groupUseCase.makeAddGroup({ mailpyDb });
export const updateGroup = groupUseCase.makeUpdateGroup({ mailpyDb });
// export const addGroup = groupUseCase.makeAddGroup({ mailpyDb });

export const listEntries = entryUseCase.makeListEntries({ mailpyDb });
export const listEntry = entryUseCase.makeListEntry({ mailpyDb });
export const addEntry = entryUseCase.makeAddEntry({ mailpyDb });
export const deleteEntry = entryUseCase.makeDeleteEntry({ mailpyDb });
export const updateEntry = entryUseCase.makeUpdateEntry({ mailpyDb });

export const userLogin = makeUserLogin({
  mailpyDb,
  usersDb,
  getExternalUserInfo,
});
