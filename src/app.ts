import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import { urlencoded } from "body-parser";
import passport from "passport";
import { BearerStrategy } from "passport-azure-ad";

import { strategyOptions } from "./config/azure";
import middleware from "./midlewares";
import indexRouter from "./routes/index";
import apiRouter from "./routes/api";
import config from "./config";

const API_ROOT = config.api.API_ROOT;

const bearerStrategy = new BearerStrategy(strategyOptions, (token, done) => {
  done(null, {}, token);
});

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
app.use(express.static(path.join(__dirname, "../public")));
app.use(passport.initialize());
passport.use(bearerStrategy);

app.use(API_ROOT, apiRouter);
app.use("/", indexRouter);

app.use(middleware.routeNotFound);
app.use(middleware.exceptionHappened);

export default app;
