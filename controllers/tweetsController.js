var Tweet = require("../models/Tweet");
var User = require("../models/User");
var Notification = require("../models/Notification");

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
      res.json({
        success: true,
        message: "tweet deleted: " + theTweet._id,
      });
    }
  });
};

exports.like = (req, res) => {
  //check if user is liking or unliking tweet
  Tweet.findById(req.params.tweetid, "likes user").exec(function (
    err,
    theTweet
  ) {
    if (err) res.json({ success: false, err });
    if (!theTweet) res.json({ success: false, message: "tweet not found" });
    else {
      //tweet found
      if (theTweet.likes.includes(req.body.user._id)) {
        //unlike
        theTweet.likes.splice(theTweet.likes.indexOf(req.body.user._id), 1);

        //remove notification for unliked tweet
        var query = {
          user: theTweet.user,
          actionUsers: [req.body.user._id],
          type: "like",
        };
        Notification.findOneAndDelete(query).exec((err, result) => {
          if (err) console.log(err);
          if (!result) console.log("Notification not found");
        });
      } else {
        //like
        theTweet.likes.push(req.body.user);

        //create notification for tweet like
        const newNotification = new Notification({
          user: theTweet.user,
          actionUsers: [req.body.user],
          type: "like",
        });
        newNotification.save((err) => {
          if (err) console.log(err);
        });
      }

      //save tweet
      theTweet.save();

      res.json({
        success: true,
        tweet: "tweet like status changed: " + theTweet._id,
      });
    }
  });
};
