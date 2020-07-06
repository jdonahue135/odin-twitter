var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
  readStatus: { type: Boolean, required: true, default: false },
  date: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  actionUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true, max: 15 },
  tweet: { type: Schema.Types.ObjectId, ref: "Tweet" },
  reply: { type: Schema.Types.ObjectId, ref: "Tweet" },
});

//Export model
module.exports = mongoose.model("Notification", NotificationSchema);
