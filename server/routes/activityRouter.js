const express = require("express");
const router = express.Router();

const {
  createActivity,
  getAllActivities,
  updateActivity,
  deleteActivity,
} = require("../controllers/activityController");

// activities
router.route("/").post(createActivity).get(getAllActivities);
router.route("/:id").patch(updateActivity).delete(deleteActivity);

module.exports = router;
