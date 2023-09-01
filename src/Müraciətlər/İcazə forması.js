import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '@fortawesome/fontawesome-free/css/all.css';
import az from 'date-fns/locale/az';

const İcazə = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState('');
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

    if (!startDate || !endDate) {
      alert('Please select start and end date.');
      return;
    }

    if (startDate > endDate) {
      alert('End date cannot be earlier than the start date.');
      return;
    }

    // Process the form data here (e.g., send to a server)
    console.log({
      startDate,
      endDate,
      reason,
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
                locale={az}
                dateFormat="MMM d, yyyy HH:mm"
                showTimeSelect
                timeFormat="HH:mm" // Set the time format
                timeIntervals={15} // Set the time intervals
                timeCaption="Time"
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
                locale={az}
                dateFormat="MMM d, yyyy HH:mm"
                showTimeSelect
                timeFormat="HH:mm" // Set the time format
                timeIntervals={15} // Set the time intervals
                timeCaption="Time"
                className="form-control"
                minDate={startDate} // Prevent end date before start date
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Səbəb:</label>
            </div>
            <div className="col-md-6">
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="form-control"
              />
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

export default İcazə;
