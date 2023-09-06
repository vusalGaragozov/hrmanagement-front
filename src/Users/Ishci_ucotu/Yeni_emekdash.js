import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ishci_ucotu.css';
import az from 'date-fns/locale/az';
import '@fortawesome/fontawesome-free/css/all.css';
import axios from 'axios';
import { API_URL } from '../Other/config';

const Yeni_emekdash = () => {
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
    });setIsSuccessVisible(false);
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
    setPersonalInfo({ ...personalInfo, [name]: value });

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

  const handleDateChange = (date, field) => {
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
      email
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
  
  const handleAddStaffMember = async (e) => {
    e.preventDefault(); // Prevent form submission
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
      // Send a POST request to your backend API
      const response = await axios.post(`${API_URL}/api/staffmember`, {
        personalInfo,
        corporateInfo,
      });

      if (response.status === 201) {
        // Staff member added successfully
        // You can optionally reset the form or display a success message
        setShowSuccess(true);

        // Reset the form fields
        resetForm();

        // Show the success message and set a timer to hide it after 3 seconds
        setIsSuccessVisible(true);
      } else {
        // Handle errors here
        alert('Error adding staff member');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the staff member. See console for details.');
    }
  };


  return (
    <div className="container mt-5">
      <form>
        {/* Personal Information */}
        <div className="mb-3">
          <h3>Şəxsi məlumatlar:</h3>
          <div className="row g-2">
            <div className={`col-md-4 ${validationErrors.name ? 'is-invalid' : ''}`}>
              <input
                type="text"
                className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
                placeholder="Ad"
                name="name"
                value={personalInfo.name}
                onChange={handlePersonalInfoChange}
                required
              />
              {validationErrors.name && (
    <div className="invalid-feedback">Zəhmət olmasa adınızı daxil edin.</div>
  )}
            </div>
            <div className={`col-md-4 ${validationErrors.surname ? 'is-invalid' : ''}`}>
              <input
                type="text"
                className={`form-control ${validationErrors.surname ? 'is-invalid' : ''}`}
                placeholder="Soyad"
                name="surname"
                value={personalInfo.surname}
                onChange={handlePersonalInfoChange}
                required
              />
              {validationErrors.surname && (
    <div className="invalid-feedback">Zəhmət olmasa Soyadınızı daxil edin.</div>
  )}
            </div>
            <div className={`col-md-4 ${validationErrors.fatherName ? 'is-invalid' : ''}`}>
              <input
                type="text"
                className={`form-control ${validationErrors.fatherName ? 'is-invalid' : ''}`}
                placeholder="Ata adı"
                name="fatherName"
                value={personalInfo.fatherName}
                onChange={handlePersonalInfoChange}
                required
              />
              {validationErrors.fatherName && (
    <div className="invalid-feedback">Zəhmət olmasa Ata adınızı daxil edin.</div>
  )}
      
            </div>
            <div className={`col-md-4 ${validationErrors.gender ? 'is-invalid' : ''}`}>
              <select
                id="gender"
                className={`form-select ${validationErrors.gender ? 'is-invalid' : ''}`}
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
    <div className="invalid-feedback">Zəhmət olmasa cinsinizi daxil edin.</div>
  )}
            </div>
            <div className={`col-md-4 ${validationErrors.birthDate ? 'is-invalid' : ''}`}>
              <DatePicker
                selected={personalInfo.birthDate}
                onChange={(date) => handleDateChange(date, 'birthDate')}
                className={`form-control ${validationErrors.birthDate ? 'is-invalid' : ''}`}
                locale={az}
                placeholderText="Doğum tarixi"
                showYearDropdown
                yearDropdownItemNumber={50} // Adjust this value as needed
                showMonthDropdown
                dateFormat="MMM d, yyyy"
                minDate={new Date('1958-01-01')}
                maxDate={new Date('2005-12-31')}
              />
              {validationErrors.birthDate && (
    <div className="invalid-feedback">Zəhmət olmasa doğum tarixinizi daxil edin.</div>
  )}
            </div>
            <div className={`col-md-4 ${validationErrors.FINCode ? 'is-invalid' : ''}`}>
              <input
                type="text"
                className={`form-control ${validationErrors.FINCode ? 'is-invalid' : ''}`}
                placeholder="FİN kod"
                name="FINCode"
                value={personalInfo.FINCode}
                onChange={handlePersonalInfoChange}
                required
              />
              {validationErrors.FINCode && (
    <div className="invalid-feedback">Zəhmət olmasa FİN kodunuzu daxil edin.</div>
  )}
            </div>
            <div className={`col-md-4 ${validationErrors.email ? 'is-invalid' : ''}`}>
              <input
                type="email"
                className={`form-control ${
                  validationErrors.email || (personalInfo.email !== '' && !isValidEmail(personalInfo.email))
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
              {personalInfo.email !== '' && !isValidEmail(personalInfo.email) && (
                <div className="invalid-feedback">Email ünvanı doğru formatda daxil edin</div>
              )}
              {validationErrors.email && (
    <div className="invalid-feedback">Zəhmət olmasa email ünvanınızı daxil edin.</div>
  )}
            </div>
          </div>
        </div>

        {/* Corporate Information */}
        <div className="mb-3">
          <h3>Korporativ məlumatlar:</h3>
          <div className="row g-2">
            <div className={`col-md-4 ${validationErrors.department ? 'is-invalid' : ''}`}>
              <input
                type="text"
                className={`form-control ${validationErrors.department ? 'is-invalid' : ''}`}
                placeholder="Şöbə"
                name="department"
                value={corporateInfo.department}
                onChange={handleCorporateInfoChange}
                required
              />
              {validationErrors.department && (
    <div className="invalid-feedback">Şöbənizi daxil edin.</div>
  )}
            </div>
            <div className={`col-md-4 ${validationErrors.position ? 'is-invalid' : ''}`}>
              <input
                type="text"
                className={`form-control ${validationErrors.position ? 'is-invalid' : ''}`}
                placeholder="Vəzifə"
                name="position"
                value={corporateInfo.position}
                onChange={handleCorporateInfoChange}
                required
              />
              {validationErrors.position && (
    <div className="invalid-feedback">Vəzifənizi daxil edin.</div>
  )}
            </div>
            <div className={`col-md-4 ${validationErrors.grossSalary ? 'is-invalid' : ''}`}>
              <input
                type="number"
                className={`form-control ${validationErrors.grossSalary ? 'is-invalid' : ''}`}
                placeholder="Əmək haqqı (gross)"
                name="grossSalary"
                value={corporateInfo.grossSalary}
                onChange={handleCorporateInfoChange}
                required
              />
               {validationErrors.grossSalary && (
    <div className="invalid-feedback">Vəzifənizi daxil edin. </div> )}
     </div>
            <div className={`col-md-4 ${validationErrors.field ? 'is-invalid' : ''}`}>
              <input
                type="text"
                className={`form-control ${validationErrors.field ? 'is-invalid' : ''}`}
                placeholder="Sahə (dövlət və qeyri-dövlət)"
                name="field"
                value={corporateInfo.field}
                onChange={handleCorporateInfoChange}
                required
              />
              {validationErrors.field && (
    <div className="invalid-feedback">Sahənizi daxil edin.</div>
  )}
              
            </div>
            <div className={`col-md-4 ${validationErrors.startDate ? 'is-invalid' : ''}`}>
              <DatePicker
                selected={corporateInfo.startDate}
                onChange={(date) => handleDateChange(date, 'startDate')}
                className={`form-control ${validationErrors.startDate ? 'is-invalid' : ''}`}
                locale={az}
                placeholderText="İşə başlama tarixi"
                showYearDropdown
                yearDropdownItemNumber={3}
                showMonthDropdown
                dateFormat="MMM d, yyyy"
                required
              />
               {validationErrors.startDate && (
    <div className="invalid-feedback">İşə başlama tarixini daxil edin.</div>
  )}
            </div>
            <div className={`col-md-4 ${validationErrors.annualLeaveDays ? 'is-invalid' : ''}`}>
              <input
                type="number"
                className={`form-control ${validationErrors.annualLeaveDays ? 'is-invalid' : ''}`}
                placeholder="İllik məzuniyyət günləri"
                name="annualLeaveDays"
                value={corporateInfo.annualLeaveDays}
                onChange={handleCorporateInfoChange}
                required
              />
               {validationErrors.annualLeaveDays && (
    <div className="invalid-feedback">İllik məzuniyyət gün sayınızı daxil edin.</div>
  )}
            </div>
            <div className={`col-md-4 ${validationErrors.contractDuration ? 'is-invalid' : ''}`}>
              <input
                type="number"
                className={`form-control ${validationErrors.contractDuration ? 'is-invalid' : ''}`}
                placeholder="Müqavilə müddəti (ayla)"
                name="contractDuration"
                value={corporateInfo.contractDuration}
                onChange={handleCorporateInfoChange}
                required
              />
               {validationErrors.contractDuration && (
    <div className="invalid-feedback">Müqavilənizin müddətini daxil edin.</div>
  )}
            </div>
            <div className={`col-md-4 ${validationErrors.weeklyWorkingHours ? 'is-invalid' : ''}`}>
              <input
                type="number"
                className={`form-control ${validationErrors.weeklyWorkingHours ? 'is-invalid' : ''}`}
                placeholder="Həftəlik iş saatı"
                name="weeklyWorkingHours"
                value={corporateInfo.weeklyWorkingHours}
                onChange={handleCorporateInfoChange}
                required
              />
               {validationErrors.weeklyWorkingHours && (
    <div className="invalid-feedback">Həftəlik iş saatı sayını daxil edin.</div>
  )}
            </div>
          </div>
        </div>
        {isSuccessVisible ? (
  <div className="alert alert-success mt-3" role="alert">
    Əməkdaş uğurla əlavə edilmişdir
  </div>
) : (
  <div className="alert alert-success mt-3 slide-out" role="alert">
    Əməkdaş uğurla əlavə edilmişdir
  </div>
)}

        <button type="submit" className="btn btn-primary" onClick={handleAddStaffMember}>
          Əlavə et
        </button>
      </form>
    </div>
  );
};

export default Yeni_emekdash;
