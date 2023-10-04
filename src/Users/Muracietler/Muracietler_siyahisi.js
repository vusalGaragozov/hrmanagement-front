import React, { useContext, useEffect, useState } from 'react';
import { Table, Button, Form, Modal, FormControl, Card } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { AuthContext } from '../Main/AuthContext';
import './Muracietler.css';
import { Steps, Popover } from 'antd';

const customDot = (dot, { status, index }) => (
  <Popover content={<span>Step {index} status: {status}</span>}>
    {dot}
  </Popover>
);

const Muracietler_siyahisi = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemStatus, setSelectedItemStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const { loggedInUserEmail, loggedInUserFullName } = useContext(AuthContext);
  const [isRejected, setIsRejected] = useState(false);
  
  useEffect(() => {
    if (selectedItem && selectedItem.status1 === 'Rədd edilib') {
      setIsRejected(true);
    } else {
      setIsRejected(false);
    }
  }, [selectedItem]);
  
  const [stepsData, setStepsData] = useState([
    {
      title: <span className="steps-title">Hazırlanıb</span>,
    },
    {
      title: <span className="steps-title">Xətti rəhbər təstiqi</span>,
    },
    {
      title: <span className="steps-title">Direktor təstiqi</span>,
    },
    {
      title: (
        <span className={`steps-title ${isRejected ? 'rejected-title' : ''}`}>
          {selectedItem?.status1 === 'Rədd edilib' ? 'Rədd edilib' : 'Təsdiqlənib'}
        </span>
      ),
    },
  ]);
  
  useEffect(() => {
    if (selectedItem && selectedItem.status1 === 'Rədd edilib') {
      setStepsData((prevStepsData) => {
        const updatedStepsData = [...prevStepsData];
        updatedStepsData[2].title = (
          <span className={`steps-title rejected-title`}>Rədd edilib</span>
        );
        return updatedStepsData;
      });
    } else {
      setStepsData((prevStepsData) => {
        const updatedStepsData = [...prevStepsData];
        updatedStepsData[2].title = <span className="steps-title">Təsdiqlənib</span>;
        return updatedStepsData;
      });
    }
  }, [selectedItem]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/vacation-data');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
  
  const openModal = (item) => {
    setSelectedItem(item);
    setSelectedItemStatus(item.status);
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };
  
  const handleCreate = () => {
    // Implement create functionality
  };
  
  const handleEdit = async () => {
    if (comment) {
      try {
        const response = await axios.post(`http://localhost:3001/api/add-comment/${selectedItem._id}`, {
          commentedUserFullName: loggedInUserFullName,
          comment,
        });
        if (response.status === 201) {
          const newComment = { commentedUserFullName: loggedInUserFullName, comment };
          setComments([...comments, newComment]);
          setComment('');
        } else {
          console.error('Failed to add comment:', response.data.error);
        }
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };
  
  const handleStatusConfirmed_1 = async () => {
    try {
      const response = await axios.put(`http://localhost:3001/api/update-status/${selectedItem._id}`, {
        newStatus_1: 'Təsdiqlənib',
      });
  
      if (response.status === 200) {
        const updatedData = data.map((item) => {
          if (item._id === selectedItem._id) {
            return { ...item, status_1: 'Təsdiqlənib' };
          }
          return item;
        });
        setData(updatedData);
        closeModal();
      } else {
        console.error('Failed to update status:', response.data.error);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  
  const handleStatusConfirmed_2 = async () => {
    try {
      const response = await axios.put(`http://localhost:3001/api/update-status/${selectedItem._id}`, {
        newStatus_2: 'Təsdiqlənib',
      });
  
      if (response.status === 200) {
        const updatedData = data.map((item) => {
          if (item._id === selectedItem._id) {
            return { ...item, status_2: 'Təsdiqlənib' };
          }
          return item;
        });
        setData(updatedData);
        closeModal();
      } else {
        console.error('Failed to update status:', response.data.error);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  const handleStatusRejected_1 = async () => {
    try {
      const response = await axios.put(`http://localhost:3001/api/update-status/${selectedItem._id}`, {
        newStatus_1: 'Rədd edilib',
      });
  
      if (response.status === 200) {
        const updatedData = data.map((item) => {
          if (item._id === selectedItem._id) {
            return { ...item, status_1: 'Rədd edilib' };
          }
          return item;
        });
        setData(updatedData);
        closeModal();
      } else {
        console.error('Failed to update status:', response.data.error);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleStatusRejected_2 = async () => {
    try {
      const response = await axios.put(`http://localhost:3001/api/update-status/${selectedItem._id}`, {
        newStatus_2: 'Rədd edilib',
      });
  
      if (response.status === 200) {
        const updatedData = data.map((item) => {
          if (item._id === selectedItem._id) {
            return { ...item, status_2: 'Rədd edilib' };
          }
          return item;
        });
        setData(updatedData);
        closeModal();
      } else {
        console.error('Failed to update status:', response.data.error);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  
  const fetchComments = async (vacationId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/get-comments/${vacationId}`);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
  
  useEffect(() => {
    if (showModal && selectedItem) {
      fetchComments(selectedItem._id);
    }
  }, [showModal, selectedItem]);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  };
  
  function calculateDuration(startDate, endDate) {
    const oneDay = 24 * 60 * 60 * 1000;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInDays = Math.floor((end - start) / oneDay) + 1;
    return durationInDays;
  };
  
  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  return (
    <div className='muracietler'>
      <div className="d-flex align-items-center mb-3">
        <Form.Group className="mr-3">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="MMM d, yyyy"
            className="form-control"
            placeholderText="Başlama tarixi"
          />
        </Form.Group>
        <Form.Group className="mr-3">
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="MMM d, yyyy"
            className="form-control"
            placeholderText="Bitmə tarixi"
          />
        </Form.Group>
        <Button variant="primary" onClick={handleCreate}>
          Siyahı formalaşdır
        </Button>
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
            <th>Xətti rəhbər təstiqi</th>
            <th>Direktor təstiqi</th>
          </tr>
        </thead>
        <tbody>
        {data.map((item, index) => (
  ((item.lineManagerEmail === loggedInUserEmail || item.directorEmail === loggedInUserEmail) || item.userEmail === loggedInUserEmail) && (
    <tr key={index} onClick={() => openModal(item)}>
                <td>{index + 1}</td>
                <td>{item.userFullName}</td>
                <td>Məzuniyyət</td>
                <td>{formatDate(item.startDate)}</td>
                <td>{formatDate(item.endDate)}</td>
                <td>{calculateDuration(item.startDate, item.endDate)}</td>
                <td>{item.selectedOptionLabel}</td>
                <td>{item.status_1}</td>
                <td>{item.status_2}</td>
               
              </tr>
            )
          ))}
        </tbody>
      </Table>
      <Modal show={showModal} className='modal-lg' onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title className='steps-title'>Məzuniyyət vərəqi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Steps
            current={selectedItem?.status_1 === 'Təsdiqlənib' ? 2 : 1}
            progressDot={customDot}
            className={`custom-steps ${isRejected ? 'rejected' : ''}`}
            items={stepsData}
          />
          <br />
          <div className='rounded'>
            <table className="table table-bordered rounded-table">
              <tbody>
                <tr>
                  <th>Əməkdaş:</th>
                  <td>{selectedItem && selectedItem.userFullName}</td>
                </tr>
                <tr>
                  <th>Başlanğıc tarixi:</th>
                  <td>{selectedItem && formatDate(selectedItem.startDate)}</td>
                </tr>
                <tr>
                  <th>Bitmə tarixi:</th>
                  <td>{selectedItem && formatDate(selectedItem.endDate)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Form.Group>
            <FormControl
              as="textarea"
              rows={3}
              value={comment}
              placeholder='Şərh əlavə edin...'
              onChange={handleCommentChange}
            />
          </Form.Group>
          <br />
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleEdit}
            disabled={selectedItem && selectedItem.status_1 !== 'Təsdiq gözləyir'}
          >
            Şərh əlavə et
          </button>
          <br />
          <br />
          {comments.map((commentItem, commentIndex) => (
            <div
              key={commentIndex}
              className="comment-container"
              style={{
                border: `1px solid #ccc`,
                borderRadius: '10px',
                marginBottom: '10px',
                padding: '10px',
                backgroundColor: '#F1EFEF',
                width: commentItem.comment.length > 50 ? '450px' : '300px'
              }}
            >
              {commentItem.commentedUserFullName && commentItem.comment && (
                <>
                  <span className="fw-bold">{commentItem.commentedUserFullName}: </span>
                  <span className="text-muted">{commentItem.comment}</span>
                </>
              )}
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer className='steps-title'>
  <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>
    Bağla
  </button>
  {selectedItem && (
    <>
      {loggedInUserEmail === selectedItem.lineManagerEmail && (
        <Button
          variant="success"
          onClick={handleStatusConfirmed_1}
          disabled={selectedItem && selectedItem.status_1 !== 'Təsdiq gözləyir'}
        >
          Təsdiq et
        </Button>
      )}
      {loggedInUserEmail === selectedItem.directorEmail && (
        <Button
          variant="success"
          onClick={handleStatusConfirmed_2}
          disabled={selectedItem && selectedItem.status_2 !== 'Təsdiq gözləyir'}
        >
          Təsdiq et
        </Button>
      )}
      {loggedInUserEmail === selectedItem.lineManagerEmail && (
        <Button
          variant="danger"
          onClick={handleStatusRejected_1}
          disabled={selectedItem && selectedItem.status_1 !== 'Təsdiq gözləyir'}
        >
          Rədd et
        </Button>
      )}
      {loggedInUserEmail === selectedItem.directorEmail && (
        <Button
          variant="danger"
          onClick={handleStatusRejected_2}
          disabled={selectedItem && selectedItem.status_2 !== 'Təsdiq gözləyir'}
        >
          Rədd et
        </Button>
      )}
    </>
  )}
</Modal.Footer>
      </Modal>
    </div>
  );
};

export default Muracietler_siyahisi;
