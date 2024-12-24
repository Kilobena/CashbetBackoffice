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
import DailyReport from './RapportGGR/DailyReport ';
import AgentTransfer from './Transaction/AgentTransfer';
import SystemData from './RapportGGR/SystemData';
import ReportGGR from './RapportGGR/RapportGGR';

// Role-based route protection component
function RoleProtectedRoute({ element, requiredRole, redirectPath = "/login" }) {
    const { user } = useAuth();

    // Debug: Log the user object to inspect its structure
    console.log("Current user object:", user);

    const isAuthenticated = !!user;
    const userRole = user?.role; // Adjust based on actual structure

    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    if (userRole !== requiredRole) {
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

    {/* Protected route for Daily Report */}
    <Route 
        path="/getDailyReport" 
        element={<RoleProtectedRoute element={<DailyReport />} requiredRole="Owner" />} 
    />

<Route 
        path="/RapportGGR" 
        element={<RoleProtectedRoute element={<ReportGGR />} requiredRole="Owner" />} 
        />

        <Route 
        path="/AgentTransuction" 
        element={<RoleProtectedRoute element={<AgentTransfer />} requiredRole="Owner" />} 
        />
        <Route 
        path="/SytemDaily" 
        element={<RoleProtectedRoute element={<SystemData />} requiredRole="Owner" />} 
        />
    {/* Routes only accessible to users with role 'Owner' */}
    <Route 
        path="/" 
        element={<RoleProtectedRoute element={<DashboardPage />} requiredRole="Owner" />} 
    />
    <Route 
        path="/users" 
        element={<RoleProtectedRoute element={<Users />} requiredRole="Owner" />} 
    />
    <Route 
        path="/regitre" 
        element={<RoleProtectedRoute element={<RegisterForm />} requiredRole="Owner" />} 
    />
    <Route 
        path="/usersDetails/:userId" 
        element={<RoleProtectedRoute element={<UserDetails />} requiredRole="Owner" />} 
    />
    <Route 
        path="/ArbreUtilisateurs" 
        element={<RoleProtectedRoute element={<UserTreeViewPage />} requiredRole="Owner" />} 
    />
    <Route 
        path="/CMS" 
        element={<RoleProtectedRoute element={<CMS />} requiredRole="Owner" />} 
    />
    <Route 
        path="/ParametresJeux" 
        element={<RoleProtectedRoute element={<ParametresJeux />} requiredRole="Owner" />} 
    />
    <Route 
        path="/TotauxTransactions" 
        element={<RoleProtectedRoute element={<TotauxTransactions />} requiredRole="Owner" />} 
    />
    <Route 
        path="/trunsuctionhistory" 
        element={<RoleProtectedRoute element={<TransferHistory />} requiredRole="Owner" />} 
    />
    
    {/* Fallback route */}
    <Route path="*" element={<Navigate to="/login" replace />} />
</Routes>

        </>
    );
}

export default AppRoutes;
