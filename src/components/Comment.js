import React, { useState } from 'react';
import axios from 'axios';

const Comment = ({ comment, taskId, currentUser, updateComment, deleteComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3070/api/comments',
        {
          text: newComment,
          taskId: taskId
        },
        {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        }
      );
      console.log('Comment created:', response.data);
      updateComment(response.data)
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again later.');
    }
  };

  const handleEdit = async () => {
    const newText = prompt('Enter new text:', comment?.text); // Optional chaining
    if (newText !== null) {
      try {
        const response = await axios.put(`http://localhost:3070/api/comments/${comment?._id}`, { text: newText }); // Optional chaining
        updateComment(response.data);
      } catch (error) {
        console.error('Error updating comment:', error);
        // Handle error
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await axios.delete(`/api/comments/${comment?._id}`); // Optional chaining
        deleteComment(comment?._id); // Optional chaining
      } catch (error) {
        console.error('Error deleting comment:', error);
        // Handle error
      }
    }
  };

  return (
    <div className="comment">
      <p>{comment?.text}</p> {/* Optional chaining */}
      <p>Posted by: {comment?.createdBy?.username}</p> {/* Optional chaining */}
      {currentUser && currentUser._id === comment?.createdBy?._id && ( // Optional chaining
        <div className="actions">
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
      <div>
        {/* Input field for adding comments */}
        <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
        <button onClick={handleAddComment} disabled={!newComment.trim()}>Add Comment</button>
      </div>
    </div>
  );
};

export default Comment;
