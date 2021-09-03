// @todo: Inject use cases at the controllers
import * as useCases from "../use-cases";

import * as entryController from "./entry";
import * as groupController from "./group";
import makeGetConditions from "./condition";
import makeGetUser from "./get-user-login";

export const postEntry = entryController.makePostEntry({ addEntry: useCases.addEntry });
export const getEntries = entryController.makeGetEntries({ listEntries: useCases.listEntries });
export const updateEntry = entryController.makeUpdateEntry({ updateEntry: useCases.updateEntry });
export const deleteEntry = entryController.makeDeleteEntry({ deleteEntry: useCases.deleteEntry });
export const getEntry = entryController.makeGetEntry({ listEntry: useCases.listEntry });

export const postGroup = groupController.makePostGroup({ addGroup: useCases.addGroup });
export const getGroups = groupController.makeGetGroups({ listGroups: useCases.listGroups });
export const getGroup = groupController.makeGetGroup({ getGroup: useCases.getGroup });
export const updateGroup = groupController.makeUpdateGroup({ updateGroup: useCases.updateGroup });
export const deleteGroup = groupController.makeDeleteGroup({ deleteGroup: useCases.deleteGroup });

export const getConditions = makeGetConditions({ listConditions: useCases.listConditions });

export const getUserLogin = makeGetUser({ userLogin: useCases.userLogin });
