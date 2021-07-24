import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import { urlencoded } from "body-parser";
import passport from "passport";
import { BearerStrategy } from "passport-azure-ad";

import { strategyOptions } from "./config/azure";
import middleware from "./middlewares";
import apiRouter from "./routes/api";

const bearerStrategy = new BearerStrategy(
  {
    clientID: strategyOptions.clientID,
    identityMetadata: strategyOptions.identityMetadata,
    issuer: strategyOptions.issuer,
    validateIssuer: strategyOptions.validateIssuer,
    audience: strategyOptions.audience,
    passReqToCallback: strategyOptions.passReqToCallback,
    loggingNoPII: strategyOptions.loggingNoPII,
  },
  (request, tokenPayload, callback) => {
    callback(null, {}, tokenPayload);
  }
);

const getLoggerLevel = () => {
  if (process.env.NODE_ENV === "production") {
    console.info("Node env: Production");
    return "combined";
  } else {
    return "dev";
  }
};
const loggerLevel = getLoggerLevel();

const app = express();

app.enable("trust proxy");
app.use(cors()); // CORS
app.use(helmet()); // Nice to have headers
app.use(express.json());
app.use(morgan(loggerLevel)); // Request Logger
app.use(urlencoded({ extended: true }));
app.use(passport.initialize());
passport.use(bearerStrategy);

app.use(apiRouter);
app.use(middleware.routeNotFound);
app.use(middleware.exceptionHappened);
export default app;
