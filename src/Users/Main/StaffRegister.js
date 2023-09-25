import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../Other/config.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const StaffRegister = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [staffmember, setstaffmember] = useState(null); 

  
  useEffect(() => {
    const fetchData = async () => {
      // Check if the email is not empty before making the API request
      if (email.trim() !== '') {
        try {
          const response = await axios.get(`${API_URL}/api/staffregistrationpage`, {
            params: {
              email,
            },
          });
  
          const data = response.data.staffmembers[0]; // Assuming you expect a single staff member
          console.log('API Response Data:', data); // Log the API response
  
          setstaffmember(data);
          console.log('Staff Member State:', data); 
          console.log('Temporary Password:', data?.temporaryPassword); // Log temporaryPassword
  
          // You can continue populating other fields here
        } catch (error) {
          setError('Error fetching staff member data');
        }
      }
    };
  
    fetchData();
  }, [email]);
  
  
  const handleRegistration = async (e) => {
    e.preventDefault();

    try {
      // Check if the email is found in the database
      if (!staffmember) {
        toast.error('Bu email-i şirkətiniz qeydiyyatdan keçirməyib!', {
          position: toast.POSITION.TOP_CENTER,
        });
        return;
      }

      // Check if the entered temporary password matches the one from staff member data
      if (temporaryPassword !== staffmember.temporaryPassword) {
        toast.error('Köhnə şifrə düz deyil!', {
          position: toast.POSITION.TOP_CENTER,
        });
        return;
      }

      // Create an object with the user data to be sent to /register
      const userData = {
        email,
        password: newPassword,
        // Match fields from staff member data to user schema
        firstname: staffmember.personalInfo.name,
        lastname: staffmember.personalInfo.surname,
        email: staffmember.personalInfo.email,
        phoneNumberPrefix: staffmember.personalInfo.phoneNumberPrefix,
        phoneNumberDigits: staffmember.personalInfo.phoneNumberDigits,
        organization: staffmember.addedBy_company,
        position: staffmember.corporateInfo.position,
        // Add other mappings here
      };

      const response = await axios.post(`${API_URL}/register`, userData);
      console.log('Registration response:', response);
      // Handle the response and navigation as needed
      if (response.status === 201) {
        toast.success('Qeydiyyatdan uğurla keçdiniz!', {
          position: toast.POSITION.TOP_CENTER,
        });

        setTimeout(() => {
          navigate('/login'); // Navigate to success page or any other route
        }, 2000); // Adjust the delay time as needed
      } else {
        setError('Error registering user');
        toast.error('Xəta baş vermişdir!', {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      setError('Error registering user');
      // You can handle specific error cases here if needed
      if (error.response.status === 404) {
        // Email not found in the database
        toast.error('Bu email-i şirkətiniz qeydiyyatdan keçirməyib!', {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        // Other error cases
        toast.error('Xəta baş vermişdir!', {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
  };
  

  return (
    <div className="container main">
      <div staffmember="row">
        <div className="col-6 mx-auto border border rounded p-4">
          <form>
            <div className="form-group row">
              <label htmlFor="inputEmail3" className="col-sm-3 col-form-label">Email</label>
              <div className="col-sm-9">
                <input
                  type="email"
                  className="form-control"
                  id="inputEmail3"
                  placeholder="şirkətin Sizi qeydiyyata aldığı email ünvan"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Allow the user to input email
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputTemporaryPassword" className="col-sm-3 col-form-label">Köhnə şifrə</label>
              <div className="col-sm-9">
                <input
                  type="password"
                  className="form-control"
                  id="inputTemporaryPassword"
                  placeholder="email-də göndərilmiş şifrə"
                  value={temporaryPassword}
                  onChange={(e) => setTemporaryPassword(e.target.value)} // Allow the user to input temporary password
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputNewPassword" className="col-sm-3 col-form-label">Yeni şifrə</label>
              <div className="col-sm-9">
                <input
                  type="password"
                  className="form-control"
                  id="inputNewPassword"
                  placeholder="yeni şifrə daxil edin"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group row">
              <div className="col-sm-12">
                <button type="submit" className="btn btn-primary" onClick={handleRegistration} 
                  style={{ width: '100%' }}>
                  Qeydiyyatı tamamla
                </button>
              </div>
            </div>
          </form>
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
      </div>
      <ToastContainer />
    </div>
    
  );
};

export default StaffRegister;
