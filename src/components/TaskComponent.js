import React, { useState, useEffect } from 'react';
import MultiSelect from 'multiselect-react-dropdown';
import axios from 'axios';

const TaskAssignmentComponent = ({ taskId }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({}); // Define newTask state

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3070/users/details');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAssignTask = (userIds) => {
    // Handle assignment logic here
    setNewTask({ ...newTask, assignedTo: userIds });
  };

  return (
    <div>
      <MultiSelect
        options={users.map(user => ({ key: user._id, value: user.username }))}
        selectedValues={selectedUsers}
        onSelect={(selectedList) => {
          setSelectedUsers(selectedList); // Update selected users
          handleAssignTask(selectedList.map(item => item.key)); // Call handleAssignTask with user IDs
        }}
        onRemove={(selectedList) => {
          setSelectedUsers(selectedList); // Update selected users
          handleAssignTask(selectedList.map(item => item.key)); // Call handleAssignTask with user IDs
        }}
        displayValue="value"
        placeholder="Assign To"
        style={{ multiselectContainer: { width: '100%' } }}
      />
      <button onClick={() => handleAssignTask(selectedUsers.map(user => user.key))}>Assign Task</button>
    </div>
  );
};

export default TaskAssignmentComponent;
