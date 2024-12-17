import React, { useEffect, useState } from 'react';
import Auth from '../service/Auth';
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';

const Users = () => {
    const authService = new Auth();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users
    const [sortOrder, setSortOrder] = useState({ key: '', order: 'asc' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(10);
    const usersPerPageOptions = [10, 25, 50, 100];
    const [tooltipInfo, setTooltipInfo] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // New state for search query
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const response = await authService.getAllUsers();
            if (response.success && Array.isArray(response.users)) {
                setUsers(response.users);
                setFilteredUsers(response.users); // Initialize filteredUsers with all users
            } else {
                setUsers([]);
                setFilteredUsers([]);
            }
        } catch (err) {
            setError('Erreur lors de la récupération des utilisateurs.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        // Filter users based on the search query
        const results = users.filter(user =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUsers(results);
        setCurrentPage(1); // Reset to the first page when search query changes
    }, [searchQuery, users]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    const handleSort = (key) => {
        const newOrder = sortOrder.key === key && sortOrder.order === 'asc' ? 'desc' : 'asc';
        const sortedUsers = [...filteredUsers].sort((a, b) => {
            if (key === 'balance') {
                return newOrder === 'asc' ? a[key] - b[key] : b[key] - a[key];
            }
            return newOrder === 'asc' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
        });

        setFilteredUsers(sortedUsers);
        setSortOrder({ key, order: newOrder });
    };

    const getRoleColorClass = (role) => {
        switch (role) {
            case 'SuperAdmin':
                return 'text-purple-700';
            case 'Admin':
                return 'text-red-600';
            case 'Partner':
                return 'text-green-500';
            case 'Assistant':
                return 'text-gray-500';
            case 'User':
                return 'text-blue-500';
            default:
                return 'text-gray-500';
        }
    };

    const userCount = filteredUsers.length;
    const totalBalance = filteredUsers.reduce((acc, user) => acc + user.balance, 0);
    const totalPages = Math.ceil(userCount / usersPerPage);

    const getCurrentUsers = () => {
        const indexOfLastUser = currentPage * usersPerPage;
        const indexOfFirstUser = indexOfLastUser - usersPerPage;
        return filteredUsers.slice(indexOfFirstUser, indexOfLastUser); // Paginate filteredUsers instead of users
    };

    const currentUsers = getCurrentUsers();

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleUsersPerPageChange = (event) => {
        setUsersPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const handleEdit = (userId) => {
        navigate(`/usersDetails/${userId}`);
    };

    const formatUserId = (userId) => {
        return `#${userId.slice(-10)}`;
    };

    const handleMouseEnter = (creator, event) => {
        if (creator) {
            setTooltipInfo({
                username: creator.username || 'N/A',
                role: creator.role || 'N/A',
                balance: creator.balance || 0,
                userdate: creator.userdate || 'N/A',
            });
            setTooltipPosition({ x: event.clientX, y: event.clientY });
            setShowTooltip(true);
        }
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };


    const handleGoBack = () => {
        navigate(-1); // Navigate back to the previous page
    };

    if (loading) return <div className="flex justify-center items-center h-64"><div className="text-xl font-semibold">Loading...</div></div>;
    if (error) return <div className="text-red-500 text-center font-medium py-10">{error}</div>;

    return (
        <div className="container mx-auto p-6 bg-gray-50 rounded-xl shadow-lg">

                <button
                onClick={handleGoBack}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
                ← Retour
            </button>
            <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Tableau des utilisateurs</h1>
            <div className="mb-6 flex items-center">
                <input
                    type="text"
                    placeholder="Rechercher par nom d'utilisateur"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                />
            </div>
            <div className="flex justify-between items-center mb-6">
                <label htmlFor="usersPerPage" className="text-lg font-medium">Utilisateurs par page :</label>
                <select
                    id="usersPerPage"
                    value={usersPerPage}
                    onChange={handleUsersPerPageChange}
                    className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
                >
                    {usersPerPageOptions.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>

            <motion.div
                className="overflow-x-auto rounded-lg shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
                    <thead className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-medium tracking-wider">ID</th>
                            <th className="py-3 px-4 text-left text-sm font-medium tracking-wider">
                                Nom d'utilisateur
                                <span onClick={() => handleSort('username')} className="cursor-pointer">
                                    {sortOrder.key === 'username' && sortOrder.order === 'asc' ? ' ↑' : ' ↓'}
                                </span>
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-medium tracking-wider">
                                Rôle
                                <span onClick={() => handleSort('role')} className="cursor-pointer">
                                    {sortOrder.key === 'role' && sortOrder.order === 'asc' ? ' ↑' : ' ↓'}
                                </span>
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-medium tracking-wider">Date de Creation</th>
                            <th className="py-3 px-4 text-left text-sm font-medium tracking-wider">Créateur</th>
                            <th className="py-3 px-4 text-left text-sm font-medium tracking-wider">
                                Solde
                                <span onClick={() => handleSort('balance')} className="cursor-pointer">
                                    {sortOrder.key === 'balance' && sortOrder.order === 'asc' ? ' ↑' : ' ↓'}
                                </span>
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-medium tracking-wider">Devise</th>
                            <th className="py-3 px-4 text-left text-sm font-medium tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user, index) => (
                            <motion.tr
                                key={user._id}
                                className={`text-gray-700 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200 transition-colors`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onMouseEnter={(event) => handleMouseEnter(user.creatorInfo, event)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <td className="py-3 px-4">{formatUserId(user._id)}</td>
                                <td className="py-3 px-4">{user.username}</td>
                                <td className={`py-3 px-4 rounded-lg font-semibold ${getRoleColorClass(user.role)}`}>{user.role}</td>
                                <td className="py-3 px-4">{formatDate(user.userdate)}</td>
                                <td className="py-3 px-4 relative">
                                    <span className="cursor-pointer hover:underline">
                                        {user.creatorInfo ? user.creatorInfo.username : 'N/A'}
                                    </span>
                                </td>
                                <td className="py-3 px-4">{user.balance} TND</td>
                                <td className="py-3 px-4">TND</td>
                                <td className="py-3 px-4">
                                    <img
                                        src="/images/user_update.png"
                                        alt="Edit"
                                        className="w-6 h-6 cursor-pointer"
                                        onClick={() => handleEdit(user._id)}
                                    />
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="8">
                                <div className="flex justify-between items-center py-4">
                                    <span className="font-bold">Total des utilisateurs : {userCount}</span>
                                    <span className="font-bold">Solde total : {totalBalance} TND</span>
                                    <div>
                                        <motion.button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                                            whileHover={{ scale: currentPage > 1 ? 1.05 : 1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Précédent
                                        </motion.button>
                                        <span>{currentPage}/{totalPages}</span>
                                        <motion.button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                                            whileHover={{ scale: currentPage < totalPages ? 1.05 : 1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Suivant
                                        </motion.button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </motion.div>

            {/* Tooltip */}
            {showTooltip && tooltipInfo && (
                <motion.div
                    className="absolute z-10 bg-white border border-gray-300 p-4 rounded-lg shadow-lg"
                    style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <p><strong>Nom d'utilisateur :</strong> {tooltipInfo.username}</p>
                    <p><strong>Rôle :</strong> {tooltipInfo.role}</p>
                    <p><strong>Solde :</strong> {tooltipInfo.balance} TND</p>
                    <p><strong>Date de création :</strong> {formatDate(tooltipInfo.userdate)}</p>
                </motion.div>
            )}
        </div>
    );
};

export default Users;
