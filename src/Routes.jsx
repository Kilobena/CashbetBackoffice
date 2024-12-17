import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
import UserTreeViewPage from './Auth/UserTreeView'
// Composant pour les routes protégées (vérifie uniquement l'authentification)
function ProtectedRoute({ element, redirectPath = "/login" }) {
    const { user } = useAuth();
    const isAuthenticated = !!user;
    return isAuthenticated ? element : <Navigate to={redirectPath} replace />;
}

function AppRoutes() {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <Routes>
                    {/* Route publique pour la page de connexion */}
                    <Route path="/login" element={<Login />} />

                    {/* Routes protégées qui nécessitent uniquement une authentification */}
                    <Route 
                        path="/" 
                        element={<ProtectedRoute element={<DashboardPage />} />} 
                    />
                    <Route 
                        path="/trunsuctionhistory" 
                        element={<ProtectedRoute element={<TransferHistory />} />} 
                    />
                    <Route 
                        path="/users" 
                        element={<ProtectedRoute element={<Users />} />} 
                    />
                    <Route 
                        path="/regitre" 
                        element={<ProtectedRoute element={<RegisterForm />} />} 
                    />
                    <Route 
                        path="/usersDetails/:userId" 
                        element={<ProtectedRoute element={<UserDetails />} />} 
                    />

                        <Route 
                        path="/ArbreUtilisateurs" 
                        element={<ProtectedRoute element={<UserTreeViewPage />} />} 
                    />
                      <Route 
                        path="/CMS" 
                        element={<ProtectedRoute element={<CMS />} />} 
                    />

                    <Route 
                        path="/ParametresJeux" 
                        element={<ProtectedRoute element={<ParametresJeux />} />} 
                    />
                     <Route 
                        path="/TotauxTransactions" 
                        element={<ProtectedRoute element={<TotauxTransactions />} />} 
                    />

                
                  
                    {/* Fallback route pour toute autre route non définie */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default AppRoutes;
