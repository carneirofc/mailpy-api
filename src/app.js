import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { urlencoded } from "body-parser";
import passport from "passport";
import { BearerStrategy } from "passport-azure-ad";

import controller from "./controller";
import auth from "./controller/auth";
import middleware from "./midlewares";

const bearerStrategy = new BearerStrategy(auth.options, (token, done) => {
  done(null, {}, token);
});

const API_ROOT = process.env.API_ROOT || "/mailpy/api";

const app = express();
const routesList = [];

const pushGetRoute = (name, ...args) => {
  routesList.push(name);
  app.get(name, ...args);
}

const createRoutes = () => {
  /** Get user authorizations and register the user if needed */
  pushGetRoute(
    `${API_ROOT}/user/info`,
    passport.authenticate("oauth-bearer", { session: false }),
    auth.validateClaims, /** Get on-behalf token and access /me information */
    controller.getUser
  );

  pushGetRoute(`${API_ROOT}/grants`, controller.getGrants)

  pushGetRoute(`${API_ROOT}/groups`, controller.getGroups);
  pushGetRoute(`${API_ROOT}/group:id`, controller.getGroup);

  pushGetRoute(`${API_ROOT}/conditions`, controller.getConditions);

  pushGetRoute(`${API_ROOT}/entries`, controller.getEntries);
  pushGetRoute(`${API_ROOT}/entry:id`, controller.getEntry);

  app.get(`/`, (req, res, next) => {
    res.send(routesList);
  });

  app.use(middleware.routeNotFound);
  app.use(middleware.exceptionHappened);
}

app.enable("trust proxy");
app.use(cors()); // CORS
app.use(helmet()); // Nice to have headers
app.use(express.json());
app.use(morgan("common")); // Request Logger
app.use(urlencoded({ extended: true }));
app.use(passport.initialize());
passport.use(bearerStrategy);

createRoutes();

console.info("Available API endpoints");
routesList.forEach((e) => console.info(`${e}`));

export default app;