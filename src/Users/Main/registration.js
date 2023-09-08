import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../Other/config.js';

const UserRegistration = () => {
  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phoneNumberPrefix: '050', // Default prefix
    phoneNumberDigits: '',
    organization: '',
    position: '',
    password: '',
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);

  
  const [formErrors, setFormErrors] = useState({
    firstname: false,
    lastname: false,
    email: false,
    phoneNumber: false,
    organization: false,
    position: false,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // For the phoneNumberDigits field, limit input to 7 digits and add formatting

    if (name === 'password') {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    } else if (name === 'phoneNumberDigits') {
      // Remove any non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      // Add hyphens for formatting (XXX-XX-XX)
      const formattedValue = digitsOnly
        .slice(0, 7)
        .replace(/(\d{3})(\d{2})(\d{2})/, '$1-$2-$3');
      setUser((prevUser) => ({
        ...prevUser,
        [name]: formattedValue,
      }));
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }

    // Clear the email validation error when typing in the email field
    if (name === 'email') {
      setIsEmailValid(validateEmail(value));
    }

    // Add input field validation checks similar to the Yeni_emekdash component
    if (value.trim() === '') {
      setFormErrors({ ...formErrors, [name]: true });
    } else {
      setFormErrors({ ...formErrors, [name]: false });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const errors = {
      firstname: !user.firstname,
      lastname: !user.lastname,
      email: !validateEmail(user.email),
      phoneNumberDigits: user.phoneNumberDigits.replace(/\D/g, '').length !== 7, // Check for 7 digits
      organization: !user.organization,
      position: !user.position,
      password: !user.password,
    };
    setFormErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (validateForm()) {
      try {
        const fullPhoneNumber = `(+994) ${user.phoneNumberPrefix}-${user.phoneNumberDigits}`;
        console.log('Sending phone number to backend:', fullPhoneNumber); // Add this line

        const response = await axios.post(`${API_URL}/register`, { ...user, phoneNumber: fullPhoneNumber });
        console.log('User registered:', response.data);
        setRegistrationSuccess(true); // Set registration success state
        // Reset the form
        setUser({
          firstname: '',
          lastname: '',
          email: '',
          phoneNumberPrefix: '050',
          phoneNumberDigits: '',
          organization: '',
          position: '',
          password: '',
        });
        setFormErrors({
          firstname: false,
          lastname: false,
          email: false,
          phoneNumberDigits: false,
          organization: false,
          position: false,
          password: false,
        });
      } catch (error) {
        console.error('Registration error:', error);
      }
    } else {
      // If there are validation errors, scroll to the first invalid field
      const firstErrorField = Object.keys(formErrors).find((key) => formErrors[key]);
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  

  return (
    <div className="container mt-5 main">
      <div className="row justify-content-center">
        <div className="col-12 col-md-5">
          <div className="card border border">
            <div className="card-body">
              <h2 className="card-title text-center">İstifadəçi qeydiyyatı</h2>
              {registrationSuccess ? (
                <div className="alert alert-success" role="alert">
                  Registration successful!
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="form-group">
                    <label htmlFor="firstname">Ad</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.firstname && 'is-invalid'}`}
                      id="firstname"
                      name="firstname"
                      value={user.firstname}
                      onChange={handleInputChange}
                      placeholder="Ad"
                      required
                    />
                    {formErrors.firstname && (
                      <div className="error-message">Ad is required.</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastname">Soyad</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.lastname && 'is-invalid'}`}
                      id="lastname"
                      name="lastname"
                      value={user.lastname}
                      onChange={handleInputChange}
                      placeholder="Soyad"
                      required
                    />
                    {formErrors.lastname && (
                      <div className="error-message">Soyad is required.</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      className={`form-control ${formErrors.email || !isEmailValid ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={user.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      required
                    />
                    {formErrors.email && (
                      <div className="error-message">Email is required.</div>
                    )}
                    {!isEmailValid && (
                      <div className="error-message">Please enter a valid email address.</div>
                    )}
                  </div>
                  <div className="form-group">
                    
                    <label>Telefon</label>
                    <div className="d-flex align-items-center">
                      <select
                        className={`form-control select-prefix ${formErrors.phoneNumberDigits && 'is-invalid'}`}
                        name="phoneNumberPrefix"
                        value={user.phoneNumberPrefix}
                        onChange={handleInputChange}
                      >
                        <option value="050">050</option>
                        <option value="051">051</option>
                        <option value="055">055</option>
                        <option value="070">070</option>
                      </select>
                      
                      <input
                        type="text"
                        className={`form-control ${formErrors.phoneNumberDigits ? 'is-invalid' : ''}`}
                        name="phoneNumberDigits"
                        value={user.phoneNumberDigits}
                        onChange={handleInputChange}
                        placeholder="XXX-XX-XX"
                        required
                      />
                    </div>
                    {formErrors.phoneNumberDigits && (
                      <div className="error-message">Telefon is required and must be 7 digits.</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Şifrə</label>
                    <input
                      type="password"
                      className={`form-control ${formErrors.password && 'is-invalid'}`}
                      id="password"
                      name="password"
                      value={user.password}
                      onChange={handleInputChange}
                      placeholder="Şifrə"
                      required
                    />
                    {formErrors.password && (
                      <div className="error-message">Şifrə is required.</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="organization">Təşkilat</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.organization && 'is-invalid'}`}
                      id="organization"
                      name="organization"
                      value={user.organization}
                      onChange={handleInputChange}
                      placeholder="Təşkilat"
                      required
                    />
                    {formErrors.organization && (
                      <div className="error-message">Təşkilat is required.</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="position">Vəzifə</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.position && 'is-invalid'}`}
                      id="position"
                      name="position"
                      value={user.position}
                      onChange={handleInputChange}
                      placeholder="Vəzifə"
                      required
                    />
                    {formErrors.position && (
                      <div className="error-message">Vəzifə is required.</div>
                    )}
                  </div>
                  <div className="form-group text-center">
                    <button type="submit" className="btn btn-primary">
                      Qeydiyyat
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;
