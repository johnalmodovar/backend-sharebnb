"use strict";

const db = require('../db');
const bcrypt = require("bcrypt");
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError');

const { BCRYPT_WORK_FACTOR } = require('../config');


class User {

  /** Registers use with data.
   *
   * Return => { username, firstName, lastName, email, phone }
   *
   * Throws BadRequestError for duplicate username.
   */

  static async register(
    { username, firstName, lastName, password, email, phone }) {
    const duplicateCheck = await db.query(`
        SELECT username
        FROM users
        WHERE username = $1`, [username],
    );

    if (duplicateCheck.rows[0].length > 0) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(`
            INSERT INTO users
              (username,
              first_name,
              last_name,
              password,
              email,
              phone)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING
              username,
              first_name AS "firstName",
              last_name AS "lastName",
              email,
              phone`,
      [username, firstName, lastName, hashedPassword, email, phone]
    );

    const user = result.row[0];

    return user;
  }

  /** Authenticates user with username and password.
   *
   * Returns
   *
   * Throws UnauthorizedError if user isn't found or if wrong password.
   */

  static async authenticate(username, password) {
    const result = await db.query(`
            SELECT username,
                   password,
                   first_name AS "firstName",
                   last_name AS "lastName",
                   email,
                   phone
            FROM users
            WHERE username = $1`,
      [username]);

    const user = result.rows[0];

    if (user) {
      const validUser = await bcrypt.compare(password, user.password);

      if (validUser === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  //TODO: => function for booking a listing.
}

module.exports = User;