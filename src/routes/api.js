import passport from "passport";
import { Router } from "express";
import makeCallback from "../helpers/express-callback";

import {
  getConditions,
  getEntries,
  getGroups,
  getUser,
} from "../controller";

import config from "../config";

const router = Router();
const API_ROOT = config.api.API_ROOT;

const routesList = [];
/** Helper function to keep track of the available endpoints */
const pushRoute = (type, name, ...args) => {
  switch (type) {
    case "get":
      router.get(name, ...args);
      break;
    default:
      router.all(name, ...args);
      break;
  }
  routesList.push(`${type} ${API_ROOT}${name}`);
};

pushRoute("get", `/conditions`, makeCallback(getConditions));
pushRoute("get", `/entries`, makeCallback(getEntries));
pushRoute("get", `/groups`, makeCallback(getGroups));
pushRoute("get", `/user/login`, passport.authenticate("oauth-bearer", { session: false }), makeCallback(getUser));

console.info("Available API endpoints");
routesList.forEach((e) => console.info(`${e}`));

export default router;
