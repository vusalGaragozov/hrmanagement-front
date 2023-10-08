import React, { useContext, useEffect, useState } from 'react';
import { Table, Button, Form, Modal, FormControl, Card } from 'react-bootstrap';
import { DatePicker, Space, Button as AntButton, Tooltip } from 'antd';
import azAZ from 'antd/lib/locale/az_AZ';
import "antd/dist/reset.css";
import axios from 'axios';
import { AuthContext } from '../Main/AuthContext';
import './Muracietler.css';
import { Alert, Steps, Popover } from 'antd';



const { RangePicker } = DatePicker;
const { Step } = Steps; // Import the Step component


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
  const [isRejected_1, setIsRejected_1] = useState(false);
  const [isRejected_2, setIsRejected_2] = useState(false);
  const [showNote, setShowNote] = useState(false);

  
  useEffect(() => {
    if (selectedItem && selectedItem.status_1 === 'Rədd edilib') {
      setIsRejected_1(true);
    } else {
      setIsRejected_1(false);
    }
  }, [selectedItem]);
  useEffect(() => {
    if (selectedItem && selectedItem.status_2 === 'Rədd edilib') {
      setIsRejected_2(true);
    } else {
      setIsRejected_2(false);
    }
  }, [selectedItem]);
  
  const isDirector = selectedItem && loggedInUserEmail === selectedItem.directorEmail;
  const isUserEmailMatch = selectedItem && loggedInUserEmail === selectedItem.userEmail;
  const hasRejectedStatusBetween = selectedItem && (selectedItem.status_1 === 'Rədd edilib' || selectedItem.status_2 === 'Rədd edilib');

  const noteText =
    isDirector && selectedItem
      ? selectedItem.status_1 === 'Təsdiq gözləyir'
        ? 'Xətti rəhbər təsdiqindən sonra təstiq/rədd edə bilərsiz.'
        : selectedItem.status_1 === 'Rədd edilib'
        ? 'Xətti rəhbər rədd etdiyinə görə sizin tərəfinizdən hər hansı addıma ehtiyac yoxdur.'
        : ''
      : '';


  const [stepsData, setStepsData] = useState([
    {
      title: <span className="steps-title">Hazırlanıb</span>,
    },
    {
      title: (
        <span className={`steps-title ${isRejected_1 ? 'rejected-title' : ''}`}>
          {selectedItem?.status_1 === 'Rədd edilib' ? 'Rədd edilib' : selectedItem?.status_1 === 'Təsdiqlənib' ? 'Təsdiqlənib' : 'Təsdiq gözləyir'}
        </span>
      ),
      description: 'Xətti rəhbərin təsdiq statusu',
    },
    {
      title: (
        <span className={`steps-title ${isRejected_2 ? 'rejected-title' : ''}`}>
          {selectedItem?.status_2 === 'Rədd edilib' ? 'Rədd edilib' : selectedItem?.status_2 === 'Təsdiqlənib' ? 'Təsdiqlənib' : 'Təsdiq gözləyir'}
        </span>
      ),
      description: 'Direktorun təsdiq statusu',
    },
  ]);
  
  
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
  
  useEffect(() => {
    if (selectedItem) {
      const updatedStepsData = [...stepsData];
      
      // Update the first step based on status_1
      if (selectedItem.status_1 === 'Rədd edilib') {
        updatedStepsData[1].title = <span className={`steps-title rejected-title`}>Rədd edilib</span>;
      } else if (selectedItem.status_1 === 'Təsdiqlənib') {
        updatedStepsData[1].title = <span className="steps-title">Təsdiqlənib</span>;
      } else {
        updatedStepsData[1].title = <span className="steps-title">Təsdiq gözləyir</span>;
      }
  
      // Update the second step based on status_2
      if (selectedItem.status_2 === 'Rədd edilib') {
        updatedStepsData[2].title = <span className={`steps-title rejected-title`}>Rədd edilib</span>;
      } else if (selectedItem.status_2 === 'Təsdiqlənib') {
        updatedStepsData[2].title = <span className="steps-title">Təsdiqlənib</span>;
      } else {
        updatedStepsData[2].title = <span className="steps-title">Təsdiq gözləyir</span>;
      }
  
      setStepsData(updatedStepsData);
    }
  }, [selectedItem]);
  
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
        <Form.Group>
          <RangePicker locale={azAZ}
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </Form.Group>
       
        <Tooltip title="Tooltip Text">
          <AntButton type="primary" onClick={handleCreate}>
            Siyahı formalaşdır
          </AntButton>
        </Tooltip>
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
            <th>Xətti rəhbər təsdiqi</th>
            <th>Direktor təsdiqi</th>
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
        <Steps current={1}>
  <Step title="Yaradılıb" status="finish" />
  <Step
    title={selectedItem?.status_1 || 'Təsdiq gözləyir'}
    status={
      selectedItem?.status_1 === 'Rədd edilib'
        ? 'error'
        : selectedItem?.status_1 === 'Təsdiqlənib'
        ? 'finish'
        : 'wait'
    }
    description="Xətti rəhbərin təsdiq statusu"
  />
  <Step
    title={selectedItem?.status_2 || 'Təsdiq gözləyir'}
    status={
      selectedItem?.status_2 === 'Rədd edilib'
        ? 'error'
        : selectedItem?.status_2 === 'Təsdiqlənib'
        ? 'finish'
        : 'wait'
    }
    description="Direktorun təsdiq statusu"
  />
</Steps>
<br/>
{isUserEmailMatch && hasRejectedStatusBetween && (
        <div>
          <Alert message="Sizin müraciətiniz rədd edilibdir!" type="error"/> 
        </div>
      )}
{isDirector && noteText && (
        <div>
          <Alert message={noteText} type="error"/> 
        </div>
      )}
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
        <Button
          type="primary"
          onClick={handleEdit}
          disabled={selectedItem && selectedItem.status_1 !== 'Təsdiq gözləyir'}
        >
          Şərh əlavə et
        </Button>
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
        <Button type="button" className='btn btn-secondary' onClick={closeModal}>
          Bağla
        </Button>
        {selectedItem && (
          <>
            {loggedInUserEmail === selectedItem.lineManagerEmail && (
              <Button
                type="button"
                className='btn btn-success'
                onClick={handleStatusConfirmed_1}
                disabled={selectedItem && selectedItem.status_1 !== 'Təsdiq gözləyir'}
              >
                Təsdiq et
              </Button>
            )}
 {loggedInUserEmail === selectedItem.directorEmail && (
  
      <Button
        type="button"
        className='btn btn-success'
        onClick={handleStatusConfirmed_2}
        disabled={
          selectedItem &&
          (selectedItem.status_2 !== 'Təsdiq gözləyir' || selectedItem.status_1 !== 'Təsdiqlənib')
        }
      >
        Təsdiq et
      </Button>
)}



            {loggedInUserEmail === selectedItem.lineManagerEmail && (
              <Button
                type="button"
                className="btn btn-danger"
                onClick={handleStatusRejected_1}
                disabled={selectedItem && selectedItem.status_1 !== 'Təsdiq gözləyir'}
              >
                Rədd et
              </Button>
            )}
            {loggedInUserEmail === selectedItem.directorEmail && (
              <Button
                type="button"
                className="btn btn-danger"
                onClick={handleStatusRejected_2}
                disabled={
                  selectedItem &&
                  (selectedItem.status_2 !== 'Təsdiq gözləyir' || selectedItem.status_1 !== 'Təsdiqlənib')
                }              >
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



