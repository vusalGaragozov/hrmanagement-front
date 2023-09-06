import React, { useEffect, useState, useContext, useMemo } from 'react';
import { format } from 'date-fns';
import { AuthContext } from '../Main/AuthContext';
import { useTable, useFilters } from 'react-table';

const StaffTable = () => {
  const { user } = useContext(AuthContext);

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd-MM-yyyy');
  };

  const NumberColumnFilter = ({ column }) => {
    return (
      <input
        type="number"
        onChange={(e) => {
          column.setFilter(e.target.value || undefined);
        }}
        value={column.filter || ''}
        placeholder={`Filter ${column.Header}`}
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
      />
    );
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
      />
    );
  };

  const [staffMembers, setStaffMembers] = useState([]);
  const [filteredStaffMembers, setFilteredStaffMembers] = useState([]);

  useEffect(() => {
    // Make a GET request to fetch staff members
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


  const columns = [
    {
      Header: '#',
      accessor: 'id', // Replace with your unique identifier for staff members
    },
    {
      Header: 'Ad',
      accessor: 'personalInfo.name',
      Filter: TextColumnFilter, // Add filter to this column
    },
    {
      Header: 'Soyad',
      accessor: 'personalInfo.surname',
      Filter: TextColumnFilter, // Add filter to this column
    },
    {
      Header: 'Ata adı',
      accessor: 'personalInfo.fatherName',
      Filter: TextColumnFilter, // Add filter to this column
    },
    {
      Header: 'Cins',
      accessor: 'personalInfo.gender',
      Filter: TextColumnFilter, // Add filter to this column
    },
    {
      Header: 'Doğum tarixi',
      accessor: 'personalInfo.birthDate',
      Cell: ({ value }) => formatDate(value), // Format date
      Filter: DateColumnFilter, // Add filter to this column
    },
    {
      Header: 'FIN kod',
      accessor: 'personalInfo.FINCode',
      Filter: TextColumnFilter, // Add filter to this column
    },
    {
      Header: 'Email',
      accessor: 'personalInfo.email',
      Filter: TextColumnFilter, // Add filter to this column
    },
    {
      Header: 'Şöbə',
      accessor: 'corporateInfo.department',
      Filter: TextColumnFilter, // Add filter to this column
    },
    {
      Header: 'Vəzifə',
      accessor: 'corporateInfo.position',
      Filter: TextColumnFilter, // Add filter to this column
    },
    {
      Header: 'Əmək haqqı',
      accessor: 'corporateInfo.grossSalary',
      Filter: NumberColumnFilter, // Add filter to this column
    },
    {
      Header: 'Sahə',
      accessor: 'corporateInfo.field',
      Filter: TextColumnFilter, // Add filter to this column
    },
    {
      Header: 'İşə başlama tarixi',
      accessor: 'corporateInfo.startDate',
      Cell: ({ value }) => formatDate(value), // Format date
      Filter: DateColumnFilter, // Add filter to this column
    },
    {
      Header: 'İllik məzuniyyət norması',
      accessor: 'corporateInfo.annualLeaveDays',
      Filter: NumberColumnFilter, // Add filter to this column
    },
    {
      Header: 'Müqavilə müddəti',
      accessor: 'corporateInfo.contractDuration',
      Filter: TextColumnFilter, // Add filter to this column
    },
    {
      Header: 'Həftəlik iş saatı',
      accessor: 'corporateInfo.weeklyWorkingHours',
      Filter: NumberColumnFilter, // Add filter to this column
    },
    // Add more columns as needed
  ];


  // Memoize the columns configuration
  const columnsMemo = useMemo(() => columns, []);

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
      columns: columnsMemo,
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

  return (
    <div className="container">
      <h2>Staff Members</h2>
      <table {...getTableProps()} className="table table-striped">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StaffTable;

