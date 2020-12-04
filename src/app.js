const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const passport = require("passport");
const http = require("http");
const https = require("https");
const fs = require("fs");
const config = require("./config");
const controller = require("./controller");
const authorization = require("./controller/authorization");
const middleware = require("./midlewares");

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
    this.app.use(morgan("common")); // Request Logger
    this.app.use(express.json());
    this.app.use(passport.initialize());
    passport.use(authorization.bearerStrategy);
  }

  pushGetRoute(name, ...args) {
    this.routesList.push({ GET: name });
    this.app.get(name, ...args);
  }

  routes() {
    this.pushGetRoute(
      `${API_ROOT}/protected`,
      passport.authenticate("oauth-bearer", { session: false }),
      authorization.basicLoginCheck
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
        console.log(`Express server started at http://${config.server.host}:${config.server.port}`);
      });
    }
    console.info("Available API endpoints");
    this.routesList.forEach((e) => console.info(e));
  }
}

module.exports = new App();
