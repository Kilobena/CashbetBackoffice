import React from 'react';
import { FaUserPlus, FaUsers, FaReceipt, FaChartBar, FaGlobe, FaCog, FaSyncAlt, FaHistory, FaSitemap, FaTicketAlt, FaMoneyBill, FaHandshake } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // For routing
import UserTreeViewPage from '../Auth/UserTreeView';
const DashboardPage = () => {
  const navigate = useNavigate(); // Initialize router navigation

  return (
    <div className="h-screen flex flex-col bg-gray-100">
     

      {/* List of Buttons */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <motion.button
              key={item.label}
              onClick={() => navigate(item.route)} // Navigate to route on click
              className="w-full flex items-center justify-between bg-white border border-gray-200 p-4 rounded-xl shadow hover:shadow-lg hover:bg-gray-100 transition"
              whileHover={{ scale: 1.05 }} // Add hover animation
              whileTap={{ scale: 0.95 }} // Add tap/click animation
            >
              <div className="flex items-center space-x-4">
                <div className="text-indigo-600">
                  {item.icon}
                </div>
                <span className="text-lg font-medium text-gray-800">{item.label}</span>
              </div>
              {item.hasArrow && <FaSyncAlt size={18} className="text-gray-400" />}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Menu Items
const menuItems = [
  { label: 'Nouvel Utilisateur', icon: <FaUserPlus size={24} />, route: '/regitre', hasArrow: false },
  { label: 'Utilisateurs', icon: <FaUsers size={24} />, route: '/users', hasArrow: false },
  { label: 'Transactions', icon: <FaReceipt size={24} />, route: '/trunsuctionhistory', hasArrow: false },
  { label: 'Rapport GGR', icon: <FaChartBar size={24} />, route: '/CMS', hasArrow: false },
  { label: 'Paramètres des Jeux', icon: <FaGlobe size={24} />, route: '/ParametresJeux', hasArrow: true },
  { label: 'CMS', icon: <FaCog size={24} />, route: '/CMS', hasArrow: true },
  { label: 'Totaux des Transactions', icon: <FaSyncAlt size={24} />, route: '/TotauxTransactions', hasArrow: false },
  { label: 'Historique des Transactions', icon: <FaHistory size={24} />, route: '/trunsuctionhistory', hasArrow: false },
  { label: 'Arbre des Utilisateurs', icon: <FaSitemap size={24} />, route: '/ArbreUtilisateurs', hasArrow: false },
  { label: 'Rapport quotidien', icon: <FaTicketAlt size={24} />, route: '/getDailyReport', hasArrow: false },
  { label: 'Retrait', icon: <FaMoneyBill size={24} />, route: '/TotauxTransactions', hasArrow: false },
  { label: 'Affiliés', icon: <FaHandshake size={24} />, route: '/TotauxTransactions', hasArrow: false },
];

export default DashboardPage;
