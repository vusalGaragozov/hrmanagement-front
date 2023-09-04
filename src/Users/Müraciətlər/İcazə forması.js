import React, { useState, useEffect, useContext } from 'react';
import {useNavigate} from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '@fortawesome/fontawesome-free/css/all.css';
import az from 'date-fns/locale/az';
import './Müraciətlər.css'; // Import your CSS file
import { AuthContext } from '../Main/AuthContext';

const İcazə_forması = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [paymentTiming, setPaymentTiming] = useState('immediate');
  const [approvers, setApprovers] = useState('');
  const [senediImzalayacaqRehber, setSenediImzalayacaqRehber] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const {user} = useContext(AuthContext);
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

  const handleSave = () => {
    const textToSave = generatedText.textContent;
    const blob = new Blob([textToSave], { type: 'application/msword' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mazuniyyet.docx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    const daysDifference = calculateDaysDifference(startDate, endDate);

    const currentDate = new Date();
    const formattedCurrentDate = formatDate(currentDate);

    const text = (
      <div>
        <div className="align-text-right">
          Şirkətin rəhbəri, {senediImzalayacaqRehber} cənablarına, həmin şirkətdə Maliyyə meneceri vəzifəsində çalışan Vüsal Qaragözov tərəfindən
        </div>
        <br /> <br />
        <div className="align-text-center">
          Ərizə
        </div>
        <br/>
        <div className="align-text-left">
          Yazıb Sizdən xahiş edirəm ki, mənə {formattedStartDate} tarixindən {formattedEndDate} tarixinədək ({daysDifference} təqvim günü) məzuniyyət verəsiniz.
        </div>
        <br/><br/><br/><br/>
        <div className="align-text-left">
          Tarix: {formattedCurrentDate}
        </div>
          
        <div className="align-text-left">
          İmza:
        </div>
      </div>
    );

    setGeneratedText(text);
  };

  return (
    <div className="container text-left">
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
                <div className="mb-3 row ">
                  <label className="col-md-6 col-form-label ">Ödəniş vaxtı:</label>
                  <div className="col-md-6 ">
                    <div className="input-group ">
                      <select
                        value={paymentTiming}
                        onChange={(e) => setPaymentTiming(e.target.value)}
                        className="form-control"
                      >
                        <option value="immediate">Dərhal</option>
                        <option value="later">Ay sonunda</option>
                      </select>
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <i className="fas fa-caret-down"></i>
                        </span>
                      </div>
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
                onClick={() => window.print()}
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
            {generatedText && (
              <div className="mt-5">
                <p>{generatedText}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default İcazə_forması;
