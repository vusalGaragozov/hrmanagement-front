import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import az from 'date-fns/locale/az';
import './Muracietler.css';
import { AuthContext } from '../Main/AuthContext';
import html2pdf from 'html2pdf.js';
import Select from 'react-select';



const Mezuniyyet_muracieti = () => {
  
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [paymentTiming, setPaymentTiming] = useState('immediate');
  const [isFormValid, setIsFormValid] = useState(false);
  const [userData, setUserData] = useState(null);

  const pdfRef = useRef();
  const [generatedText, setGeneratedText] = useState({
    textForWebPage: '',
    textForPrinting: '',
  });
  const [registeredStaffMembers, setRegisteredStaffMembers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptionsign, setSelectedOptionsign] = useState(null);
  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    // You can perform additional actions here if needed
  };
  const handleSelectChangesign = (selectedOptionsign) => {
    setSelectedOptionsign(selectedOptionsign);
    // You can perform additional actions here if needed
  };
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: 185, // Set the width to 100% to make it responsive
      margin: 'auto', // Center horizontally
      marginBottom: '20px',
      marginTop: '-35px',
      marginLeft: '206px',
  
      // Use media query to adjust styles for smaller screens
      '@media (max-width: 768px)': {
        width: '100%', // Adjust the width for smaller screens
        marginTop: '-20px', // Adjust margin-top for smaller screens
      },
    }),
  };
  
  useEffect(() => {
    fetchRegisteredStaffMembers();
  }, []);
  

  const fetchRegisteredStaffMembers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/registeredstaffmembers', {
        credentials: 'include', 
      });
      const data = await response.json();

      setRegisteredStaffMembers(data);
    } catch (error) {
      console.error('Error fetching registered staff members:', error);
    }
  };
  const handleDownloadPdf = () => {
    console.log('handleDownloadPdf called');
    const pdfOptions = {
      margin: 10,
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };
 

    const content = document.getElementById('pdf-content');
    console.log('pdfOptions:', pdfOptions);
    console.log('content:', content);

    if (content) {
      // Use html2pdf to generate and save the PDF
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
  useEffect(() => {
    // Wait for the content to be rendered
    const contentElement = document.getElementById('pdf-content');
  
    if (contentElement) {
      // Content is available, proceed with PDF generation
      handleDownloadPdf();
    }
  }, []); 
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date > endDate) {
      setEndDate(null);
    }
  };

  const availableDays = 20;
  const usedDays = 7;

  const handleEndDateChange = (date) => {
    if (!startDate || date >= startDate) {
      setEndDate(date);
    }
  };
  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/user', {
        credentials: 'include', // You may need to include credentials for authentication
      });
      if (response.ok) {
        const data = await response.json();
        console.log('User Data:', data); // Log the user data

        setUserData(data.user); // Set user data in your component's state
      } else {
        // Handle errors, e.g., user not authenticated
        console.error('Error fetching user data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
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

  const handleSave = () => {

  };
  
  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    const daysDifference = calculateDaysDifference(startDate, endDate);

    const currentDate = new Date();
    const formattedCurrentDate = formatDate(currentDate);
    const userFullName = user ? `${user.firstname} ${user.lastname}` : '';
const selectedOptionLabel = selectedOption ? selectedOption.label : '';
const selectedOptionsignLabel = selectedOptionsign ? selectedOptionsign.label : '';


    // For the web page, hide the content with a CSS class
    const textForWebPage = `
      <div class="hidden-for-print" id="pdf-content" >
        <div class="text-for-webpage">
        ${selectedOptionsignLabel.split('-')[0]?.trim() || ''} cənablarına, həmin şirkətdə ${selectedOptionsignLabel.split('-')[1]?.trim() || ''} vəzifəsində çalışan ${userFullName} tərəfindən
        </div>
        <br /> <br />
        <div class="text-left">
          Ərizə
        </div>
        <br />
        <div class="text-for-webpage">
          Yazıb Sizdən xahiş edirəm ki, mənə ${formattedStartDate} tarixindən ${formattedEndDate} tarixinədək (${daysDifference} təqvim günü) məzuniyyət verəsiniz.
        </div>
        <div class="text-for-webpage">
        Ödənişin ${paymentTiming} edilməsini xahiş edirəm.
      </div>
        <br /><br /><br /><br />
        <div class="text-for-webpage">
          Tarix: ${formattedCurrentDate}
        </div>
        <div class="text-for-webpage">
          İmza:
        </div>
      </div>
    `;

    // For printing, include the content without the hidden class
    const textForPrinting = `
      <div>
        <div class="text-for-printing">
          Şirkətin rəhbəri, ${selectedOptionsign ? selectedOptionsign.label.split('-')[0].trim() : ''} cənablarına, həmin şirkətdə Maliyyə meneceri vəzifəsində çalışan Vüsal Qaragözov t
        </div>
        <br /> <br />
        <div class="text-center">
          Ərizə
        </div>
        <br />
        <div class="text-for-printing">
          Yazıb Sizdən xahiş edirəm ki, mənə ${formattedStartDate} tarixindən ${formattedEndDate} tarixinədək (${daysDifference} təqvim günü) məzuniyyət verəsiniz.
        </div>
        <br /><br /><br /><br />
        <div class="text-for-printing">
          Tarix: ${formattedCurrentDate}
        </div>
        <div class="text-for-printing">
          İmza:
        </div>
      </div>
    `;

    setGeneratedText({ textForWebPage, textForPrinting });
  };

  return (
    <div className="container text-left muracietler">
      <div className="row">
        <div className="col-md-5">
          <main className="col-md-12">
            <div>
              <div className="border p-4 rounded mb-4">
                <div className="text-center mt-3">
                  <div className="alert alert-info">
                    <strong>Mövcud gün sayı:</strong> {availableDays} gün
                  </div>
                  <div className="alert alert-success">
                    <strong>İstifadə olunmuş gün sayı:</strong> {usedDays} gün
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
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
                      <select
                        value={paymentTiming}
                        onChange={(e) => setPaymentTiming(e.target.value)}
                        className="form-control form-select"
                      >
                        <option value="dərhal">Məzuniyyətdən əvvəl</option>
                        <option value="ay sonunda">Ay sonunda</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mb-3 row">
                <label className="col-md-6 col-form-label">Təstiq edəcək rəhbər</label>
  <Select
    options={registeredStaffMembers.map((staffMember) => ({
    value: staffMember._id,
    label: `${staffMember.personalInfo.name} ${staffMember.personalInfo.surname} - ${staffMember.corporateInfo.position}`,
    }))}
    value={selectedOption}
    onChange={handleSelectChange}
    placeholder="Rəhbəri seç"
    styles={customStyles} 
  />
</div>
<div className="mb-3 row">
                <label className="col-md-6 col-form-label">İmza çəkəcək rəhbər</label>
  <Select
    options={registeredStaffMembers.map((staffMember) => ({
    value: staffMember._id,
    label: `${staffMember.personalInfo.name} ${staffMember.personalInfo.surname} - ${staffMember.corporateInfo.position}`,
    }))}
    value={selectedOptionsign}
    onChange={handleSelectChangesign}
    placeholder="Rəhbəri seç"
    styles={customStyles} 
  />
</div>
                <div className="mb-3 row">
                  <div className="col-md-12">
                    <button
                      type="submit"
                      className={`btn btn-primary ${isFormValid ? '' : 'disabled'}`}
                      style={{ width: '100%' }}
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
                onClick={handleSubmit}
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
