//const path = require('path');
require("dotenv").config();
const cors = require("cors");
const express = require("express");
//const helmet = require("helmet");
const morgan = require("morgan");
//const yup = require('yup');
//const rateLimit = require('express-rate-limit');
//const slowDown = require('express-slow-down');

const passport = require("passport");
const BearerStrategy = require("passport-azure-ad").BearerStrategy;

const config = require("./config");
const controller = require("./controller");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 1337;

const app = express();

// Set the ip-address of your trusted reverse proxy server such as
// haproxy or Apache mod proxy or nginx configured as proxy or others.
// The proxy server should insert the ip address of the remote client
// through request header 'X-Forwarded-For' as 'X-Forwarded-For: some.client.ip.address'
//app.enable("trust proxy"); //, '127.0.0.1');

app.use(cors());
//app.use(helmet());
app.use(morgan("dev")); // Request Logger
//app.use(express.json());
app.use(passport.initialize());

const options = {
  audience: config.options.audience,
  clientID: config.credentials.clientID,
  identityMetadata: config.identityMetadata,
  isB2C: config.settings.isB2C,
  issuer: config.settings.issuer,
  loggingLevel: config.settings.loggingLevel,
  passReqToCallback: config.settings.passReqToCallback,
  policyName: config.policies.policyName,
  validateIssuer: config.settings.validateIssuer,
};

const bearerStrategy = new BearerStrategy(options, function (token, done) {
  console.info(token, "was the token retreived");
  if (!token.oid) done(new Error("oid is not found in token"));
  else {
    owner = token.oid;
    done(null, {}, token);
  }
});
passport.use(bearerStrategy);
/*app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});*/

app.get(
  "/mailpy/api/hello",
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
  console.log("Use", error, req, res);
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }
  res.json({
    message: error.message,
    stack: error.stack,
  });
});

app.listen(PORT, HOST, () => {
  console.log("Express server started on port %s at %s", PORT, HOST);
});
