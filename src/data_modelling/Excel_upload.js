import React, { useState } from 'react';
import axios from 'axios';

const UploadData = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post('http://localhost:3001/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Upload Data</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="file">Select Excel File:</label>
                    <input type="file" className="form-control-file" id="file" onChange={handleFileChange} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default UploadData;