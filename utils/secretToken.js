require("dotenv").config();
const jwt = require("jsonwebtoken");

const createSecretToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: 24 * 60 * 60 * 1000,
  });
};

module.exports = createSecretToken;
