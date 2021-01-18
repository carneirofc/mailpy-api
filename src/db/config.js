export default {
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/mailpy",
    options: {
        connectTimeoutMS: 1000,
        loggerLevel: "info"
    }
};