const express = require("express");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

router.post("/email", async (req, res) => {
  const { email } = req.body;
  const emailToken = await sendEmail(email);

  res.send(emailToken);
});

router.get("/:token", async (req, res) => {
  const payload = jwt.verify(req.params.token, "emailToken");
  payload.confirmed = true;

  const confirmToken = jwt.sign(payload, "confirmToken");
  res.header("x-confirm-token", confirmToken).send(payload);
});

module.exports = router;
