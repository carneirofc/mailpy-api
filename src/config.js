module.exports = {
  resource: {
    scope: ["access_as_userUser"],
  },
  msal: {
    tenantName: "CNPEMCAMP",
    clientID: "21787c54-4ba3-4270-a273-adf60bc20601",
    identityMetadata:
      "https://login.microsoftonline.com/CNPEMCAMP.onmicrosoft.com/v2.0/.well-known/openid-configuration",
    isB2C: false,
    validateIssuer: true,
    passReqToCallback: false,
    loggingLevel: "info",
    issuer: null /* Required if you are using common endpoint and setting `validateIssuer` to true.*/,
    audience: null /* Optional, default value is clientID */,
    allowMultiAudiencesInToken: false /* Set to true if you accept access_token whose `aud` claim contains multiple values.*/,
  },
  server: {
    host: process.env.API_HOST || "0.0.0.0",
    port: process.env.API_PORT || 1337,
  },
  db: {
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/mailpy-db",
  },
};
