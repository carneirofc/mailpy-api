exports.config = {
  credentials: {
    tenantName: "CNPEMCAMP",
    clientID: "21787c54-4ba3-4270-a273-adf60bc20601",
  },
  /* resource: {
    scope: ["access_as_userUser"],
  },*/
  identityMetadata: "https://login.microsoftonline.com/CNPEMCAMP.onmicrosoft.com/v2.0/.well-known/openid-configuration",
  settings: {
    isB2C: false,
    validateIssuer: false,
    passReqToCallback: false,
    loggingLevel: "info",
    issuer: null /* Required if you are using common endpoint and setting `validateIssuer` to true.*/,
    audience: null /* Optional, default value is clientID */,
    allowMultiAudiencesInToken: false /* Set to true if you accept access_token whose `aud` claim contains multiple values.*/,
  },
};
