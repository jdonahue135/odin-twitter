var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var MessageSchema = new Schema({
  sentUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receivedUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, max: 240 },
  date: { type: Date, default: Date.now },
  isViewed: { type: Boolean, default: false },
});

//Export model
module.exports = mongoose.model("Message", MessageSchema);
