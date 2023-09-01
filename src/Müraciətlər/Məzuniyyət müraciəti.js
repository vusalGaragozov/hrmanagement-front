import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '@fortawesome/fontawesome-free/css/all.css';
import az from 'date-fns/locale/az';

const Məzuniyyət_müraciəti = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [paymentTiming, setPaymentTiming] = useState('immediate');
  const [approvers, setApprovers] = useState('');

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date > endDate) {
      setEndDate(null);
    }
  };

  const handleEndDateChange = (date) => {
    if (!startDate || date >= startDate) {
      setEndDate(date);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process the form data here (e.g., send to a server)
    console.log({
      startDate,
      endDate,
      paymentTiming,
      approvers,
    });
  };

  return (
    <main className="col-md-12 ms-sm-lg col-lg-7 px-md-2">
      <div className="container mt-5 col-md-15">
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Başlanğıc tarixi:</label>
            </div>
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
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Bitmə tarixi:</label>
            </div>
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
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Ödəniş vaxtı:</label>
            </div>
            <div className="col-md-6">
              <div className="input-group">
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
                    <i className="fas fa-caret-up"></i>
                    <i className="fas fa-caret-down"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Təsdiq edəcək rəhbərlər:</label>
            </div>
            <div className="col-md-6">
              <input
                type="text"
                value={approvers}
                onChange={(e) => setApprovers(e.target.value)}
                className="form-control"
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6"></div>
            <div className="col-md-6">
              <button type="submit" className="btn btn-primary">
                Göndər
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Məzuniyyət_müraciəti;
