import React, { useEffect, useState } from 'react';
import AdminNotificationForm from './AdminNotificationForm'; // Adjust the path as necessary

const AdminNotifications = () => {
    const [doctorants, setDoctorants] = useState([]);

    useEffect(() => {
        const fetchDoctorants = async () => {
            const response = await fetch('http://localhost:5000/api/doctorants');
            const data = await response.json();
            setDoctorants(data);
        };

        fetchDoctorants();
    }, []);

    const handleSendNotification = async (notificationData) => {
        try {
            const response = await fetch('http://localhost:5000/api/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(notificationData),
            });

            if (response.ok) {
                alert('Notification sent successfully!');
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Error sending notification');
            }
        } catch (error) {
            alert('Network error. Unable to send notification.');
        }
    };

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Admin Notifications</h1>
            <AdminNotificationForm 
                doctorants={doctorants} 
                onSendNotification={handleSendNotification} 
            />
        </div>
    );
};

export default AdminNotifications;