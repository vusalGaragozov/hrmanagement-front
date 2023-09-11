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
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal
  const [editedFields, setEditedFields] = useState({
    personalInfo: {
      name: '',
      surname: '',
      // Add other nested fields here
    },});

    const formatDate = (dateString) => {
      if (!dateString || !isValid(parseISO(dateString))) {
        // Handle invalid date format or empty date string
        return 'Invalid Date';
      }
      return format(new Date(dateString), 'dd-MM-yyyy');
    };

  const TextColumnFilter = ({ column }) => {
    return (
      <input
        type="text"
        onChange={(e) => {
          column.setFilter(e.target.value || undefined);
        }}
        value={column.filter || ''}
        placeholder={`Filter ${column.Header}`}
        className="form-control"
      />
    );
  };

  const DateColumnFilter = ({ column }) => {
    return (
      <input
        type="date"
        onChange={(e) => {
          column.setFilter(e.target.value || undefined);
        }}
        value={column.filter || ''}
        placeholder={`Filter ${column.Header}`}
        className="form-control"
      />
    );
  };

  const handleRowClick = (staffMember) => {
    console.log('Clicked staff member:', staffMember); // Debugging statement

    setSelectedStaff(staffMember);
    setEditedFields(staffMember); // Initialize edited fields with current data
    setIsModalOpen(true); // Open the modal
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleFieldChange = (e, field, category) => {
    const { value } = e.target;
    setEditedFields((prevFields) => ({
      ...prevFields,
      [category]: {
        ...prevFields[category],
        [field]: value,
      },
    }));
  };
  
  
  const handleUpdate = () => {
    if (!selectedStaff || !selectedStaff._id) {
      console.error('Selected staff member is missing ID');
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
      Filter: TextColumnFilter,
    },
    {
      Header: 'Soyad',
      accessor: 'personalInfo.surname',
      Filter: TextColumnFilter,
    },
    {
      Header: 'Ata adı',
      accessor: 'personalInfo.fatherName',
      Filter: TextColumnFilter,
    },
    {
      Header: 'Cins',
      accessor: 'personalInfo.gender',
      Filter: TextColumnFilter,
    },
    {
      Header: 'Doğum tarixi',
      accessor: 'personalInfo.birthDate',
      Cell: ({ value }) => formatDate(value),
      Filter: DateColumnFilter,
    },
    {
      Header: 'FIN kod',
      accessor: 'personalInfo.FINCode',
      Filter: TextColumnFilter,
    },
    {
      Header: 'Email',
      accessor: 'personalInfo.email',
      Filter: TextColumnFilter,
    },
    {
      Header: 'Vəzifə',
      accessor: 'corporateInfo.position',
      Filter: TextColumnFilter,
    },
    {
      Header: 'Əmək haqqı',
      accessor: 'corporateInfo.grossSalary',
      Filter: TextColumnFilter,
    },
    // ... (Other column definitions)
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
          <Modal.Title className='Modal-font'>İşçi məlumatları</Modal.Title>
        </Modal.Header>
        <Modal.Body className='Modal-font'>
          {/* Display staff member details here */}
          {selectedStaff && (
            <div>
  <p className='modal-header'>
  <span className='bold-text'>Ad:</span> {selectedStaff.personalInfo.name}
</p>
<p className='modal-header'>
  <span className='bold-text'>Soyad:</span> {selectedStaff.personalInfo.surname}
</p>


              <hr />
              <h5>Dəyişiklik et:</h5>
              <div className="form-group">
                <label>Ad:</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedFields.personalInfo.name || ''}
                  onChange={(e) => handleFieldChange(e, 'name','personalInfo')}
                />
              </div>
              <div className="form-group">
                <label>Soyad:</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedFields.personalInfo.surname || ''}
                  onChange={(e) => handleFieldChange(e, 'surname','personalInfo')}
                />
              </div>
              <div className="form-group">
                <label>Ata adı:</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedFields.personalInfo.fatherName || ''}
                  onChange={(e) => handleFieldChange(e, 'fatherName','personalInfo')}
                />
              </div>
              <div className="form-group">
                <label>Cins:</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedFields.personalInfo.gender || ''}
                  onChange={(e) => handleFieldChange(e, 'gender','personalInfo')}
                />
              </div>
              <div className="form-group">
  <label>Doğum tarixi:</label>
  <div>
  <DatePicker
    selected={editedFields.personalInfo.birthDate ? new Date(editedFields.personalInfo.birthDate) : null}
    onChange={(date) => handleFieldChange(date, 'birthDate', 'personalInfo')}
    locale={az}
                  placeholderText="Doğum tarixi"
                  showYearDropdown
                  yearDropdownItemNumber={50}
                  showMonthDropdown
                  dateFormat="MMM d, yyyy"
                  minDate={new Date('1958-01-01')}
                  maxDate={new Date('2005-12-31')}
    className="form-control"
   
  />
  </div>
</div>
              <div className="form-group">
                <label>FİN kod:</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedFields.personalInfo.FINCode || ''}
                  onChange={(e) => handleFieldChange(e, 'FINCode','personalInfo')}
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedFields.personalInfo.email || ''}
                  onChange={(e) => handleFieldChange(e, 'email','personalInfo')}
                />
              </div>
              <div className="form-group">
                <label>Şöbə:</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedFields.corporateInfo.department || ''}
                  onChange={(e) => handleFieldChange(e, 'department','corporateInfo')}
                />
              </div>
              <div className="form-group">
                <label>Vəzifə:</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedFields.corporateInfo.position || ''}
                  onChange={(e) => handleFieldChange(e, 'position','corporateInfo')}
                />
              </div>
              <div className="form-group">
                <label>Əmək haqqı:</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedFields.corporateInfo.grossSalary || ''}
                  onChange={(e) => handleFieldChange(e, 'grossSalary','corporateInfo')}
                />
              </div>
              <div className="form-group">
                <label>Sahə:</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedFields.corporateInfo.field || ''}
                  onChange={(e) => handleFieldChange(e, 'field','corporateInfo')}
                />
              </div>
              <div className="form-group">
  <label>İşə başlama tarixi:</label>
  <div>
  <DatePicker
    selected={editedFields.corporateInfo.startDate ? new Date(editedFields.corporateInfo.startDate) : null}
    onChange={(date) => handleFieldChange(date, 'startDate', 'corporateInfo')}
    dateFormat="MMM d, yyyy"
    className="form-control"
    placeholderText="İşə başlama tarixi"
  /></div>
</div>
              <div className="form-group">
                <label>İllik məzuniyyət gün sayı:</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedFields.corporateInfo.annualLeaveDays || ''}
                  onChange={(e) => handleFieldChange(e, 'annualLeaveDays','corporateInfo')}
                />
              </div>
              <div className="form-group">
                <label>Müqavilə müddəti (ayla):</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedFields.corporateInfo.contractDuration || ''}
                  onChange={(e) => handleFieldChange(e, 'contractDuration','corporateInfo')}
                />
              </div>
              <div className="form-group">
                <label>Həftəlik iş saatı:</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedFields.corporateInfo.weeklyWorkingHours || ''}
                  onChange={(e) => handleFieldChange(e, 'weeklyWorkingHours','corporateInfo')}
                />
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
