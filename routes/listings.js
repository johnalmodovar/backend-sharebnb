"use strict";
const express = require("express");
const router = new express.Router();
const { isCorrectUser, isLoggedIn } = require("../middleware/auth");
const { readFile, uploadToS3 } = require("../helpers/s3Upload");

const Listing = require('../models/listing');

router.post("/create", isLoggedIn, async function (req, res) {

  const { title, description, price, location, photoFile } = req.body;
  const photoContent = await readFile(photoFile);
  const photoUrl = await uploadToS3(photoContent);
  const listing = Listing.add(title, description, price, location, photoUrl);

  return res.status(201).json({ listing });
});

router.get("/", async function (req, res) {
  const listings = await Listing.findAll();
  return res.json({ listings });
});