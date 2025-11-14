import React, { useState } from 'react';

const AdminNotificationForm = ({ doctorants, onSendNotification }) => {
    const [message, setMessage] = useState('');
    const [selectedDoctorants, setSelectedDoctorants] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleCheckboxChange = (id) => {
        if (selectedDoctorants.includes(id)) {
            setSelectedDoctorants(selectedDoctorants.filter(doctorantId => doctorantId !== id));
        } else {
            setSelectedDoctorants([...selectedDoctorants, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedDoctorants.length === doctorants.length) {
            setSelectedDoctorants([]);
        } else {
            setSelectedDoctorants(doctorants.map(doctorant => doctorant.id));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (message.trim() === '') {
            alert('Message is required');
            return;
        }
        setLoading(true);
        await onSendNotification({ message, doctorantIds: selectedDoctorants });
        setLoading(false);
        setMessage('');
        setSelectedDoctorants([]);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Send Notification</h2>
            <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                    id="message"
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                    placeholder="Enter your notification message here..."
                />
            </div>
            <div className="mb-4">
                <h3 className="text-lg font-semibold">Select Doctorants</h3>
                <div className="flex items-center mb-2">
                    <input
                        type="checkbox"
                        id="select-all"
                        checked={selectedDoctorants.length === doctorants.length}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="select-all" className="ml-2 text-sm text-gray-700 font-medium">
                        All Doctorants
                    </label>
                </div>
                <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
                    {doctorants.map(doctorant => (
                        <div key={doctorant.id} className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                id={`doctorant-${doctorant.id}`}
                                checked={selectedDoctorants.includes(doctorant.id)}
                                onChange={() => handleCheckboxChange(doctorant.id)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor={`doctorant-${doctorant.id}`} className="ml-2 text-sm text-gray-700">
                                {doctorant.nom} {doctorant.prenom}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} transition duration-200`}
            >
                {loading ? 'Sending...' : 'Send Notification'}
            </button>
        </form>
    );
};

export default AdminNotificationForm;