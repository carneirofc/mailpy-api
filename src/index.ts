import dotenv from "dotenv";
dotenv.config();

import http from "http";
import https from "https";
import fs from "fs";
import app from "./app";
import config from "./config";

try {
  const credentials = {
    key: fs.readFileSync("./keys/key.pem", "utf-8"),
    cert: fs.readFileSync("./keys/cert.pem", "utf-8"),
  };
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(config.server.port, config.server.port, () => {
    console.log(`Express server started at https://${config.server.host}:${config.server.port}`);
  });
} catch (e) {
  console.error(`Failed to start https server ${e}`);
  const httpServer = http.createServer(app);
  httpServer.listen(config.server.port, config.server.port, () => {
    console.warn(
      `Express server started at http://${config.server.host}:${config.server.port}. Some functionalities may not work due to the unsecure protocol`
    );
  });
}
