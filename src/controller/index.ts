// @todo: Inject use cases at the controllers
import { listConditions, listEntries, listGroups, userLogin, addEntry, addGroup } from "../use-cases";

import makeGetConditions from "./get-conditions";
import makeGetEntries from "./get-entries";
import makeGetGroups from "./get-groups";
import makeGetUser from "./get-user-login";
import makePostEntry from "./post-entry";
import makePostGroup from "./post-group";

export const getConditions = makeGetConditions({ listConditions });
export const getEntries = makeGetEntries({ listEntries });
export const getGroups = makeGetGroups({ listGroups });
export const getUserLogin = makeGetUser({ userLogin });

export const postEntry = makePostEntry({ addEntry });
export const postGroup = makePostGroup({ addGroup });
