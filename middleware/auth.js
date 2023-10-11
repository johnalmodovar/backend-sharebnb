"use strict";

/** Middleware for authentication. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require('../config');
const { UnauthorizedError } = require('../expressError');

/** authenticates user.
 *
 * Verifies token.
 * - if valid, stores token payload in res.locals.
 * - if not, throw error that token is not valid.
 */

function authenticateJWT(req, res, next) {
  const authHeader = req.headers?.authorization;

  if (authHeader) {
    const token = authHeader;
    try {
      res.locals.user = jwt.verify(token, `${SECRET_KEY}`);
    } catch (err) {
      // doesn't store user when token is invalid.
    }
  }


  return next();
}

/** Ensures user is logged in. */

function isLoggedIn(req, res, next) {
  if (res.locals.user?.username) return next();

  throw new UnauthorizedError();
}

/**
 * Ensures user trying to access current user data is correct user
 *
 * Throws Unauthorized Error if not.
 *
 */

function isCorrectUser(req, res, next) {
  const username = res.locals.user?.username;
  if (username === req.params.username) {
    return next();
  }

  throw new UnauthorizedError();
}

module.exports = {
  authenticateJWT,
  isLoggedIn,
  isCorrectUser
};