// @todo: Inject use cases at the controllers
import * as useCases from "../use-cases";

import * as entryController from "./entry";
import * as groupController from "./group";
import * as conditionController from "./condition";
import makeGetUser from "./get-user-login";
import { Controller } from "./comm-types";

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

export const getConditions = conditionController.makeGetConditions({ listConditions: useCases.listConditions });

export const getUserLogin = makeGetUser({ userLogin: useCases.userLogin });

function makeGetEvents() {
  return async function () {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const res = await useCases.listEvents();
      return {
        headers,
        statusCode: 200,
        body: res,
      };
    } catch (e) {
      console.error(`Failed to update group ${e}`, e);
      return {
        headers,
        statusCode: 400,
        body: {
          error: e.message,
        },
      };
    }
  };
}
export const getEvents = makeGetEvents();
