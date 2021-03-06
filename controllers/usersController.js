var User = require("../models/User");
var Tweet = require("../models/Tweet");
var Notification = require("../models/Notification");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { body } = require("express-validator");
const { sanitizeBody } = require("express-validator");
var async = require("async");

// Handle login on POST
exports.login = function (req, res, next) {
  User.findOne({ username: req.body.username }, (err, theUser) => {
    if (err) {
      res.json({ success: false, err });
    }
    if (!theUser) {
      res.json({ success: false, message: "username does not exist" });
    } else {
      bcrypt.compare(req.body.password, theUser.password, (err, result) => {
        if (err) {
          res.json({ success: false, err });
        }
        if (result) {
          //success
          jwt.sign({ theUser }, process.env.SECRET_KEY, (err, token) => {
            if (err) return next(err);
            else {
              res.json({
                token: token,
                user: theUser,
              });
            }
          });
        } else {
          res.json({ success: false, message: "passwords do not match" });
        }
      });
    }
  });
};

// handle sign up on POST
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
        parseInt(process.env.SALT, 10),
        (err, hashedPassword) => {
          if (err) {
            console.log(err);
            return next(err);
          }
          const new_user = new User({
            name: req.body.username,
            username: req.body.username,
            password: hashedPassword,
          });
          new_user.following.push(new_user);
          new_user.followers.push(new_user);
          new_user.save((err) => {
            if (err) return next(err);
          });
          //get token for user
          jwt.sign({ new_user }, process.env.SECRET_KEY, (err, token) => {
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

// Send user info on GET
exports.user_get = (req, res) => {
  User.findById(req.params.userid)
    .select("-password")
    .exec((err, theUser) => {
      if (err) res.json({ success: false, message: "Error" });
      if (!theUser) res.json({ success: false, message: "No user" });
      else res.json(theUser);
    });
};

//Send user following/followers on GET
exports.user_follow_get = (req, res) => {
  User.findOne({ username: req.params.username })
    .select("-password")
    .populate("followers following")
    .exec((err, theUser) => {
      if (err) res.json({ success: false, err });
      else {
        res.json(theUser);
      }
    });
};

exports.user_update = (req, res, next) => {
  User.findById(req.params.userid).exec((err, theUser) => {
    if (err) res.json({ success: false, message: "Error" });
    if (!theUser) res.json({ success: false, message: "No user" });
    else {
      let updates = "";
      if (req.body.bio && req.body.bio !== undefined && req.body.bio !== "") {
        theUser.bio = req.body.bio;
        updates = updates + "bio ";
      }
      if (req.files) {
        //verify photos uploaded and save
        if (req.body.profilePictureID) {
          updates = updates + "profilePicture ";
          if (req.files[0].originalname === req.body.profilePictureID) {
            theUser.profilePicture = req.files[0].location;
          } else if (req.files[1].originalname === req.body.profilePictureID) {
            theUser.profilePicture = req.files[1].location;
          }
        }
        if (req.body.headerID) {
          updates = updates + "header ";
          if (req.files[0].originalname === req.body.headerID) {
            theUser.header = req.files[0].location;
          } else if (req.files[1].originalname === req.body.headerID) {
            theUser.header = req.files[1].location;
          }
        }
      }
      theUser.save();
      res.json({
        success: true,
        updates: updates,
        message: "user profile updated",
      });
    }
  });
};

// send user tweets on GET
exports.get_tweets = (req, res, next) => {
  User.findOne({ username: req.params.username })
    .select("-password")
    .exec(function (err, theUser) {
      if (err) res.json({ success: false, message: "Error" });
      else {
        Tweet.find({ user: theUser })
          .populate("user")
          .populate({
            path: "retweetOf",
            populate: {
              path: "user",
              select: "name username profilePicture",
            },
          })
          .populate({
            path: "inReplyTo",
            populate: {
              path: "user",
              select: "name username profilePicture",
            },
          })
          .populate({
            path: "inReplyTo",
            populate: {
              path: "retweetOf",
              populate: {
                path: "user",
                select: "name username profilePicture",
              },
            },
          })
          .exec(function (err, theTweets) {
            if (err) res.json({ success: false, message: "Error" });
            if (!theTweets) res.json({ success: false, message: "No tweets" });
            else res.json({ tweets: theTweets, user: theUser });
          });
      }
    });
};

exports.get_notifications = (req, res) => {
  //find user notifications
  Notification.find({ user: req.params.userid })
    .populate("tweet")
    .populate({
      path: "actionUser",
      populate: {
        path: "user",
        select: "name username profilePicture",
      },
    })
    .populate({
      path: "reply",
      populate: {
        path: "user",
        select: "name username profilePicture",
      },
    })
    .exec((err, theNotifications) => {
      if (err) console.log(err);
      else res.json({ success: true, notifications: theNotifications });
    });
};

exports.read_notifications = (req, res) => {
  Notification.find({ user: req.params.userid }).exec(
    (err, theNotifications) => {
      if (err) res.json({ success: false, err });
      else {
        for (let i = 0; i < theNotifications.length; i++) {
          theNotifications[i].readStatus = true;
          theNotifications[i].save();
        }
        res.json({ success: true, message: "notifications read" });
      }
    }
  );
};

// handle user follow/unfollow on POST
exports.follow = (req, res) => {
  async.parallel(
    {
      targetUser: function (callback) {
        User.findById(req.params.userid).exec(callback);
      },

      user: function (callback) {
        User.findById(req.body.user._id).select("-password").exec(callback);
      },
    },
    function (err, results) {
      if (err) res.json({ success: false, err });
      if (!results.targetUser)
        res.json({
          success: false,
          message: "User to follow/unfollow not found",
        });
      if (!results.user)
        res.json({ success: false, message: "current user not found" });
      if (results.user._id === results.targetUser._id)
        res.json({ success: false, message: "Cannot unfollow yourself" });

      //both users found, determine if request is follow or unfollow
      if (results.user.following.includes(results.targetUser._id)) {
        //unfollow
        results.user.following.splice(
          results.user.following.indexOf(results.targetUser._id),
          1
        );
        results.targetUser.followers.splice(
          results.targetUser.followers.indexOf(results.user._id),
          1
        );

        //remove notification for unfollowed user
        var query = {
          user: results.targetUser,
          actionUser: results.user._id,
          type: "follow",
        };
        Notification.findOneAndDelete(query).exec((err, result) => {
          if (err) console.log(err);
          if (!result) console.log("Notification not found");
        });
      } else {
        //Follow
        results.user.following.push(results.targetUser);
        results.targetUser.followers.push(results.user);

        //Create Notification for followed user
        const newNotification = new Notification({
          user: results.targetUser,
          actionUser: results.user,
          type: "follow",
        });
        newNotification.save((err) => {
          if (err) console.log(err);
        });
      }
      results.user.save();
      results.targetUser.save();
      res.json({ success: true, user: results.user });
    }
  );
};
