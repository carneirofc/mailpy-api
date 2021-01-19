import { MongoClient } from "mongodb";

import config from "./config";
import makeMailpyDB from "./mailpy-db";

const uri = config.MONGODB_URI;
const options = config.options;

console.info("Creating Mongodb client...");
const client = new MongoClient(uri, {
  ...options,
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
console.info("Done ...");

export const makeDb = async () => {
  if (!client.isConnected()) {
    console.info(`Trying to estabilish a connection to the database. ${uri}`);
    await client.connect().then(() => {
      console.info(`MongoDB Connected`);
    });
  }
  return client.db();
};

const mailpyDb = makeMailpyDB({ makeDb });

export default mailpyDb;

