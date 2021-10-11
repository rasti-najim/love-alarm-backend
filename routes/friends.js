const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const nodemailer = require("nodemailer");
const axios = require("axios");
const debug = require("debug")("app:routes:friends");
const url = require("url");
const jwt = require("jsonwebtoken");
const genAuthToken = require("../utils/genAuthToken");
const pool = require("../db");
const validateUser = require("../middleware/validateUser");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM friends JOIN users ON friends.friend_id = users.id WHERE user_id = $1",
      [req.user.id]
    );
    res.send(result.rows);
  } catch (error) {
    console.log(error);
  }
});

router.get("/check/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM added_by WHERE user_id = $1 AND added_by_id = $2",
      [req.user.id, id]
    );
    if (result.rows.length != 0) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/addFriend/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const checkResult = await pool.query(
      "SELECT * FROM added_by WHERE user_id = $1 AND added_by_id = $2",
      [id, req.user.id]
    );
    if (checkResult.rows.length != 0) {
      const deleteResult = await pool.query(
        "DELETE FROM added_by WHERE user_id = $1 AND added_by_id = $2 RETURNING *",
        [id, req.user.id]
      );
      return res.send(deleteResult.rows[0]);
    }

    const addedCheckResult = await pool.query(
      "SELECT * FROM added_by WHERE user_id = $1 AND added_by_id = $2",
      [req.user.id, id]
    );
    if (addedCheckResult.rows.length != 0) {
      const addResult = await pool.query(
        "INSERT INTO friends (user_id, friend_id, created_at) VALUES ($1, $2, $3) RETURNING *",
        [req.user.id, id, new Date()]
      );
      await pool.query(
        "INSERT INTO friends (user_id, friend_id, created_at) VALUES ($1, $2, $3) RETURNING *",
        [id, req.user.id, new Date()]
      );
      const url = `${req.protocol}://${req.get("host")}`;
      const response = await axios.post(
        `${url}/api/chats/createChat/${id}`,
        {},
        { headers: { "x-auth-token": req.header("x-auth-token") } }
      );
      return res.send(addResult.rows[0]);
    }

    const result = await pool.query(
      "INSERT INTO added_by (user_id, added_by_id, added_at) VALUES ($1, $2, $3) RETURNING *",
      [id, req.user.id, new Date()]
    );
    return res.send(result.rows[0]);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
