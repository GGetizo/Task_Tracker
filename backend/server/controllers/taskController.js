const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Task = require("../models/Task");

// @desc Get all tasks
// @route GET /tasks
// @access Private
const getAllTasks = asyncHandler(async (req, res) => {
    // Fetch all tasks from the database
    const tasks = await Task.find().lean().exec();
  
    if (!tasks.length) {
      return res.status(404).json({ message: "No tasks found" }); // Changed from "No users found" to "No tasks found"
    }
  
    res.json(tasks);
  });

// @desc Get tasks for a specific user
// @route GET /tasks
// @access Private
const getUserTasks = asyncHandler(async (req, res) => {
    const userId = req.userId; // Get the user ID from the request object

    const tasks = await Task.find({ user: userId }).lean();

    if (!tasks?.length) {
        return res.status(404).json({ message: 'No tasks found' });
    }

    res.json(tasks);
});

// @desc Create a new task
// @route POST /tasks
// @access Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, completed } = req.body;
  const userId = req.userId; // Extract userId from authenticated request

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  try {
    const task = new Task({
      title,
      description,
      completed,
      user: userId, // Associate task with user
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(400).json({ message: 'Invalid task data received' });
  }
});


// @desc Update a task
// @route PATCH /tasks/:id
// @access Private
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, deadline } = req.body;

    // Convert deadline to Date if needed
    const updatedDeadline = deadline ? new Date(deadline) : undefined;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, deadline: updatedDeadline }, // Include deadline in update
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ task: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: 'Error updating task' });
  }
};


// @desc Delete a task
// @route DELETE /tasks
// @access Private
const deleteTask = asyncHandler(async (req, res) => {
    const taskId = req.params.id; // Get the task ID from URL parameters
    const userId = req.userId; // Get the user ID from the request object

    // Confirm data
    if (!taskId) {
        return res.status(400).json({ message: "Task ID required" });
    }

    // Confirm task exists to delete
    const task = await Task.findById(taskId).exec();

    if (!task) {
        return res.status(400).json({ message: "Task not found" });
    }

    // Ensure the task belongs to the logged-in user
    if (task.user.toString() !== userId) {
        return res.status(403).json({ message: "You do not have permission to delete this task" });
    }

    await task.deleteOne();

    const reply = `Task '${task.title}' with ID ${task._id} deleted`;

    res.json({ message: reply });
});

module.exports = {
  getAllTasks,
  createTask,
  getUserTasks,
  updateTask,
  deleteTask,
};
