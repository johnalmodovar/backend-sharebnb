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
   * Return => { title, description, price, location, photoUrl, listed_by }
   *
   */
  static async add({ title, description, price, location, photoUrl, listedBy }) {

    const result = await db.query(`
        INSERT INTO listings
          (title,
           description,
           price,
           location,
           photo_url,
           listed_by)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
           title,
           description,
           price,
           location,
           photo_url AS "photoUrl",
           listed_by AS "listedBy"`,
      [title, description, price, location, photoUrl, listedBy]
    );

    const listing = result.rows[0];
    console.log("what is listing in model", listing);
    return listing;
  }

  /** Gets a listing from database with id.
   *
   * Returns => { title, description, price, location, listed_by, photoUrl }
   */
  static async get(id) {
    const response = await db.query(`
        SELECT id,
               title,
               description,
               price,
               location,
               photo_url AS "photoUrl",
               listed_by AS "listedBy"
        FROM listings
        WHERE id = $1`, [id]);

    const listing = response.rows[0];

    if (!listing) throw new NotFoundError("Listing Not Found.");

    return listing;
  }

  /** Gets all listing from database
 *
 * Returns => [{ title, description, price, location, listed_by, photoUrl }]
 */

  static async findAll() {
    const response = await db.query(`
          SELECT id,
                 title,
                 description,
                 price,
                 location,
                 photo_url AS "photoUrl",
                 listed_by AS "listedBy"
          FROM listings
          ORDER BY title`
    );

    return response.rows;
  }
}

module.exports = Listing;