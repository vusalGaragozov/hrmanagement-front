import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import az from 'date-fns/locale/az';
import './Muracietler.css';
import { AuthContext } from '../Main/AuthContext';
import mammoth from 'mammoth';


const Mezuniyyet_muracieti = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [paymentTiming, setPaymentTiming] = useState('immediate');
  const [approvers, setApprovers] = useState('');
  const [senediImzalayacaqRehber, setSenediImzalayacaqRehber] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [generatedText, setGeneratedText] = useState({
    textForWebPage: '',
    textForPrinting: '',
  });
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
      approvers &&
      senediImzalayacaqRehber
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [startDate, endDate, paymentTiming, approvers, senediImzalayacaqRehber]);

  const handleSave = async () => {
    const textToSave = generatedText.textForPrinting;
  
    try {
      const result = await mammoth.convertHtml(textToSave, {
        styleMap: [
          "p[style-name='text-for-printing'] => p",
          "div[style-name='text-for-printing'] => div",
        ],
      });
  
      const blob = new Blob([result.value], { type: 'application/msword' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'mazuniyyet.docx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error converting HTML to Word document:', error);
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    const daysDifference = calculateDaysDifference(startDate, endDate);

    const currentDate = new Date();
    const formattedCurrentDate = formatDate(currentDate);

    // For the web page, hide the content with a CSS class
    const textForWebPage = `
      <div class="hidden-for-print">
        <div class="text-for-webpage">
          Şirkətin rəhbəri, ${senediImzalayacaqRehber} cənablarına, həmin şirkətdə Maliyyə meneceri vəzifəsində çalışan Vüsal Qaragözov tərəfindən
        </div>
        <br /> <br />
        <div class="text-center">
          Ərizə
        </div>
        <br />
        <div class="text-for-webpage">
          Yazıb Sizdən xahiş edirəm ki, mənə ${formattedStartDate} tarixindən ${formattedEndDate} tarixinədək (${daysDifference} təqvim günü) məzuniyyət verəsiniz.
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
          Şirkətin rəhbəri, ${senediImzalayacaqRehber} cənablarına, həmin şirkətdə Maliyyə meneceri vəzifəsində çalışan Vüsal Qaragözov t
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
        <div className="col-md-6">
          <main className="col-md-12">
            <div className="container mt-5">
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
                        className="form-control"
                      >
                        <option value="immediate">Dərhal</option>
                        <option value="later">Ay sonunda</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-md-6 col-form-label">Təsdiq edəcək rəhbərlər:</label>
                  <div className="col-md-6">
                    <input
                      type="text"
                      value={approvers}
                      onChange={(e) => setApprovers(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-md-6 col-form-label">Sənədi imzalayacaq rəhbər:</label>
                  <div className="col-md-6">
                    <input
                      type="text"
                      value={senediImzalayacaqRehber}
                      onChange={(e) => setSenediImzalayacaqRehber(e.target.value)}
                      className="form-control"
                    />
                  </div>
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
              </form>
            </div>
          </main>
        </div>
        <div className="col-md-6 mt-5">
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
                onClick={handleSave}
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
