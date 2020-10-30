//const path = require('path');
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const passport = require("passport");
const passportAzureAD = require("passport-azure-ad");

const controller = require("./controller");
const config = require("./config");

const passportAzureOptions = {
  audience: config.msal.audience,
  clientID: config.msal.clientID,
  identityMetadata: config.msal.identityMetadata,
  isB2C: config.msal.isB2C,
  issuer: config.msal.issuer,
  loggingLevel: config.msal.loggingLevel,
  passReqToCallback: config.msal.passReqToCallback,
  validateIssuer: config.msal.validateIssuer,
};

const bearerStrategy = new passportAzureAD.BearerStrategy(passportAzureOptions, function (token, done) {
  console.info(token, "was the token retreived");
  if (!token.oid) done(new Error("oid is not found in token"));
  else {
    owner = token.oid;
    done(null, {}, token);
  }
});

class App {
  constructor() {
    this.app = express();

    this.midlewares();
    this.routes();
    this.handlers();
  }

  midlewares() {
    /* Set the ip-address of your trusted reverse proxy server such as 
         haproxy or Apache mod proxy or nginx configured as proxy or others.
         The proxy server should insert the ip address of the remote client
         through request header 'X-Forwarded-For' as 'X-Forwarded-For: some.client.ip.address' */
    this.app.enable("trust proxy");

    this.app.use(cors()); // CORS
    this.app.use(helmet()); // Nice to have headers
    this.app.use(morgan("common")); // Request Logger
    this.app.use(express.json());
    this.app.use(passport.initialize());
    passport.use(bearerStrategy);
  }

  handlers() {
    this.app.use((req, res) => {
      res.status(404).json({
        someBody: "Route not found or missing resource...",
      });
    });

    this.app.use((error, req, res, next) => {
      if (error.status) {
        res.status(error.status);
      } else {
        res.status(500);
      }
      res.json({
        message: error.message,
        stack: process.env.NODE_ENV === "production" ? "Something wrong happened" : error.stack,
      });
    });
  }

  routes() {
    this.app.get("/mailpy/api/protected", passport.authenticate("oauth-bearer", { session: false }), (req, res) => {
      console.log("Validated claims: ", req.authInfo);
      res.status(200).json({ name: req.authInfo["name"] });
    });
    this.app.get("/mailpy/api/groups", controller.getGroups);
    this.app.get("/mailpy/api/group:id", controller.getGroup);

    this.app.get("/mailpy/api/conditions", controller.getConditions);

    this.app.get("/mailpy/api/entries", controller.getEntries);
    this.app.get("/mailpy/api/entry:id", controller.getEntry);

    this.app.get("/", (req, res, next) => {
      res.send("Mailpy - REST API");
    });
  }
}

module.exports = new App().app;
