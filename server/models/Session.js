const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: "Activity" },
  duration: Number, // duration in seconds
  startTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Session", sessionSchema);
