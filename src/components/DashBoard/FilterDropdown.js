// FilterDropdown.js

import React, { useState } from 'react';

const FilterDropdown = ({ onFilter }) => {
    const [filterOptions, setFilterOptions] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFilterOptions({ ...filterOptions, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onFilter(filterOptions);
    };

    return (
        <form onSubmit={handleSubmit}>
            <select name="status" onChange={handleChange}>
                <option value="">Select Status</option>
                <option value="Todo">Todo</option>
                <option value="InProgress">InProgress</option>
                <option value="Done">Done</option>
            </select>
            <select name="priority" onChange={handleChange}>
                <option value="">Select Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>
            <button type="submit">Apply Filter</button>
        </form>
    );
};

export default FilterDropdown;
