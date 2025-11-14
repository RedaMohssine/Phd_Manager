import React from 'react';

const NotificationItem = ({ notification }) => {
    return (
        <div className="flex items-center p-4 mb-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v4a6 6 0 00-2 4h16a6 6 0 00-2-4V8a6 6 0 00-6-6z" />
                </svg>
            </div>
            <div className="ml-4">
                <p className="text-gray-800 font-semibold">{notification.message}</p>
                <p className="text-gray-500 text-sm">{new Date(notification.created_at).toLocaleString()}</p>
            </div>
        </div>
    );
};

export default NotificationItem;