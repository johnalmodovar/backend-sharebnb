"use strict";

/** Config options for entire application. */

require("dotenv").config;

const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const SECRET_KEY = process.env.SECRET_KEY;
const BUCKET = "sharebnb-jm";
const PORT = 3001;


AWS.config.update({ region: 'us-west-1' });


/** Use dev database, testing database, or via env var, production database */
function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
    ? "postgresql:///jobly_test"
    : process.env.DATABASE_URL || "postgresql:///jobly";
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

module.exports = {
  AWS,
  s3,
  SECRET_KEY,
  BUCKET,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};