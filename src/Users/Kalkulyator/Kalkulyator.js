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
    if (isNaN(amount)) {
      return "0.00 ₼";
    }

    const incomeTax = parseFloat(calculateIncomeTax(amount, sector).replace(/[^\d.-]/g, ''));
    const dsmf = parseFloat(calculateDSMF(amount, sector).replace(/[^\d.-]/g, ''));
    const unemploymentInsurance = parseFloat(calculateUnemploymentInsurance(amount).replace(/[^\d.-]/g, ''));
    const medicalInsurance = parseFloat(calculateMedicalInsurance(amount).replace(/[^\d.-]/g, ''));

    let netIncome = amount - incomeTax - dsmf - unemploymentInsurance - medicalInsurance;

    netIncome = parseFloat(netIncome.toFixed(2));
    return !isNaN(netIncome) ? netIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₼" : "0.00 ₼";
  };

  const calculateCompanyNetIncome = (amount, sector) => {
    const companyIncomeTax = parseFloat(calculateCompanyIncomeTax(amount, sector).replace(/[^\d.-]/g, ''));
    const companyDSMF = parseFloat(calculateCompanyDSMF(amount, sector).replace(/[^\d.-]/g, ''));
    const companyUnemploymentInsurance = parseFloat(calculateCompanyUnemploymentInsurance(amount).replace(/[^\d.-]/g, ''));
    const companyMedicalInsurance = parseFloat(calculateCompanyMedicalInsurance(amount).replace(/[^\d.-]/g, ''));

    let netIncome = amount - companyIncomeTax - companyDSMF - companyUnemploymentInsurance - companyMedicalInsurance;

    netIncome = parseFloat(netIncome.toFixed(2));
    const formattedNetIncome = !isNaN(netIncome) ? netIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00";

    return formattedNetIncome + " ₼";
  };

  const calculateGrossFromNetIncome = (amount, sector) => {
    if (isNaN(amount)) {
      return "0.00 ₼";
    }

    const incomeTax = parseFloat(calculateIncomeTax(0, sector).replace(/[^\d.-]/g, ''));
    const dsmf = parseFloat(calculateDSMF(0, sector).replace(/[^\d.-]/g, ''));
    const unemploymentInsurance = parseFloat(calculateUnemploymentInsurance(0).replace(/[^\d.-]/g, ''));
    const medicalInsurance = parseFloat(calculateMedicalInsurance(0).replace(/[^\d.-]/g, ''));

    let grossSalary = amount + incomeTax + dsmf + unemploymentInsurance + medicalInsurance;

    grossSalary = parseFloat(grossSalary.toFixed(2));
    return !isNaN(grossSalary)
      ? grossSalary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₼"
      : "0.00 ₼";
  };

  
  
  

  const handleGrossToNetAmountChange = (e) => {
    const inputValue = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
    setGrossToNetAmount(inputValue);
  };

  const handleGrossToNetSectorChange = (e) => {
    setGrossToNetSector(e.target.value);
  };

  const handleNetToGrossAmountChange = (e) => {
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
                    value={grossToNetAmount.toLocaleString('en-US')}
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
                <div className="form-group">
                  <label>Net Maaş</label>
                  <input
                    type="text"
                    className="form-control"
                    value={calculateNetIncome(grossToNetAmount, grossToNetSector)}
                    readOnly
                  />
                </div>
              </form>
            </div>
            <div className="col-md-6">
              <h2>NETT-dan Gross-a</h2>
              <form>
                <div className="form-group">
                  <label>Məbləğ</label>
                  <input
                    type="text"
                    className="form-control"
                    value={netToGrossAmount.toLocaleString('en-US')}
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
                <div className="form-group">
                  <label>Gross Maaş</label>
                  <input
                    type="text"
                    className="form-control"
                    value={calculateGrossFromNetIncome(netToGrossAmount, netToGrossSector)}
                    readOnly
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalaryCalculator;
