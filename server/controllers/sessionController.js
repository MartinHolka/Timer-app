const User = require("../models/User");
const Session = require("../models/Session");

const startSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { activityId } = req.body;

    // Ensure there is a valid activityId
    if (!activityId) {
      return res
        .status(400)
        .json({ error: "Activity ID is required to start a session." });
    }

    // Find the user by ID
    const user = await User.findById(userId);

    console.log(user.currentSession);

    // Check if there is an ongoing session
    if (user.currentSession.ongoing) {
      return res.status(400).json({
        error:
          "A session is already in progress. Please end it before starting a new one.",
      });
    }

    // Update the user's currentSession field
    user.currentSession = {
      activityId,
      startTime: new Date(),
      isRest: false,
      restLength: null,
      ongoing: true,
    };

    // Save the user document with the updated session
    await user.save();

    return res.status(200).json({
      message: "Session started successfully.",
      currentSession: user.currentSession,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Failed to start session. Please try again." });
  }
};

const endSession = async (req, res) => {
  try {
    console.log("i am here");
    
    const userId = req.user.id;

    // Find the user
    const user = await User.findById(userId);
    if (!user || !user.currentSession.activityId) {
      return res.status(400).json({ error: "No ongoing session to end." });
    }

    // Calculate the duration of the session
    const duration = (Date.now() - user.currentSession.startTime) / 1000;

    // Extract necessary fields from currentSession
    const { activityId, startTime } = user.currentSession;

    // Save the completed session to the Session collection
    const newSession = await Session.create({
      userId,
      activityId,
      startTime,
      duration,
    });

    // Clear currentSession in user document
    user.currentSession = {
      activityId,
      startTime: Date.now(),
      isRest: true,
      restLength: duration / 3,
      ongoing: false,
    };
    await user.save();

    return res.status(200).json({
      message: "Session saved successfully",
      currentSession: user.currentSession,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while ending the session." });
  }
};

const resetSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(500).json({ error: "user not found" });
    }
    user.currentSession.ongoing = false;
    await user.save();

    return res.status(200).json({
      message: "Session reset successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while reseting the session." });
  }
};

const getSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(500).json({ error: "user not found" });
    }
    const currentSession = user.currentSession;
    return res.status(200).json({ currentSession });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        error: "Something went wrong while getting the current session.",
      });
  }
};

module.exports = { startSession, endSession, resetSession, getSession };
