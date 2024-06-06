const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    createdBy: {
        type: Object,
        ref: 'User', // Reference to the User model
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now // Use default to set createdAt automatically
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task', // Reference to the Task model
        required: true
    }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
