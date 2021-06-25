const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const debug = require("debug")("app:routes:users");
const genAuthToken = require("../utils/genAuthToken");
const pool = require("../db");
const validateUser = require("../middleware/validateUser");

const router = express.Router();

// * registration
router.post("/", validateUser, async (req, res) => {
  try {
    // * 1. destruct the req.body
    const { username, email, password } = req.body;

    // * 2. check if the user exists (if so, throw error)
    const user = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );
    if (user.rows.length !== 0)
      return res.status(400).send("User already registered.");

    // * 3. bcrypt the password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // * 4. enter the new user inside the database
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );

    // * 5. generate the jwt token and return it
    const token = genAuthToken(newUser.rows[0].id);
    res
      .header("x-auth-token", token)
      .send(_.omit(newUser.rows[0], ["password"]));
  } catch (error) {
    debug(error.message);
    res.sendStatus(500);
  }
});

module.exports = router;
