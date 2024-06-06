const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const User = require('../models/user-model');
const emailService  = require('../services/emailService')

const taskCltr = {};



// taskCltr.get = async (req, res) => {
//     try {
//         let query = {};

//         // Filtering by status, priority, or title
//         const { search, filter, sort } = req.query;
//         if (filter && ['status', 'priority', 'title'].includes(filter)) {
//             if (search) {
//                 query[filter] = { $regex: search, $options: 'i' };
//             } else {
//                 query[filter] = req.query[filter];
//             }
//         }
        
//         // Sorting
//         let sortOption = {};
//         if (sort) {
//             sortOption[sort] = 1; // Sort ascending
//         }

//         const tasks = await Task.find(query).sort(sortOption);

//         res.json(tasks);
//     } catch (err) {
//         console.error('Error fetching tasks:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };


// Get a specific task by ID for the logged-in user

taskCltr.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        console.error('Error fetching all tasks:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Filter tasks
taskCltr.filterTasks = async (req, res) => {
    try {
        const { status, priority, title } = req.query;
        let query = {};
        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (title) query.title = { $regex: title, $options: 'i' };
        const tasks = await Task.find(query);
        res.json(tasks);
    } catch (error) {
        console.error('Error filtering tasks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Search tasks
taskCltr.searchTasks = async (req, res) => {
    try {
        const { search } = req.query;
        const tasks = await Task.find({ title: { $regex: search, $options: 'i' } });
        res.json(tasks);
    } catch (error) {
        console.error('Error searching tasks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

taskCltr.getById = async (req, res) => {
    try {
        const taskId = req.params.id;
        
    
     
        console.log('User ID:', req.user.id);
        const task = await Task.findById(taskId)

        console.log(task)
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        console.error('Error fetching task by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


taskCltr.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title,description,priority,status,dueDate, userIds, startDate, endDate } = req.body;
        const task = new Task({ title, description,priority,status,dueDate,userIds, startDate, endDate, userId: req.user.id, assignedUserId: userIds });
        await task.save();

        // Send email notification if assigned user exists
        if (task.userId) {
            const assignedUser = await User.findById(task.userId);
            if (assignedUser) {
                const emailSubject = 'Task Assignment';
                const emailBody = `You have been assigned a new task: ${title}`;
                await emailService.sendTaskNotification(assignedUser.email, emailSubject, emailBody);
            }
        }

        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



taskCltr.update = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { userIds } = req.body;
        const taskId = req.params.id;
        const updatedTask = await Task.findOneAndUpdate({ _id: taskId, userId: req.user.id }, { ...req.body, assignedUserId: userIds }, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Send email notification if assigned user exists
        if (taskId) {
            const assignedUser = await User.findById(taskId);
            if (assignedUser) {
                const emailSubject = 'Task Update';
                const emailBody = `Task "${updatedTask.title}" has been updated.`;
                await emailService.sendTaskNotification(assignedUser.email, emailSubject, emailBody);
            }
        }

        res.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


taskCltr.assignTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, userIds } = req.body;
        const task = new Task({ title, userIds, userId: req.user.id, assignedUserId: userIds });
        await task.save();

        // Send email notification if assigned user exists
        if (task.userId) {
            const assignedUser = await User.findById(task.userId);
            console.log(assignedUser);
            if (assignedUser) {
                const emailSubject = 'Task Assignment';
                const emailBody = `You have been assigned a new task: ${title}`;
                await emailService.sendTaskNotification(assignedUser.email, emailSubject, emailBody);
            }
        }

        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


  taskCltr.delete = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.id;
        const task = await Task.findOneAndDelete({ _id: taskId, userId: userId });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = taskCltr;