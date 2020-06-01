var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var TweetSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, max: 280 },
  date: { type: Date, default: Date.now },
  replies: [ { type: Schema.Types.ObjectId, ref: 'Tweet' } ],
  retweets: [ { type: Schema.Types.ObjectId, ref: 'Tweet' } ],
  likes: [ { type: Schema.Types.ObjectId, ref: 'User' } ],
  photos: [ { type: Buffer } ]
});

//Export model
module.exports = mongoose.model("Tweet", TweetSchema);
