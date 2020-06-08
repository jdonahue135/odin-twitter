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

router.post("/", function (req, res, next) {
  //Simple route for testing, need to add validation
  const newTweet = new Tweet({
    //user is going to be written in for now
    user: req.body.user,
    text: req.body.text,
  });

  newTweet.save((err) => {
    if (err) return next(err);
  });
});

module.exports = router;
