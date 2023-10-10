"use strict";

const bcrypt = require("bcrypt");


class User {

  static async register(
    { username, firstName, lastName, password, email, phone }) {
    const duplicateCheck = await db.query(`
        SELECT username
        FROM users
        WHERE username = $1`, [username],
    );

    if (duplicateCheck.rows.length > 0) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }




  }
}