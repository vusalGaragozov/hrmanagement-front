import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../Main/AuthContext';

const UserProfile = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [userPhoto, setUserPhoto] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      setUserId(user.id);
    }
  }, [isAuthenticated, user]);

  const handlePhotoUpload = () => {
    if (selectedFile && userId) {
      const photoName = `user_${userId}_1.jpg`;
      console.log('Selected File:', selectedFile); // Log the selected file
      console.log('Photo Name:', photoName); // Log the generated photo name

      const formData = new FormData();
      formData.append('photo', selectedFile);

      axios
        .post('http://localhost:3001/api/upload-photo', formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          console.log('Response:', response); // Log the response from the server
          if (response.status === 200) {
            setUserPhoto(`/uploads/${photoName}`);
            setShowModal(false);
          }
        })
        .catch((error) => {
          console.error('Error uploading photo:', error);
        });
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  console.log('Rendered UserProfile Component'); // Log when the component is rendered

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-2">
          <div
            className="profile-photo"
            style={{
              width: '150px',
              height: '150px',
              border: '1px solid #ccc',
              position: 'relative',
              cursor: 'pointer',
            }}
            onClick={() => setShowModal(true)}
          >
            {userPhoto ? (
              <img
                src={userPhoto}
                alt="User Profile"
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <div className="text-center" style={{ marginTop: '40%' }}>
                Upload Photo
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Profile Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePhotoUpload}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserProfile;
