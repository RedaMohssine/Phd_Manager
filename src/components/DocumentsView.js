import React, { useState } from 'react';

const DocumentsView = ({ user }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('document', file);
        formData.append('doctorantId', user.id); // Assuming user.id is the doctorant's ID

        try {
            const response = await fetch('http://localhost:5000/api/documents', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setSuccess(data.message);
                setError('');
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Error uploading document');
            }
        } catch (err) {
            setError('Network error. Unable to upload document.');
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Upload Document</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                    required 
                    className="block w-full text-sm text-gray-500 
                               file:mr-4 file:py-2 file:px-4 
                               file:rounded-md file:border-0 
                               file:text-sm file:font-semibold 
                               file:bg-blue-50 file:text-blue-700 
                               hover:file:bg-blue-100"
                />
                <button 
                    type="submit" 
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md 
                               hover:bg-blue-700 transition duration-200"
                >
                    Upload
                </button>
            </form>
            {error && <p className="mt-4 text-red-500">{error}</p>}
            {success && <p className="mt-4 text-green-500">{success}</p>}
        </div>
    );
};

export default DocumentsView;