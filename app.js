"use strict";

/** Express App for Sharebnb. */

const express = require("express");
const cors = require('cors');
const { NotFoundError } = require('./expressError');

const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
//TODO: middleware stuff

app.use('/auth', authRoutes);


/** Handle 404 errors -- this matches everything */
app.use(function (req, res) {
  throw new NotFoundError();
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;