const express = require("express");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

router.post("/email", async (req, res) => {
  const { email } = req.body;
  // const emailToken = await sendEmail(email);
  const confirmToken = await sendEmail(email);

  // res.send(emailToken);
  res.send(confirmToken);
});

router.get("/:token", async (req, res) => {
  const payload = jwt.verify(req.params.token, "emailToken");
  payload.confirmed = true;

  const confirmToken = jwt.sign(payload, "confirmToken");
  res.header("x-confirm-token", confirmToken).send(payload);
});

router.post("/code", (req, res) => {
  const { code } = req.body;
  console.log(code);

  // * check if the user has verified their email
  const confirmToken = req.header("x-confirm-token");
  console.log(confirmToken);
  if (!confirmToken)
    return res.status(401).send("Access denied. No token provided.");

  try {
    const payload = jwt.verify(confirmToken, "confirmToken");
    if (payload.code !== code) {
      return res.status(400).send("Invalid confirmation code.");
    }

    res.header("x-confirm-token", confirmToken).send(payload);
  } catch (error) {
    return res.status(400).send("Invalid token.");
  }
});

module.exports = router;
