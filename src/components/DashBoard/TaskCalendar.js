// TaskCalendar.js

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const TaskCalendar = ({ tasks }) => {
    return (
        <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={tasks.map((task) => ({
                title: task.title,
                start: task.startDate, // Adjust this based on your task data
                end: task.endDate, // Adjust this based on your task data
            }))}
        />
    );
};

export default TaskCalendar;
