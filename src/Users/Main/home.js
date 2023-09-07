import React, { useContext } from 'react'; // Import AuthContext

import { AuthContext } from '../Main/AuthContext.js';

const Home = () => {
  const { user } = useContext(AuthContext); // Access the user from AuthContext

  return (
    <div className="container main">
      <h2>IR İdarəetmə Moduluna xoş gəlmisiniz!</h2>
      {user ? (
        <p>Siz {user.firstname} {user.lastname} olaraq daxil olmusuz.</p>
      ) : (
        <p>Öz səhifənizə giriş əldə etmək üçün daxil olun və ya qeydiyyatdan keçin.</p>
      )}
    </div>
  );
};

export default Home;
