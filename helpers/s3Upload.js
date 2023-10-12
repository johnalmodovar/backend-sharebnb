const uuid = require('uuid').v4;
const AWS = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
const fsP = require("fs/promises");
const express = require('express');

const app = express();

dotenv.config();

const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_DEFAULT_REGION = process.env.AWS_DEFAULT_REGION;
const BUCKET_NAME = "sharebnb-jm";

const s3 = new AWS.S3({
  region: 'us-west-1',
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  accessKeyID: AWS_ACCESS_KEY_ID
});


async function uploadToS3(data) {
  const name = uuid() + '.jpeg';

  await s3.putObject({
    Key: name,
    Bucket: BUCKET_NAME,
    ContentType: 'image/jpeg',
    Body: data
  });

  return `https://${BUCKET_NAME}.s3.us-west-1.amazonaws.com/${name}`;
};


// async function getPhotoUrl(path) {

//   try {
//     //TODO: may have to change w/form data
//     const content = await fsP.readFile(path);
//     const url = await uploadToS3(content, 'image/jpeg');
//     //TODO: add to db instead of console log
//     console.log(url);
//   } catch (err) {
//     console.error(`Error reading ${path}: ${err}`);
//     process.exit(1);
//   }
// }

async function readFile(path) {
  try {
    return await fsP.readFile(path);
  } catch (err) {
    console.error(`Error reading ${path}: ${err}`);
    process.exit(1);
  }
}

module.exports = { readFile, uploadToS3 };