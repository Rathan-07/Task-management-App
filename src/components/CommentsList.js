import React from 'react';
import Comment from './Comment';

const CommentsList = ({ comments, currentUser, updateComment, deleteComment }) => {
  return (
    <div className="comments-list">
      {comments.map(comment => (
        <Comment
          key={comment._id}
          comment={comment}
          currentUser={currentUser}
          updateComment={updateComment} // Pass the updateComment function here
          deleteComment={deleteComment}
        />
      ))}
    </div>
  );
};

export default CommentsList;
