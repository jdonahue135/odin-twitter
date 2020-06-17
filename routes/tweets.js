var express = require("express");
var router = express.Router();
var Tweet = require("../models/Tweet");

var tweets_controller = require("../controllers/tweetsController");

/* GET all tweets. */
router.get("/", function (req, res, next) {
  Tweet.find({})
    .populate("user")
    .exec(function (err, theTweets) {
      if (err) return next(err);
      res.json(theTweets);
    });
  //res.send('respond with a resource');
});

/* POST new tweet */
router.post("/", tweets_controller.tweet_post);

/* handle tweet DELETE on POST */
router.post("/:tweetid/delete", tweets_controller.tweet_delete);

module.exports = router;
