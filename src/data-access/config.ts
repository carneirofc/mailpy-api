import { MongoClientOptions } from "mongodb";

const options: MongoClientOptions = {
  connectTimeoutMS: 1000,
  loggerLevel: "info",
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

export default {
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/mailpy",
  options,
};
