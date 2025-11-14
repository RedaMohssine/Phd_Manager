import React, { useEffect, useState } from 'react';

const AdminDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/documents');
                const data = await response.json();
                // Assuming the file_path returned from the server is relative, prepend the server URL
                const updatedDocuments = data.map(doc => ({
                    ...doc,
                    file_path: `http://localhost:5000/${doc.file_path}` // Ensure the file path is absolute
                }));
                setDocuments(updatedDocuments);
                
            } catch (error) {
                console.error('Error fetching documents:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);

    const handleOpen = (filePath) => {
        window.open(filePath, '_blank');
    };

    return (
        <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Uploaded Documents</h1>
            {loading ? (
                <p>Loading documents...</p>
            ) : (
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-2 px-4 text-left text-gray-600">Doctorant</th>
                            <th className="py-2 px-4 text-left text-gray-600">Document Name</th>
                            <th className="py-2 px-4 text-left text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.length > 0 ? (
                            documents.map((doc) => (
                                <tr key={doc.id} className="border-b hover:bg-gray-100">
                                    <td className="py-2 px-4 text-center">{doc.nom} {doc.prenom}</td>
                                    <td className="py-2 px-4 text-center">
                                        <a
                                            href={doc.file_path}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {doc.file_path.split('/').pop()}
                                        </a>
                                    </td>
                                    <td className="py-2 px-4 text-center">
                                        <button
                                            onClick={() => handleOpen(doc.file_path)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                                        >
                                            Open
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-4">No documents available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
            <footer className="mt-6 text-center text-gray-600">
                <p>&copy; {new Date().getFullYear()} PhD Management System. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AdminDocuments;