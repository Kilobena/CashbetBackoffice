import React, { useState, useEffect } from 'react';
import TransferService from '../service/Trunsuction';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';

const AgentTransfer = () => {
  const transferService = new TransferService();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState({ sender: '', receiver: '', date: null });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const result = await transferService.getAgentTransactions();
        console.log("result", result);
        if (result.success) {
          setTransactions(result.agentTransactions || []);
        } else {
          setError(result.message || 'Failed to fetch agent transactions.');
        }
      } catch (error) {
        console.error('Error fetching agent transactions:', error);
        setError('An unexpected error occurred while fetching agent transactions.');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
    setTransactions((prevTransactions) =>
      [...prevTransactions].sort((a, b) => {
        if (key === 'amount') {
          return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
        }
        return direction === 'asc'
          ? (a[key] || '').localeCompare(b[key] || '')
          : (b[key] || '').localeCompare(a[key] || '');
      })
    );
  };

  const filteredTransactions = transactions.filter(
    (transaction) =>
      (!searchTerm.sender || transaction.senderUsername?.toLowerCase().includes(searchTerm.sender.toLowerCase())) &&
      (!searchTerm.receiver || transaction.receiverUsername?.toLowerCase().includes(searchTerm.receiver.toLowerCase())) &&
      (!searchTerm.date || new Date(transaction.date).toLocaleDateString() === new Date(searchTerm.date).toLocaleDateString())
  );

  const displayedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <motion.div
      className="w-full p-6 bg-gray-50 rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Transactions des agents</h1>

      {/* Search bar and items per page dropdown */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Rechercher par émetteur..."
          value={searchTerm.sender}
          onChange={(e) => setSearchTerm({ ...searchTerm, sender: e.target.value })}
          className="border border-gray-300 p-2 rounded-lg w-1/3 mb-4 lg:mb-0"
        />
        <input
          type="text"
          placeholder="Rechercher par récepteur..."
          value={searchTerm.receiver}
          onChange={(e) => setSearchTerm({ ...searchTerm, receiver: e.target.value })}
          className="border border-gray-300 p-2 rounded-lg w-1/3 mb-4 lg:mb-0"
        />
        <div className="relative">
          <button
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className="border border-gray-300 p-2 rounded-lg flex items-center"
          >
            <FaCalendarAlt className="mr-2" />
            Sélectionner une date
          </button>
          {isDatePickerOpen && (
            <div className="absolute z-10 mt-2">
              <DatePicker
                selected={searchTerm.date}
                onChange={(date) => {
                  setSearchTerm({ ...searchTerm, date });
                  setIsDatePickerOpen(false);
                }}
                inline
              />
            </div>
          )}
        </div>
        <select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          className="border border-gray-300 p-2 rounded-lg"
        >
          {[10, 25, 50, 100].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="w-full bg-white rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-medium cursor-pointer" onClick={() => handleSort('date')}>
                Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium">ID Émetteur</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Émetteur (Role)</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Solde Avant Émetteur</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Solde Après Émetteur</th>
              <th className="py-3 px-4 text-left text-sm font-medium">ID Récepteur</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Récepteur (Role)</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Solde Avant Récepteur</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Solde Après Récepteur</th>
              <th className="py-3 px-4 text-left text-sm font-medium cursor-pointer" onClick={() => handleSort('amount')}>
                Montant {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />)}
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedTransactions.map((transaction, index) => (
              <motion.tr
                key={transaction.senderID || `transaction-${index}`}
                className="bg-white hover:bg-gray-200 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <td className="py-3 px-4">{new Date(transaction.date).toLocaleString()}</td>
                <td className="py-3 px-4">{transaction.senderID || 'N/A'}</td>
                <td className="py-3 px-4">
                  {transaction.senderUsername || 'N/A'} ({transaction.senderRole || 'N/A'})
                </td>
                <td className="py-3 px-4">{transaction.senderBalanceBefore ?? 'N/A'}</td>
                <td className="py-3 px-4">{transaction.senderBalanceAfter ?? 'N/A'}</td>
                <td className="py-3 px-4">{transaction.receiverID || 'N/A'}</td>
                <td className="py-3 px-4">
                  {transaction.receiverUsername || 'N/A'} ({transaction.receiverRole || 'N/A'})
                </td>
                <td className="py-3 px-4">{transaction.receiverBalanceBefore ?? 'N/A'}</td>
                <td className="py-3 px-4">{transaction.receiverBalanceAfter ?? 'N/A'}</td>
                <td className="py-3 px-4">{transaction.amount ?? 'N/A'} TND</td>
              </motion.tr>
            ))}

            {displayedTransactions.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center text-gray-500 p-3">Aucune transaction trouvée</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between items-center py-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          Précédent
        </button>
        <span>{currentPage} / {Math.ceil(filteredTransactions.length / itemsPerPage)}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredTransactions.length / itemsPerPage)))}
          disabled={currentPage === Math.ceil(filteredTransactions.length / itemsPerPage)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </motion.div>
  );
};

export default AgentTransfer;
