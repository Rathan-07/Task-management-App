// CommentForm.js

import React, { useState } from 'react';
import axios from 'axios';

const CommentForm = ({ taskId, userId }) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Make a POST request to the backend endpoint to create a new comment
      const response = await axios.post(`http://localhost:3070/api/task/${taskId}/comments`, {
        body: comment,
        userId: userId // Pass the user ID to the backend
      });

      console.log('Comment created:', response.data);

      // Clear the comment input field after successful submission
      setComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Adding Comment...' : 'Add Comment'}
      </button>
    </form>
  );
};

export default CommentForm;
