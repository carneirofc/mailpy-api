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

  let response = await fetch(resourceURI, options);
  let json = await response.json();
  return json;
};

const getNewAccessToken = async (userToken) => {
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
  //let json = response.json();
  return json;
};

const validateClaims = async (req, res) => {
  console.log("Validated claims: ", JSON.stringify(req.authInfo));

  // the access token the user sent
  const userToken = req.get("authorization");

  // request new token and use it to call resource API on user's behalf
  let tokenObj = await getNewAccessToken(userToken);

  // access the resource with token
  let apiResponse = await callResourceAPI(tokenObj["access_token"], auth.resourceUri);

  res.status(200).json(apiResponse);
};

module.exports = { options: options, validateClaims };
