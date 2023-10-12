const express = require("express");
const router = new express.Router();
const Listing = require("../models/listing");

/** GET: /:id
 *
 * Returns listing data { id, title, description, price, availability, photo_url }
 */
router.get("/:id", async function (req, res) {
  const listing = await Listing.get(req.params.id);

  return res.json({ listing });
});