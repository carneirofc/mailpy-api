const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const passport = require("passport");

const config = require("./config");
const controller = require("./controller");
const authorization = require("./controller/authorization");
const middleware = require("./midlewares");

class App {
  constructor() {
    this.app = express();

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

  routes() {
    this.app.get(
      "/mailpy/api/protected",
      passport.authenticate("oauth-bearer", { session: false }),
      authorization.basicLoginCheck
    );
    this.app.get("/mailpy/api/groups", controller.getGroups);
    this.app.get("/mailpy/api/group:id", controller.getGroup);

    this.app.get("/mailpy/api/conditions", controller.getConditions);

    this.app.get("/mailpy/api/entries", controller.getEntries);
    this.app.get("/mailpy/api/entry:id", controller.getEntry);

    this.app.get("/", (req, res, next) => {
      res.json.send("Mailpy - REST API");
    });

    this.app.use(middleware.routeNotFound);
    this.app.use(middleware.exceptionHappened);
  }

  listen() {
    this.app.listen(config.server.port, config.server.port, () => {
      console.log(`Express server started on port ${config.server.port} at ${config.server.port}`);
    });
  }
}

module.exports = new App();
