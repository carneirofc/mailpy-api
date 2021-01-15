const auth = require("../config/auth.json");
const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

const options = {
  identityMetadata: `https://${auth.authority}/${auth.tenantID}/${auth.version}/${auth.discovery}`,
  issuer: `https://${auth.authority}/${auth.tenantID}/${auth.version}`,
  clientID: auth.clientID,
  validateIssuer: auth.validateIssuer,
  audience: auth.audience,
  loggingLevel: auth.loggingLevel,
  passReqToCallback: auth.passReqToCallback,
  loggingNoPII: auth.loggingNoPII,
};

const callResourceAPI = async (newTokenValue, resourceURI) => {
  let options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${newTokenValue}`,
      "Content-type": "application/json",
      Accept: "application/json",
      "Accept-Charset": "utf-8",
    },
  };
  console.log("Attempt to call Resource API");

  const response = await fetch(resourceURI, options)
    .then(res => res.json())
    .then(json => json)
    .catch(e => console.error(`Failed to get user data from ${resourceURI}, error ${e}`));
  return response;
};

const getNewAccessToken = async (userToken) => {
  /** The administrator consent is needed. Same problem described at:
   * https://stackoverflow.com/questions/56266148/aad-how-do-you-send-an-interactive-authorization-request-to-resolve-aadsts650
   * In a default environment the user would be propted at the SPA to accept and give the permission, but in our tenant it's more restrictive.
   * */
  const [bearer, tokenValue] = userToken.split(" ");
  const tokenEndpoint = `https://${auth.authority}/${auth.tenantID}/oauth2/${auth.version}/token`;

  let myHeaders = new fetch.Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  let urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
  urlencoded.append("client_id", auth.clientID);
  urlencoded.append("client_secret", auth.clientSecret);
  urlencoded.append("assertion", tokenValue);
  urlencoded.append("scope", auth.resourceScope.join(" "));
  urlencoded.append("requested_token_use", "on_behalf_of");

  console.log(`Encoded url ${tokenEndpoint}/${urlencoded.toString()}\n\n`);

  let options = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    //redirect: "follow",
  };

  console.info("Attempt to get a new OBO access token", tokenEndpoint, options);

  const json = await fetch(tokenEndpoint, options)
    .then((res) => res.json())
    .then((res) => res)
    .catch((err) => console.log(err));
  console.info("Response", json);
  return json;
};

const validateClaims = async (req, res, next) => {
  //console.log("Validated claims: ", JSON.stringify(req.authInfo));

  // the access token the user sent
  const userToken = req.get("authorization");

  // request new token and use it to call resource API on user's behalf
  let tokenObj = await getNewAccessToken(userToken);

  // access the resource with token
  let apiResponse = await callResourceAPI(tokenObj["access_token"], auth.resourceUri);

  if (apiResponse) {
    res.locals.validatedClaims = apiResponse;
    return next();
  }
  return next("Failed to obtain user data");
};

module.exports = { options: options, validateClaims };
