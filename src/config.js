module.exports = {
    HOST: process.env.API_HOST || '0.0.0.0',
    PORT: process.env.API_PORT || 1337,
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/mailpy-db"
};
