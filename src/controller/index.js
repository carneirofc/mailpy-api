// @todo: Inject use cases at the controllers
import { listConditions, listEntries, listGroups, userLogin } from "../use-cases";

import makeGetConditions from "./get-conditions";
import makeGetEntries from "./get-entries";
import makeGetGroups from "./get-groups";
import makeGetUser from "./get-user-login";

export const getConditions = makeGetConditions({ listConditions });
export const getEntries = makeGetEntries({ listEntries });
export const getGroups = makeGetGroups({ listGroups });
export const getUserLogin = makeGetUser({ userLogin });

const mailpyController = Object.freeze({
  getConditions,
  getEntries,
  getGroups,
  getUserLogin,
});
export default mailpyController;
