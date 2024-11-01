const User = require("../models/User");
const Activity = require("../models/Activity");

const createActivity = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res
        .status(400)
        .json({ error: "Please provide an activity name." });
    }

    // Step 1: Create Activity document
    const newActivity = await Activity.create({
      name,
      description,
      userId,
    });

    // Step 2: Update User to add reference to new activity
    await User.findByIdAndUpdate(
      userId,
      { $push: { activities: newActivity._id } },
      { new: true }
    );

    return res.status(201).json({
      message: "Activity created successfully.",
      activity: newActivity,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Failed to create activity. Please try again." });
  }
};

const getAllActivities = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("activities"); // Populate activity details

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json({ activities: user.activities });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve activities. Please try again." });
  }
};

const updateActivity = async (req, res) => {
  try {
    const { id: activityId } = req.params;
    const userId = req.user.id;
    const { name } = req.body;
    const activity = await Activity.findOneAndUpdate(
      { _id: activityId, userId }, // Filter by both activity ID and user ID
      { name }, // Fields to update
      { new: true, runValidators: true } // Return the updated activity
    );
    if (!activity) {
      return res
        .status(404)
        .json({ error: "Activity not found or unauthorized." });
    }
    return res
      .status(200)
      .json({ message: "Activity updated successfully.", activity });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Failed to update activity. Please try again." });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const { id: activityId } = req.params;
    const userId = req.user.id;
    const activity = await Activity.findOneAndDelete({
      _id: activityId,
      userId,
    });
    if (!activity) {
      return res
        .status(404)
        .json({ error: "Activity not found or unauthorized." });
    }
    return res.status(200).json({ message: "Activity deleted successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Failed to delete activity. Please try again." });
  }
};

module.exports = {
  createActivity,
  getAllActivities,
  updateActivity,
  deleteActivity,
};
