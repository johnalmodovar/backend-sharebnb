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
   * Return => { title, description, price, availability, photos }
   *    where photos => {...}
   *
   */
  static async addListing({ title, description, price, availability, photos }) {
    const result = await db.query(`
        INSERT INTO listings
          (title,
           description,
           price,
           availability,
           photos)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
           username,
           description,
           price,
           availability,
           photos`,
      [title, description, price, availability, photos]
    );

    const listing = result.rows[0];

    return listing;
  }

  //TODO: function to convert photo file into url to save in database

}