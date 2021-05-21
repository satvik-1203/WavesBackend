// jwt import
const jwt = require("jsonwebtoken");

// dotenv to import environment variables
require("dotenv").config();

// middleware for authenticating the user

module.exports = (req, res, next) => {
  // takes the token from the request header

  const token = req.header("x-jwt-token");

  if (!token) return res.status(401).send("Access denied, No token provided");

  // If the token the valid, sends the token to the next middleware else throws an err

  try {
    const payload = jwt.verify(token, process.env.JWT_SIGN);
    req.payload = payload;
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};

// testing this auth for post in genre
