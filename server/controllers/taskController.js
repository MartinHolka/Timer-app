const Task = require("../models/Task");

const getTasks = async (req, res) => {
  try {
    const { activityId } = req.body;
    const userId = req.user.id;

    // Find tasks based on the presence of activityId
    const tasks = activityId
      ? await Task.find({ userId, activityId })
      : await Task.find({ userId });

    return res.status(200).json(tasks || []);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Something went wrong while getting tasks. Please try again.",
    });
  }
};

const createTask = async (req, res) => {
  try {
    const { activityId, name } = req.body;
    const userId = req.user.id;

    if (!activityId) {
      return res
        .status(400)
        .json({ error: "Please provide a valid activity ID." });
    }

    if (!name) {
      return res.status(400).json({ error: "Please provide a task name." });
    }

    const task = await Task.create({ activityId, userId, name });
    return res
      .status(201)
      .json({ message: "Successfully created task.", task });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Something went wrong creating the task. Please try again.",
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const userId = req.user.id;
    const { name, completed } = req.body;

    if (!taskId) {
      return res.status(400).json({ error: "Please provide a task ID." });
    }

    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      return res.status(404).json({ error: "Task not found or inaccessible." });
    }

    if (name !== undefined) task.name = name;
    if (completed !== undefined) task.completed = completed;

    await task.save();

    return res
      .status(200)
      .json({ message: "Task updated successfully.", task });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to update task. Please try again.",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const userId = req.user.id;

    const task = await Task.findOneAndDelete({ _id: taskId, userId });
    if (!task) {
      return res.status(404).json({ error: "Task not found or inaccessible." });
    }

    return res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to delete task. Please try again.",
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
