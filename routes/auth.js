const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const debug = require("debug")("app:routes:users");
const pool = require("../db");
const genAuthToken = require("../utils/genAuthToken");
const validateLogin = require("../middleware/validateLogin");

const router = express.Router();

// * authentication
router.post("/", validateLogin, async (req, res) => {
  try {
    // * 1. destruct the req.body
    const { email, password } = req.body;

    // * 2. check if user exists (if not throw error)
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0)
      return res.status(400).send("Invalid email or password.");

    // * 3. compare the given password with password stored in the database
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword)
      return res.status(400).send("Invalid email or password.");

    // * 4. generate the jwt token and return it
    const token = genAuthToken(user.rows[0].id);
    res.send(token);
  } catch (error) {
    debug(error.message);
    res.sendStatus(500);
  }
});

module.exports = router;
