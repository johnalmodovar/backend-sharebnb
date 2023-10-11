"use strict";

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

/** creates token from user data.
 *
 * JWT = { username }
 */

function createToken(user) {
  let payload = {
    username: user.username,
  };
  console.log("PAYLOAD!!!! In createToken ", payload);

  return jwt.sign(payload, `${SECRET_KEY}`);
}

module.exports = { createToken };