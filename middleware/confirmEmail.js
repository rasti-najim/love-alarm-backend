const jwt = require("jsonwebtoken");

function confirmEmail(req, res, next) {
  const token = req.header("x-confirm-token");
  if (!token) return res.status(401).send("Email not verified.");

  try {
    const payload = jwt.verify(token, "confirmToken");
    req.emailData = payload;
    next();
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
}

module.exports = confirmEmail;
