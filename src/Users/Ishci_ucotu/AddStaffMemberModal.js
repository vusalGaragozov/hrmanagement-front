import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import az from 'date-fns/locale/az';
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

  const [validationErrors, setValidationErrors] = useState({
    name: false,
    surname: false,
    fatherName: false,
    gender: false,
    birthDate: false,
    FINCode: false,
    email: false,
  });

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });

    if (value.trim() === '' || (name === 'email' && !isValidEmail(value))) {
      setValidationErrors({ ...validationErrors, [name]: true });
    } else {
      setValidationErrors({ ...validationErrors, [name]: false });
    }
  };

  const handleDateChange = (date, field) => {
    if (field === 'birthDate') {
      setPersonalInfo({ ...personalInfo, birthDate: date });
    }
    setValidationErrors({ ...validationErrors, [field]: false });
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

    if (
      !name ||
      !surname ||
      !fatherName ||
      !gender ||
      !birthDate ||
      !FINCode ||
      !isValidEmail(email)
    ) {
      return false;
    }
    return true;
  };

  const formattedPersonalInfo = {
    ...personalInfo,
    birthDate: personalInfo.birthDate
      ? format(personalInfo.birthDate, 'dd-MM-yyyy')
      : null,
  };

  const handleAddClick = () => {
    if (isFormValid()) {
      onAdd(formattedPersonalInfo);
      onHide();
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  return (
    <div className={`modal ${show ? 'show' : ''}`}>
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
                <div className="invalid-feedback">
                  Please enter a name.
                </div>
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
                <div className="invalid-feedback">
                  Please enter a surname.
                </div>
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
                <div className="invalid-feedback">
                  Please enter a father's name.
                </div>
              )}
            </div>
            <div className="mb-3">
              <select
                className={`form-select ${
                  validationErrors.gender ? 'is-invalid' : ''
                }`}
                name="gender"
                value={personalInfo.gender}
                onChange={handlePersonalInfoChange}
                required
              >
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {validationErrors.gender && (
                <div className="invalid-feedback">
                  Please select a gender.
                </div>
              )}
            </div>
            <div className="mb-3">
              <DatePicker
                selected={personalInfo.birthDate}
                onChange={(date) => handleDateChange(date, 'birthDate')}
                className={`form-control ${
                  validationErrors.birthDate ? 'is-invalid' : ''
                }`}
                locale={az}
                placeholderText="Birth Date"
                showYearDropdown
                yearDropdownItemNumber={50}
                showMonthDropdown
                dateFormat="MMM d, yyyy"
                minDate={new Date('1958-01-01')}
                maxDate={new Date('2005-12-31')}
              />
              {validationErrors.birthDate && (
                <div className="invalid-feedback">
                  Please enter a valid birth date.
                </div>
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
                <div className="invalid-feedback">
                  Please enter a FIN code.
                </div>
              )}
            </div>
            <div className="mb-3">
              <input
                type="email"
                className={`form-control ${
                  validationErrors.email || !isValidEmail(personalInfo.email)
                    ? 'is-invalid'
                    : ''
                }`}
                placeholder="Email"
                name="email"
                value={personalInfo.email}
                onChange={handlePersonalInfoChange}
                required
              />
              {!isValidEmail(personalInfo.email) && (
                <div className="invalid-feedback">
                  Please enter a valid email address.
                </div>
              )}
            </div>
            {/* Add other personal info fields with similar structure */}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onHide}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddClick}
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
