import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL } from './config.js';
import { AuthContext } from './AuthContext.js';

const UserLogin = () => {
  const { setUser, setAuthenticated } = useContext(AuthContext); // Use the functions from AuthContext
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [loginError, setLoginError] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    async function checkLoggedInStatus() {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          const response = await axios.get(`${API_URL}/check-auth`, {
            withCredentials: true, // Include this option
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          console.log('Check logged in response:', response.data);
          if (response.data.user) {
            setFirstName(response.data.user.firstname);
            setLastName(response.data.user.lastname);
          }
        } catch (error) {
          console.error('Error checking authentication:', error);
        }
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
      const { token, firstname, lastname, user } = response.data; // Extract user from response

      // Store token and user details in local storage
      localStorage.setItem('authToken', token);

       // Update AuthContext state
    setUser(user); // Set the user object
    setAuthenticated(true);
    setFirstName(firstname); // Set the first name
    setLastName(lastname); // Set the last name

      // Update AuthContext state
      setUser(user); // Set the user object
      setAuthenticated(true);

      // Clear form fields and errors
      setCredentials({
        email: '',
        password: '',
      });
      setLoginError('');
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
      {firstName && (
        <div className="alert alert-success" role="alert">
          Dear {firstName} {lastName}, you logged in successfully
        </div>
      )}
      {!firstName && (
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
