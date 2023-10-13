"use strict";

const express = require("express");
const router = new express.Router();

const User = require('../models/user');
const { createToken } = require("../helpers/tokens");
const userLoginSchema = require("../schemas/userLogin.json");
const userRegisterSchema = require("../schemas/userRegister.json");

/**
 * POST auth/register { userFormData } => { token }
 *
 * userFormData = { username, firstName, lastName, password, email, phone }
 *
 * returns json token that's been signed by the server.
 */

router.post("/register", async function (req, res) {
  const validator = jsonschema.validate(
    req.body,
    userRegisterSchema,
    { required: true }
  );
  if (!validator.valid) {
    const errors = validator.errors.map(e => e.stack);
    throw new BadRequestError(errors);
  }

  const userFormData = { ...req.body };
  const user = await User.register(userFormData);
  const token = createToken(user);

  return res.status(201).json({ token });
});

/**
 * POST /auth/login { username, password } => { token }
 *
 */

router.post("/login", async function (req, res) {
  const validator = jsonschema.validate(
    req.body,
    userLoginSchema,
    { required: true }
  );
  if (!validator.valid) {
    const errors = validator.errors.map(e => e.stack);
    throw new BadRequestError(errors);
  }

  const { username, password } = req.body;
  const user = await User.authenticate(username, password);
  const token = createToken(user);

  return res.json({ token });

});

module.exports = router;