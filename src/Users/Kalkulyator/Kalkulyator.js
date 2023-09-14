import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function SalaryCalculator() {
  const [grossToNetAmount, setGrossToNetAmount] = useState('');
  const [grossToNetSector, setGrossToNetSector] = useState('Qeyri-dövlət və qeyri-neft sektoru');
  const [netToGrossAmount, setNetToGrossAmount] = useState('');
  const [netToGrossSector, setNetToGrossSector] = useState('Qeyri-dövlət və qeyri-neft sektoru');

  const calculateIncomeTax = (amount, sector) => {
    if (sector === 'Qeyri-dövlət və qeyri-neft sektoru') {
      if (amount <= 8000) return (0).toFixed(2) + " ₼";
      else return ((amount - 8000) * 0.14).toFixed(2) + " ₼";
    } else {
      if (amount <= 2500) return (0).toFixed(2) + " ₼";
      else if (amount <= 8000) return ((amount - 2500) * 0.14).toFixed(2) + " ₼";
      else return ((amount - 2500) * 0.25 + 350).toFixed(2) + " ₼";
    }
  };
  

  const calculateCompanyIncomeTax = (amount, sector) => {
    if (sector === 'Qeyri-dövlət və qeyri-neft sektoru') {
      if (amount <= 8000) return (0).toFixed(2) + " ₼";
      else if (amount <= 2500) return ((amount - 8000) * 0.14).toFixed(2) + " ₼";
      else return ((amount - 2500) * 0.25 + 350).toFixed(2) + " ₼";
    } else {
      if (amount <= 8000) return (0).toFixed(2) + " ₼";
      else if (amount <= 2500) return ((amount - 8000) * 0.14).toFixed(2) + " ₼";
      else return ((amount - 2500) * 0.25 + 350).toFixed(2) + " ₼";
    }
  };
  

  const calculateDSMF = (amount, sector) => {
    if (sector === 'Qeyri-dövlət və qeyri-neft sektoru') {
      if (amount < 200) return (amount * 0.03).toFixed(2) + " ₼";
      else return ((amount - 200) * 0.10 + 6).toFixed(2) + " ₼";
    } else {
      if (amount < 200) return (amount * 0.22).toFixed(2) + " ₼";
      else return ((amount - 200) * 0.15 + 44).toFixed(2) + " ₼";
    }
  };
  

  const calculateCompanyDSMF = (amount, sector) => {
    if (sector === 'Qeyri-dövlət və qeyri-neft sektoru') {
      if (amount < 200) return (amount * 0.03).toFixed(2) + " ₼";
      else return ((amount - 200) * 0.10 + 6).toFixed(2) + " ₼";
    } else {
      if (amount < 200) return (amount * 0.22).toFixed(2) + " ₼";
      else return ((amount - 200) * 0.15 + 44).toFixed(2) + " ₼";
    }
  };
  

  const calculateUnemploymentInsurance = (amount) => {
    return (amount * 0.005).toFixed(2) + " ₼";
  };
  

  const calculateCompanyUnemploymentInsurance = (amount) => {
    return (amount * 0.005).toFixed(2) + " ₼";
  };
  

  const calculateMedicalInsurance = (amount) => {
    if (amount <= 8000) return (amount * 0.02).toFixed(2) + " ₼";
    else return ((amount - 8000) * 0.005 + 160).toFixed(2) + " ₼";
  };
  
  

  const calculateCompanyMedicalInsurance = (amount) => {
    if (amount <= 8000) return (amount * 0.02).toFixed(2) + " ₼";
    else return ((amount - 8000) * 0.005 + 160).toFixed(2) + " ₼";
  };
  
  const calculateNetIncome = (amount, sector) => {
    // Ensure amount is a valid number
    if (isNaN(amount)) {
      // Handle the case where the input is not a valid number
      return "0.00 ₼";
    }
  
    const incomeTax = parseFloat(calculateIncomeTax(amount, sector).replace(/[^\d.-]/g, ''));
    const dsmf = parseFloat(calculateDSMF(amount, sector).replace(/[^\d.-]/g, ''));
    const unemploymentInsurance = parseFloat(calculateUnemploymentInsurance(amount).replace(/[^\d.-]/g, ''));
    const medicalInsurance = parseFloat(calculateMedicalInsurance(amount).replace(/[^\d.-]/g, ''));
  
    let netIncome = amount - incomeTax - dsmf - unemploymentInsurance - medicalInsurance;
  
    // Ensure netIncome is a number and round to two decimal places
    netIncome = parseFloat(netIncome.toFixed(2));
    return !isNaN(netIncome) ? netIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₼" : "0.00 ₼";
  };
  
  

  const calculateCompanyNetIncome = (amount, sector) => {
    const companyIncomeTax = parseFloat(calculateCompanyIncomeTax(amount, sector).replace(/[^\d.-]/g, ''));
    const companyDSMF = parseFloat(calculateCompanyDSMF(amount, sector).replace(/[^\d.-]/g, ''));
    const companyUnemploymentInsurance = parseFloat(calculateCompanyUnemploymentInsurance(amount).replace(/[^\d.-]/g, ''));
    const companyMedicalInsurance = parseFloat(calculateCompanyMedicalInsurance(amount).replace(/[^\d.-]/g, ''));
  
    // Calculate net income
    let netIncome = amount - companyIncomeTax - companyDSMF - companyUnemploymentInsurance - companyMedicalInsurance;
  
    // Ensure netIncome is a number and round to two decimal places
    netIncome = parseFloat(netIncome.toFixed(2));
    const formattedNetIncome = !isNaN(netIncome) ? netIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00";
  
    // Add "AZN" symbol
    return formattedNetIncome + " ₼";
  };
  
  
  
  

  const handleGrossToNetAmountChange = (e) => {
    // Remove non-numeric characters, including commas and currency symbols
    const inputValue = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
    setGrossToNetAmount(inputValue);
  };
  const handleGrossToNetSectorChange = (e) => {
    setGrossToNetSector(e.target.value);
  };

  const handleNetToGrossAmountChange = (e) => {
    // Remove non-numeric characters, including commas and currency symbols
    const inputValue = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
    setNetToGrossAmount(inputValue);
  };

  const handleNetToGrossSectorChange = (e) => {
    setNetToGrossSector(e.target.value);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-6">
              <h2>Gross-dan NETT-ə</h2>
              <form>
                <div className="form-group">
                  <label>Məbləğ</label>
                  <input
  type="text"
  className="form-control"
  value={grossToNetAmount.toLocaleString('en-US')} // Format with commas for display
  onChange={handleGrossToNetAmountChange}
/>

                </div>
                <div className="form-group">
                  <label>Sahə</label>
                  <select className="form-control" value={grossToNetSector} onChange={handleGrossToNetSectorChange}>
                    <option value="Qeyri-dövlət və qeyri-neft sektoru">Qeyri-dövlət və qeyri-neft sektoru</option>
                    <option value="Dövlət və Neft sektoru">Dövlət və Neft sektoru</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="col-md-6">
              <h2>Nett-den Gross-a</h2>
              <form>
                <div className="form-group">
                  <label>Məbləğ</label>
                  <input
                    type="text"
                    className="form-control"
                    value={netToGrossAmount ? netToGrossAmount.toLocaleString('en-US') : ''}
                    onChange={handleNetToGrossAmountChange}
                  />
                </div>
                <div className="form-group">
                  <label>Sahə</label>
                  <select className="form-control" value={netToGrossSector} onChange={handleNetToGrossSectorChange}>
                    <option value="Qeyri-dövlət və qeyri-neft sektoru">Qeyri-dövlət və qeyri-neft sektoru</option>
                    <option value="Dövlət və Neft sektoru">Dövlət və Neft sektoru</option>
                  </select>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-6">
              <div className="result">
                <table className="table">
                  <thead>
                    <tr>
                      <th></th>
                      <th></th>
                      <th>Əməkdaş üçün</th>
                      <th>Şirkət üçün</th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr>
                      <td></td>
                      <td>Gəlir vergisi:</td>
                      <td>{calculateIncomeTax(grossToNetAmount, grossToNetSector)}</td>
                      <td>{calculateCompanyIncomeTax(grossToNetAmount, grossToNetSector)}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>DSMF ayırmaları:</td>
                      <td>{calculateDSMF(grossToNetAmount, grossToNetSector)}</td>
                      <td>{calculateCompanyDSMF(grossToNetAmount, grossToNetSector)}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>İşsizlikdən sığorta haqqı:</td>
                      <td>{calculateUnemploymentInsurance(grossToNetAmount)}</td>
                      <td>{calculateCompanyUnemploymentInsurance(grossToNetAmount)}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>İcbari tibbi sığorta haqqı:</td>
                      <td>{calculateMedicalInsurance(grossToNetAmount)}</td>
                      <td>{calculateCompanyMedicalInsurance(grossToNetAmount)}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>NETT:</td>
                      <td>{calculateNetIncome(grossToNetAmount, grossToNetSector)}</td>
                      <td>{calculateCompanyNetIncome(grossToNetAmount, grossToNetSector)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-md-6">
              <div className="result">
                <table className="table">
                  <thead>
                    <tr>
                      <th></th>
                      <th></th>
                      <th>Əməkdaş üçün</th>
                      <th>Şirkət üçün</th>
                    </tr>
                  </thead>
                  <tbody>
                
                    <tr>
                      <td></td>
                      <td>Gəlir vergisi:</td>
                      <td>{calculateIncomeTax(netToGrossAmount, netToGrossSector)}</td>
                      <td>{calculateCompanyIncomeTax(netToGrossAmount, netToGrossSector)}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>DSMF ayırmaları:</td>
                      <td>{calculateDSMF(netToGrossAmount, netToGrossSector)}</td>
                      <td>{calculateCompanyDSMF(netToGrossAmount, netToGrossSector)}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>İşsizlikdən sığorta haqqı:</td>
                      <td>{calculateUnemploymentInsurance(netToGrossAmount)}</td>
                      <td>{calculateCompanyUnemploymentInsurance(netToGrossAmount)}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>İcbari tibbi sığorta haqqı:</td>
                      <td>{calculateMedicalInsurance(netToGrossAmount)}</td>
                      <td>{calculateCompanyMedicalInsurance(netToGrossAmount)}</td>
                    </tr>
                    <tr>
  <td></td>
  <td>GROSS:</td>
  <td>{calculateNetIncome(netToGrossAmount, netToGrossSector)}</td>
  <td>{calculateCompanyNetIncome(netToGrossAmount, netToGrossSector)}</td>
</tr>

                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalaryCalculator;