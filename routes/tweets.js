var express = require("express");
var router = express.Router();
var Tweet = require("../models/Tweet");

var tweets_controller = require("../controllers/tweetsController");

/* GET all user following tweets. */
router.get("/:userid", tweets_controller.tweets_get);

/* GET tweet info */
router.get("/status/:tweetid", tweets_controller.tweet_get);

/* POST new tweet */
router.post("/", tweets_controller.tweet_post);

/* handle tweet DELETE on POST */
router.post("/:tweetid/delete", tweets_controller.tweet_delete);

module.exports = router;
