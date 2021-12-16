const configAzure = {
  audience: "3ab086b7-33bf-4f5e-8c30-72fbdbc12c25",
  authority: "login.microsoftonline.com",
  clientID: "3ab086b7-33bf-4f5e-8c30-72fbdbc12c25",
  clientSecret: process.env.AZURE_CLIENT_SECRET, // client secret from Azure
  discovery: ".well-known/openid-configuration",
  loggingLevel: "info",
  loggingNoPII: true,
  passReqToCallback: false,
  resourceScope: ["https://graph.microsoft.com/User.Read"],
  resourceUri: "https://graph.microsoft.com/v1.0/me",
  tenantId: "ed764e1f-b3b8-4aaf-8fb2-1d05be08443b",
  tenantName: "CNPEMCAMP",
  validateIssuer: true,
  version: "v2.0",
};

export default configAzure;

export const strategyOptions = {
  identityMetadata: `https://${configAzure.authority}/${configAzure.tenantId}/${configAzure.version}/${configAzure.discovery}`,
  issuer: `https://${configAzure.authority}/${configAzure.tenantId}/${configAzure.version}`,
  clientID: configAzure.clientID,
  validateIssuer: configAzure.validateIssuer,
  audience: configAzure.audience,
  loggingLevel: configAzure.loggingLevel,
  passReqToCallback: configAzure.passReqToCallback,
  loggingNoPII: configAzure.loggingNoPII,
};
