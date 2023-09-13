import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ishci_ucotu.css';
import az from 'date-fns/locale/az';
import '@fortawesome/fontawesome-free/css/all.css';
import axios from 'axios';
import { API_URL } from '../Other/config';
import { AuthContext } from '../Main/AuthContext.js';
import { format } from 'date-fns';

const Yeni_emekdash = () => {
  const { user } = useContext(AuthContext);
  
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    surname: '',
    fatherName: '',
    gender: '',
    birthDate: null,
    FINCode: '',
    email: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  const resetForm = () => {
    setPersonalInfo({
      name: '',
      surname: '',
      fatherName: '',
      gender: '',
      birthDate: null,
      FINCode: '',
      email: '',
    });
    setCorporateInfo({
      department: '',
      position: '',
      grossSalary: '',
      field: '',
      startDate: null,
      annualLeaveDays: '',
      contractDuration: '',
      weeklyWorkingHours: '',
    });
    setIsSuccessVisible(false);
  };

  // Function to hide the success message after a delay
  const hideSuccessMessage = () => {
    setIsSuccessVisible(false);
  };

  // Use useEffect to automatically hide the success message after 3 seconds
  useEffect(() => {
    if (isSuccessVisible) {
      const timeoutId = setTimeout(() => {
        hideSuccessMessage(); // Hide the success message after 3 seconds
      }, 3000); // 3 seconds
      return () => clearTimeout(timeoutId); // Cleanup on unmount or if isSuccessVisible changes
    }
  }, [isSuccessVisible]);

  const handleEmailBlur = (e) => {
    const { name, value } = e.target;

    // Check if the email is in a valid format
    if (!isValidEmail(value)) {
      // Display an error message or handle the validation as needed
      // You can also set a state variable to track the email validation status
      // For now, let's display a console error message
      console.error('Invalid email address');
      // Add the "is-invalid" class to highlight the invalid email field
      setValidationErrors({ ...validationErrors, [name]: true });
    }
  };

  const [corporateInfo, setCorporateInfo] = useState({
    department: '',
    position: '',
    grossSalary: '',
    field: '',
    startDate: null,
    annualLeaveDays: '',
    contractDuration: '',
    weeklyWorkingHours: '',
  });
  const currentDate = new Date();

  const [validationErrors, setValidationErrors] = useState({
    name: false,
    surname: false,
    fatherName: false,
    gender: false,
    birthDate: false,
    FINCode: false,
    email: false,
    department: false,
    position: false,
    grossSalary: false,
    field: false,
    startDate: false,
    annualLeaveDays: false,
    contractDuration: false,
    weeklyWorkingHours: false,
  });

  const isValidEmail = (email) => {
    // Regular expression for email format validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;

    // Check if the input field is the "FINCode" field
    if (name === 'FINCode') {
      // Capitalize the input value and restrict it to 7 characters
      const formattedValue = value.slice(0, 7).toUpperCase();
      setPersonalInfo({ ...personalInfo, [name]: formattedValue });
    } else {
      // For other fields, update the state normally
      setPersonalInfo({ ...personalInfo, [name]: value });
    }

    // Add the "is-invalid" class when the field is empty or has an invalid email format
    if (value.trim() === '' || (name === 'email' && !isValidEmail(value))) {
      setValidationErrors({ ...validationErrors, [name]: true });
    } else {
      // Remove the "is-invalid" class when the field is not empty and has a valid email format
      setValidationErrors({ ...validationErrors, [name]: false });
    }
  };

  const handleCorporateInfoChange = (e) => {
    const { name, value } = e.target;
    setCorporateInfo({ ...corporateInfo, [name]: value });

    // Add the "is-invalid" class when the field is empty
    if (value.trim() === '') {
      setValidationErrors({ ...validationErrors, [name]: true });
    } else {
      // Remove the "is-invalid" class when the field is not empty
      setValidationErrors({ ...validationErrors, [name]: false });
    }
  };

// Calculate minDate and maxDate
const startBirthDate = new Date();
startBirthDate.setFullYear(currentDate.getFullYear() - 65);

const endBirthDate = new Date();
endBirthDate.setFullYear(currentDate.getFullYear() - 18);

const handleDateChange = (date, field) => {
  // Handle date changes for the specified field
  if (field === 'birthDate') {
    setPersonalInfo({ ...personalInfo, birthDate: date });
  } else if (field === 'startDate') {
    setCorporateInfo({ ...corporateInfo, startDate: date });
  }

  // Remove the "is-invalid" class when the user selects a date
  setValidationErrors({ ...validationErrors, [field]: false });
};


  const isFormValid = () => {
    // Add your form validation logic here
    // Check each field's value and return false if any validation fails
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
    return true; // If all checks pass, the form is valid
  };

  const formattedPersonalInfo = {
    ...personalInfo,
    birthDate: personalInfo.birthDate
      ? format(personalInfo.birthDate, 'dd-MM-yyyy')
      : null,
  };
  
  const formattedCorporateInfo = {
    ...corporateInfo,
    startDate: corporateInfo.startDate
      ? format(corporateInfo.startDate, 'dd-MM-yyyy')
      : null,
  };
  

  const handleAddStaffMember = async (e) => {
    e.preventDefault(); // Prevent form submission

    if (!user) {
      console.error('User is not defined or null.');
      // Handle the error or return early as needed
      return;
    }

    if (!isFormValid()) {
      // If the form is not valid, mark the invalid fields
      setValidationErrors((prevState) => ({
        ...prevState,
        name: personalInfo.name.trim() === '',
        surname: personalInfo.surname.trim() === '',
        fatherName: personalInfo.fatherName.trim() === '',
        gender: personalInfo.name === '',
        birthDate: personalInfo.birthDate === null,
        FINCode: personalInfo.FINCode.trim() === '',
        email: !isValidEmail(personalInfo.email),
        department: corporateInfo.department.trim() === '',
        position: corporateInfo.position.trim() === '',
        grossSalary: corporateInfo.grossSalary.trim() === '', // Add this line for grossSalary
        field: corporateInfo.field.trim() === '', // Add this line for field
        startDate: corporateInfo.startDate === null, // Add this line for startDate
        annualLeaveDays: corporateInfo.annualLeaveDays.trim() === '', // Add this line for annualLeaveDays
        contractDuration: corporateInfo.contractDuration.trim() === '', // Add this line for contractDuration
        weeklyWorkingHours: corporateInfo.weeklyWorkingHours.trim() === '', // Add this line for weeklyWorkingHours
      }));
      return;
    }

    // Clear any previous validation errors
    setValidationErrors({});

    try {
      const response = await axios.post(`${API_URL}/api/staffmember`, {
        addedBy_company: user.organization,
        addedBy_email: user.email,
        personalInfo: formattedPersonalInfo, // Use the formatted data
        corporateInfo: formattedCorporateInfo, // Use the formatted data
      });

      if (response.status === 201) {
        setShowSuccess(true);
        resetForm();
        setIsSuccessVisible(true);

        // After 3 seconds, hide the success message and reset showSuccess
        setTimeout(() => {
          setIsSuccessVisible(false);
          setShowSuccess(false);
        }, 3000);
      } else {
        alert('Error adding staff member');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(
        'An error occurred while adding the staff member. See console for details.'
      );
    }
  };

  return (
    <div className="container mt-5 ishci_ucotu">
      <div className="row">
        <div className="col-md-12">
          <div className="d-flex justify-content-center">
            <div className="col-md-4 border rounded p-3 register-margin-left">
              <h3 className='register-underline'>Şəxsi məlumatlar:</h3>
              <div className="mb-3">
                <input
                  type="text"
                  className={`form-control ${
                    validationErrors.name ? 'is-invalid' : ''
                  }`}
                  placeholder="Ad"
                  name="name"
                  value={personalInfo.name}
                  onChange={handlePersonalInfoChange}
                  required
                />
                {validationErrors.name && (
                  <div className="invalid-feedback">
                    Zəhmət olmasa adınızı daxil edin.
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className={`form-control ${
                    validationErrors.surname ? 'is-invalid' : ''
                  }`}
                  placeholder="Soyad"
                  name="surname"
                  value={personalInfo.surname}
                  onChange={handlePersonalInfoChange}
                  required
                />
                {validationErrors.surname && (
                  <div className="invalid-feedback">
                    Zəhmət olmasa Soyadınızı daxil edin.
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className={`form-control ${
                    validationErrors.fatherName ? 'is-invalid' : ''
                  }`}
                  placeholder="Ata adı"
                  name="fatherName"
                  value={personalInfo.fatherName}
                  onChange={handlePersonalInfoChange}
                  required
                />
                {validationErrors.fatherName && (
                  <div className="invalid-feedback">
                    Zəhmət olmasa Ata adınızı daxil edin.
                  </div>
                )}
              </div>
              <div className="mb-3">
                <select
                  id="gender"
                  className={`form-select ${
                    validationErrors.gender ? 'is-invalid' : ''
                  }`}
                  name="gender"
                  value={personalInfo.gender}
                  onChange={handlePersonalInfoChange}
                  required
                >
                  <option value="">Cins</option>
                  <option value="Kişi">Kişi</option>
                  <option value="Qadın">Qadın</option>
                </select>
                {validationErrors.gender && (
                  <div className="invalid-feedback">
                    Zəhmət olmasa cinsinizi daxil edin.
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
        locale="az"
        placeholderText="Doğum tarixi"
        showYearDropdown
        showMonthDropdown
        dateFormat="MMM d, yyyy"
        minDate={startBirthDate} // Set minDate
        maxDate={endBirthDate}   // Set maxDate
        yearDropdownItemNumber={100}
      />
      {validationErrors.birthDate && (
        <div className="invalid-feedback">
          Zəhmət olmasa doğum tarixinizi daxil edin.
        </div>
      )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className={`form-control ${
                    validationErrors.FINCode ? 'is-invalid' : ''
                  }`}
                  placeholder="FİN kod"
                  name="FINCode"
                  value={personalInfo.FINCode}
                  onChange={handlePersonalInfoChange}
                  required
                />
                {validationErrors.FINCode && (
                  <div className="invalid-feedback">
                    Zəhmət olmasa FİN kodunuzu daxil edin.
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  className={`form-control ${
                    validationErrors.email ||
                    (personalInfo.email !== '' &&
                      !isValidEmail(personalInfo.email))
                      ? 'is-invalid'
                      : ''
                  }`}
                  placeholder="E-mail"
                  name="email"
                  value={personalInfo.email}
                  onChange={handlePersonalInfoChange}
                  onBlur={handleEmailBlur}
                  required
                />
                {personalInfo.email !== '' &&
                  !isValidEmail(personalInfo.email) && (
                    <div className="invalid-feedback">
                      Email ünvanı doğru formatda daxil edin
                    </div>
                  )}
                {validationErrors.email && (
                  <div className="invalid-feedback">
                    Zəhmət olmasa email ünvanınızı daxil edin.
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-4 border rounded p-3 register-margin-right">
              <h3 className='register-underline'>Korporativ məlumatlar:</h3>
              <div className="mb-3">
                <input
                  type="text"
                  className={`form-control ${
                    validationErrors.department ? 'is-invalid' : ''
                  }`}
                  placeholder="Şöbə"
                  name="department"
                  value={corporateInfo.department}
                  onChange={handleCorporateInfoChange}
                  required
                />
                {validationErrors.department && (
                  <div className="invalid-feedback">
                    Zəhmət olmasa şöbəni daxil edin.
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className={`form-control ${
                    validationErrors.position ? 'is-invalid' : ''
                  }`}
                  placeholder="Vəzifə"
                  name="position"
                  value={corporateInfo.position}
                  onChange={handleCorporateInfoChange}
                  required
                />
                {validationErrors.position && (
                  <div className="invalid-feedback">
                    Zəhmət olmasa vəzifəni daxil edin.
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className={`form-control ${
                    validationErrors.grossSalary ? 'is-invalid' : ''
                  }`}
                  placeholder="Əmək haqqı"
                  name="grossSalary"
                  value={corporateInfo.grossSalary}
                  onChange={handleCorporateInfoChange}
                  required
                />
                {validationErrors.grossSalary && (
                  <div className="invalid-feedback">
                    Zəhmət olmasa gross əmək haqqını daxil edin.
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className={`form-control ${
                    validationErrors.field ? 'is-invalid' : ''
                  }`}
                  placeholder="Sahə"
                  name="field"
                  value={corporateInfo.field}
                  onChange={handleCorporateInfoChange}
                  required
                />
                {validationErrors.field && (
                  <div className="invalid-feedback">
                    Zəhmət olmasa sahəni daxil edin.
                  </div>
                )}
              </div>
              <div className="mb-3">
                <DatePicker
                  selected={corporateInfo.startDate}
                  onChange={(date) => handleDateChange(date, 'startDate')}
                  className={`form-control ${
                    validationErrors.startDate ? 'is-invalid' : ''
                  }`}
                  locale={az}
                  placeholderText="İşə başlama tarixi"
                  showYearDropdown
                  showMonthDropdown
                  dateFormat="MMM d, yyyy"
                />
                {validationErrors.startDate && (
                  <div className="invalid-feedback">
                    Zəhmət olmasa işə başlama tarixini daxil edin.
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className={`form-control ${
                    validationErrors.annualLeaveDays ? 'is-invalid' : ''
                  }`}
                  placeholder="İllik məzuniyyət gün sayı"
                  name="annualLeaveDays"
                  value={corporateInfo.annualLeaveDays}
                  onChange={handleCorporateInfoChange}
                  required
                />
                {validationErrors.annualLeaveDays && (
                  <div className="invalid-feedback">
                    Zəhmət olmasa illik müddəti daxil edin.
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className={`form-control ${
                    validationErrors.contractDuration ? 'is-invalid' : ''
                  }`}
                  placeholder="Müqavilə müddəti (ayla)"
                  name="contractDuration"
                  value={corporateInfo.contractDuration}
                  onChange={handleCorporateInfoChange}
                  required
                />
                {validationErrors.contractDuration && (
                  <div className="invalid-feedback">
                    Zəhmət olmasa müqavilə müddətini daxil edin.
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className={`form-control ${
                    validationErrors.weeklyWorkingHours ? 'is-invalid' : ''
                  }`}
                  placeholder="Həftəlik iş saatı"
                  name="weeklyWorkingHours"
                  value={corporateInfo.weeklyWorkingHours}
                  onChange={handleCorporateInfoChange}
                  required
                />
                {validationErrors.weeklyWorkingHours && (
                  <div className="invalid-feedback">
                    Zəhmət olmasa həftəlik iş saatını daxil edin.
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="d-flex mt-3 justify-content-end">
            
            <button
              className="btn btn-primary register-button ml-auto"
              onClick={handleAddStaffMember}
            >
              Əlavə et
            </button>
          </div>
        </div>
      </div>
      {showSuccess && (
        <div className="row mt-4">
          <div className="col-md-12">
            <div className="alert alert-success" role="alert">
              İşçi əlavə edildi!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Yeni_emekdash;
