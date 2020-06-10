var Tweet = require("../models/Tweet");

const { body } = require("express-validator");
const { sanitizeBody } = require("express-validator");

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
      Tweet.find({})
        .populate("user")
        .exec(function (err, theTweets) {
          if (err) return next(err);
          res.json({
            success: true,
            message: "Tweet posted!",
            tweets: theTweets,
          });
        });
    }
  });
};
