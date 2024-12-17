import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Login from './Auth/LoginPage';

import Users from './Auth/Users';
import Header from "./pages/Header";
import UserDetails from './Auth/UserDetails';
import DashboardPage from './Home/DashboardPage';
import TransferHistory from './Transaction/TransferHistory';
import RegisterForm from './Auth/Registre';
import { AuthProvider, useAuth } from './providers/AuthContext';
import ArbreUtilisateurs from './Auth/ArbreUtilisateurs';
import CMS from './CMS/CMS';
import ParametresJeux from './Settings/ParametresJeux';
import TotauxTransactions from './Transaction/TotauxTransactions';
import UserTreeViewPage from './Auth/UserTreeView';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Role-based route protection component
function RoleProtectedRoute({ element, requiredRole, redirectPath = "/login" }) {
    const { user } = useAuth();
    const isAuthenticated = !!user;
    const hasRequiredRole = user?.user?.role === requiredRole; // Adjusted for user object structure

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    // If role is incorrect, show toast and redirect to login
    if (!hasRequiredRole) {
        // Display toast notification
        import('react-toastify').then(({ toast }) => {
            toast.error("You are not allowed to sign in because you don't have permission.", {
                position: "top-right",
                autoClose: 5000,
            });
        });

        return <Navigate to={redirectPath} replace />;
    }

    return element;
}

function AppRoutes() {
    return (
        <AuthProvider>
            <Router>
                <AuthContent />
                <ToastContainer />
            </Router>
        </AuthProvider>
    );
}

// New wrapper to conditionally render the Header
function AuthContent() {
    const { user } = useAuth();
    const location = useLocation();

    const isLoginPage = location.pathname === "/login";
    const isAuthenticated = !!user;

    return (
        <>
            {/* Render Header only if the user is authenticated and not on the login page */}
            {isAuthenticated && !isLoginPage && <Header />}
            <Routes>
                {/* Public route for login */}
                <Route path="/login" element={<Login />} />

                {/* Routes only accessible to users with role 'SuperPartner' */}
                <Route 
                    path="/" 
                    element={<RoleProtectedRoute element={<DashboardPage />} requiredRole="SuperPartner" />} 
                />
                <Route 
                    path="/users" 
                    element={<RoleProtectedRoute element={<Users />} requiredRole="SuperPartner" />} 
                />
                <Route 
                    path="/regitre" 
                    element={<RoleProtectedRoute element={<RegisterForm />} requiredRole="SuperPartner" />} 
                />
                <Route 
                    path="/usersDetails/:userId" 
                    element={<RoleProtectedRoute element={<UserDetails />} requiredRole="SuperPartner" />} 
                />
                <Route 
                    path="/ArbreUtilisateurs" 
                    element={<RoleProtectedRoute element={<UserTreeViewPage />} requiredRole="SuperPartner" />} 
                />
                <Route 
                    path="/CMS" 
                    element={<RoleProtectedRoute element={<CMS />} requiredRole="SuperPartner" />} 
                />
                <Route 
                    path="/ParametresJeux" 
                    element={<RoleProtectedRoute element={<ParametresJeux />} requiredRole="SuperPartner" />} 
                />
                <Route 
                    path="/TotauxTransactions" 
                    element={<RoleProtectedRoute element={<TotauxTransactions />} requiredRole="SuperPartner" />} 
                />
                <Route 
                    path="/trunsuctionhistory" 
                    element={<RoleProtectedRoute element={<TransferHistory />} requiredRole="SuperPartner" />} 
                />
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </>
    );
}

export default AppRoutes;
