import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentsList from './CommentsList';
import AuthService from './AuthService ';

const TaskDetailsPage = () => {
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchComments();
    fetchCurrentUser(); // Call fetchCurrentUser when the component mounts
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get('http://localhost:3070/api/comments');
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchCurrentUser = async () => {
    const user = await AuthService.getCurrentUser(); // Call AuthService to fetch current user
    setCurrentUser(user);
  };

  const updateComment = (updatedComment) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment._id === updatedComment._id ? updatedComment : comment
      )
    );
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/comments/${commentId}`);
      setComments(prevComments =>
        prevComments.filter(comment => comment._id !== commentId)
      );
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div>
      <h2>Task Details</h2>
      <CommentsList
        comments={comments}
        currentUser={currentUser}
        updateComment={updateComment}
        deleteComment={deleteComment}
      />
    </div>
  );
};

export default TaskDetailsPage;
