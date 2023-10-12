"use strict";
const express = require("express");
const router = new express.Router();
const { isCorrectUser, isLoggedIn } = require("../middleware/auth");
const { readFile, uploadToS3 } = require("../helpers/s3Upload");

const Listing = require('../models/listing');

/** POST: /create -> adds listing to database.
 *
 * Returns listing data -> { title, description, price, location, photoUrl, listed_by }
 */
router.post("/create", isLoggedIn, async function (req, res) {

  const { title, description, price, location, photoFile, listedBy } = req.body;
  // const photoContent = await readFile(photoFile);
  // const photoUrl = await uploadToS3(photoContent);
  const photoUrl = photoFile;
  const listing = await Listing.add({ title, description, price, location, photoUrl, listedBy });

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