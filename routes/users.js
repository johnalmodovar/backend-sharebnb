const express = require("express");
const router = new express.Router();
const User = require('../models/user');
const { createToken } = require("../helpers/tokens");
const { isCorrectUser } = require("../middleware/auth");

/**
 * GET: /:username
 *
 * Returns user data {username, firstName, lastName }
 */
router.get("/:username", isCorrectUser, async function (req, res) {
  const user = await User.get(req.params.username);

  return res.json({ user });
});

module.exports = router;