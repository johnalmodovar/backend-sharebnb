"use strict";

const express = require("express");
const router = new express.Router();
const { isCorrectUser, isLoggedIn } = require("../middleware/auth");
const { readFile, uploadToS3 } = require("../helpers/s3Upload");
const listingNewSchema = require("../schemas/listingNew.json");
const multer = require('multer');
const upload = multer();
const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");
const Listing = require('../models/listing');

/** POST: /create -> adds listing to database.
 *
 * Returns listing data -> { title, description, price, location, photoUrl, listed_by }
 */
router.post(
  "/create",
  isLoggedIn,
  upload.single("photoFile"),
  async function (req, res) {
    let { title, description, price, location, listedBy } = req.body;
    price = Number(price);
    const validator = jsonschema.validate(
      {
        title,
        description,
        price,
        location,
        listedBy
      },
      listingNewSchema,
      { required: true }
    );
    if (!validator.valid) {
      const errors = validator.errors.map(e => e.stack);
      throw new BadRequestError(errors);
    }

    const photoFile = req.file;
    // const { title, description, price, location, listedBy } = req.body;
    const photoUrl = await uploadToS3(photoFile);
    const listing = await Listing.add({
      title,
      description,
      price,
      location,
      photoUrl,
      listedBy
    });


    return res.status(201).json({ listing });
  });

/** GET: / -> Grabs all listings.
 *
 * Returns listing data -> [{ title, description, price, location, photoUrl }, ...]
 */
router.get("/", async function (req, res) {
  const listings = await Listing.findAll(req.query);

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