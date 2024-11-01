const express = require("express");
const router = express.Router();

const {
  startSession,
  endSession,
  resetSession,
  getSession,
} = require("../controllers/sessionController");

// sessions
router.route("/start").post(startSession);
router.route("/end").post(endSession);
router.route("/reset").post(resetSession);
router.route("/").get(getSession)

module.exports = router;
