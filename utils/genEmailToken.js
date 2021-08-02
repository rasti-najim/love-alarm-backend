const jwt = require("jsonwebtoken");

function genEmailToken(user_email) {
  const payload = {
    email: user_email,
    confirmed: false,
  };

  const token = jwt.sign(payload, "emailToken");
  return token;
}

module.exports = genEmailToken;
