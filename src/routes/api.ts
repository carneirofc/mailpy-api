import passport from "passport";
import { Router, Response, Request } from "express";
import makeCallback from "../helpers/express-callback";

import * as controllers from "../controller";

import config from "../config";

const router = Router();
const API_ROOT = config.api.API_ROOT;
type Method = "delete" | "get" | "put" | "patch" | "post";
type ApiLink = {
  method: Method;
  href: string;
};
const routesList: ApiLink[] = [];
/** Helper function to keep track of the available endpoints */
const pushRoute = (method: Method, href: string, ...args: any) => {
  switch (method) {
    case "get":
      router.get(href, ...args);
      break;

    case "post":
      router.post(href, ...args);
      break;

    case "delete":
      router.delete(href, ...args);
      break;
    case "patch":
      router.patch(href, ...args);
      break;

    default:
      console.warn("Invalid route", method, href);
      break;
  }
  routesList.push({ method, href });
};

pushRoute("delete", `${API_ROOT}/entry`, makeCallback(controllers.deleteEntry));
pushRoute("get", `${API_ROOT}/entries`, makeCallback(controllers.getEntries));
pushRoute("get", `${API_ROOT}/entry`, makeCallback(controllers.getEntry));
pushRoute("patch", `${API_ROOT}/entry`, makeCallback(controllers.updateEntry));
pushRoute("post", `${API_ROOT}/entry`, makeCallback(controllers.postEntry));

pushRoute("delete", `${API_ROOT}/group`, makeCallback(controllers.deleteGroup));
pushRoute("get", `${API_ROOT}/groups`, makeCallback(controllers.getGroups));
pushRoute("get", `${API_ROOT}/group`, makeCallback(controllers.getGroup));
pushRoute("patch", `${API_ROOT}/group`, makeCallback(controllers.updateGroup));
pushRoute("post", `${API_ROOT}/group`, makeCallback(controllers.postGroup));

pushRoute("get", `${API_ROOT}/conditions`, makeCallback(controllers.getConditions));
pushRoute(
  "get",
  `${API_ROOT}/user/login`,
  passport.authenticate("oauth-bearer", { session: false }),
  makeCallback(controllers.getUserLogin)
);
pushRoute("get", API_ROOT, (req: Request, res: Response) =>
  res.json({
    _href: routesList,
  })
);
pushRoute("get", "/", (req: Request, res: Response) =>
  res.json({
    API: API_ROOT,
  })
);

console.info("Available API endpoints");
routesList
  .sort((a, b) => (a.href < b.href ? -1 : a.href > b.href ? 1 : 0))
  .forEach(({ href, method }) => console.info(`${href} ${method}`));

export default router;
