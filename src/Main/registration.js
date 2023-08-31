import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../Other/config.js';

const UserRegistration = () => {
  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    email: '',
    organization: '',
    position: '',
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/register`, user);
      console.log('User registered:', response.data);
      setRegistrationSuccess(true); // Set registration success state
      // Reset the form
      setUser({
        firstname: '',
        lastname: '',
        email: '',
        organization: '',
        position: '',
      });
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>User Registration</h2>
      {registrationSuccess ? (
        <div className="alert alert-success" role="alert">
          Registration successful!
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="firstname"
              name="firstname"
              value={user.firstname}
              onChange={handleInputChange}
              placeholder="First Name"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="lastname"
              name="lastname"
              value={user.lastname}
              onChange={handleInputChange}
              placeholder="Last Name"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={user.email}
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
              value={user.password}
              onChange={handleInputChange}
              placeholder="Password"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="organization"
              name="organization"
              value={user.organization}
              onChange={handleInputChange}
              placeholder="Organization"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="position"
              name="position"
              value={user.position}
              onChange={handleInputChange}
              placeholder="Position"
              required
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Register
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserRegistration;
