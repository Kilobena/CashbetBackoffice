import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ user }) => {
    return (
        <div className="flex flex-col sm:flex-row h-full min-h-screen"> {/* Responsive layout */}
            <Sidebar user={user} />

            {/* Main Content Area */}
            <div className="flex flex-col w-full">
                <Header user={user} />

                <main className="flex-1 p-4 sm:p-8 bg-gray-100">
                    <Outlet /> {/* This renders the child component based on the current route */}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
