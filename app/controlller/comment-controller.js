const Comment = require('../models/Comment');
const Task = require('../models/Task');

const commentCtrl = {};

// commentCtrl.create = async (req, res) => {
//     try {
//         const { taskId, text } = req.body;
//         const task = await Task.findById(taskId);

//         if (!task) {
//             return res.status(404).json({ error: 'Task not found' });
//         }

//         const comment = new Comment({
//             taskId,
//             text,
//             createdBy: {id:req.user.id,username:req.user.username}, // Store only user id in createdBy
//         });

//         await comment.save();

//         res.status(201).json(comment);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// };

// commentCtrl.getCommentsByTask = async (req, res) => {
//     try {
//         const taskId = req.params.taskId;
//         const comments = await Comment.find({ taskId });
//         res.json(comments);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// };

// commentCtrl.edit = async (req, res) => {
//     try {
//         const commentId = req.params.id;
//         const { text } = req.body;

//         const comment = await Comment.findByIdAndUpdate(commentId, { text }, { new: true });

//         if (!comment) {
//             return res.status(404).json({ error: 'Comment not found' });
//         }

//         res.json(comment);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// };

// commentCtrl.delete = async (req, res) => {
//     try {
//         const commentId = req.params.id;

//         const comment = await Comment.findByIdAndDelete(commentId);

//         if (!comment) {
//             return res.status(404).json({ error: 'Comment not found' });
//         }

//         res.json({ message: 'Comment deleted successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// };

commentCtrl.getComments = async (req, res) => {
    try {
        const { taskId } = req.params;

        // Find all comments for the given task ID
        const comments = await Comment.find({ taskId });

        res.json(comments);
    } catch (error) {
        console.error('Error getting comments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
commentCtrl.createComment = async (req, res) => {
    try {
        const { text, taskId } = req.body;
        const createdBy = req.user.id; // Assuming you have user information in req.user

        const comment = new Comment({ text, taskId, createdBy });
        await comment.save();

        res.status(201).json(comment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


commentCtrl.updateComment = async (req, res) => {
    try {
        const { text } = req.body;
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Check if the user is the creator of the comment
        if (comment.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        comment.text = text;
        await comment.save();

        res.json(comment);
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


commentCtrl.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Check if the user is the creator of the comment
        if (comment.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await comment.remove();

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}







module.exports = commentCtrl;
