const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: "Activity" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  completed: { type: Boolean, default: false },
});

module.exports = mongoose.model("Task", taskSchema);
