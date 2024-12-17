import React, { useEffect } from 'react';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';

const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleLogin = () => {
        navigate('/login');
    };

   
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-900 text-white p-4 shadow-lg">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0">
                {user && user.user ? (
                    <>
                        <div className="flex items-center space-x-2 border-r border-gray-600 pr-4">
                            <FaUserCircle className="text-3xl" />
                            <div className="text-lg font-semibold">{user.user.username}</div>
                        </div>
                        <div className="flex flex-col items-center px-4 border-r border-gray-600 hover:bg-gray-800 rounded transition duration-200">
                            <span className="text-xl font-bold text-green-400">${user.user.balance || 0}</span>
                        </div>
                        <div className="flex flex-col items-center px-4 hover:bg-gray-800 rounded transition duration-200">
                            <span className="bg-yellow-500 text-black px-3 py-1 rounded-full font-semibold">{user.user.role}</span>
                        </div>
                        <div 
                            className="flex items-center cursor-pointer hover:bg-gray-800 p-2 rounded transition duration-200" 
                            onClick={handleLogout}
                        >
                            <FaSignOutAlt className="mr-2" />
                            Logout
                        </div>
                    </>
                ) : (
                    <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200" 
                        onClick={handleLogin}
                    >
                        Login
                    </button>
                )}
            </div>
        </div>
    );
};

export default Header;
