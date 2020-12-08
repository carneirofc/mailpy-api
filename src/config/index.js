module.exports = {
  server: {
    host: process.env.API_HOST || "0.0.0.0",
    port: process.env.API_PORT || 1337,
  },
  db: {
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/mailpy-db",
  },
};
