import React, { useEffect, useState } from 'react';
import NotificationItem from './NotificationItem'; // Adjust the path as necessary

const DoctorantNotifications = ({ user }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const response = await fetch(`http://localhost:5000/api/notifications/${user.id - 1}`);
            const data = await response.json();
            setNotifications(data);
        };

        fetchNotifications();
    }, [user.id]);

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Your Notifications</h2>
            {notifications.length === 0 ? (
                <p className="text-gray-500">No notifications available.</p>
            ) : (
                notifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                ))
            )}
        </div>
    );
};

export default DoctorantNotifications;