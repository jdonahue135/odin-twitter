var Tweet = require("../models/Tweet");
var User = require("../models/User");

const { body } = require("express-validator");
const { sanitizeBody } = require("express-validator");

exports.tweets_get = function (req, res) {
  // get user following array
  User.findById(req.params.userid)
    .select("following")
    .exec((err, results) => {
      if (err) res.json({ success: false, err });
      if (!results) res.json({ success: false, message: "user not found" });
      else {
        const query = { user: { $in: results.following } };
        Tweet.find(query)
          .populate("user")
          .exec((err, theTweets) => {
            if (err) res.json({ success: false, err });
            else res.json({ success: true, tweets: theTweets });
          });
      }
    });
};

exports.tweet_get = function (req, res) {
  Tweet.findById(req.params.tweetid)
    .populate("user")
    .exec((err, tweet) => {
      if (err) res.json({ success: false, err });
      if (!tweet) res.json({ success: false, message: "tweet not found" });
      else res.json({ success: true, tweet: tweet });
    });
};

exports.tweet_post = function (req, res, next) {
  // Validate field.
  body("text")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Text must be specified.")
    .isAlphanumeric()
    .withMessage("Text has non-alphanumeric characters."),
    // Sanitize field.
    sanitizeBody("text").escape();

  //Validate input
  if (req.body.user == null) {
    res.json({ message: "user must be specified" });
  }
  if (req.body.text == "") {
    res.json({ message: "text must be specified" });
  }

  //save tweet
  const newTweet = new Tweet({
    user: req.body.user,
    text: req.body.text,
  });

  newTweet.save((err) => {
    if (err) res.json({ success: false, err: err });
    else {
      res.json({
        success: true,
        message: "Tweet posted!",
      });
    }
  });
};

exports.tweet_delete = function (req, res, next) {
  Tweet.findByIdAndDelete(req.params.tweetid).exec(function (err, theTweet) {
    if (err) res.json({ success: false, err });
    if (!theTweet) res.json({ success: false, message: "tweet not found" });
    else {
      Tweet.find({})
        .populate("user")
        .exec(function (err, theTweets) {
          if (err) res.json({ success: false, err });
          res.json({
            success: true,
            message: "tweet deleted: " + theTweet._id,
            tweets: theTweets,
          });
        });
    }
  });
};
