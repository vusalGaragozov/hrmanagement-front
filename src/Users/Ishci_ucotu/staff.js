import React from 'react';

const Staff = ({ staffMember, onClose }) => {
  return (
    <div className="modal fade" id="staffModal" tabIndex="-1" role="dialog" aria-labelledby="staffModalLabel" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staffModalLabel">Staff Member Details</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {staffMember && (
              <div>
                <p>Name: {staffMember.personalInfo.name}</p>
                <p>Surname: {staffMember.personalInfo.surname}</p>
                {/* Add more details here */}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staff;
