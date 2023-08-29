import React, { useContext } from 'react'; // Import AuthContext

import { AuthContext } from './AuthContext.js';

const Home = () => {
  const { user } = useContext(AuthContext); // Access the user from AuthContext

  return (
    <div className="container">
      <h2>Welcome to the HR Management system</h2>
      {user ? (
        <p>You are logged in as {user.username}</p>
      ) : (
        <p>Please register or login to access your organisation page.</p>
      )}
    </div>
  );
};

export default Home;
