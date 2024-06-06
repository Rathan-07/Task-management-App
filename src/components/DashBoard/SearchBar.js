// SearchBar.js

import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(searchQuery);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={searchQuery}
                onChange={handleChange}
                placeholder="Search tasks..."
            />
            <button type="submit">Search</button>
        </form>
    );
};

export default SearchBar;
