require("dotenv").config();
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
//const yup = require('yup');
//const rateLimit = require('express-rate-limit');
//const slowDown = require('express-slow-down');

const passport = require("passport");
const passportAzureAD = require("passport-azure-ad");

const config = require("./config");
const controller = require("./controller");

const app = express();

// Set the ip-address of your trusted reverse proxy server such as
// haproxy or Apache mod proxy or nginx configured as proxy or others.
// The proxy server should insert the ip address of the remote client
// through request header 'X-Forwarded-For' as 'X-Forwarded-For: some.client.ip.address'
app.enable("trust proxy"); //, '127.0.0.1');

app.use(cors());
app.use(helmet());
app.use(morgan("dev")); // Request Logger
app.use(express.json());
app.use(passport.initialize());

const options = {
  audience: config.msal.audience,
  clientID: config.msal.clientID,
  identityMetadata: config.msal.identityMetadata,
  isB2C: config.msal.isB2C,
  issuer: config.msal.issuer,
  loggingLevel: config.msal.loggingLevel,
  passReqToCallback: config.msal.passReqToCallback,
  validateIssuer: config.msal.validateIssuer,
};

const bearerStrategy = new passportAzureAD.BearerStrategy(options, function (token, done) {
  console.info(token, "was the token retreived");
  if (!token.oid) done(new Error("oid is not found in token"));
  else {
    owner = token.oid;
    done(null, {}, token);
  }
});
passport.use(bearerStrategy);

app.get(
  "/mailpy/api/protected",
  passport.authenticate("oauth-bearer", { session: false }),
  (req, res) => {
    console.log("Validated claims: ", req.authInfo);

    // Service relies on the name claim.
    res.status(200).json({ name: req.authInfo["name"] });
  }
  // wrap passport.authenticate call in a middleware function
  /*  function (req, res, next) {
    // call passport authentication passing the "local" strategy name and a callback function
    passport.authenticate("oauth-bearer", function (error, user, info) {
      // this will execute in any case, even if a passport strategy will find an error
      // log everything to console
      console.log(error);
      console.log(user);
      console.log(info);

      if (error) {
        res.status(401).send(error);
      } else if (!user) {
        res.status(401).send(info);
      } else {
        next();
      }

      res.status(401).send(info);
    })(req, res);
  },*/
  // controller.getProtected
);

app.get("/mailpy/api/groups", controller.getGroups);
//app.get("/group:id", controller.getGroup);

app.get("/mailpy/api/conditions", controller.getConditions);

app.get("/mailpy/api/entries", controller.getEntries);
//app.get("/entry:id", controller.getEntry);

app.get("/", (req, res, next) => {
  res.send("Mailpy - REST API");
});

app.use((req, res) => {
  res.status(404).json({
    someBody: "Route not found or missing resource.....",
  });
});

app.use((error, req, res, next) => {
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

app.listen(config.config.server, HOST, () => {
  console.log("Express server started on port %s at %s", PORT, HOST);
});
