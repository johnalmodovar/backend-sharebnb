"use strict";
const express = require("express");
const router = new express.Router();
const { isCorrectUser, isLoggedIn } = require("../middleware/auth");
const { readFile, uploadToS3 } = require("../helpers/s3Upload");
const multer = require('multer');
const upload = multer();

const Listing = require('../models/listing');

/** POST: /create -> adds listing to database.
 *
 * Returns listing data -> { title, description, price, location, photoUrl, listed_by }
 */
router.post("/create", isLoggedIn, upload.single("photoFile"), async function (req, res) {
  const photoFile = req.file;
  console.log("photoFile in route", req.file);
  const { title, description, price, location, listedBy } = req.body;
  // const photoContent = await readFile(photoFile);
  console.log("all other form data in req.body in route", req.body);

  const photoUrl = await uploadToS3(photoFile);
  console.log("photoUrl in route", photoUrl);
  // const photoUrl = photoFile;
  const listing = await Listing.add({
    title,
    description,
    price,
    location,
    photoUrl,
    listedBy
  });
  console.log("listing in route", listing);

  return res.status(201).json({ listing });
});

/** GET: / -> Grabs all listings.
 *
 * Returns listing data -> [{ title, description, price, location, photoUrl }, ...]
 */
router.get("/", async function (req, res) {
  const listings = await Listing.findAll();
  return res.json({ listings });
});

/** GET: /:id
 *
 * Returns listing data { title, description, price, location, photoUrl,listed_by }
 */
router.get("/:id", async function (req, res) {
  const listing = await Listing.get(req.params.id);

  return res.json({ listing });

});

module.exports = router;