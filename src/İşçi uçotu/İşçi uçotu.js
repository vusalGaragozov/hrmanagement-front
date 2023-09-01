import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddStaffMember = () => {
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    surname: '',
    fatherName: '',
    gender: '',
    birthDate: null,
    FINCode: '',
    email: '',
  });

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

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });
  };

  const handleCorporateInfoChange = (e) => {
    const { name, value } = e.target;
    setCorporateInfo({ ...corporateInfo, [name]: value });
  };

  const handleDateChange = (date, field) => {
    if (field === 'birthDate') {
      setPersonalInfo({ ...personalInfo, birthDate: date });
    } else if (field === 'startDate') {
      setCorporateInfo({ ...corporateInfo, startDate: date });
    }
  };

  const handleAddStaffMember = () => {
    // Perform the logic to add the staff member with the provided information
    // You can send the data to an API or update your state here
  };

  return (
    <div className="container mt-5">
      <h2>Add New Staff Member</h2>
      <form>
        {/* Personal Information */}
        <div className="mb-3">
          <h3>Şəxsi məlumatlar:</h3>
          <div className="row g-2">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control w-100"
                placeholder="Ad"
                name="name"
                value={personalInfo.name}
                onChange={handlePersonalInfoChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control w-100"
                placeholder="Soyad"
                name="surname"
                value={personalInfo.surname}
                onChange={handlePersonalInfoChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control w-100"
                placeholder="Ata adı"
                name="fatherName"
                value={personalInfo.fatherName}
                onChange={handlePersonalInfoChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control w-100"
                placeholder="Cins"
                name="gender"
                value={personalInfo.gender}
                onChange={handlePersonalInfoChange}
              />
            </div>
            <div className="col-md-4">
              <DatePicker
                selected={personalInfo.birthDate}
                onChange={(date) => handleDateChange(date, 'birthDate')}
                className="form-control w-100"
                placeholderText="Doğum tarixi"
                style={{ width: '100%' }} // Set the width explicitly
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control w-100"
                placeholder="FİN kod"
                name="FINCode"
                value={personalInfo.FINCode}
                onChange={handlePersonalInfoChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="email"
                className="form-control w-100"
                placeholder="E-mail"
                name="email"
                value={personalInfo.email}
                onChange={handlePersonalInfoChange}
              />
            </div>
          </div>
        </div>

        {/* Corporate Information */}
        <div className="mb-3">
          <h3>Korporativ məlumatlar:</h3>
          <div className="row g-2">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control w-100"
                placeholder="Şöbə"
                name="department"
                value={corporateInfo.department}
                onChange={handleCorporateInfoChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control w-100"
                placeholder="Vəzifə"
                name="position"
                value={corporateInfo.position}
                onChange={handleCorporateInfoChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="number"
                className="form-control w-100"
                placeholder="Əmək haqqı (gross)"
                name="grossSalary"
                value={corporateInfo.grossSalary}
                onChange={handleCorporateInfoChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control w-100"
                placeholder="Sahə (dövlət və qeyri-dövlət)"
                name="field"
                value={corporateInfo.field}
                onChange={handleCorporateInfoChange}
              />
            </div>
            <div className="col-md-4">
              <DatePicker
                selected={corporateInfo.startDate}
                onChange={(date) => handleDateChange(date, 'startDate')}
                className="form-control w-100"
                placeholderText="İşə başlama tarixi"
                style={{ width: '100%' }} // Set the width explicitly
              />
            </div>
            <div className="col-md-4">
              <input
                type="number"
                className="form-control w-100"
                placeholder="İllik məzuniyyət günləri"
                name="annualLeaveDays"
                value={corporateInfo.annualLeaveDays}
                onChange={handleCorporateInfoChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control w-100"
                placeholder="Müqavilə müddəti"
                name="contractDuration"
                value={corporateInfo.contractDuration}
                onChange={handleCorporateInfoChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control w-100"
                placeholder="Həftəlik iş saatı"
                name="weeklyWorkingHours"
                value={corporateInfo.weeklyWorkingHours}
                onChange={handleCorporateInfoChange}
              />
            </div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleAddStaffMember}>
          Add
        </button>
      </form>
    </div>
  );
};

export default AddStaffMember;
