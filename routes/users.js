var express = require("express");
var router = express.Router();

var User = require("../models/User");
const auth = require("../config/auth");
var users_controller = require("../controllers/usersController");
const file_upload = require("../config/file_upload");

/* GET users listing. */
router.get("/", function (req, res, next) {
  User.find({}, function (err, theUsers) {
    if (err) return next(err);
    res.json(theUsers);
  });
});

/* handle log in on POST */
router.post("/login", users_controller.login);

/* handle sign up on POST */
router.post("/signup", users_controller.signup);

/* handle GET request for user information */
router.get("/:userid", users_controller.user_get);

/* handle GET request for user following/followers */
router.get("/:username/follow", users_controller.user_follow_get);

/* handle profile update on POST */
router.post(
  "/:userid/update",
  auth.verifyToken,
  file_upload.upload.single("profilePicture"),
  users_controller.user_update
);

/* handle GET request for user tweets */
router.get("/:username/tweets", users_controller.get_tweets);

/*handle GET request for user Notifications */
router.get(
  "/:userid/notifications",
  auth.verifyToken,
  users_controller.get_notifications
);

/*handle GET request for user seeing notifications*/
router.get(
  "/:userid/notifications/read",
  auth.verifyToken,
  users_controller.read_notifications
);

/* handle user follow/unfollow on POST*/
router.post("/:userid", auth.verifyToken, users_controller.follow);

module.exports = router;
