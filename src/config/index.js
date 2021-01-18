import process from "process";

export default {
  api: {
    API_ROOT: process.env.API_ROOT || "/mailpy/api",
  },
  server: {
    host: process.env.API_HOST || "0.0.0.0",
    port: process.env.API_PORT || 1337,
  },
  db: {
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/mailpy",
    options: {
      connectTimeoutMS: 1000,
      loggerLevel: "info",
    },
  },
  db_test: {
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27018/mailpy-test",
    options: {
      connectTimeoutMS: 1000,
      loggerLevel: "debug",
    },
  },
};
