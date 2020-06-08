var User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { body } = require("express-validator");
const { sanitizeBody } = require("express-validator");

// Handle login on POST
exports.login = function (req, res, next) {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) return next(err);
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) return next(err);
      if (result) {
        //success
        jwt.sign({ user }, process.env.JWT_KEY, (err, token) => {
          if (err) return next(err);
          else {
            res.json({
              token: token,
              user: user,
            });
          }
        });
      } else {
        res.json({ success: false, message: "passwords do not match" });
      }
    });
  });
};

exports.signup = (req, res, next) => {
  // Validate fields.
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Username must be specified.")
    .isAlphanumeric()
    .withMessage("Username has non-alphanumeric characters."),
    body("password")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Password must be specified.")
      .isAlphanumeric()
      .withMessage("Password has non-alphanumeric characters.");
  // Sanitize fields.
  sanitizeBody("username").escape(), sanitizeBody("password").escape();

  //Validate input
  if (req.body.username == "") {
    res.json({ message: "username must be specified" });
  }
  if (req.body.password == "") {
    res.json({ message: "password must be specified" });
  }

  //Verify that username does not already exist
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) return next(err);
    if (user) {
      res.json({ message: "username already exists" });
    }
    if (!user) {
      //Save new user
      bcrypt.hash(
        req.body.password,
        process.env.SALT,
        (err, hashedPassword) => {
          if (err) return next(err);
          const new_user = new User({
            name: req.body.username,
            username: req.body.username,
            password: hashedPassword,
          });
          new_user.save((err) => {
            if (err) return next(err);
          });
          //get token for user
          jwt.sign({ new_user }, process.env.JWT_KEY, (err, token) => {
            if (err) return next(err);
            else {
              res.json({
                token: token,
                user: new_user,
              });
            }
          });
        }
      );
    }
  });
};
