import React, { useState, useEffect } from 'react';
import TaskAssignmentComponent from './TaskAssignmentComponent';
import axios from 'axios';

const ParentComponent = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3070/api/tasks');
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  return (
    <div>
      <h1>Assign Task</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        tasks.map(task => (
          <TaskComponent key={task._id} taskId={task._id} />
        ))
      )}
    </div>
  );
};

export default ParentComponent;
