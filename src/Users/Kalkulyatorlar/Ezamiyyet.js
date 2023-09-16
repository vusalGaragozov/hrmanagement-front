import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './kalkulyator.css';

function Ezamiyyet() {
  const [grossToNetAmount, setGrossToNetAmount] = useState('');
  const [grossToNetSector, setGrossToNetSector] = useState('Qeyri-dövlət və qeyri-neft sektoru');
  const [netToGrossAmount, setNetToGrossAmount] = useState('');
  const [netToGrossSector, setNetToGrossSector] = useState('Qeyri-dövlət və qeyri-neft sektoru');

  const calculateIncomeTax = (amount, sector) => {
    let taxAmount;
  
    if (sector === 'Qeyri-dövlət və qeyri-neft sektoru') {
      if (amount > 7014) {
        taxAmount = ((amount - 1014) / 0.75 - 8000) * 0.14;
      } else {
        taxAmount = 0;
      }
    } else {
      if (amount <= 189) {
        taxAmount = 0;
      } else if (amount <= 2362.5) {
        taxAmount = ((amount - 28) / 0.805 - 200) * 0.14;
      } else if (amount <= 6790) {
        taxAmount = (((amount - 275) / 0.695 - 2500) * 0.25 + 350);
      } else {
        taxAmount = (((amount - 155) / 0.71 - 2500) * 0.25 + 350);
      }
    }
  
    const formattedAmount = taxAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  
    return formattedAmount + ' ₼';
  };
  
  
    const calculateIncomeTaxGN = (amount, sector) => {
        let taxAmount;
      
        if (sector === 'Qeyri-dövlət və qeyri-neft sektoru') {
          if (amount <= 8000) {
            taxAmount = 0;
          } else {
            taxAmount = (amount - 8000) * 0.14;
          }
        } else {
          if (amount <= 2500) {
            taxAmount = 0;
          } else if (amount <= 8000) {
            taxAmount = (amount - 2500) * 0.14;
          } else {
            taxAmount = (amount - 2500) * 0.25 + 350;
          }
        }
      
        const formattedAmount = taxAmount.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      
        return formattedAmount + " ₼";
      };
      
      const calculateDSMF = (amount, sector) => {
        let dsmfAmount;
      
        if (sector === 'Qeyri-dövlət və qeyri-neft sektoru') {
          if (amount < 189) {
            dsmfAmount = (amount / 0.945) * 0.03;
          } else if (amount < 7014) {
            dsmfAmount = ((amount - 14) / 0.875 - 200) * 0.10 + 6;
          } else {
            dsmfAmount = ((amount - 1014) / 0.75 - 200) * 0.10 + 6;
          }
        } else {
          if (amount <= 189) {
            dsmfAmount = (amount / 0.945) * 0.03;
          } else if (amount <= 2362.5) {
            dsmfAmount = ((amount - 28) / 0.805) * 0.03;
          } else if (amount <= 6790) {
            dsmfAmount = ((amount - 275) / 0.695) * 0.03;
          } else {
            dsmfAmount = ((amount - 155) / 0.71) * 0.03;
          }
        }
      
        const formattedAmount = dsmfAmount.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      
        return formattedAmount + ' ₼';
      };
      
      
      const calculateDSMFGN = (amount, sector) => {
        let dsmfAmount;
      
        if (sector === 'Qeyri-dövlət və qeyri-neft sektoru') {
          if (amount < 200) {
            dsmfAmount = amount * 0.03;
          } else {
            dsmfAmount = (amount - 200) * 0.10 + 6;
          }
        } else {
          dsmfAmount = amount * 0.03;
        }
      
        const formattedAmount = dsmfAmount.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      
        return formattedAmount + " ₼";
      };
      

      const calculateCompanyDSMF = (amount, sector) => {
        let companyDSMFAmount;
      
        if (sector === 'Qeyri-dövlət və qeyri-neft sektoru') {
          if (amount < 200) {
            companyDSMFAmount = amount * 0.22;
          } else {
            companyDSMFAmount = (amount - 200) * 0.15 + 44;
          }
        } else {
          companyDSMFAmount = amount * 0.22;
        }
      
        const formattedAmount = companyDSMFAmount.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      
        return formattedAmount + ' ₼';
      };
      
  

  const calculateUnemploymentInsurance = (amount, sector) => {
    let insuranceAmount;
  
    if (sector === 'Qeyri-dövlət və qeyri-neft sektoru') {
      if (amount < 189) {
        insuranceAmount = (amount / 0.945) * 0.005;
      } else if (amount < 7014) {
        insuranceAmount = ((amount - 14) / 0.875) * 0.005;
      } else {
        insuranceAmount = ((amount - 1014) / 0.75) * 0.005;
      }
    } else {
      if (amount <= 189) {
        insuranceAmount = (amount / 0.945) * 0.005;
      } else if (amount <= 2362.5) {
        insuranceAmount = ((amount - 28) / 0.805) * 0.005;
      } else if (amount <= 6790) {
        insuranceAmount = ((amount - 275) / 0.695) * 0.005;
      } else {
        insuranceAmount = ((amount - 155) / 0.71) * 0.005;
      }
    }
  
    const formattedAmount = insuranceAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  
    return formattedAmount + " ₼";
  };
  
  
  const calculateUnemploymentInsuranceGN = (amount) => {
    const formattedAmount = (amount * 0.005).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  
    return formattedAmount + " ₼";
  };
  

  const calculateCompanyUnemploymentInsurance = (amount) => {
    return (amount * 0.005).toFixed(2) + " ₼";
  };
  

  const calculateMedicalInsurance = (amount, sector) => {
    if (sector === 'Qeyri-dövlət və qeyri-neft sektoru') {
      if (amount < 189) {
        return ((amount / 0.945) * 0.02).toFixed(2) + " ₼";
      } else if (amount < 7014) {
        return (((amount - 14) / 0.875) * 0.02).toFixed(2) + " ₼";
      } else {
        return (160 + ((amount - 1014) / 0.75 - 8000) * 0.005).toFixed(2) + " ₼";
      }
    } else {
      if (amount <= 189) {
        return ((amount / 0.945) * 0.02).toFixed(2) + " ₼";
      } else if (amount <= 2362.5) {
        return (((amount - 28) / 0.805) * 0.02).toFixed(2) + " ₼";
      } else if (amount <= 6790) {
        return (((amount - 275) / 0.695) * 0.02).toFixed(2) + " ₼";
      } else {
        return (((amount - 155) / 0.71 - 8000) * 0.005 + 160).toFixed(2) + " ₼";
      }
    }
  };
  
  const calculateMedicalInsuranceGN = (amount) => {
    if (amount <= 8000) return (amount * 0.02).toFixed(2) + " ₼";
    else return ((amount - 8000) * 0.005 + 160).toFixed(2) + " ₼";
  };
  
  

  const calculateCompanyMedicalInsurance = (amount) => {
    if (amount <= 8000) return (amount * 0.02).toFixed(2) + " ₼";
    else return ((amount - 8000) * 0.005 + 160).toFixed(2) + " ₼";
  };
  
  const calculateNetIncomeGN = (amount, sector) => {
    // Ensure amount is a valid number
    if (isNaN(amount)) {
      // Handle the case where the input is not a valid number
      return "0.00 ₼";
    }
  
    // Convert amount to a numeric value if it's not already
    const numericAmount = parseFloat(amount);
  
    const incomeTax = parseFloat(calculateIncomeTaxGN(numericAmount, sector).replace(/[^\d.-]/g, ''));
    const dsmf = parseFloat(calculateDSMFGN(numericAmount, sector).replace(/[^\d.-]/g, ''));
    const unemploymentInsurance = parseFloat(calculateUnemploymentInsuranceGN(numericAmount).replace(/[^\d.-]/g, ''));
    const medicalInsurance = parseFloat(calculateMedicalInsuranceGN(numericAmount).replace(/[^\d.-]/g, ''));
  
    let netIncome = numericAmount - incomeTax - dsmf - unemploymentInsurance - medicalInsurance;
  
    // Ensure netIncome is a number and round to two decimal places
    netIncome = parseFloat(netIncome.toFixed(2));
    return !isNaN(netIncome) ? netIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₼" : "0.00 ₼";
  };
  
  const calculateNetIncome = (amount, sector) => {
    // Ensure amount is a valid number
    if (isNaN(amount)) {
      // Handle the case where the input is not a valid number
      return "0.00 ₼";
    }
  
    // Convert amount to a numeric value if it's not already
    const numericAmount = parseFloat(amount);
  
    const incomeTax = parseFloat(calculateIncomeTax(numericAmount, sector).replace(/[^\d.-]/g, ''));
    const dsmf = parseFloat(calculateDSMF(numericAmount, sector).replace(/[^\d.-]/g, ''));
    const unemploymentInsurance = parseFloat(calculateUnemploymentInsurance(numericAmount).replace(/[^\d.-]/g, ''));
    const medicalInsurance = parseFloat(calculateMedicalInsurance(numericAmount).replace(/[^\d.-]/g, ''));
  
    let netIncome = numericAmount + incomeTax + dsmf + unemploymentInsurance + medicalInsurance;
  
    // Ensure netIncome is a number and round to two decimal places
    netIncome = parseFloat(netIncome.toFixed(2));
    return !isNaN(netIncome) ? netIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₼" : "0.00 ₼";
  };
  

  const calculateCompanyNetIncome = (amount, sector) => {
    const companyDSMF = parseFloat(calculateCompanyDSMF(amount, sector).replace(/[^\d.-]/g, ''));
    const companyUnemploymentInsurance = parseFloat(calculateCompanyUnemploymentInsurance(amount).replace(/[^\d.-]/g, ''));
    const companyMedicalInsurance = parseFloat(calculateCompanyMedicalInsurance(amount).replace(/[^\d.-]/g, ''));
  
    // Calculate net income by adding the values back
    let netIncome = parseFloat(amount) + companyDSMF + companyUnemploymentInsurance + companyMedicalInsurance;
  
    // Ensure netIncome is a number and round to two decimal places
    if (isNaN(netIncome)) {
      netIncome = 0.00;
    } else {
      netIncome = parseFloat(netIncome.toFixed(2));
    }
  
    // Format the netIncome with two decimal places
    const formattedNetIncome = netIncome.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  
    // Add "₼" symbol
    return formattedNetIncome + " ₼";
  };
  

  const handleGrossToNetAmountChange = (e) => {
    // Remove non-numeric characters, including commas and currency symbols
    const inputValue = e.target.value.replace(/[^0-9.]/g, '');
  
    if (inputValue === '') {
      // Handle the case where the input is empty
      setGrossToNetAmount('');
    } else if (inputValue.length <= 5) {
      // Convert the cleaned input to a number and update the state
      const numericValue = parseFloat(inputValue);
      setGrossToNetAmount(numericValue);
    }
  };
  
  
  const handleGrossToNetSectorChange = (e) => {
    setGrossToNetSector(e.target.value);
  };

  const handleNetToGrossAmountChange = (e) => {
    // Remove non-numeric characters, including commas and currency symbols
    let inputValue = e.target.value.replace(/[^0-9.]/g, '');
  
    // Limit the input to 5 characters
    if (inputValue.length > 5) {
      inputValue = inputValue.slice(0, 5);
    }
  
    if (inputValue === '') {
      // Handle the case where the input is empty
      setNetToGrossAmount('');
    } else {
      // Convert the cleaned input to a number and update the state
      const numericValue = parseFloat(inputValue);
      setNetToGrossAmount(numericValue);
    }
  };
  

  const handleNetToGrossSectorChange = (e) => {
    const selectedSector = e.target.value;
    setNetToGrossSector(selectedSector);
  
    // You don't need to set state variables here for net income and company net income
  };
  
  

  return (
    <div className="container kalkulyator">
      <div className="row">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-6">
              <h2 className='summary-header'>Gross-dan NETT-ə</h2>
              <form>
                <div className="form-group">
                  <label>Məbləğ</label>
                  <input
  type="text"
  className="form-control"
  value={grossToNetAmount.toLocaleString('en-US')} // Format with commas for display
  onChange={handleGrossToNetAmountChange}
  placeholder='Daxil edin...'
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
              <h2 className='summary-header'>NETT-dən Gross-a</h2>
              <form>
                <div className="form-group">
                  <label>Məbləğ</label>
                  <input
                    type="text"
                    className="form-control"
                    value={netToGrossAmount.toLocaleString('en-US')}
                    onChange={handleNetToGrossAmountChange}
                    placeholder='Daxil edin...'
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
                <table className="table table-success" >
                  <thead>
                    <tr>
                      <th></th>
                      <th>Əməkdaş üçün</th>
                      <th>Şirkət üçün</th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr>
                      <td>Gəlir vergisi:</td>
                      <td>{calculateIncomeTaxGN(grossToNetAmount, grossToNetSector)}</td>
                      <td>0.00 ₼</td>
                    </tr>
                    <tr>
                      <td>DSMF ayırmaları:</td>
                      <td>{calculateDSMFGN(grossToNetAmount, grossToNetSector)}</td>
                      <td>{calculateCompanyDSMF(grossToNetAmount, grossToNetSector)}</td>
                    </tr>
                    <tr>
                      <td>İşsizlikdən sığorta haqqı:</td>
                      <td>{calculateUnemploymentInsuranceGN(grossToNetAmount)}</td>
                      <td>{calculateCompanyUnemploymentInsurance(grossToNetAmount)}</td>
                    </tr>
                    <tr>
                      <td>İcbari tibbi sığorta haqqı:</td>
                      <td>{calculateMedicalInsuranceGN(grossToNetAmount)}</td>
                      <td>{calculateCompanyMedicalInsurance(grossToNetAmount)}</td>
                    </tr>
                    <tr className='summary-row'>
                      <td>NETT:</td>
                      <td>{calculateNetIncomeGN(grossToNetAmount, grossToNetSector)}</td>
                      <td>{calculateCompanyNetIncome(grossToNetAmount, grossToNetSector)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-md-6">
              <div className="result">
                <table className="table table-success">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Əməkdaş üçün</th>
                      <th>Şirkət üçün</th>
                    </tr>
                  </thead>
                  <tbody>
                
                    <tr>
                      <td>Gəlir vergisi:</td>
                      <td>{calculateIncomeTax(netToGrossAmount, netToGrossSector)}</td>
                      <td>0.00 ₼</td>
                    </tr>
                    <tr>
                      <td>DSMF ayırmaları:</td>
                      <td>{calculateDSMF(netToGrossAmount, netToGrossSector)}</td>
                      <td>{calculateCompanyDSMF(netToGrossAmount, netToGrossSector)}</td>
                    </tr>
                    <tr>
                      <td>İşsizlikdən sığorta haqqı:</td>
                      <td>{calculateUnemploymentInsurance(netToGrossAmount)}</td>
                      <td>{calculateCompanyUnemploymentInsurance(netToGrossAmount)}</td>
                    </tr>
                    <tr>
                      <td>İcbari tibbi sığorta haqqı:</td>
                      <td>{calculateMedicalInsurance(netToGrossAmount)}</td>
                      <td>{calculateCompanyMedicalInsurance(netToGrossAmount)}</td>
                    </tr>
                    <tr className='summary-row'>
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

export default Ezamiyyet;