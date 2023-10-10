"use strict";

/** Config options for entire application. */

require("dotenv").config;

const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });


const BUCKET = "sharebnb-jm";


AWS.config.update({ region: 'us-west-1' });