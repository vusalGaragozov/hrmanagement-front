import React, { useEffect, useState } from 'react';
import { Table, Button, Dropdown, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker'; // Import date picker library
import 'react-datepicker/dist/react-datepicker.css'; // Import date picker styles
import axios from 'axios';

const Muracietler_siyahisi = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState([]); // Replace with your actual data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/vacation-data');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    };
    fetchData();
  }, []);


  // Implement sorting logic here
  const sortByStatus = () => {
    // Implement sorting by Status logic
  };

  const sortByEmployee = () => {
    // Implement sorting by Employee logic
  };

  const handleCreate = () => {
    // Implement create functionality
  };

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  }
  function calculateDuration(startDate, endDate) {
    const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInDays = Math.floor((end - start) / oneDay) + 1;
    return durationInDays;
  }
  
  
  return (
    <div className='muracietler'>
      <div className="d-flex align-items-center mb-3">

        <Form.Group className="mr-3m ">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="MMM d, yyyy"
            className="form-control"
            placeholderText="Start Date"
          />
        </Form.Group>
        <Form.Group className="mr-3">
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="MMM d, yyyy"
            className="form-control"
            placeholderText="End Date"
          />
        </Form.Group>
        <Button variant="primary" onClick={handleCreate}>
          Siyahı formalaşdır
        </Button>
      </div>
      <div className="d-flex align-items-center mb-3">
        <Dropdown className="mr-3">
          <Dropdown.Toggle variant="secondary">
            Əməkdaşa görə filtr
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={sortByStatus}>Ascending</Dropdown.Item>
            <Dropdown.Item onClick={sortByStatus}>Descending</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown>
          <Dropdown.Toggle variant="secondary">
            Status görə filtr
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={sortByEmployee}>Ascending</Dropdown.Item>
            <Dropdown.Item onClick={sortByEmployee}>Descending</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Əməkdaş</th>
            <th>Müraciət növü</th>
            <th>Başlama tarixi</th>
            <th>Bitmə Tarixi</th>
            <th>Müddət</th>
            <th>Xətti rəhbər</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {/* Map over data and display rows */}
          {data.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.userFullName}</td>
              <td>Məzuniyyət</td>
              <td>{formatDate(item.startDate)}</td>
              <td>{formatDate(item.endDate)}</td>
              <td>{calculateDuration(item.startDate, item.endDate)}</td>
              <td>{item.selectedOptionLabel}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Muracietler_siyahisi;
