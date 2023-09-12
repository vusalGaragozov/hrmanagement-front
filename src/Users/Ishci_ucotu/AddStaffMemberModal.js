import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const AddStaffMemberModal = ({ show, onHide, onAdd }) => {
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    surname: '',
    fatherName: '',
    gender: '',
    birthDate: null,
    FINCode: '',
    email: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });

    // Remove the "is-invalid" class when the user starts typing in a field
    setValidationErrors({ ...validationErrors, [name]: undefined });
  };

  const handleDateChange = (date, field) => {
    setPersonalInfo({ ...personalInfo, [field]: date });
  };

  const isFormValid = () => {
    const {
      name,
      surname,
      fatherName,
      gender,
      birthDate,
      FINCode,
      email,
    } = personalInfo;

    const errors = {};

    if (!name) {
      errors.name = 'Please enter a name.';
    }
    

    if (!surname) {
      errors.surname = 'Please enter a surname.';
    }

    if (!fatherName) {
      errors.fatherName = 'Please enter a father name.';
    }

    if (!gender) {
      errors.gender = 'Please select a gender.';
    }

    if (!birthDate) {
      errors.birthDate = 'Please select a birth date.';
    }

    if (!FINCode) {
      errors.FINCode = 'Please enter an FIN code.';
    }

    if (!isValidEmail(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    setValidationErrors(errors);

    // Check if there are any errors
    return Object.keys(errors).length === 0;
  };

  const handleAddClick = (e) => {
    e.preventDefault(); // Prevent form submission
    console.log('Clicked Add button');
    if (!isFormValid()) {
      // Form is not valid, do not proceed
      console.log('Form is not valid:', validationErrors);
      return;
    }

    const formattedPersonalInfo = {
      ...personalInfo,
      birthDate: personalInfo.birthDate ? format(personalInfo.birthDate, 'dd-MM-yyyy') : null,
    };

    onAdd(formattedPersonalInfo);
    onHide();
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  return (
    <div className={`modal ${show ? 'show' : ''}`} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Staff Member</h5>
            <button type="button" className="close" onClick={onHide}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {/* Personal Info Fields */}
            <div className="mb-3">
              <input
                type="text"
                className={`form-control ${
                  validationErrors.name ? 'is-invalid' : ''
                }`}
                placeholder="Name"
                name="name"
                value={personalInfo.name}
                onChange={handlePersonalInfoChange}
                required
              />
              {validationErrors.name && (
                <div className="invalid-feedback">{validationErrors.name}</div>
              )}
            </div>
            <div className="mb-3">
              <input
                type="text"
                className={`form-control ${
                  validationErrors.surname ? 'is-invalid' : ''
                }`}
                placeholder="Surname"
                name="surname"
                value={personalInfo.surname}
                onChange={handlePersonalInfoChange}
                required
              />
              {validationErrors.surname && (
                <div className="invalid-feedback">{validationErrors.surname}</div>
              )}
            </div>
            <div className="mb-3">
              <input
                type="text"
                className={`form-control ${
                  validationErrors.fatherName ? 'is-invalid' : ''
                }`}
                placeholder="Father Name"
                name="fatherName"
                value={personalInfo.fatherName}
                onChange={handlePersonalInfoChange}
                required
              />
              {validationErrors.fatherName && (
                <div className="invalid-feedback">{validationErrors.fatherName}</div>
              )}
            </div>
            <div className="mb-3">
              <input
                type="text"
                className={`form-control ${
                  validationErrors.gender ? 'is-invalid' : ''
                }`}
                placeholder="Gender"
                name="gender"
                value={personalInfo.gender}
                onChange={handlePersonalInfoChange}
                required
              />
              {validationErrors.gender && (
                <div className="invalid-feedback">{validationErrors.gender}</div>
              )}
            </div>
            <div className="mb-3">
              <label>Date of Birth</label>
              <br />
              <DatePicker
                selected={personalInfo.birthDate}
                onChange={(date) => handleDateChange(date, 'birthDate')}
                dateFormat="dd-MM-yyyy"
                className={`form-control ${
                  validationErrors.birthDate ? 'is-invalid' : ''
                }`}
                placeholderText="Select a date"
                required
              />
              {validationErrors.birthDate && (
                <div className="invalid-feedback">{validationErrors.birthDate}</div>
              )}
            </div>
            <div className="mb-3">
              <input
                type="text"
                className={`form-control ${
                  validationErrors.FINCode ? 'is-invalid' : ''
                }`}
                placeholder="FIN Code"
                name="FINCode"
                value={personalInfo.FINCode}
                onChange={handlePersonalInfoChange}
                required
              />
              {validationErrors.FINCode && (
                <div className="invalid-feedback">{validationErrors.FINCode}</div>
              )}
            </div>
            <div className="mb-3">
              <input
                type="email"
                className={`form-control ${
                  validationErrors.email ? 'is-invalid' : ''
                }`}
                placeholder="Email"
                name="email"
                value={personalInfo.email}
                onChange={handlePersonalInfoChange}
                required
              />
              {validationErrors.email && (
                <div className="invalid-feedback">{validationErrors.email}</div>
              )}
            </div>
            {/* Add more input fields as needed */}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onHide}>
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddClick}
              disabled={!isFormValid()}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStaffMemberModal;
