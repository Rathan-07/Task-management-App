import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Pdf from '../Pdf';
import Comment from '../Comment';
const TaskDetail = () => {
    const { taskId } = useParams(); // Get taskId from URL params
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchingUser = async () => {
            if (taskId) {
                try {
                    const response = await axios.get(`http://localhost:3070/api/task/${taskId}`, {
                        headers: {
                            Authorization: localStorage.getItem('token')
                        }
                    });
                    setUser(response.data);
                } catch (error) {
                    console.log(error);
                }
            }
        };
        fetchingUser();
    }, [taskId]);
    // Function to validate date format (YYYY-MM-DD)
     
    const isValidDate = (dateString) => {
    // Check if the date string matches the format YYYY-MM-DD
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    return datePattern.test(dateString);
};


    const handleEdit = async () => {
        const newTitle = prompt("Enter the new title:", user.title);
        if (newTitle !== null && newTitle !== "" && newTitle !== user.title) {
            const newDescription = prompt("Enter the new description:", user.description);
            const newPriority = prompt("Enter the new priority (High, Medium, Low):", user.priority);
            const newStatus = prompt("Enter the new status (Todo, in progress, done):", user.status);
            const newDueDate = prompt("Enter the new due date (YYYY-MM-DD):", user.dueDate);
    
            // Validate input
            if (!newDescription || newDescription.trim() === "") {
                alert("Description is required");
                return;
            }
            if (!newPriority || !['High', 'Medium', 'Low'].includes(newPriority)) {
                alert("Priority should be one of High, Medium, Low");
                return;
            }
            if (!newStatus || !['Todo', 'in progress', 'done'].includes(newStatus)) {
                alert("Status should be one of Todo, in progress, done");
                return;
            }
            if (!newDueDate || !isValidDate(newDueDate)) {
                alert("Due date is invalid. Please use the format YYYY-MM-DD");
                return;
            }
    
            try {
                await axios.put(
                    `http://localhost:3070/api/task/${taskId}`,
                    { title: newTitle, description: newDescription, priority: newPriority, status: newStatus, dueDate: newDueDate },
                    {
                        headers: {
                            Authorization: localStorage.getItem('token')
                        }
                    }
                );
                // Update the title in the state
                setUser({ ...user, title: newTitle });
            } catch (error) {
                console.log(error);
                alert("An error occurred while updating the task. Please try again later.");
            }
        }
    };
    
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await axios.delete(`http://localhost:3070/api/task/${taskId}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                // Remove the task from the UI
               setUser(null)
                // Redirect to a different page or refresh the task list
                // history.push('/tasks');
            } catch (error) {
                console.log(error);
            }
        }
    };

   
    return (
        <div>
            <h2>Task Detail</h2>
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
            <table border={1}>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Due Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{user?.title}</td>
                        <td>{user?.status}</td>
                        <td>{user?.priority}</td>
                        <td>{user?.dueDate}</td>
                    </tr>
                </tbody>
            </table>
            {/* <Pdf/> */}
            <div style={{margin:'5px',padding:'5px', marginTop:'20px'}}>
             <Comment taskId = {taskId}/>
            </div>
            <div style={{margin:'5px',padding:'5px', marginTop:'20px'}}>
             <Pdf/>
            </div>

        </div>
        
    );
};

export default TaskDetail;
