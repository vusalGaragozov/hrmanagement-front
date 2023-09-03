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
    <div className="container mt-5 col-5">
      <h2>İstifadəçi qeydiyyatı</h2>
      {registrationSuccess ? (
        <div className="alert alert-success" role="alert">
          Registration successful!
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <br/>

          <div className="form-group col-8">
            <input
              type="text"
              className="form-control"
              id="firstname"
              name="firstname"
              value={user.firstname}
              onChange={handleInputChange}
              placeholder="Ad"
              required
            />
          </div>
          <div className="form-group col-8">
            <input
              type="text"
              className="form-control"
              id="lastname"
              name="lastname"
              value={user.lastname}
              onChange={handleInputChange}
              placeholder="Soyad"
              required
            />
          </div>
          <div className="form-group col-8">
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
          <div className="form-group col-8">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={user.password}
              onChange={handleInputChange}
              placeholder="Şifrə"
              required
            />
          </div>
          <div className="form-group col-8">
            <input
              type="text"
              className="form-control"
              id="organization"
              name="organization"
              value={user.organization}
              onChange={handleInputChange}
              placeholder="Şirkət"
              required
            />
          </div>
          <div className="form-group col-8">
            <input
              type="text"
              className="form-control"
              id="position"
              name="position"
              value={user.position}
              onChange={handleInputChange}
              placeholder="Vəzifə"
              required
            />
          </div>
          <div className="form-group col-8">
            <button type="submit" className="btn btn-primary">
              Qeydə al
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserRegistration;
