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

// @desc Create new task
// @route POST /tasks/newTask
// @access Private
const createNewTask = asyncHandler(async (req, res) => {
    const { title, description, createdAt } = req.body;
    const userId = req.userId; // Get the user ID from the request object
  
    // Confirm data
    if (!userId || !title || !description || !createdAt) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    // Check for duplicate title
    const duplicate = await Task.findOne({ title }).lean().exec();
  
    if (duplicate) {
      return res.status(409).json({ message: 'Duplicate task title' });
    }
  
    // Create and store the new task
    const taskObject = { user: userId, title, description, createdAt };
    const task = await Task.create(taskObject);
  
    if (task) {
      return res.status(201).json({ message: 'New task created' });
    } else {
      return res.status(400).json({ message: 'Invalid task data received' });
    }
  });

// @desc Update a task
// @route PATCH /tasks
// @access Private
const updateTask = asyncHandler(async (req, res) => {
    const { title, description, completed } = req.body;
    const userId = req.userId; // Get the user ID from the request object
    const taskId = req.params.id; // Get the task ID from URL parameters

    // Confirm data
    if (!title || !description || typeof completed !== "boolean") {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Confirm Task exists to update
    const task = await Task.findById(taskId).exec();

    if (!task) {
        return res.status(400).json({ message: "Task not found" });
    }

    // Ensure the task belongs to the logged-in user
    if (task.user.toString() !== userId) {
        return res.status(403).json({ message: "You do not have permission to update this task" });
    }

    // Check for duplicate title
    const duplicate = await Task.findOne({ title }).lean().exec();

    // Allow renaming of the original task
    if (duplicate && duplicate?._id.toString() !== taskId) {
        return res.status(409).json({ message: "Duplicate task title" });
    }

    task.title = title;
    task.description = description;
    task.completed = completed;

    const updatedTask = await task.save();

    res.json({ message: `'${updatedTask.title}' updated` });
});

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
  createNewTask,
  getUserTasks,
  updateTask,
  deleteTask,
};
