var express = require("express");
var router = express.Router();

var Tweet = require("../models/Tweet");

/* GET users listing. */
router.get("/", function (req, res, next) {
  Tweet.find({})
    .populate("user")
    .exec(function (err, theTweets) {
      if (err) return next(err);
      res.json(theTweets);
    });
  //res.send('respond with a resource');
});

module.exports = router;
