import passport from "passport";
import { Router } from "express";
import makeCallback from "../helpers/express-callback";

import { getConditions, getEntries, getGroups, getUserLogin } from "../controller";

import config from "../config";

const router = Router();
const API_ROOT = config.api.API_ROOT;

interface Route {
  name: string;
  type: string;
}

const routesList: Route[] = [];
/** Helper function to keep track of the available endpoints */
const pushRoute = (type: "get" | "use" | "post" | "all", name: string, ...args: any) => {
  switch (type) {
    case "get":
      router.get(name, ...args);
      break;
    default:
      router.all(name, ...args);
      break;
  }
  routesList.push({ type, name: `${API_ROOT}${name}` });
};

pushRoute("get", `/conditions`, makeCallback(getConditions));
pushRoute("get", `/entries`, makeCallback(getEntries));
pushRoute("get", `/groups`, makeCallback(getGroups));
pushRoute("get", `/user/login`, passport.authenticate("oauth-bearer", { session: false }), makeCallback(getUserLogin));

console.info("Available API endpoints");
routesList.forEach(({ name, type }) => console.info(`${type} ${name}`));

export default router;
