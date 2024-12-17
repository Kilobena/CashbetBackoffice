import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserPage from './UserPage';
import AdminDashboard from './AdminDashboard';

const RoleBasedPage = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Simulate fetching user data (replace with actual user fetching logic)
        const storedUser = JSON.parse(localStorage.getItem('user'));

        if (!storedUser) {
            // Redirect to the home page if no user is logged in
            navigate('/');
        } else {
            setUser(storedUser);
        }
    }, [navigate]);

    if (!user) return <div>Loading...</div>;

    // Conditional rendering based on role
    if (user.role === 'User') {
        return <UserPage user={user} />;
    } else {
        return <AdminDashboard user={user} />;
    }
};

export default RoleBasedPage;
