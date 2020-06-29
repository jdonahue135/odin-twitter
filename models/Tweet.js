var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var TweetSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, max: 280 },
  date: { type: Date, default: Date.now },
  retweets: [{ type: Schema.Types.ObjectId, ref: "User" }],
  retweetOf: { type: Schema.Types.ObjectId, ref: "Tweet" },
  replies: [{ type: Schema.Types.ObjectId, ref: "Tweet" }],
  inReplyTo: { type: Schema.Types.ObjectId, ref: "Tweet" },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  photo: { type: String },
});

//Export model
module.exports = mongoose.model("Tweet", TweetSchema);
