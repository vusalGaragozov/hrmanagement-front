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
import numeral from 'numeral';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Yeni_emekdash = () => {
  const { user } = useContext(AuthContext);
  const [registeredStaffMembers, setRegisteredStaffMembers] = useState([]);
  const [isLineManagerSelected, setIsLineManagerSelected] = useState(true);
  const [lineManagerError, setLineManagerError] = useState(false);
  

  const isEmailAlreadyRegistered = (email) => {
    return registeredStaffMembers.some(
      (staffMember) =>
        staffMember.personalInfo.email.toLowerCase() === email.toLowerCase()
    );
  };

  const generateRandomPassword = () => {
    const length = 10; // You can adjust the length of the password
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters.charAt(randomIndex);
    }

    return password;
  };
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    surname: '',
    fatherName: '',
    gender: '',
    birthDate: null,
    FINCode: '',
    email: '',
    phoneNumberPrefix: '050', // Default prefix
    phoneNumberDigits: '',
  });

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
      lineManager: null,
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

  useEffect(() => {
    fetchRegisteredStaffMembers();
  }, []);

  const fetchRegisteredStaffMembers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/registeredstaffmembers', {
        credentials: 'include', 
      });
      const data = await response.json();
      setRegisteredStaffMembers(data);
    } catch (error) {
      console.error('Error fetching registered staff members:', error);
    }
  };

  const handleLineManagerChange = (selectedOption) => {
    setCorporateInfo({
      ...corporateInfo,
      lineManager: selectedOption, 
    });
  
    const isSelected = !!selectedOption.value; 
    setIsLineManagerSelected(isSelected);
    setLineManagerError(!isSelected); 
  
    console.log('Selected Line Manager:', selectedOption.value);
  };

  const handleEmailBlur = (e) => {
    const { name, value } = e.target;
    if (!isValidEmail(value)) {
      console.error('Invalid email address');
      setValidationErrors({ ...validationErrors, [name]: true });
    }
  };
  const handleGrossSalaryChange = (e) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value.replace(/,/g, ''));
    const isValidValue = !isNaN(numericValue) && numericValue >= 0 && numericValue <= 99999;
   const formattedValue = isValidValue && value.length <= 6 ? numericValue.toLocaleString('en-US') : corporateInfo.grossSalary;
  setCorporateInfo({ ...corporateInfo, [name]: formattedValue });
  };
  
  const [corporateInfo, setCorporateInfo] = useState({
    lineManager: '',
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
    phoneNumber: false,
    email: false,
    lineManager: false,
    position: false,
    grossSalary: false,
    field: false,
    startDate: false,
    annualLeaveDays: false,
    contractDuration: false,
    weeklyWorkingHours: false,
    phoneNumberDigits: false,

  });

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    if (name === 'FINCode') {
      const formattedValue = value.slice(0, 7).toUpperCase();
      setPersonalInfo({ ...personalInfo, [name]: formattedValue });
    }else if (name === 'phoneNumberPrefix' || name === 'phoneNumberDigits') {
      // Handle phone number input
      const digitsOnly = value.replace(/\D/g, ''); // Remove non-digit characters
      const formattedValue = digitsOnly
        .slice(0, 7)
        .replace(/(\d{3})(\d{2})(\d{2})/, '$1-$2-$3'); // Format as XXX-XX-XX
  
      setPersonalInfo((prevPersonalInfo) => ({
        ...prevPersonalInfo,
        [name]: formattedValue,
      }));
  
      // Validate phone number digits (7 digits)
      if (name === 'phoneNumberDigits' && digitsOnly.length !== 7) {
        setValidationErrors({ ...validationErrors, phoneNumberDigits: true });
      } else {
        setValidationErrors({ ...validationErrors, phoneNumberDigits: false });
      }
    } else {
      setPersonalInfo({ ...personalInfo, [name]: value });
    }
    
    // Validate other fields as needed
    if (value.trim() === '' || (name === 'email' && !isValidEmail(value))) {
      setValidationErrors({ ...validationErrors, [name]: true });
    } else {
      setValidationErrors({ ...validationErrors, [name]: false });
    }
  };

  const handleCorporateInfoChange = (e) => {
    const { name, value } = e.target;
    if (value.trim() === '' || (name === 'grossSalary' && isNaN(value))) {
      setValidationErrors({ ...validationErrors, [name]: true });
    } else {
      setValidationErrors({ ...validationErrors, [name]: false });
    }
    setCorporateInfo({ ...corporateInfo, [name]: value });
  };
  
const startBirthDate = new Date();
startBirthDate.setFullYear(currentDate.getFullYear() - 65);

const endBirthDate = new Date();
endBirthDate.setFullYear(currentDate.getFullYear() - 18);

const handleDateChange = (date, field) => {
  if (field === 'birthDate') {
    setPersonalInfo({ ...personalInfo, birthDate: date });
  } else if (field === 'startDate') {
    setCorporateInfo({ ...corporateInfo, startDate: date });
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
      phoneNumber,
      email,
    } = personalInfo;

    const isPersonalInfoValid =
    name &&
    surname &&
    fatherName &&
    gender &&
    birthDate &&
    FINCode &&
    isValidEmail(email);

  return isPersonalInfoValid;
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
    e.preventDefault(); 
    const temporaryPassword = generateRandomPassword();
    console.log('Temporary Password:', temporaryPassword); // Log the temporary password


    if (!user) {
      console.error('User is not defined or null.');
      return;
    }
    setValidationErrors({});
    setLineManagerError(false); 
  
    const hasValidationErrors = Object.values(validationErrors).some(
      (error) => error
    );
    
  
    if (hasValidationErrors || !isLineManagerSelected) {
      console.error('Form has validation errors or line manager is not selected.');
      setValidationErrors((prevState) => ({
        ...prevState,
        lineManager: !isLineManagerSelected,
      }));
      setLineManagerError(!isLineManagerSelected); 
      return;
    }
  
    if (!isFormValid()) {
      setValidationErrors((prevState) => ({
        ...prevState,
        name: personalInfo.name.trim() === '',
        surname: personalInfo.surname.trim() === '',
        fatherName: personalInfo.fatherName.trim() === '',
        gender: personalInfo.name === '',
        birthDate: personalInfo.birthDate === null,
        FINCode: personalInfo.FINCode.trim() === '',
        phoneNumber: (personalInfo.phoneNumber?.trim() || '') === '',
        email: !isValidEmail(personalInfo.email),
        position: corporateInfo.position.trim() === '',
        grossSalary: !isNaN(parseFloat(corporateInfo.grossSalary.toString().replace(/,/g, ''))) ? false : true,
        field: corporateInfo.field.trim() === '',
        startDate: corporateInfo.startDate === null, 
        annualLeaveDays: corporateInfo.annualLeaveDays.trim() === '', 
        contractDuration: corporateInfo.contractDuration.trim() === '', 
        weeklyWorkingHours: corporateInfo.weeklyWorkingHours.trim() === '', 
        lineManager: corporateInfo.lineManager.trim() === '', 
      }));
      return;
    }
  
    const emailAlreadyRegistered = isEmailAlreadyRegistered(personalInfo.email);
  
    if (emailAlreadyRegistered) {
      toast.error('Bu email artıq qeydiyyatdan keçmişdir.', {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    if (emailAlreadyRegistered) {
      console.error('Email is already registered.');
      return;
    }
  
    try {
      const lineManagerName = corporateInfo.lineManager
        ? `${corporateInfo.lineManager.label}` 
        : '';
      const grossSalaryValue = corporateInfo.grossSalary
        ? numeral(corporateInfo.grossSalary).value() 
        : '';
        
      const response = await axios.post(`${API_URL}/api/staffmember`, {
        addedBy_company: user.organization,
        addedBy_email: user.email,
        personalInfo: formattedPersonalInfo, 
        corporateInfo: {
          ...corporateInfo,
          lineManager: lineManagerName, 
          grossSalary: grossSalaryValue, 
          startDate: corporateInfo.startDate
            ? format(new Date(corporateInfo.startDate), 'dd-MM-yyyy')
            : null,
        },
        temporaryPassword: temporaryPassword, // Add the temporary password here

      });
  
      if (response.status === 201) {
        toast.success('İşçi uğurla əlavə edildi', {
          position: toast.POSITION.TOP_CENTER,
        });
        resetForm();
        return;
      } else {
      }
    } catch (error) {
      console.error('Error:', error);
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
        placeholderText="Doğum tarixi"
        showYearDropdown
        showMonthDropdown
        dateFormat="MMM d, yyyy"
        minDate={startBirthDate} 
        maxDate={endBirthDate}  
        yearDropdownItemNumber={100}
      />
      {validationErrors.birthDate && (
        <div className="invalid-feedback">
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
                  </div>
                )}
              </div>
              <div className="mb-3">
                <div className="d-flex align-items-center">
                  <select
                    className={`form-control select-prefix form-select ${
                      validationErrors.phoneNumberDigits ? 'is-invalid' : ''
                    }`}
                    name="phoneNumberPrefix"
                    value={personalInfo.phoneNumberPrefix}
                    onChange={handlePersonalInfoChange}
                  >
                    <option value="050">050</option>
                    <option value="051">051</option>
                    <option value="055">055</option>
                    <option value="070">070</option>
                  </select>

                  <input
                    type="text"
                    className={`form-control ${
                      validationErrors.phoneNumberDigits ? 'is-invalid' : ''
                    }`}
                    name="phoneNumberDigits"
                    value={personalInfo.phoneNumberDigits}
                    onChange={handlePersonalInfoChange}
                    placeholder="XXX-XX-XX"
                    required
                  />
                </div>
                {validationErrors.phoneNumberDigits && (
                  <div className="error-message">
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-4 border rounded p-3 register-margin-right">
              <h3 className='register-underline'>Korporativ məlumatlar:</h3>
              <div className="mb-3" id="lineManagerInput">
              <Select
  options={[
    ...(registeredStaffMembers.length === 0
      ? [{ value: 'CEO', label: 'Rəhbər (ilk əməkdaş rəhbər olmalıdır)' }]
      : []),
    ...registeredStaffMembers.map((staffMember) => ({
      value: staffMember._id,
      label: `${staffMember.personalInfo.name} ${staffMember.personalInfo.surname} - ${staffMember.corporateInfo.position}`,
    })),
  ]}
  value={corporateInfo.lineManager}
  onChange={handleLineManagerChange}
  placeholder="Xətti rəhbəri seçin"
/>
  {lineManagerError && (
    <div className="invalid-feedback">
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
        onChange={handleGrossSalaryChange} 
        required
      />

                {validationErrors.grossSalary && (
                  <div className="invalid-feedback">
                  </div>
                )}
              </div>
              <div className="mb-3">
                <select
                  id="field"
                  className={`form-select ${
                    validationErrors.field ? 'is-invalid' : ''
                  }`}
                  name="field"
                  value={corporateInfo.field}
                  onChange={handleCorporateInfoChange}
                  required
                >
                  <option value="">Sektor</option>
                  <option value="Qeyri-dövlət və qeyri-neft sektoru">Qeyri-dövlət və qeyri-neft sektoru</option>
                  <option value="Dövlət və neft sektoru">Dövlət və neft sektoru</option>
                </select>
                {validationErrors.field && (
                  <div className="invalid-feedback">
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
                  placeholderText="İşə başlama tarixi"
                  showYearDropdown
                  showMonthDropdown
                  dateFormat="MMM d, yyyy"
                />
                {validationErrors.startDate && (
                  <div className="invalid-feedback">
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="number"
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
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="number"
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
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="number"
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
            <ToastContainer />
    </div>
  );
};

export default Yeni_emekdash;