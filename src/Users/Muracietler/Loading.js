import React from 'react';

const CustomLoading = ({ width }) => (
  <div style={{ width: `${width}px`, display: 'inline-block', height: '1em', backgroundColor: '#f0f0f0', animation: 'loading 1.5s infinite' }}></div>
);

export default CustomLoading;
