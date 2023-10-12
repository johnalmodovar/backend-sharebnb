"use strict";

const db = require('../db');
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

class Listing {

  /** Adds listing to database with provided data.
   *
   * Return => { title, description, price, availability, photoUrl }
   *    where photos => {...}
   *
   */
  static async add({ title, description, price, location, photoUrl }) {

    const result = await db.query(`
        INSERT INTO listings
          (title,
           description,
           price,
           photo_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
           username,
           description,
           price,
           photo_url AS "photoUrl"`,
      [title, description, price, photoUrl]
    );

    const listing = result.rows[0];

    return listing;
  }

  //TODO: function to convert photo file into url to save in database

}

module.exports = Listing;