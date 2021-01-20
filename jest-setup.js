const path = require("path");
const fs = require("fs");

/**
 * Setup a testing instance of Mongodb and generate
 * the config file used on the jest environment
 */

const { MongoMemoryServer } = require("mongodb-memory-server");

const globalConfigPath = path.join(__dirname, "globalConfigMongo.json");

const mongod = global.__MONGOD__ || new MongoMemoryServer({
  autoStart: false
});

module.exports = async () => {
  if (!mongod.runningInstance) {
    await mongod.start();
  }

  const mongoConfig = {
    mongoDBName: "jest",
    mongoUri: await mongod.getUri()
  };

  // Write global config to disk because all tests run in different contexts.
  fs.writeFileSync(globalConfigPath, JSON.stringify(mongoConfig));

  // Set reference to mongod in order to close the server during teardown.
  global.__MONGOD__ = mongod;
}