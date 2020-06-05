var express = require("express");
var router = express.Router();
var User = require("../models/User");

/* GET users listing. */
router.get("/", function (req, res, next) {
  User.find({}, function (err, theUsers) {
    if (err) return next(err);
    res.json(theUsers);
  });
  //res.send('respond with a resource');
});

module.exports = router;
