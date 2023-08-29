import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from './config.js';

const UserLogin = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [loginError, setLoginError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    async function checkLoggedInStatus() {
      try {
        const response = await axios.get(`${API_URL}/check-auth`);
        if (response.data.isLoggedIn) {
          setIsLoggedIn(true);
          setFirstName(response.data.user.firstname);
          setLastName(response.data.user.lastname);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    }
    checkLoggedInStatus();
  }, []); 

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      console.log('Login successful:', response.data);

      setCredentials({
        email: '',
        password: '',
      });
      setLoginError('');
      setIsLoggedIn(true);
      setFirstName(response.data.firstname); // Store first name
      setLastName(response.data.lastname); // Store last name
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Invalid email or password');
    }
  };

  return (
    <div className="container mt-5">
      <h2>User Login</h2>
      {loginError && (
        <div className="alert alert-danger" role="alert">
          {loginError}
        </div>
      )}
      {isLoggedIn ? (
        <div className="alert alert-success" role="alert">
          Dear {firstName} {lastName}, you logged in successfully
        </div>
      ) : (
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      )}
    </div>
  );
};

export default UserLogin;
