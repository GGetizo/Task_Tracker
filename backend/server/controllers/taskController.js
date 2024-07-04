import Task from '../models/Task.js'; // Adjust path as necessary

// Retrieve all tasks for the authenticated user
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Add a new task for the authenticated user
export const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        const newTask = new Task({
            user: req.user.id,
            title,
            description
        });

        await newTask.save();

        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update an existing task for the authenticated user
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;

        // Find the task and check if it belongs to the authenticated user
        const task = await Task.findOne({ _id: id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update task fields
        task.title = title || task.title;
        task.description = description || task.description;
        task.completed = completed !== undefined ? completed : task.completed;

        await task.save();

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Remove a task for the authenticated user
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the task and check if it belongs to the authenticated user
        const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
