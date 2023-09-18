import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Assuming you have Axios installed
import './OrganizationalStructure.css'; // Import your CSS for styling

const Struktur = () => {
  const [staffMembers, setStaffMembers] = useState([]);

  useEffect(() => {
    // Fetch staff members from your API on port 3001
    axios.get('http://localhost:3001/api/registeredstaffmembers') // Replace with your backend URL
      .then((response) => {
        setStaffMembers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Create a function to recursively build the organizational structure
  const buildOrgStructure = (lineManager, allStaffMembers) => {
    const children = allStaffMembers.filter((member) => member.corporateInfo.lineManager === lineManager._id);

    return (;
        <div className={`org-node${lineManager.corporateInfo.position === 'CEO' ? ' ceo' : ''}`}>
          <div className="org-info">
            <p>{`${lineManager.personalInfo.name} ${lineManager.personalInfo.surname}`}</p>
            <p>{lineManager.corporateInfo.position}</p>
          </div>
          {children.map((child) => buildOrgStructure(child, allStaffMembers))}
        </div>
      );
    };

  // Find the CEO (assuming the CEO has no line manager)
  const ceo = staffMembers.find((member) => member.corporateInfo.position === 'CEO');

  if (!ceo) {
    return <div>No CEO found</div>;
  }

  return (
    <div className="organizational-structure">
      <h1>Organizational Structure</h1>
      <div className="org-chart">{buildOrgStructure(ceo, staffMembers)}</div>
    </div>
  );
};

export default Struktur;
