const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.send("Access denied. No token provided.");

  try {
    const payload = jwt.verify(token, "jwtPrivateKey");
    req.user = payload;
    next();
  } catch (error) {
    res.sendStatus(400);
  }
}

module.exports = auth;
