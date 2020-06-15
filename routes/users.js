var express = require("express");
var router = express.Router();
var User = require("../models/User");

var users_controller = require("../controllers/usersController");

/* GET users listing. */
router.get("/", function (req, res, next) {
  User.find({}, function (err, theUsers) {
    if (err) return next(err);
    res.json(theUsers);
  });
  //res.send('respond with a resource');
});

/*handle log in on POST*/
router.post("/login", users_controller.login);

/*handle sign up on POST*/
router.post("/signup", users_controller.signup);

/*handle GET request for user tweets*/
router.get("/:userid", users_controller.get_tweets);

module.exports = router;
