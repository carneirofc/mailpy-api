import { MongoClient, ObjectId } from "mongodb";

import config from "./config";
import makeMailpyDB from "./mailpy-db";
import makeUsersDb from "./users-db";

const uri = config.MONGODB_URI;
const options = config.options;

console.info("Opening database connection...", uri, options);
const client = new MongoClient(uri, options);

export const makeDb = async () => {
  if (!client.isConnected()) {
    console.info(`Trying to estabilish a connection to the database. ${uri}`);
    await client.connect().then(() => {
      console.info(`MongoDB Connected`);
    });
  }
  return client.db();
};

export const mailpyDb = makeMailpyDB({ makeDb });
export const usersDb = makeUsersDb({ makeDb });

export const getId = ({ id }: { id: string }) => {
  return new ObjectId(id);
};
