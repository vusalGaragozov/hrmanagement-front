// DefaultColumnFilter.js
import React from 'react';

const DefaultColumnFilter = ({ column }) => {
  return (
    <input
      type="text"
      onChange={(e) => {
        column.setFilter(e.target.value || undefined);
      }}
      placeholder={`Filter ${column.Header}`}
    />
  );
};

export default DefaultColumnFilter;
