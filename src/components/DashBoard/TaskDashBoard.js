// TaskDashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskCalendar from './TaskCalendar';

const TaskDashboard = () => {
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

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}> {/* Adjusted maximum width and centered alignment */}
        <h1 style={{ marginBottom: '20px' }}>Task Calendar</h1> {/* Added margin bottom */}
        <TaskCalendar tasks={tasks} />
    </div>
    );
};

export default TaskDashboard;
