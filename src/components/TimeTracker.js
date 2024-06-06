import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TimeTracker() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3070/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Function to start the timer for a task
  const startTimer = (taskId) => {
    setTasks(prevTasks => prevTasks.map(task =>
      task.id === taskId && !task.timerId
        ? { ...task, timerId: setInterval(() => updateTime(taskId), 1000) }
        : task
    ));
  };

  // Function to stop the timer for a task
  const stopTimer = (taskId) => {
    setTasks(prevTasks => prevTasks.map(task =>
      task.id === taskId && task.timerId
        ? { ...task, timerId: clearInterval(task.timerId) }
        : task
    ));
  };

  // Function to update the time spent for a task
  const updateTime = (taskId) => {
    setTasks(prevTasks => prevTasks.map(task =>
      task.id === taskId && task.timerId
        ? { ...task, timeSpent: task.timeSpent + 1 }
        : task
    ));
  };

  return (
    <div className="App">
      <h1>Task Time Tracking</h1>
      <div className="task-list">
        {tasks.map(task => (
          <div className="task" key={task.id}>
            <h2>{task.name}</h2>
            <button onClick={() => startTimer(task.id)}>Start Timer</button>
            <button onClick={() => stopTimer(task.id)}>Stop Timer</button>
            <span>{formatTime(task.timeSpent)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Function to format time in MM:SS format
const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default TimeTracker;
