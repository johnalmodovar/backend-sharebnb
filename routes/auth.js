"use strict";
const express = require("express");
const router = new express.Router();

const User = require('../models/user');
const { createToken } = require("../helpers/tokens");
//TODO: import schema later

/**
 * POST auth/register { userFormData } => { token }
 *
 * userFormData = { username, firstName, lastName, password, email, phone }
 *
 * returns json token that's been signed by the server.
 */

router.post("/register", async function (req, res) {
  const userFormData = { ...req.body };
  // JSON Schema Validator stuff here...

  const user = await User.register(userFormData);

  const token = createToken(user);

  return res.status(201).json({ token });
});

/**
 * POST /auth/login { username, password } => { token }
 *
 * TODO:
 */

router.post("/login", async function (req, res) {
  // JSON Schema Validator here...

  const { username, password } = req.body;
  const user = await User.authenticate(username, password);
  const token = createToken(user);

  return res.json({ token });

});

module.exports = router;