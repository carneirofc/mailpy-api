const fetch = require("node-fetch");
const passportAzureAD = require("passport-azure-ad");

const config = require("../config");
const endpoint = config.graphConfig;

const passportAzureOptions = {
  audience: config.msal.audience,
  clientID: config.msal.clientID,
  identityMetadata: config.msal.identityMetadata,
  isB2C: config.msal.isB2C,
  issuer: config.msal.issuer,
  loggingLevel: config.msal.loggingLevel,
  passReqToCallback: config.msal.passReqToCallback,
  validateIssuer: config.msal.validateIssuer,
};

const bearerStrategy = new passportAzureAD.BearerStrategy(passportAzureOptions, function (token, done) {
  console.info(token, "was the token retreived");
  if (!token.oid) done(new Error("oid is not found in token"));
  else {
    owner = token.oid;
    done(null, {}, token);
  }
});

/** Helper function to call MS Graph API endpoint 
 using authorization bearer token scheme */
const callMSGraph = async (endpoint, bearer) => {
  console.log(endpoint, bearer);
  const options = {
    method: "GET",
    headers: { 'Authorization': bearer },
  };

  console.log(`Request made to Graph API at endpoint ${endpoint}`);
  fetch(endpoint, options)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((error) => console.log(error));
};

const basicLoginCheck = async (req, res) => {
  console.log("Validated claims: ", req.authInfo);
  console.log("MS Graph Me!", callMSGraph(endpoint.graphMeEndpoint, req.header("Authorization")));

  res.status(200).json({ name: req.authInfo["name"] });
};

module.exports = { bearerStrategy: bearerStrategy, basicLoginCheck: basicLoginCheck };
