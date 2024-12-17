import React, { useEffect, useState } from 'react';
import TransferService from '../service/Trunsuction';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";

const TransactionSummary = () => {
    const [transactionSummary, setTransactionSummary] = useState([]);
    const [filteredSummary, setFilteredSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState({ key: '', order: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const entriesPerPageOptions = [10, 25, 50, 100];

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    const transferService = new TransferService();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await transferService.getAllTransfers();
                if (response.success) {
                    const transactions = response.transfers;
                    processTransactions(transactions);
                    setLoading(false);
                } else {
                    setError(response.message);
                    setLoading(false);
                }
            } catch (error) {
                setError("Failed to fetch transaction data.");
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const processTransactions = (transactions) => {
        const summary = {};

        transactions.forEach((transaction) => {
            const { senderId, receiverId, type, amount, date } = transaction;
            const senderUsername = senderId?.username || 'Unknown Sender';
            const receiverUsername = receiverId?.username || 'Unknown Receiver';

            if (!summary[senderUsername]) {
                summary[senderUsername] = { deposit: 0, withdraw: 0, currency: 'TND', date };
            }
            if (!summary[receiverUsername]) {
                summary[receiverUsername] = { deposit: 0, withdraw: 0, currency: 'TND', date };
            }

            if (type === 'deposit') {
                summary[receiverUsername].deposit += amount;
            } else if (type === 'withdraw') {
                summary[senderUsername].withdraw += amount;
            }
        });

        const summaryArray = Object.entries(summary).map(([username, { deposit, withdraw, currency, date }]) => ({
            username,
            deposit,
            withdraw,
            total: deposit - withdraw,
            currency,
            date: new Date(date)
        }));

        setTransactionSummary(summaryArray);
        setFilteredSummary(summaryArray);
    };

    const handleSort = (key) => {
        const newOrder = sortOrder.key === key && sortOrder.order === 'asc' ? 'desc' : 'asc';
        const sortedTransactions = [...filteredSummary].sort((a, b) => {
            if (key === 'total') {
                return newOrder === 'asc' ? a[key] - b[key] : b[key] - a[key];
            }
            return newOrder === 'asc' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
        });
        setFilteredSummary(sortedTransactions);
        setSortOrder({ key, order: newOrder });
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    useEffect(() => {
        const results = transactionSummary.filter(entry =>
            entry.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredSummary(results);
    }, [searchQuery, transactionSummary]);

    useEffect(() => {
        // Filter by date range when startDate or endDate changes
        const results = transactionSummary.filter(entry => {
            const entryDate = new Date(entry.date);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            return (!start || entryDate >= start) && (!end || entryDate <= end);
        });
        setFilteredSummary(results);
    }, [startDate, endDate, transactionSummary]);

    const totalEntries = filteredSummary.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);

    const getCurrentEntries = () => {
        const startIndex = (currentPage - 1) * entriesPerPage;
        return filteredSummary.slice(startIndex, startIndex + entriesPerPage);
    };

    const currentEntries = getCurrentEntries();

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
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
            <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Résumé des transactions</h1>
            
            <div className="flex flex-col sm:flex-row sm:space-x-4 items-center mb-6">
                <div className="mb-4 sm:mb-0">
                    <label className="block text-lg font-medium mb-2">Début :</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                    />
                </div>
                <div className="mb-4 sm:mb-0">
                    <label className="block text-lg font-medium mb-2">Fin :</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                    />
                </div>
                <div className="flex-grow">
                    <label htmlFor="entriesPerPage" className="text-lg font-medium">Entrées par page :</label>
                    <select
                        id="entriesPerPage"
                        value={entriesPerPage}
                        onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                        className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 ml-2"
                    >
                        {entriesPerPageOptions.map(option => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mb-6 flex items-center">
                <input
                    type="text"
                    placeholder="Rechercher par nom d'utilisateur"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                />
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
                            <th className="py-3 px-4 text-left text-sm font-medium tracking-wider">
                                Nom d'utilisateur
                                <span onClick={() => handleSort('username')} className="cursor-pointer ml-2">
                                    {sortOrder.key === 'username' && sortOrder.order === 'asc' ? '↑' : '↓'}
                                </span>
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-medium tracking-wider">
                                Dépôt
                                <span onClick={() => handleSort('deposit')} className="cursor-pointer ml-2">
                                    {sortOrder.key === 'deposit' && sortOrder.order === 'asc' ? '↑' : '↓'}
                                </span>
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-medium tracking-wider">
                                Retrait
                                <span onClick={() => handleSort('withdraw')} className="cursor-pointer ml-2">
                                    {sortOrder.key === 'withdraw' && sortOrder.order === 'asc' ? '↑' : '↓'}
                                </span>
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-medium tracking-wider">
                                Totaux
                                <span onClick={() => handleSort('total')} className="cursor-pointer ml-2">
                                    {sortOrder.key === 'total' && sortOrder.order === 'asc' ? '↑' : '↓'}
                                </span>
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-medium tracking-wider">Devise</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEntries.map((entry, index) => (
                            <motion.tr
                                key={entry.username}
                                className={`text-gray-700 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200 transition-colors`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <td className="py-3 px-4 text-center">{entry.username}</td>
                                <td className="py-3 px-4 text-right">{entry.deposit.toLocaleString()} TND</td>
                                <td className="py-3 px-4 text-right">{entry.withdraw.toLocaleString()} TND</td>
                                <td className="py-3 px-4 text-right font-semibold">{entry.total.toLocaleString()} TND</td>
                                <td className="py-3 px-4 text-center">{entry.currency}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="5">
                                <div className="flex justify-between items-center py-4">
                                    <span className="font-bold">Total des transactions : {totalEntries}</span>
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
        </div>
    );
};

export default TransactionSummary;
