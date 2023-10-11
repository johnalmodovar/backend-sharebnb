"use strict";

/** Config options for entire application. */

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;
const BUCKET = "sharebnb-jm";
const PORT = 3001;


/** Use dev database, testing database, or via env var, production database */
function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
    ? "postgresql:///sharebnb_test"
    : process.env.DATABASE_URL || "postgresql:///sharebnb";
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

module.exports = {
  SECRET_KEY,
  BUCKET,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};