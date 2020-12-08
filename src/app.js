const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const http = require("http");
const https = require("https");
const fs = require("fs");

const config = require("./config");
const controller = require("./controller");
const middleware = require("./midlewares");
const auth = require("./controller/auth");

const passport = require("passport");
//const createHandler = require("azure-function-express").createHandler;
const BearerStrategy = require("passport-azure-ad").BearerStrategy;

const bearerStrategy = new BearerStrategy(auth.options, (token, done) => {
  done(null, {}, token);
});

API_ROOT = process.env.API_ROOT || "/mailpy/api";

class App {
  constructor() {
    this.app = express();
    this.routesList = [];
    this.midlewares();
    this.routes();
  }

  midlewares() {
    /* Set the ip-address of your trusted reverse proxy server such as 
         haproxy or Apache mod proxy or nginx configured as proxy or others.
         The proxy server should insert the ip address of the remote client
         through request header 'X-Forwarded-For' as 'X-Forwarded-For: some.client.ip.address' */
    this.app.enable("trust proxy");
    this.app.use(cors()); // CORS
    this.app.use(helmet()); // Nice to have headers
    this.app.use(express.json());
    this.app.use(morgan("common")); // Request Logger
    this.app.use(require("body-parser").urlencoded({ extended: true }));
    this.app.use(passport.initialize());
    passport.use(bearerStrategy);
  }

  pushGetRoute(name, ...args) {
    this.routesList.push({ GET: name });
    this.app.get(name, ...args);
  }

  routes() {
    //this.pushGetRoute(`${API_ROOT}/protected`, /*validateJwt,*/ acquireTokenOBO);
    this.pushGetRoute(
      `${API_ROOT}/protected`,
      passport.authenticate("oauth-bearer", { session: false }),
      auth.validateClaims
    );

    this.pushGetRoute(`${API_ROOT}/groups`, controller.getGroups);
    this.pushGetRoute(`${API_ROOT}/group:id`, controller.getGroup);

    this.pushGetRoute(`${API_ROOT}/conditions`, controller.getConditions);

    this.pushGetRoute(`${API_ROOT}/entries`, controller.getEntries);
    this.pushGetRoute(`${API_ROOT}/entry:id`, controller.getEntry);

    this.app.get(`/`, (req, res, next) => {
      res.send(this.routesList);
    });

    this.app.use(middleware.routeNotFound);
    this.app.use(middleware.exceptionHappened);
  }

  listen() {
    try {
      const credentials = {
        key: fs.readFileSync("./keys/key.pem", "utf-8"),
        cert: fs.readFileSync("./keys/cert.pem", "utf-8"),
      };
      const httpsServer = https.createServer(credentials, this.app);
      httpsServer.listen(config.server.port, config.server.port, () => {
        console.log(`Express server started at https://${config.server.host}:${config.server.port}`);
      });
    } catch (e) {
      console.error(`Failed to start https server ${e}`);
      const httpServer = http.createServer(this.app);
      httpServer.listen(config.server.port, config.server.port, () => {
        console.warn(
          `Express server started at http://${config.server.host}:${config.server.port}. Some functionalities may not work due to the unsecure protocol`
        );
      });
    }
    console.info("Available API endpoints");
    this.routesList.forEach((e) => console.info(e));
  }
}

module.exports = new App();
