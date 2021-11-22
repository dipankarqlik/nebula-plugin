const jsonWebToken = require("jsonwebtoken");
const fs = require("fs");
const config = require("../config/config");

const key = fs.readFileSync(".data/private.pem.txt", "utf8");
const methods = {
  generate: function (clientIp, tenantDomain) {
    // kid and issuer have to match with the IDP config and the audience has to be qlik.api/jwt-login-session

    const signingOptions = {
      keyid: config.keyid,
      algorithm: "RS256",
      issuer: config.issuer,
      expiresIn: "30s",
      audience: "qlik.api/login/jwt-session"
    };

    // These are the claims that will be accepted and mapped anything else will be ignored. sub, subtype and name are mandatory.
    // Realm is optional in the sub field.
    //Buffer.from('Hello World!').toString('base64')
    const userInfo = Buffer.from(
      `${clientIp}_${new Date().toUTCString()}`
    ).toString("base64");
    const payload = {
      sub: userInfo,
      subType: "user",
      name: userInfo,
      email: `${userInfo}@${config.tenantDomain}`,
      email_verified: true,
      groups: ["anon-view"]
    };

    const token = jsonWebToken.sign(payload, key, signingOptions);
    return token;
  }
};

module.exports = methods;
