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
  import DefaultColumnFilter from './DefaultColumnFilter'; // You need to create this filter component


  const StaffTable = () => {
    const { user } = useContext(AuthContext);

    const [selectedStaff, setSelectedStaff] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal
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


      const formatDate = (dateString) => {
        if (!dateString || !isValid(parseISO(dateString))) {
          // Handle invalid date format or empty date string
          return 'Invalid Date';
        }
        return format(new Date(dateString), 'MMM d, yyyy', { locale: az });
      };
      
      

    const [selectedGender, setSelectedGender] = useState('');

    
// Helper function to format a number with commas
function formatNumber(number) {
  if (number === null || number === undefined) {
    return '';
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Helper function to remove commas and convert the formatted number back to its original format
function unformatNumber(formattedNumber) {
  return formattedNumber.replace(/,/g, '');
}

const DateColumnFilter = ({ column }) => {
  return (
    <input
      type="date"
      onChange={(e) => {
        const parsedDate = e.target.value ? format(new Date(e.target.value), 'yyyy-MM-dd') : undefined;
        column.setFilter(parsedDate);
      }}
      value={column.filterValue || ''}
      placeholder={`Filter ${column.Header}`}
      className="form-control"
    />
  );
};
    

    const handleRowClick = (staffMember) => {
      console.log('Clicked staff member:', staffMember); // Debugging statement
    
      setSelectedStaff(staffMember);
    
      // Make a deep copy of selectedStaff and set it as the initial state for editedFields
      setEditedFields(JSON.parse(JSON.stringify(staffMember)));
    
      setIsModalOpen(true); // Open the modal
    };
    

    const handleModalClose = () => {
      setIsModalOpen(false); // Close the modal
    };
    const isFieldEmpty = (fieldValue) => {
      return fieldValue === '' || fieldValue === null;
    };
    const [clearedFields, setClearedFields] = useState({}); // Initialize cleared fields

    const handleFieldChange = (updatedValue, field, category) => {
      if (isFieldEmpty(updatedValue)) {
        // Show a Bootstrap notification only if the field is fully deleted
        setClearedFields({
          ...clearedFields,
          [field]: 'Boş qala bilməz.',
        });
      } else {
        // Clear the notification for this field
        const { [field]: clearedField, ...rest } = clearedFields;
        setClearedFields(rest);
      }
    
      // Check if the field being updated is 'startDate'
      if (field === 'startDate' && updatedValue) {
        // Format the date and update it in editedFields
        updatedValue = format(new Date(updatedValue), 'yyyy-MM-dd');
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
          // Add other nested fields here
        },
        corporateInfo: {
          // Add fields and initial error messages for corporateInfo here
        },
      };
    
      // Check if required fields are filled
      if (!data.personalInfo.name) {
        errors.personalInfo.name = 'Name is required.';
      }
    
      if (!data.personalInfo.surname) {
        errors.personalInfo.surname = 'Surname is required.';
      }
    
      // Add more validation checks as needed for other fields
    
      setValidationErrors(errors);
    
      // Check if there are any validation errors
      return Object.values(errors).every((category) =>
        Object.values(category).every((error) => !error)
      );
    };
    
    
    
    const handleUpdate = () => {
      if (!selectedStaff || !selectedStaff._id) {
        console.error('Selected staff member is missing ID');
        return;
      }
    
      // Add your validation logic here
      if (!validateData(editedFields)) {
        // Handle validation error, e.g., display an error message
        console.error('Validation failed');
        return;
      }
      const staffId = selectedStaff._id; // Extract the ID
      const formattedBirthDate = formatDate(editedFields.personalInfo.birthDate);
      const formattedStartDate = formatDate(editedFields.corporateInfo.startDate); // Format the startDate
    
      // Validate corporateInfo.startDate before attempting to update
      if (
        editedFields.corporateInfo &&
        typeof editedFields.corporateInfo.startDate === 'string' &&
        !isNaN(Date.parse(editedFields.corporateInfo.startDate))
      ) {
        // The startDate is a valid date string
        const updatedFields = {
          ...editedFields,
          personalInfo: {
            ...editedFields.personalInfo,
            birthDate: formattedBirthDate,
          },
          corporateInfo: {
            ...editedFields.corporateInfo,
            startDate: formattedStartDate, // Update the startDate
          },
        };
    
        // Send the edited fields to the backend
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
            // Update the selected staff member with the response from the backend
            setSelectedStaff(updatedStaffMember);
            // Close the modal
            setIsModalOpen(false);
          })
          .catch((error) => {
            console.error('Error updating staff member:', error);
            // Log the response content for debugging
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
      // Fetch staff members from your backend
      fetch('http://localhost:3001/api/staffmembers')
        .then((response) => response.json())
        .then((data) => {
          // Filter the staff members added by the currently logged-in user
          const userStaffMembers = data.filter(
            (staffMember) => staffMember.addedBy_email === user.email
          );
          setStaffMembers(userStaffMembers);
          setFilteredStaffMembers(userStaffMembers);
        })
        .catch((error) => console.error('Error fetching staff members:', error));
    }, [user]);

    // Define an array to keep track of visible columns
    const [visibleColumns, setVisibleColumns] = useState([
      'personalInfo.name',
      'personalInfo.surname',
      'corporateInfo.position',
      'corporateInfo.grossSalary',
      'personalInfo.FINCode',
    ]);

    // Define the full columns array with user-friendly labels
    const columns = [
      {
        Header: 'Ad',
        accessor: 'personalInfo.name',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Soyad',
        accessor: 'personalInfo.surname',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Ata adı',
        accessor: 'personalInfo.fatherName',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Cins',
        accessor: 'personalInfo.gender',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Doğum tarixi',
        accessor: 'personalInfo.birthDate',
        Cell: ({ value }) => formatDate(value),
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'FIN kod',
        accessor: 'personalInfo.FINCode',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Email',
        accessor: 'personalInfo.email',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Vəzifə',
        accessor: 'corporateInfo.position',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Əmək haqqı',
        accessor: 'corporateInfo.grossSalary',
        Filter: DefaultColumnFilter,
        Cell: ({ cell: { value } }) => {
          // Check if the value is a valid number
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
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Başlama tarixi',
        accessor: 'corporateInfo.startDate',
        Cell: ({ value }) => formatDate(value),
        Filter: DefaultColumnFilter,
      },
      
      {
        Header: 'İllik məzuniyyət gün sayı',
        accessor: 'corporateInfo.annualLeaveDays',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Müqavilə müddəti',
        accessor: 'corporateInfo.contractDuration',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Həftəlik iş saatı',
        accessor: 'corporateInfo.weeklyWorkingHours',
        Filter: DefaultColumnFilter,
      },
    ];

    // Create a dynamic columns array based on visibleColumns
    const dynamicColumns = useMemo(() => {
      return columns.filter((column) => visibleColumns.includes(column.accessor));
    }, [visibleColumns]);

    // Create an instance of the table
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

    // Handle changes in the filters
    useEffect(() => {
      const filterValues = state.filters;
    
      // Apply filters to your data
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
    

    // Options for react-select to select columns with user-friendly labels
    const columnOptions = columns.map((column) => ({
      label: column.Header, // Display the user-friendly label
      value: column.accessor, // Use the accessor as the value
    }));

    // Determine whether to show the 'Number' column
    const showNumberColumn = dynamicColumns.length > 0;

    // Modal component
    const renderModal = () => {
      return (
        <Modal show={isModalOpen} onHide={handleModalClose} centered>
          <Modal.Header closeButton className='Modal-font'>
            <Modal.Title className='Modal-font'>İşçi məlumatların dəyişdirilməsi</Modal.Title>
          </Modal.Header>
          <Modal.Body className='Modal-font'>
            {/* Display staff member details here */}
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
  <input
    className={`form-control ${validationErrors.personalInfo.gender ? 'is-invalid' : ''}`}
    value={editedFields.personalInfo && editedFields.personalInfo.gender ? editedFields.personalInfo.gender : ''}
    onChange={(e) => handleFieldChange(e.target.value, 'gender', 'personalInfo')}
                  />{validationErrors.personalInfo.gender && (
                    <div className="invalid-feedback">{validationErrors.personalInfo.gender}</div>
                  )}
  {selectedGender === '' && ( // Check if no gender is selected
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
                    className={`form-control ${validationErrors.personalInfo.email ? 'is-invalid' : ''}`}
                    value={editedFields.personalInfo && editedFields.personalInfo.email ? editedFields.personalInfo.email : ''}
                    onChange={(e) => handleFieldChange(e.target.value, 'email', 'personalInfo')}
                  />{validationErrors.personalInfo.email && (
                    <div className="invalid-feedback">{validationErrors.personalInfo.email}</div>
                  )}
                  {clearedFields.email && (
                    <div className="alert alert-danger mt-2 small-notification">{clearedFields.email}</div>
                  )}
                </div>
                <div className="form-group">
                  <label>Şöbə:</label>
                  <input
                    type="text"
                    className={`form-control ${validationErrors.corporateInfo.department ? 'is-invalid' : ''}`}
                    value={editedFields.corporateInfo && editedFields.corporateInfo.department ? editedFields.corporateInfo.department : ''}
                    onChange={(e) => handleFieldChange(e.target.value, 'department', 'corporateInfo')}
                  />{validationErrors.corporateInfo.department && (
                    <div className="invalid-feedback">{validationErrors.corporateInfo.department}</div>
                  )}
                  {clearedFields.department && (
                    <div className="alert alert-danger mt-2 small-notification">{clearedFields.department}</div>
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
    onChange={(e) => handleFieldChange(unformatNumber(e.target.value), 'grossSalary', 'corporateInfo')}
  />
  {validationErrors.personalInfo.grossSalary && (
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
  dateFormat="yyyy-MM-dd" // Corrected date format
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
                    type="text"
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
                    type="text"
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
                    type="text"
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
                {/* Add more editable fields */}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Bağla
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
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
            table="table-to-xls" // ID of the table to export
            filename="staff-members" // File name for the exported file
            sheet="staff-members"
            buttonText="Excel fayl endir"
          />
        </div>

        {/* Use react-select for column selection */}
        <Select
          isMulti
          options={columnOptions}
          value={visibleColumns.map((column) => ({
            label: columns.find((col) => col.accessor === column).Header,
            value: column,
          }))}
          onChange={(selectedOptions) => {
            // Extract the selected columns
            const selectedColumns = selectedOptions.map((option) => option.value);
            // Update the visibleColumns state
            setVisibleColumns(selectedColumns);
          }}
          className="mb-3"
          placeholder="Məlumat əlavə et..."
        />

        {/* Render the table */}
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
                  style={{ cursor: 'pointer' }} // Add cursor pointer for clickable rows
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

        {/* Modal component */}
        {isModalOpen && renderModal()}
      </div>
    );
  };

  export default StaffTable;
