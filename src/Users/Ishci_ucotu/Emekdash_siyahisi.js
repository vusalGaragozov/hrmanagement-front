import React, { useEffect, useState, useContext, useMemo } from 'react';
import { format } from 'date-fns';
import { AuthContext } from '../Main/AuthContext';
import { useTable, useFilters } from 'react-table';
import Select from 'react-select';

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

  // Define an array to keep track of visible columns
  const [visibleColumns, setVisibleColumns] = useState([]);

  // Define the full columns array
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
      Header: 'Şöbə',
      accessor: 'corporateInfo.department',
      Filter: TextColumnFilter,
    },
    // Add more columns as needed
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

  // Options for react-select to select columns
  const columnOptions = columns.map((column) => ({
    label: column.Header,
    value: column.accessor,
  }));

  return (
    <div className="container ishci_ucotu">
      <h2>Staff Members</h2>

      {/* Use react-select for column selection */}
      <Select
        isMulti
        options={columnOptions}
        onChange={(selectedOptions) => {
          // Extract the selected columns
          const selectedColumns = selectedOptions.map((option) => option.value);
          // Update the visibleColumns state
          setVisibleColumns(selectedColumns);
        }}
        className="mb-3"
        placeholder="Select columns"
      />

      {/* Render the table */}
      <table {...getTableProps()} className="table table-striped table-bordered table-hover">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  {column.render('Header')}
                </th>
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
