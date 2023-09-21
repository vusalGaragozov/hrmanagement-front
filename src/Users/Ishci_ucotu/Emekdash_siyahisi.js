  import React, { useEffect, useState, useContext, useMemo } from 'react';
  import { format, isValid, parseISO } from 'date-fns'; 
  import { AuthContext } from '../Main/AuthContext';
  import { useTable, useFilters } from 'react-table';
  import Select from 'react-select';
  import DatePicker from 'react-datepicker';
  import 'react-datepicker/dist/react-datepicker.css';
  import az from 'date-fns/locale/az';
  import ReactHTMLTableToExcel from 'react-html-table-to-excel';
  import Modal from 'react-bootstrap/Modal';
  import Button from 'react-bootstrap/Button';

  const StaffTable = () => {
    const { user } = useContext(AuthContext);

    const [selectedStaff, setSelectedStaff] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [editedFields, setEditedFields] = useState({
      personalInfo: {
        name: '',
        surname: '',
        // Add other nested fields here
      },});

      const [validationErrors, setValidationErrors] = useState({
        personalInfo: {
          name: '',
          surname: '',
          // Add other nested fields here
        },
        corporateInfo: {
          // Add fields and initial error messages for corporateInfo here
        },
      });
      const [filterMenusVisible, setFilterMenusVisible] = useState({});
      const formatDate = (dateString, dateFormat = 'dd-MM-yyyy') => {
        if (!dateString || !isValid(parseISO(dateString))) {
          // Handle invalid date format or empty date string
          return 'Invalid Date';
        }
        return format(new Date(dateString), dateFormat, { locale: az });
      };
      
    const [selectedGender, setSelectedGender] = useState('');

function formatNumber(number) {
  if (number === null || number === undefined) {
    return '';
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function unformatNumber(formattedNumber) {
  return formattedNumber.replace(/,/g, '');
}

 const [isButtonEnabled, setIsButtonEnabled] = useState(true); 
 const [isEmailValid, setIsEmailValid] = useState(true);

const currentDate = new Date();
const startBirthDate = new Date();
const emailFormatRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
let emailValue = '';
startBirthDate.setFullYear(currentDate.getFullYear() - 65);
const isValidEmail = emailFormatRegex.test(emailValue);
const endBirthDate = new Date();
endBirthDate.setFullYear(currentDate.getFullYear() - 18);

    const handleRowClick = (staffMember) => {
      console.log('Clicked staff member:', staffMember); 
      setSelectedStaff(staffMember);
    
      setEditedFields(JSON.parse(JSON.stringify(staffMember)));
    
      setIsModalOpen(true); 
    };
    const handleModalClose = () => {
      setIsModalOpen(false); 
    };
    const isFieldEmpty = (fieldValue) => {
      return fieldValue === '' || fieldValue === null;
    };
    const [clearedFields, setClearedFields] = useState({});

    const handleFieldChange = (updatedValue, field, category) => {
      if (isFieldEmpty(updatedValue)) {
        setClearedFields({
          ...clearedFields,
          [field]: 'Boş qala bilməz.',
        });
      } else {
        const { [field]: clearedField, ...rest } = clearedFields;
        setClearedFields(rest);
      }
    
      if (field === 'startDate' && updatedValue) {
        updatedValue = format(new Date(updatedValue), 'yyyy-MM-dd');
      }
      let emailValue;

      if (field === 'email') {
        const emailValue = updatedValue;
        const isValidEmail = emailFormatRegex.test(emailValue);
        setIsEmailValid(isValidEmail); // Update email validation state
    
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          personalInfo: {
            ...prevErrors.personalInfo,
            email: isValidEmail ? '' : 'Email formatı yanlışdır!',
          },
      }));
    }
      setEditedFields((prevFields) => ({
        ...prevFields,
        [category]: {
          ...prevFields[category],
          [field]: updatedValue,
        },
      }));
    };
    const validateData = (data) => {
      const errors = {
        personalInfo: {
          name: '',
          surname: '',
        },
        corporateInfo: {
        },
      };
    
      if (!data.personalInfo.name) {
        errors.personalInfo.name = 'Name is required.';
      }
    
      if (!data.personalInfo.surname) {
        errors.personalInfo.surname = 'Surname is required.';
      }

      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        personalInfo: {
          ...prevErrors.personalInfo,
          email: isValidEmail ? '' : 'Email formatı yanlışdır!',
        },}));
        handleFieldChange(emailValue, 'email', 'personalInfo');
      return Object.values(errors).every((category) =>
        Object.values(category).every((error) => !error)
      );
    };
    
    const handleUpdate = () => {
      if (!selectedStaff || !selectedStaff._id) {
        console.error('Selected staff member is missing ID');
        return;
      }
    
      if (!validateData(editedFields, emailValue)) {
        console.error('Validation failed');
        return;
      }
      const staffId = selectedStaff._id; 
      const formattedBirthDate = formatDate(editedFields.personalInfo.birthDate);
      const formattedStartDate = formatDate(editedFields.corporateInfo.startDate); 
    
      if (
        editedFields.corporateInfo &&
        typeof editedFields.corporateInfo.startDate === 'string' &&
        !isNaN(Date.parse(editedFields.corporateInfo.startDate))
      ) {
        const updatedFields = {
          ...editedFields,
          personalInfo: {
            ...editedFields.personalInfo,
            birthDate: formattedBirthDate,
          },
          corporateInfo: {
            ...editedFields.corporateInfo,
            startDate: formattedStartDate, 
          },
        };
        fetch(`http://localhost:3001/api/staffmembers/${staffId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedFields),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((updatedStaffMember) => {
            console.log('Response from backend:', updatedStaffMember);
            setSelectedStaff(updatedStaffMember);
            setIsModalOpen(false);
          })
          .catch((error) => {
            console.error('Error updating staff member:', error);
            error.response.text().then((text) => {
              console.error('Response content:', text);
            });
          });
      } else {
        console.error('Invalid startDate format');
      }
    };
    const [staffMembers, setStaffMembers] = useState([]);
    const [filteredStaffMembers, setFilteredStaffMembers] = useState([]);

    useEffect(() => {
      fetch('http://localhost:3001/api/staffmembers')
        .then((response) => response.json())
        .then((data) => {
          const userStaffMembers = data.filter(
            (staffMember) => staffMember.addedBy_email === user.email
          );
          setStaffMembers(userStaffMembers);
          setFilteredStaffMembers(userStaffMembers);
        })
        .catch((error) => console.error('Error fetching staff members:', error));
    }, [user]);

    const [visibleColumns, setVisibleColumns] = useState([
      'personalInfo.name',
      'personalInfo.surname',
      'corporateInfo.position',
      'corporateInfo.grossSalary',
      'personalInfo.FINCode',
    ]);

    const columns = [
      {
        Header: 'Ad',
        accessor: 'personalInfo.name',
      },
      {
        Header: 'Soyad',
        accessor: 'personalInfo.surname',
      },
      {
        Header: 'Ata adı',
        accessor: 'personalInfo.fatherName',
      },
      {
        Header: 'Cins',
        accessor: 'personalInfo.gender',
      },
      {
        Header: 'Doğum tarixi',
        accessor: 'personalInfo.birthDate',
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: 'FIN kod',
        accessor: 'personalInfo.FINCode',
      },
      {
        Header: 'Email',
        accessor: 'personalInfo.email',
      },
      {
        Header: 'Telefon nömrəsi',
        accessor: 'personalInfo.phoneNumber',
      },
      {
        Header: 'Vəzifə',
        accessor: 'corporateInfo.position',
      },
      {
        Header: 'Əmək haqqı',
        accessor: 'corporateInfo.grossSalary',
        Cell: ({ cell: { value } }) => {
          const formattedValue = parseFloat(value);
          if (!isNaN(formattedValue)) {
            return formattedValue.toLocaleString('en-US');
          }
          return value;
        },
      },
      
      {
        Header: 'Sahə',
        accessor: 'corporateInfo.field',
      },
      {
        Header: 'Başlama tarixi',
        accessor: 'corporateInfo.startDate',
        Cell: ({ value }) => formatDate(value),
      },
      
      {
        Header: 'İllik məzuniyyət gün sayı',
        accessor: 'corporateInfo.annualLeaveDays',
      },
      {
        Header: 'Müqavilə müddəti',
        accessor: 'corporateInfo.contractDuration',
      },
      {
        Header: 'Həftəlik iş saatı',
        accessor: 'corporateInfo.weeklyWorkingHours',
      },
    ];

    const dynamicColumns = useMemo(() => {
      return columns.filter((column) => visibleColumns.includes(column.accessor));
    }, [visibleColumns]);

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
      state,
      setFilter,
    } = useTable(
      {
        columns: dynamicColumns,
        data: filteredStaffMembers,
      },
      useFilters
    );

    useEffect(() => {
      // Check if all validation errors are empty and email is valid
      const isEmailValid = !validationErrors.personalInfo.email;
      const allErrorsEmpty = Object.values(validationErrors).every((category) =>
        Object.values(category).every((error) => !error)
      );
    
      // Update isButtonEnabled based on email validation and other validation errors
      setIsButtonEnabled(isEmailValid && allErrorsEmpty);
    }, [validationErrors]);
    useEffect(() => {
      const filterValues = state.filters;
    
      let filteredData = [...staffMembers];
      filterValues.forEach((filter) => {
        const { id, value } = filter;
        if (value) {
          filteredData = filteredData.filter((row) => {
            const rowValue = row.values[id];
            return String(rowValue).toLowerCase().includes(String(value).toLowerCase());
          });
        }
      });
    
      setFilteredStaffMembers(filteredData);
    }, [state.filters, staffMembers]);
    const columnOptions = columns.map((column) => ({
      label: column.Header, 
      value: column.accessor, 
    }));

    const showNumberColumn = dynamicColumns.length > 0;

    const renderModal = () => {
      return (
        <Modal show={isModalOpen} onHide={handleModalClose} centered>
          <Modal.Header closeButton className='Modal-font'>
            <Modal.Title className='Modal-font'>İşçi məlumatların dəyişdirilməsi</Modal.Title>
          </Modal.Header>
          <Modal.Body className='Modal-font'>
            {selectedStaff && (
              <div>
<div className="name-surname-block">
  <p className="modal-header">
    <span className="bold-text">Ad:</span> {selectedStaff.personalInfo.name}
  </p>
  <p className="modal-header">
    <span className="bold-text">Soyad:</span> {selectedStaff.personalInfo.surname}
  </p>
</div>
                <hr />
                <div className="form-group">
    <label>Ad:</label>
    <input
  type="text"
  className={`form-control ${validationErrors.personalInfo.name ? 'is-invalid' : ''}`}
  value={editedFields.personalInfo && editedFields.personalInfo.name ? editedFields.personalInfo.name : ''}
  onChange={(e) => handleFieldChange(e.target.value, 'name', 'personalInfo')}
/>

    {validationErrors.personalInfo.name && (
      <div className="invalid-feedback">{validationErrors.personalInfo.name}</div>
    )}
    {clearedFields.name && (
      <div className="alert alert-danger mt-2 small-notification">{clearedFields.name}</div>
    )}
  </div>

                <div className="form-group">
                  <label>Soyad:</label>
                  <input
                    type="text"
                    className={`form-control ${validationErrors.personalInfo.surname ? 'is-invalid' : ''}`}
  value={editedFields.personalInfo && editedFields.personalInfo.surname ? editedFields.personalInfo.surname : ''}
  onChange={(e) => handleFieldChange(e.target.value, 'surname', 'personalInfo')}
                  />
                    {validationErrors.personalInfo.name && (
      <div className="invalid-feedback">{validationErrors.personalInfo.surname}</div>
    )}
    {clearedFields.surname && (
      <div className="alert alert-danger mt-2 small-notification">{clearedFields.surname}</div>
    )}
                </div>
                <div className="form-group">
                  <label>Ata adı:</label>
                  <input
                    type="text"
                    className={`form-control ${validationErrors.personalInfo.fatherName ? 'is-invalid' : ''}`}
                    value={editedFields.personalInfo && editedFields.personalInfo.fatherName ? editedFields.personalInfo.fatherName : ''}
                    onChange={(e) => handleFieldChange(e.target.value, 'fatherName', 'personalInfo')}
                  />{validationErrors.personalInfo.fatherName && (
                    <div className="invalid-feedback">{validationErrors.personalInfo.fatherName}</div>
                  )}
                  {clearedFields.fatherName && (
                    <div className="alert alert-danger mt-2 small-notification">{clearedFields.fatherName}</div>
                  )}
                </div>
                <div className="form-group">
  <label>Cins:</label>
  <select
    className={`form-control ${validationErrors.personalInfo.gender ? 'is-invalid' : ''}`}
    value={editedFields.personalInfo && editedFields.personalInfo.gender ? editedFields.personalInfo.gender : ''}
    onChange={(e) => handleFieldChange(e.target.value, 'gender', 'personalInfo')}
  >
    <option value="">Select Gender</option>
    <option value="Kişi">Kişi</option>
    <option value="Qadın">Qadın</option>
  </select>
  {selectedGender === '' && (
    <div className="invalid-feedback">Cins seçimi boş qala bilməz.</div>
  )}
  {validationErrors.personalInfo.gender && (
    <div className="invalid-feedback">{validationErrors.personalInfo.gender}</div>
  )}
  {clearedFields.gender && (
    <div className="alert alert-danger mt-2 small-notification">{clearedFields.gender}</div>
  )}
</div>

                <div className="form-group">
    <label>Doğum tarixi:</label>
    <div>
    <DatePicker
  selected={editedFields.personalInfo.birthDate ? new Date(editedFields.personalInfo.birthDate) : null}
  onChange={(date) => handleFieldChange(
    date ? format(date, 'yyyy-MM-dd') : null,
    'birthDate',
    'personalInfo'
  )}
  locale={az}
  dateFormat="yyyy-MM-dd" 
  className={`form-control ${validationErrors.personalInfo.birthDate ? 'is-invalid' : ''}`}
  placeholderText="Doğum tarixi"
  showYearDropdown
  showMonthDropdown
  minDate={startBirthDate}
  maxDate={endBirthDate}
  yearDropdownItemNumber={100}
/>

{validationErrors.personalInfo.birthDate && (
      <div className="invalid-feedback">{validationErrors.personalInfo.birthDate}</div>
    )}
    {clearedFields.birthDate && (
      <div className="alert alert-danger mt-2 small-notification">{clearedFields.birthDate}</div>
    )}
    </div>
  </div>
                <div className="form-group">
                  <label>FİN kod:</label>
                  <input
                    type="text"
                    className={`form-control ${validationErrors.personalInfo.FINCode ? 'is-invalid' : ''}`}
                    value={editedFields.personalInfo && editedFields.personalInfo.FINCode ? editedFields.personalInfo.FINCode : ''}
                    onChange={(e) => handleFieldChange(e.target.value, 'FINCode', 'personalInfo')}
                  />{validationErrors.personalInfo.FINCode && (
                    <div className="invalid-feedback">{validationErrors.personalInfo.FINCode}</div>
                  )}
                  {clearedFields.FINCode && (
                    <div className="alert alert-danger mt-2 small-notification">{clearedFields.FINCode}</div>
                  )}
                </div>
                <div className="form-group">
  <label>Email:</label>
  <input
    type="text"
    className={`form-control ${
      validationErrors.personalInfo.email ? 'is-invalid' : ''
    }`}
    value={
      editedFields.personalInfo && editedFields.personalInfo.email
        ? editedFields.personalInfo.email
        : ''
    }
    onChange={(e) => {
      const emailValue = e.target.value;
      const emailFormatRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      const isValidEmail = emailFormatRegex.test(emailValue);

      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        personalInfo: {
          ...prevErrors.personalInfo,
          email: isValidEmail ? '' : 'Email formatı yanlışdır!',
        },
      }));

      handleFieldChange(emailValue, 'email', 'personalInfo');
    }}
  />
  {validationErrors.personalInfo.email && (
    <div className="invalid-feedback">{validationErrors.personalInfo.email}</div>
  )}
  {clearedFields.email && (
    <div className="alert alert-danger mt-2 small-notification">{clearedFields.email}</div>
  )}
</div>
                <div className="form-group">
                  <label>Xətti rəhbər:</label>
                  <input
                    type="text"
                    className={`form-control ${validationErrors.corporateInfo.lineManager ? 'is-invalid' : ''}`}
                    value={editedFields.corporateInfo && editedFields.corporateInfo.lineManager ? editedFields.corporateInfo.lineManager : ''}
                    onChange={(e) => handleFieldChange(e.target.value, 'lineManager', 'corporateInfo')}
                  />{validationErrors.corporateInfo.lineManager && (
                    <div className="invalid-feedback">{validationErrors.corporateInfo.lineManager}</div>
                  )}
                  {clearedFields.lineManager && (
                    <div className="alert alert-danger mt-2 small-notification">{clearedFields.lineManager}</div>
                  )}
                </div>
                <div className="form-group">
                  <label>Telefon nömrəsi:</label>
                  <input
                    type="number"
                    className={`form-control ${validationErrors.personalInfo.phoneNumber ? 'is-invalid' : ''}`}
                    value={editedFields.personalInfo && editedFields.personalInfo.phoneNumber ? editedFields.personalInfo.phoneNumber : ''}
                    onChange={(e) => handleFieldChange(e.target.value, 'phoneNumber', 'personalInfo')}
                  />{validationErrors.personalInfo.phoneNumber && (
                    <div className="invalid-feedback">{validationErrors.personalInfo.phoneNumber}</div>
                  )}
                  {clearedFields.phoneNumber && (
                    <div className="alert alert-danger mt-2 small-notification">{clearedFields.phoneNumber}</div>
                  )}
                </div>
                <div className="form-group">
                  <label>Vəzifə:</label>
                  <input
                    type="text"
                    className={`form-control ${validationErrors.corporateInfo.position ? 'is-invalid' : ''}`}
                    value={editedFields.corporateInfo && editedFields.corporateInfo.position ? editedFields.corporateInfo.position : ''}
                    onChange={(e) => handleFieldChange(e.target.value, 'position', 'corporateInfo')}
                  />{validationErrors.corporateInfo.position && (
                    <div className="invalid-feedback">{validationErrors.corporateInfo.position}</div>
                  )}
                  {clearedFields.position && (
                    <div className="alert alert-danger mt-2 small-notification">{clearedFields.position}</div>
                  )}
                </div>
                <div className="form-group">
  <label>Əmək haqqı:</label>
  <input
    type="text"
    className={`form-control ${validationErrors.corporateInfo.grossSalary ? 'is-invalid' : ''}`}
    value={formatNumber(editedFields.corporateInfo && editedFields.corporateInfo.grossSalary)}
    onChange={(e) => {
      let input = e.target.value;
      input = input.replace(/[^0-9]/g, '');
      if (input.length > 5) {
        input = input.substr(0, 5);
      }
      handleFieldChange(unformatNumber(input), 'grossSalary', 'corporateInfo');
    }}
  />
  {validationErrors.corporateInfo.grossSalary && (
    <div className="invalid-feedback">{validationErrors.corporateInfo.grossSalary}</div>
  )}
  {clearedFields.grossSalary && (
    <div className="alert alert-danger mt-2 small-notification">{clearedFields.grossSalary}</div>
  )}
</div>
                <div className="form-group">
                  <label>Sahə:</label>
                  <input
                    type="text"
                    className={`form-control ${validationErrors.corporateInfo.field ? 'is-invalid' : ''}`}
                    value={editedFields.corporateInfo && editedFields.corporateInfo.field ? editedFields.corporateInfo.field : ''}
                    onChange={(e) => handleFieldChange(e.target.value, 'field', 'corporateInfo')}
                  />{validationErrors.personalInfo.field && (
                    <div className="invalid-feedback">{validationErrors.corporateInfo.field}</div>
                  )}
                  {clearedFields.field && (
                    <div className="alert alert-danger mt-2 small-notification">{clearedFields.field}</div>
                  )}
                </div>
                <div className="form-group">
    <label>İşə başlama tarixi:</label>
    <div>
    <DatePicker
  selected={editedFields.corporateInfo.startDate ? new Date(editedFields.corporateInfo.startDate) : null}
  onChange={(date) => handleFieldChange(
    date ? format(date, 'yyyy-MM-dd') : null,
    'startDate',
    'corporateInfo'
  )}
  locale={az}
  dateFormat="yyyy-MM-dd" 
  className={`form-control ${validationErrors.corporateInfo.startDate ? 'is-invalid' : ''}`}
  placeholderText="İşə başlama tarixi"
/>

    {validationErrors.personalInfo.field && (
                    <div className="invalid-feedback">{validationErrors.corporateInfo.startDate}</div>
                  )}
                  {clearedFields.startDate && (
                    <div className="alert alert-danger mt-2 small-notification">{clearedFields.startDate}</div>
                  )}</div>
  </div>
                <div className="form-group">
                  <label>İllik məzuniyyət gün sayı:</label>
                  <input
                    type="number"
                    className={`form-control ${validationErrors.corporateInfo.annualLeaveDays ? 'is-invalid' : ''}`}
                    value={editedFields.corporateInfo && editedFields.corporateInfo.annualLeaveDays ? editedFields.corporateInfo.annualLeaveDays : ''}
                    onChange={(e) => handleFieldChange(e.target.value, 'annualLeaveDays', 'corporateInfo')}
                  />{validationErrors.personalInfo.field && (
                    <div className="invalid-feedback">{validationErrors.corporateInfo.annualLeaveDays}</div>
                  )}
                  {clearedFields.annualLeaveDays && (
                    <div className="alert alert-danger mt-2 small-notification">{clearedFields.annualLeaveDays}</div>
                  )}
                </div>
                <div className="form-group">
                  <label>Müqavilə müddəti (ayla):</label>
                  <input
                    type="number"
                    className={`form-control ${validationErrors.corporateInfo.contractDuration ? 'is-invalid' : ''}`}
                    value={editedFields.corporateInfo && editedFields.corporateInfo.contractDuration ? editedFields.corporateInfo.contractDuration : ''}
                    onChange={(e) => handleFieldChange(e.target.value, 'contractDuration', 'corporateInfo')}
                  />  {validationErrors.corporateInfo.contractDuration && (
                    <div className="invalid-feedback">{validationErrors.corporateInfo.contractDuration}</div>
                  )}
                  {clearedFields.contractDuration && (
                    <div className="alert alert-danger mt-2 small-notification">{clearedFields.contractDuration}</div>
                  )}
                </div>
                <div className="form-group">
                  <label>Həftəlik iş saatı:</label>
                  <input
                    type="number"
                    className={`form-control ${validationErrors.corporateInfo.weeklyWorkingHours ? 'is-invalid' : ''}`}
                    value={editedFields.corporateInfo && editedFields.corporateInfo.weeklyWorkingHours ? editedFields.corporateInfo.weeklyWorkingHours : ''}
                    onChange={(e) => handleFieldChange(e.target.value, 'weeklyWorkingHours', 'corporateInfo')}
                  />{validationErrors.corporateInfo.weeklyWorkingHours && (
                    <div className="invalid-feedback">{validationErrors.corporateInfo.weeklyWorkingHours}</div>
                  )}
                  {clearedFields.weeklyWorkingHours && (
                    <div className="alert alert-danger mt-2 small-notification">{clearedFields.weeklyWorkingHours}</div>
                  )}
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Bağla
            </Button>
            <Button variant="primary" onClick={handleUpdate} disabled={!isButtonEnabled}>
              Əlavə et
            </Button>
          </Modal.Footer>
        </Modal>
      );
    };

    return (
      <div className="container ishci_ucotu">
        <div className="header">
          <h2 className="page-title">İşçi heyyəti</h2>

          <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="btn btn-primary"
            table="table-to-xls" 
            filename="staff-members" 
            sheet="staff-members"
            buttonText="Excel fayl endir"
          />
        </div>
        <Select
          isMulti
          options={columnOptions}
          value={visibleColumns.map((column) => ({
            label: columns.find((col) => col.accessor === column).Header,
            value: column,
          }))}
          onChange={(selectedOptions) => {
            const selectedColumns = selectedOptions.map((option) => option.value);
            setVisibleColumns(selectedColumns);
          }}
          className="mb-3"
          placeholder="Məlumat əlavə et..."
        />
        <table
          {...getTableProps()}
          id="table-to-xls"
          className="table table-striped table-bordered table-hover"
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {showNumberColumn && (
                  <th
                    key="number"
                    style={{ whiteSpace: 'nowrap', textAlign: 'center', width: '50px' }}
                  >
                    Nömrə
                  </th>
                )}
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, index) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  onClick={() => handleRowClick(row.original)}
                  style={{ cursor: 'pointer' }} 
                >
                  {showNumberColumn && (
                    <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                      {index + 1}
                    </td>
                  )}
                  {row.cells.map((cell) => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        {isModalOpen && renderModal()}
      </div>
    );
  };

  export default StaffTable;
