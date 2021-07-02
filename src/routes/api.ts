import passport from "passport";
import { Router } from "express";
import makeCallback from "../helpers/express-callback";

import * as controllers from "../controller";

import config from "../config";

const router = Router();
const API_ROOT = config.api.API_ROOT;

interface Route {
  name: string;
  type: string;
}

const routesList: Route[] = [];
/** Helper function to keep track of the available endpoints */
const pushRoute = (type: "delete" | "get" | "put" | "patch" | "post" | "all", name: string, ...args: any) => {
  switch (type) {
    case "get":
      router.get(name, ...args);
      break;

    case "post":
      router.post(name, ...args);
      break;

    case "delete":
      router.delete(name, ...args);
      break;
    case "patch":
      router.patch(name, ...args);
      break;

    default:
      console.warn("Invalid route", type, name);
      break;
  }
  routesList.push({ type, name: `${API_ROOT}${name}` });
};

pushRoute("delete", `/entry`, makeCallback(controllers.deleteEntry));
pushRoute("get", `/entries`, makeCallback(controllers.getEntries));
pushRoute("get", `/entry`, makeCallback(controllers.getEntry));
pushRoute("patch", `/entry`, makeCallback(controllers.updateEntry));
pushRoute("post", `/entry`, makeCallback(controllers.postEntry));

// pushRoute("delete", `/group`, makeCallback(controllers.deleteGroup));
pushRoute("get", `/groups`, makeCallback(controllers.getGroups));
pushRoute("patch", `/group`, makeCallback(controllers.updateGroup));
pushRoute("post", `/group`, makeCallback(controllers.postGroup));

pushRoute("get", `/conditions`, makeCallback(controllers.getConditions));
pushRoute(
  "get",
  `/user/login`,
  passport.authenticate("oauth-bearer", { session: false }),
  makeCallback(controllers.getUserLogin)
);

console.info("Available API endpoints");
routesList
  .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
  .forEach(({ name, type }) => console.info(`${type} ${name}`));

export default router;
