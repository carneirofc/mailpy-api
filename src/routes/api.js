import passport from "passport";
import { Router } from "express";

import authController from "../controller/azure";
import mailpyController from "../controller";

import config from "../config";

const router = Router();

const API_ROOT = config.api.API_ROOT;

const pushGetRoute = (name, ...args) => {
  routesList.push(name);
  router.get(name, ...args);
};

/** Get user authorizations and register the user if needed */
pushGetRoute(
  `${API_ROOT}/user/info`,
  passport.authenticate("oauth-bearer", { session: false }),
  authController.getAzureUserInfo /** Get on-behalf token and access /me information */,
  mailpyController.getUser
);

pushGetRoute(`${API_ROOT}/conditions`, mailpyController.getConditions);
pushGetRoute(`${API_ROOT}/entries`, mailpyController.getEntries);
pushGetRoute(`${API_ROOT}/entry:id`, mailpyController.getEntry);
pushGetRoute(`${API_ROOT}/grants`, mailpyController.getGrants);
pushGetRoute(`${API_ROOT}/group:id`, mailpyController.getGroup);
pushGetRoute(`${API_ROOT}/groups`, mailpyController.getGroups);

console.info("Available API endpoints");
routesList.forEach((e) => console.info(`${e}`));

export default router;
