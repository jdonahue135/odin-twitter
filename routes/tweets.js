var express = require("express");
var router = express.Router();
const auth = require("../config/auth");

var tweets_controller = require("../controllers/tweetsController");

/* GET all user following tweets. */
router.get("/:userid", tweets_controller.tweets_get);

/* GET tweet info */
router.get("/status/:tweetid", tweets_controller.tweet_get);

/* POST new tweet */
router.post("/", auth.verifyToken, tweets_controller.tweet_post);

/* handle tweet DELETE on POST */
router.post(
  "/:tweetid/delete",
  auth.verifyToken,
  tweets_controller.tweet_delete
);

/* handle tweet like/unlike on POST */
router.post("/:tweetid/like", auth.verifyToken, tweets_controller.like);

module.exports = router;
