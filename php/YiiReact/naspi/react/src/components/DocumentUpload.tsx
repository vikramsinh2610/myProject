import axios from 'axios';
import React, { FunctionComponent, useState } from 'react';
import { DocumentUploadInput } from '../@types/inputs';

const DocumentUpload: FunctionComponent<DocumentUploadInput> = ({ name, className = '', label = '', change }) => {

    const [selectedFile, setSelectedFile] = useState<File>();
    const [progress, setProgress] = useState(-1)
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState<any>(null)

    // On file select (from the pop up) 
    const onFileChange = event => {

        // Update the state
        setSelectedFile(event.target.files[0]);

        // Create an object of formData
        const formData = new FormData();
        if (!event.target.files[0]) {
            return
        }
        // Update the formData object
        formData.append(
            'file',
            event.target.files[0],
            selectedFile?.name
        );

        // Details of the uploaded file
        console.log(selectedFile);
        axios
            .post(`${process.env.API_URL}/naspi/upload`, formData, {
                headers: {
                    'content-type': 'multipart/form-data'
                },
                onUploadProgress: progressEvent => {
                    if (progressEvent.loaded < progressEvent.total) {
                        setProgress((progressEvent.loaded / progressEvent.total) * 30)
                    } else {
                        setProgress(-1)
                        setLoading(true)
                    }
                }
            })
            .then(res => {
                setResponse(res.data.data)
                setLoading(false)
                change(res.data.data)
            })
            .catch((err) => {
                alert(err.response.data.data)
            })
    };

    return (
        <div className={className}>
            <label htmlFor={`file-${name}`} className='btn-input-file'>
                <input id={`file-${name}`} type='file' onChange={onFileChange} hidden />
                {loading ? 'Uploading...' : (selectedFile ? selectedFile.name : (response?.name ? response.name : label))}
                {progress >= 0 && <div className="progress mt-10">
                    <div
                        className="progress-bar"
                        style={{ width: `${progress}%` }}
                        role="progressbar" />
                </div>}
            </label>
        </div>
    );
}


export default DocumentUpload;