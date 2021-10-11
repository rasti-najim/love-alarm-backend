const express = require("express");
const pool = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM chats WHERE (friend_one_id = $1 OR friend_one_id = $2) AND (friend_two_id = $1 OR friend_two_id = $2)",
      [req.user.id, id]
    );
    res.send(result.rows[0]);
  } catch (error) {
    console.log(error);
  }
});

router.post("/createChat/:friend_id", auth, async (req, res) => {
  try {
    const { friend_id } = req.params;
    const response = await pool.query(
      "INSERT INTO chats (friend_one_id, friend_two_id) VALUES ($1, $2) RETURNING *",
      [req.user.id, friend_id]
    );
    res.send(response.rows[0]);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
