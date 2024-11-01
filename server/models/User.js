const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: [true, "username taken"],
    minlength: [3, "username must be longer than 2 characters"],
    maxlength: [25, "username must be shorter than 26 characters"],
  },
  password: {
    type: String,
    required: true,
  },
  activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
  currentSession: {
    activityId: { type: mongoose.Schema.Types.ObjectId, ref: "Activity" }, // Reference to the activity
    startTime: { type: Date }, // Timestamp when the session started
    isRest: { type: Boolean }, // If in rest state
    restLength: { type: Number }, // Only populated when rest - seconds
    ongoing: { type: Boolean, default: false },
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
