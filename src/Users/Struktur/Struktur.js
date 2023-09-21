import React, { useEffect, useState } from 'react';
import Tree from 'react-d3-tree';

function OrgChart() {
  const [orgData, setOrgData] = useState({});

  useEffect(() => {
    // Fetch only the required data (name, surname, and lineManager)
    fetch('http://localhost:3001/api/registeredstaffmembers')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // If the response is an array, use it directly
          const extractedData = data;
          const orgChartData = formatOrgChartData(extractedData);
          setOrgData(orgChartData);
        } else if (typeof data === 'object') {
          // If the response is an object, create an array with a single element
          const extractedData = [data];
          const orgChartData = formatOrgChartData(extractedData);
          setOrgData(orgChartData);
        } else {
          throw new Error('Data is not in the expected format');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        // Handle the error, e.g., display an error message to the user
      });
  }, []);

  function formatOrgChartData(staffMembers) {
    // Create a hierarchical structure based on lineManager relationships
    const orgChart = {};

    staffMembers.forEach((staffMember) => {
      const fullName = `${staffMember.personalInfo.name} ${staffMember.personalInfo.surname}`;
      const lineManager = staffMember.corporateInfo.lineManager;

      // Check if the line manager is already in orgChart
      if (!orgChart[lineManager]) {
        orgChart[lineManager] = [];
      }

      // Push the staff member's name to the line manager's subordinates
      orgChart[lineManager].push(fullName);
    });

    return orgChart;
  }

  // Convert orgData to a format suitable for react-d3-tree
  function convertToTreeData(data) {
    const treeData = {
      name: 'CEO',
      children: [],
    };

    Object.entries(data).forEach(([lineManager, subordinates]) => {
      const node = {
        name: lineManager,
        children: [],
      };

      subordinates.forEach((fullName) => {
        node.children.push({ name: fullName });
      });

      treeData.children.push(node);
    });

    return treeData;
  }

  const treeData = convertToTreeData(orgData);

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <h2>Organizational Chart</h2>
      {Object.keys(orgData).length > 0 ? (
        <Tree
          data={treeData}
          orientation="vertical"
          translate={{ x: 300, y: 100 }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default OrgChart;
