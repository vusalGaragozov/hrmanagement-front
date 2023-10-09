import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import az from 'date-fns/locale/az';
import './Muracietler.css';
import { AuthContext } from '../Main/AuthContext';
import html2pdf from 'html2pdf.js';
import Select from 'react-select';
import { API_URL } from '../Other/config';
import { Skeleton } from 'antd';
import { Select as AntSelect, Space } from 'antd';


const Mezuniyyet_muracieti = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [paymentTiming, setPaymentTiming] = useState('məzuniyyətdən əvvəl');
  const [isFormValid, setIsFormValid] = useState(false);
  const [userData, setUserData] = useState(null);
  const [annualLeaveDays, setAnnualLeaveDays] = useState(null);
  const [position, setPosition] = useState(null);

  const pdfRef = useRef();
  const [generatedText, setGeneratedText] = useState({
    textForWebPage: '',
    textForPrinting: '',
  });
  const [registeredStaffMembers, setRegisteredStaffMembers] = useState([]);
  const [selectedOption, setselectedOption] = useState(null);
  const [selectedOptionsign, setselectedOptionsign] = useState(null);

  const handleSelectChange = (selectedOption) => {
    setselectedOption(selectedOption);
    // You can perform additional actions here if needed
    const selectedStaffMember = registeredStaffMembers.find(
      (staffMember) => staffMember._id === selectedOption.value
    );
  
    if (selectedStaffMember) {
      const email = selectedStaffMember.personalInfo.email;
      // Use the email for further processing or sending it to the backend
      console.log(email);
    }
  };

 const handleSelectChangesign = (selectedOptionsign) => {
   setselectedOptionsign(selectedOptionsign);
 
   // Access the selected staff member's email
   const selectedStaffMember = registeredStaffMembers.find(
     (staffMember) => staffMember._id === selectedOptionsign.value
   );
 
   if (selectedStaffMember) {
     const email = selectedStaffMember.personalInfo.email;
     // Use the email for further processing or sending it to the backend
     console.log(email);
   }
 };

  
  useEffect(() => {
    fetchRegisteredStaffMembers();
    fetchUserData();
  }, []);
  

  const fetchRegisteredStaffMembers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/registeredstaffmembers', {
        credentials: 'include', 
      });
      const data = await response.json();
      console.log('Data received from the backend:', data); // Log the data here

      setRegisteredStaffMembers(data);
    } catch (error) {
      console.error('Error fetching registered staff members:', error);
    }
  };

  const handleDownloadPdf = () => {
    const pdfOptions = {
      margin: 10,
      filename: 'mezuniyyet.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };
 
    const content = document.getElementById('pdf-content');

    if (content) {
      html2pdf()
        .set(pdfOptions)
        .from(content)
        .save()
        .then(() => {
          console.log('PDF saved successfully.');
        })
        .catch((error) => {
          console.error('Error saving PDF:', error);
        });
    }
  };



  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date > endDate) {
      setEndDate(null);
    }
  };

  const usedDays = 7;



  const handleEndDateChange = (date) => {
    if (!startDate || date >= startDate) {
      setEndDate(date);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/staffmemberstoregister', {
        credentials: 'include', // You may need to include credentials for authentication
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Staff Member Data:', data);
  
        // Set staff member data and annualLeaveDays in your component's state
        setUserData(data.staffMember);
        setAnnualLeaveDays(data.annualLeaveDays);
        setPosition(data.position);

      } else {
        // Handle errors, e.g., user not authenticated or staff member not found
        console.error('Error fetching staff member data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching staff member data:', error);
    }
  };
  
  const formatDate = (date) => {
    if (date) {
      const day = date.getDate().toString().padStart(2, '0');
      const monthNames = [
        'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
        'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
      ];
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      const month = monthNames[monthIndex];

      const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

      return `${day} ${capitalizedMonth} ${year}`;
    }
    return '';
  };

  const calculateDaysDifference = (start, end) => {
    if (!start || !end) return null;

    const startTime = start.getTime();
    const endTime = end.getTime();
    const difference = endTime - startTime;
    const daysDifference = Math.floor(difference / (1000 * 3600 * 24));

    return daysDifference;
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (
      startDate &&
      endDate &&
      paymentTiming &&
      selectedOption &&
      selectedOptionsign

    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [startDate, endDate, paymentTiming, selectedOption, selectedOptionsign]);

  const handledocshow = async () => {
    // Create an object with the data to send to the backend
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    const daysDifference = calculateDaysDifference(startDate, endDate);
    const currentDate = new Date();
    const formattedCurrentDate = formatDate(currentDate);
    const userFullName = user ? `${user.firstname} ${user.lastname}` : '';
    const selectedOptionLabel = selectedOption ? selectedOption.label : '';
    const selectedOptionsignLabel = selectedOptionsign ? selectedOptionsign.label : '';


    // HTML structure for textForWebPage
    const textForWebPage = `
    <div class="hidden-for-print" id="pdf-content">
      <div class="text-for-webpage" style="display: flex;">
        <div style="flex: 1;"></div> <!-- This div occupies the left half of the page -->
        <div style="flex: 1; text-align: left;">
          ${selectedOptionsignLabel.split('-')[0]?.trim() || ''} cənablarına, həmin şirkətdə ${position} vəzifəsində çalışan ${userFullName} tərəfindən
        </div>
      </div>
  
      <br /> <br />
      <div class="text-for-webpage">
        <div class="text-center">Ərizə</div>
      </div>
      <br />
      <div class="text-for-webpage" style="text-align: left;">
        Yazıb Sizdən xahiş edirəm ki, mənə ${formattedStartDate} tarixindən ${formattedEndDate} tarixinədək (${daysDifference} təqvim günü) məzuniyyət verəsiniz. Ödənişin ${paymentTiming} edilməsini xahiş edirəm.
      </div>
 
  
      <br /><br /><br /><br />
      <div style="display: flex; flex-direction: column; align-items: flex-start; width: 50%;">
        <div class="text-for-webpage" style="text-align: left;">
          Tarix: ${formattedCurrentDate}
        </div>
        <div class="text-for-webpage" style="text-align: left;">
          İmza:
        </div>
      </div>
    </div>
  `;
  

    // For printing, include the content without the hidden class
    const textForPrinting = `
    <style>
      @page {
        size: A4;
        margin: 0;
      }
      body {
        margin: 0;
        padding: 0;
      }
      #printable-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
      }
      .text-for-printing {
        text-align: left;
      }
      .text-for-printing:last-child {
        page-break-before: always; /* Page break before the last child */
      }
    </style>
    <div style="margin: 40mm 20mm 0; min-height: 100vh; overflow: hidden;"> <!-- Add margin to the top and sides, and set min-height -->
      <div class="text-for-webpage" style="display: flex;">
        <div style="flex: 1;"></div> <!-- This div occupies the left half of the page -->
        <div style="flex: 1; text-align: left;">
          ${selectedOptionsignLabel.split('-')[0]?.trim() || ''} cənablarına, həmin şirkətdə ${position} vəzifəsində çalışan ${userFullName} tərəfindən
        </div>
      </div>
  
      <br /> <br />
      <div class="text-for-webpage">
        <div class="text-center" style="text-align: center;">Ərizə</div> <!-- Center align "Ərizə" -->
      </div>
      <br />
      <div class="text-for-webpage" style="text-align: left;">
        Yazıb Sizdən xahiş edirəm ki, mənə ${formattedStartDate} tarixindən ${formattedEndDate} tarixinədək (${daysDifference} təqvim günü) məzuniyyət verəsiniz. Ödənişin ${paymentTiming} edilməsini xahiş edirəm.
      </div>
  
      <br /><br /><br /><br />
      <div style="display: flex; flex-direction: column; align-items: flex-start; width: 50%;">
        <div class="text-for-webpage" style="text-align: left;">
          Tarix: ${formattedCurrentDate}
        </div>
        <div class="text-for-webpage" style="text-align: left;">
          İmza:
        </div>
      </div>
    </div>
  `;
  

    setGeneratedText({ textForWebPage, textForPrinting });
  };

const handleSendDataToBackend = async () => {
  const formattedStartDate = new Date(startDate);
  const formattedEndDate = new Date(endDate);
  const selectedOptionLabel = selectedOption ? selectedOption.label : '';
  const selectedOptionsignLabel = selectedOptionsign ? selectedOptionsign.label : '';
  const userFullName = user ? `${user.firstname} ${user.lastname}` : '';

  const lineManager = registeredStaffMembers.find(
    (staffMember) => staffMember._id === selectedOption.value
  );
  const lineManagerEmail = lineManager ? lineManager.personalInfo.email : '';

  const director = registeredStaffMembers.find(
    (staffMember) => staffMember._id === selectedOptionsign.value
  );
  const directorEmail = director ? director.personalInfo.email : '';

const vacationData = {
  userEmail: user.email,
  userFullName: userFullName,
  startDate: formattedStartDate,
  endDate: formattedEndDate,
  paymentTiming,
  selectedOptionLabel,
  lineManagerEmail,
  selectedOptionsignLabel,
  directorEmail,
  status_1: 'Təsdiq gözləyir', // Add the "status" property with the default value
  status_2: 'Təsdiq gözləyir',
};
console.log(vacationData);

  try {
    // Send a POST request to the backend to save the data
    const response = await fetch('http://localhost:3001/api/submit-vacation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vacationData),
    });

    if (response.ok) {
      // Handle success, e.g., show a success message
      console.log('Vacation request saved successfully.');
      // Optionally, reset form fields or perform other actions
    } else {
      // Handle errors from the backend
      console.error('Error saving vacation request to the backend.');
      // Optionally, display an error message to the user
    }
  } catch (error) {
    // Handle network errors or other exceptions
    console.error('An error occurred while sending the request:', error);
    // Optionally, display an error message to the user
  }
};
console.log(startDate);


  return (
    <div className="container text-left muracietler">
      <div className="row">
        <div className="col-md-5">
          <main className="col-md-12">
            <div>
              <div className="border p-4 rounded mb-4">
                <div className="text-center mt-3">
                <div className="alert alert-info">
  <strong>Mövcud gün sayı:</strong>{' '}
  {annualLeaveDays ? (
    annualLeaveDays
  ) : (
    <Skeleton.Input
      style={{ width: '10px', display: 'inline-block' }}
      active={true}
    />
  )}{' '}
  gün
</div>


                  <div className="alert alert-success">
                    <strong>İstifadə olunmuş gün sayı:</strong> {usedDays} gün
                  </div>
                </div>
              </div>
<form onSubmit={handledocshow}>
  <div className='border p-4 rounded mb-4'>
    <div className="mb-3 row">
      <label className="col-md-6 col-form-label">Başlanğıc tarixi:</label>
      <div className="col-md-6">
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          dateFormat="MMM d, yyyy"
          locale={az}
          className="form-control"
        />
      </div>
    </div>
    <div className="mb-3 row">
      <label className="col-md-6 col-form-label">Bitmə tarixi:</label>
      <div className="col-md-6">
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          dateFormat="MMM d, yyyy"
          minDate={startDate}
          locale={az}
          className="form-control"
        />
      </div>
    </div>
    <div className="mb-3 row">
      <label className="col-md-6 col-form-label">Ödəniş vaxtı:</label>
      <div className="col-md-6 ">
        <div className="input-group">
        <AntSelect
  value={paymentTiming}
  onChange={(value) => setPaymentTiming(value)}
  style={{
    width: 230,
  }}
>
  <AntSelect.Option value="dərhal">Məzuniyyətdən əvvəl</AntSelect.Option>
  <AntSelect.Option value="ay sonunda">Ay sonunda</AntSelect.Option>
</AntSelect>

        </div>
      </div>
    </div>
    <div className="mb-3 row">
  <label className="col-md-6 col-form-label">Təsdiq edəcək rəhbər</label>
  <div className="col-md-6">
    <AntSelect
      options={registeredStaffMembers.map((staffMember) => ({
        value: staffMember._id,
        label: `${staffMember.personalInfo.name} ${staffMember.personalInfo.surname} - ${staffMember.corporateInfo.position}`,
      }))}
      value={selectedOption}
      onChange={handleSelectChange}
      placeholder="Rəhbəri seç"
      style={{
        width: 220,
      }}
    />
  </div>
</div>

<div className="mb-3 row">
  <label className="col-md-6 col-form-label">İmza çəkəcək rəhbər</label>
  <div className="col-md-6">
    <AntSelect
      options={registeredStaffMembers.map((staffMember) => ({
        value: staffMember._id,
        label: `${staffMember.personalInfo.name} ${staffMember.personalInfo.surname} - ${staffMember.corporateInfo.position}`,
      }))}
      value={selectedOptionsign}
      onChange={handleSelectChangesign}
      placeholder="Rəhbəri seç"
      style={{
        width: 220,
      }}
    />
  </div>
</div>
  </div>
  <div className="mb-3 row">
    <div className="col-md-12">
                    <div className="col-md-12">
                    <button
  
  className={`btn btn-primary ${isFormValid ? '' : 'disabled'}`}
  style={{ width: '100%' }}
  onClick={handleSendDataToBackend}
>
  Göndər
</button>

                  </div>
    </div>
    
  </div>
 
</form>
            </div>
          </main>
        </div>
        <div className="col-md-6">
          <div className="border rounded p-3 text-center">
            <div className="d-flex justify-content-center">
              <button
                className={`btn btn-primary ${isFormValid ? '' : 'disabled'}`}
                onClick={handledocshow}
                style={{ marginRight: '10px' }}
              >
                Ərizə yarat
              </button>
              <button
                className={`btn btn-primary ${isFormValid ? '' : 'disabled'}`}
                onClick={() => {
                  const printWindow = window.open('', '', 'width=600,height=600');
                  printWindow.document.open();
                  printWindow.document.write(`
                    <html>
                    <head>
                      <title>Print</title>
                      <style>
                        @page {
                          size: A4;
                          margin: 0;
                        }
                        body {
                          margin: 0;
                          padding: 0;
                        }
                        #printable-content {
                          display: flex;
                          flex-direction: column;
                          justify-content: center;
                          align-items: center;
                          min-height: 100vh;
                        }
                        .text-for-printing {
                          text-align: left;
                        }
                      </style>
                    </head>
                    <body>
                      <div id="printable-content">
                        ${generatedText.textForPrinting}
                      </div>
                    </body>
                    </html>
                  `);
                  printWindow.document.close();
                  printWindow.print();
                  printWindow.close();
                }}
                style={{ margin: '0 10px' }}
              >
                Çap et
              </button>
              <button
                className={`btn btn-primary ${isFormValid ? '' : 'disabled'}`}
                onClick={handleDownloadPdf}
                style={{ marginLeft: '10px' }}
              >
                Yüklə
              </button>
            </div>
            <hr style={{ margin: '20px 0', borderColor: '#6c757d' }} />
            {generatedText.textForWebPage && (
              <div className="mt-5">
                <p dangerouslySetInnerHTML={{ __html: generatedText.textForWebPage }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mezuniyyet_muracieti;
