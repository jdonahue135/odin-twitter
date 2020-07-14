const jwt = require("jsonwebtoken");

// Get Token
const getToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
  }
  next();
};

const verifyToken = (req, res, next) => {
  //verify token
  jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
    if (err) return next(err);
  });
  next();
};

module.exports = {
  getToken,
  verifyToken,
};
