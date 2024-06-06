import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import FilterDropdown from './FilterDropdown';
import TaskDashboard from './TaskDashBoard';
import { useNavigate } from 'react-router-dom';

const TaskItem = () => {
    const [tasks, setTasks] = useState([]);
    const [filterOptions, setFilterOptions] = useState({});
    const navigate = useNavigate()

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

    const handleSearch = async (query) => {
        try {
            const response = await axios.get('http://localhost:3070/api/tasks/search', {
                params: { search: query }
            });
            setTasks(response.data);
        } catch (error) {
            console.error('Error searching tasks:', error);
        }
    };

    const handleFilter = async (filter) => {
        try {
            const response = await axios.get('http://localhost:3070/api/tasks/filter', {
                params: { ...filterOptions, ...filter }
            });
            setTasks(response.data);
            setFilterOptions(filter);
        } catch (error) {
            console.error('Error filtering tasks:', error);
        }
    };

    const handleShowDetails = (taskId) => {
        navigate('/dashboard/TaskList/' + taskId);
    };

    return (
        <div>
            <SearchBar onSearch={handleSearch} />
            <FilterDropdown onFilter={handleFilter} />
         
            <table border={1}>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Due Date</th>
                        <th>Actions</th> 
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task._id}>
                            <td>{task.title}</td>
                            <td>{task.status}</td>
                            <td>{task.priority}</td>
                            <td>{task.dueDate}</td>
                            <td>
                                {/* <Link to={`/task/${task._id}`}><button>Show</button></Link> Show button with redirect */}
                                <button onClick={() => handleShowDetails(task._id)}>Show</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <TaskDashboard/>
        </div>
    );
};

export default TaskItem;
