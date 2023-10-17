import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import 'moment/locale/az'; // Import Azerbaijani locale

const Telimler = () => {
  const onChange = (date, dateString) => {};

  return (
    <div className="container">
      <h2>Təlimlərin Məzmunu</h2>
      <DatePicker
        onChange={onChange}
        format="DD.MM.YYYY"
      />
    </div>
  );
};

export default Telimler;
