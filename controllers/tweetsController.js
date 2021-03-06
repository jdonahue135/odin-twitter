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
          .populate("user retweetOf")
          .populate({
            path: "retweetOf",
            populate: {
              path: "user",
              select: "name username profilePicture",
            },
          })
          .exec((err, theTweets) => {
            if (err) res.json({ success: false, err });
            else res.json({ success: true, tweets: theTweets });
          });
      }
    });
};

exports.tweet_get = function (req, res) {
  Tweet.findById(req.params.tweetid)
    .populate("user retweetOf replies")
    .populate({
      path: "replies",
      populate: {
        path: "user",
        select: "name username profilePicture",
      },
    })
    .populate({
      path: "retweetOf",
      populate: {
        path: "user",
        select: "name username profilePicture",
      },
    })
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
    .isAlphanumeric()
    .withMessage("Text has non-alphanumeric characters."),
    // Sanitize field.
    sanitizeBody("text").escape();
  //Validate input
  if (req.body.user == null) {
    res.json({ message: "user must be specified" });
  }
  if (req.body.text == "" && !req.file && !req.body.gif) {
    res.json({ message: "text and/or photo must be specified" });
  }

  const user = JSON.parse(req.body.user);

  //save tweet
  let newTweet = new Tweet({
    user: user,
    text: req.body.text,
  });

  if (req.file) {
    newTweet.photo = req.file.location;
  }

  if (req.body.gif) {
    newTweet.photo = req.body.gif;
  }

  if (req.body.replyTweet !== "null" && req.body.replyTweet !== "undefined") {
    //find the replyTweet and save new tweet as a reply
    const replyTweet = JSON.parse(req.body.replyTweet);
    newTweet.inReplyTo = replyTweet;
    Tweet.findById(replyTweet._id).exec((err, theTweet) => {
      if (err) {
        console.log(err);
        return;
      } else {
        theTweet.replies.push(newTweet);
        theTweet.save();

        //add new notification for user
        const newNotification = new Notification({
          user: theTweet.user,
          actionUser: user,
          type: "reply",
          tweet: theTweet,
          reply: newTweet,
        });

        newNotification.save();
      }
    });
  }

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
  Tweet.findById(req.params.tweetid)
    .populate("retweets inReplyTo replies user")
    .exec(function (err, theTweet) {
      if (err) res.json({ success: false, err });
      if (!theTweet) res.json({ success: false, message: "tweet not found" });
      else {
        //delete all instances of the tweet
        while (theTweet.retweets.length > 0) {
          //delete all retweets
          Tweet.findOneAndDelete({ retweetOf: theTweet._id }).exec((err) => {
            if (err) console.log(err);
          });
          theTweet.retweets.pop();
          theTweet.save();
        }
        //delete all replies to the tweet
        while (theTweet.replies.length > 0) {
          Tweet.findOneAndDelete({ inReplyTo: theTweet._id }).exec((err) => {
            if (err) console.log(err);
          });
          theTweet.replies.pop();
          theTweet.save();
        }
        //if tweet is a reply, remove from target tweet "replies" and remove Notification of target user
        if (theTweet.inReplyTo !== undefined) {
          Tweet.findById(theTweet.inReplyTo._id).exec((err, targetTweet) => {
            if (err) console.log(err);
            else {
              targetTweet.replies.splice(
                targetTweet.replies.indexOf(theTweet._id),
                1
              );
              targetTweet.save();
            }
          });
          Notification.findOne({ reply: theTweet._id }).exec(
            (err, notification) => {
              if (err) console.log(err);
              notification.remove();
            }
          );
        }
        //if tweet is a retweet, remove from target tweet "retweet" and remove Notification of target user
        if (theTweet.retweetOf !== undefined) {
          Tweet.findById(theTweet.retweetOf._id).exec((err, targetTweet) => {
            if (err) console.log(err);
            else {
              targetTweet.retweets.splice(
                targetTweet.retweets.indexOf(theTweet._id),
                1
              );
              targetTweet.save();

              Notification.findOne({
                tweet: targetTweet._id,
                actionUser: theTweet.user._id,
              }).exec((err, notification) => {
                if (err) console.log(err);
                notification.remove();
              });
            }
          });
        }

        //remove all Notifications for theTweet
        Notification.find({ tweet: theTweet._id }).exec(
          (err, notifications) => {
            if (err) console.log(err);
            else if (!notifications) console.log("no notifications");
            else {
              for (let i = 0; i < notifications.length; i++) {
                console.log(notifications);
                Notification.findByIdAndRemove(
                  notifications[i]._id
                ).exec((err) => console.log(err));
              }
            }
          }
        );
        theTweet.remove();
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
          actionUser: req.body.user._id,
          type: "like",
          tweet: theTweet._id,
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
          actionUser: req.body.user,
          type: "like",
          tweet: theTweet,
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

exports.retweet = (req, res) => {
  Tweet.findById(req.params.tweetid).exec(function (err, theTweet) {
    if (err) res.json({ success: false, err });
    if (!theTweet) res.json({ success: false, message: "tweet not found" });
    else {
      //tweet found
      if (theTweet.retweets.includes(req.body.user._id)) {
        //remove notification for retweet
        var query = {
          user: theTweet.user._id,
          actionUser: req.body.user._id,
          type: "retweet",
          tweet: theTweet._id,
        };
        Notification.findOneAndDelete(query).exec((err, result) => {
          if (err) console.log(err);
          if (!result) console.log("Notification not found");
        });

        //delete RT
        Tweet.findOne({
          retweetOf: theTweet._id,
          user: req.body.user._id,
        }).exec((err, theRetweet) => {
          if (err) res.json({ success: false, err });
          if (!theRetweet) console.log("retweet not found");
          else {
            theRetweet.remove();
          }
        });

        //remove RT from original tweet
        theTweet.retweets.splice(
          theTweet.retweets.indexOf(req.body.user._id),
          1
        );
        theTweet.save();
      } else {
        //New retweet
        const theRetweet = new Tweet({
          user: req.body.user,
          retweetOf: theTweet,
        });

        //create notification for retweet
        const newNotification = new Notification({
          user: theTweet.user,
          actionUser: req.body.user,
          type: "retweet",
          tweet: theTweet,
        });
        newNotification.save((err) => {
          if (err) console.log(err);
        });

        //save tweet
        theRetweet.save((err) => console.log(err));

        //add retweet to original tweet
        theTweet.retweets.push(req.body.user._id);
        theTweet.save((err) => console.log(err));
      }

      res.json({
        success: true,
        tweet: "retweet status changed: " + theTweet._id,
      });
    }
  });
};
