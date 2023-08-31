import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import az from 'date-fns/locale/az';

const Müraciət_forması = () => {
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
    <main className="col-md-9 ms-sm-lg col-lg-12 px-md-2">
      <div className="container mt-5 col-md-15">
        <form onSubmit={handleSubmit}>
        <div className="row mb-3">
  <div className="col-md-3">
    <label className="form-label">Başlanğıc tarixi:</label>
  </div>
  <div className="col-md-6">
    <DatePicker
      selected={startDate}
      onChange={handleStartDateChange}
      locale={az}
      className="form-control"
    />
  </div>
</div>
<div className="row mb-3">
  <div className="col-md-3">
    <label className="form-label">Bitmə tarixi:</label>
  </div>
  <div className="col-md-6">
    <DatePicker
      selected={endDate}
      onChange={handleEndDateChange}
      minDate={startDate}
      locale={az}
      className="form-control"
    />
  </div>
</div>
<div className="row mb-3">
  <div className="col-md-3">
    <label className="form-label">Ödəniş vaxtı:</label>
  </div>
  <div className="col-md-6">
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
<div className="row mb-3">
  <div className="col-md-3">
    <label className="form-label">Təstiq edəcək rəhbərlər:</label>
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
    <div className="col-md-3"></div> {/* Empty column for alignment */}
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

export default Müraciət_forması;
