"use strict";

const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");
const User = require('../models/user');
const { createToken } = require("../helpers/tokens");
const userLoginSchema = require("../schemas/userLogin.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require("../expressError");

/**
 * POST auth/register { userFormData } => { token }
 *
 * userFormData = { username, firstName, lastName, password, email, phone }
 *
 * returns json token that's been signed by the server.
 */

router.post("/register", async function (req, res) {
  // const userFormData = { ...req.body, phone: Number(phone) };
  let { username, firstName, lastName, password, email, phone } = req.body;
  phone = Number(phone);
  const validator = jsonschema.validate(
    {
      username,
      firstName,
      lastName,
      password,
      email,
      phone
    },
    userRegisterSchema,
    { required: true }
  );
  if (!validator.valid) {
    const errors = validator.errors.map(e => e.stack);
    throw new BadRequestError(errors);
  }

  const user = await User.register({
    username,
    firstName,
    lastName,
    password,
    email,
    phone
  });
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