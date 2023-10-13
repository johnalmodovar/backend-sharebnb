/** helper functions that deal with AWS. */

const uuid = require('uuid').v4;
const AWS = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
const fsP = require("fs/promises");
const express = require('express');

const app = express();

dotenv.config();

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.BUCKET_NAME;

const s3 = new AWS.S3({
  region: 'us-west-1',
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  accessKeyID: AWS_ACCESS_KEY_ID
});

/** Uploads file to AWS bucket. */

async function uploadToS3(file) {
  // const name = uuid() + '.jpeg';

  await s3.putObject({
    Key: file.originalname,
    Bucket: BUCKET_NAME,
    ContentType: file.mimetype,
    Body: file.buffer
  });

  return `https://${BUCKET_NAME}.s3.us-west-1.amazonaws.com/${file.originalname}`;
};


module.exports = { readFile, uploadToS3 };