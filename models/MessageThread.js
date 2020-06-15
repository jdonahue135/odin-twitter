var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var MessageThreadSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

//Export model
module.exports = mongoose.model("MessageThread", MessageThreadSchema);
