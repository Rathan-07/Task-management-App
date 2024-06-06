// controllers/timeTrackerController.js
const TimeTracker = require('../models/TaskTracker');

// Start a time log
exports.startLog = async (req, res) => {
    try {
        const taskId = req.body.taskId; // Extract taskId from request body
        if (!taskId) {
            return res.status(400).json({ error: 'Task ID is required' });
        }
        // Create a new time log with start date and time
        const newLog = new TimeTracker({
            task: taskId,
            user: req.user.id,
            startDateTime: new Date()
        });
        await newLog.save();
        res.status(201).json({ message: 'Time log started successfully' });
    } catch (error) {
        console.error('Error starting time log:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Stop a time log
exports.stopLog = async (req, res) => {
    try {
        const taskId = req.body.taskId; // Extract taskId from request body
        if (!taskId) {
            return res.status(400).json({ error: 'Task ID is required' });
        }
        // Find the latest time log for the user and task
        const latestLog = await TimeTracker.findOne({ task: taskId, user: req.user.id }).sort({ startDateTime: -1 });
        if (!latestLog) {
            return res.status(404).json({ error: 'No active time log found' });
        }
        // Update the end date and time, and calculate duration
        latestLog.endDateTime = new Date();
        latestLog.duration = Math.round((latestLog.endDateTime - latestLog.startDateTime) / (1000 * 60)); // Calculate duration in minutes
        await latestLog.save();
        res.json({ message: 'Time log stopped successfully', duration: latestLog.duration });
    } catch (error) {
        console.error('Error stopping time log:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get all time logs for a task
exports.getTimeLogsForTask = async (req, res) => {
    try {
        const taskId = req.params.taskId; // Extract taskId from request parameters
        if (!taskId) {
            return res.status(400).json({ error: 'Task ID is required' });
        }
        const logs = await TimeTracker.find({ task: taskId }).populate('user', 'username');
        res.json(logs);
    } catch (error) {
        console.error('Error fetching time logs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
