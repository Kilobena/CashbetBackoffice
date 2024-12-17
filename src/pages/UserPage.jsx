import React from 'react';
import { useAuth } from '../providers/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserPage = () => {
    const { user, logout } = useAuth(); 
    const navigate = useNavigate(); 

    if (!user) {
        return <p className="text-center text-gray-600">Loading user data...</p>;
    }

    const handleLogout = () => {
        logout();  
        navigate('/home');  
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6 sm:p-8"> {/* Added padding for mobile */}
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-sm sm:max-w-md"> {/* Responsive max-width */}
                {/* User Avatar */}
                <div className="flex flex-col items-center mb-6">
                    <img
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-4 border border-gray-300" 
                        src={`https://ui-avatars.com/api/?name=${user.username}&background=fff&color=000&bold=true`}  
                        alt="User Avatar"
                    />
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center"> {/* Responsive text size */}
                        Welcome, {user.username}!
                    </h1>
                    <p className="text-md sm:text-lg text-gray-500 mt-1 text-center">
                        You are logged in as a <strong>{user.role}</strong>.
                    </p>
                </div>

                {/* User Info Section */}
                <div className="my-6 text-center">
                    <h2 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">Your Dashboard</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Here you can view your account details and access personalized features.
                    </p>
                </div>

                {/* Logout button */}
                <button
                    onClick={handleLogout}
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default UserPage;
