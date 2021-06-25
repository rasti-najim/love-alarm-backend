const jwt = require("jsonwebtoken");

function genAuthToken(user_id) {
  const payload = {
    id: user_id,
  };

  const token = jwt.sign(payload, "jwtPrivateKey");
  return token;
}

module.exports = genAuthToken;
