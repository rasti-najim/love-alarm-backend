const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const nodemailer = require("nodemailer");
const debug = require("debug")("app:routes:users");
const jwt = require("jsonwebtoken");
const genAuthToken = require("../utils/genAuthToken");
const pool = require("../db");
const validateUser = require("../middleware/validateUser");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  try {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.user.id,
    ]);
    res.send(_.omit(user.rows[0], ["password"]));
  } catch (error) {
    res.sendStatus(500);
  }
});

// * registration
router.post("/", [validateUser], async (req, res) => {
  try {
    // const emailData = req.emailData;

    // * 1. destruct the req.body
    const { email, code, password, username, birth_date } = req.body;

    // * 2. check if the user exists (if so, throw error)
    const user = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );
    if (user.rows.length !== 0)
      return res.status(400).send("User already registered.");

    // * check if the user has verified their email
    const confirmToken = req.header("x-confirm-token");
    if (!confirmToken) return res.status(401).send("Email not verified.");

    try {
      const emailData = jwt.verify(confirmToken, "confirmToken");
      if (emailData.code !== code) {
        return res.status(400).send("Invalid confirmation code.");
      } else if (emailData.email !== email)
        return res.status(401).send("Email not verified.");
    } catch (error) {
      return res.status(400).send("Invalid token.");
    }

    // * 3. bcrypt the password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // * 4. enter the new user inside the database
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password, birth_date) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, hashedPassword, birth_date]
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
