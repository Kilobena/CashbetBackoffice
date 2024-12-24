import React, { useState, useEffect } from 'react';
import TransferService from '../service/Trunsuction';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TransferHistory = () => {
  const transferService = new TransferService();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filterType, setFilterType] = useState(''); // State for transaction type filter

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const result = await transferService.getAllTransfers();
        if (result.success) {
          setHistory(result.transfers || []);
        } else {
          setError(result.message || 'Failed to fetch transfer history.');
        }
      } catch (error) {
        console.error('Error fetching transfer history:', error);
        setError('An unexpected error occurred while fetching transfer history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
    setHistory((prevHistory) =>
      [...prevHistory].sort((a, b) => {
        if (key === 'amount') {
          return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
        }
        return direction === 'asc'
          ? (a[key] || '').localeCompare(b[key] || '')
          : (b[key] || '').localeCompare(a[key] || '');
      })
    );
  };

  const applyFilters = (data) => {
    return data.filter((transfer) => {
      // Search term filter
      const matchesSearch =
        transfer.sender?.username.includes(searchTerm) ||
        transfer.receiver?.username.includes(searchTerm) ||
        transfer.transactionId.includes(searchTerm);

      // Date range filter
      const matchesDateRange =
        (!startDate || new Date(transfer.date) >= startDate) &&
        (!endDate || new Date(transfer.date) <= endDate);

      // Type filter
      const matchesType = !filterType || transfer.type === filterType;

      return matchesSearch && matchesDateRange && matchesType;
    });
  };

  const filteredHistory = applyFilters(history);
  const displayedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <motion.div
      className="h-screen w-full bg-gray-50 flex flex-col p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">Historique des transactions</h1>

      <div className="flex justify-between items-center mb-6">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg w-1/3"
        />

        {/* Date Pickers */}
        <div className="flex items-center space-x-2">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="Start Date"
            className="border border-gray-300 p-2 rounded-lg"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText="End Date"
            className="border border-gray-300 p-2 rounded-lg"
          />
        </div>

        {/* Transaction Type Filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg"
        >
          <option value="">All Types</option>
          <option value="deposit">Deposit</option>
          <option value="withdraw">Withdraw</option>
          <option value="debit">Mise</option>
          <option value="credit">Win</option>
          
        </select>

        {/* Items Per Page */}
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

      <div className="overflow-x-auto rounded-lg shadow-sm flex-grow">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white">
            <tr>
              <th onClick={() => handleSort('date')}>Date</th>
              <th>Transaction ID</th>
              <th>Sender (Role)</th>
              <th>Receiver (Role)</th>
              <th onClick={() => handleSort('type')}>Type</th>
              <th onClick={() => handleSort('amount')}>Amount</th>
              <th>Note</th>
              <th>Balance Before</th>
              <th>Balance After</th>
              <th>Rolled Back</th>
            </tr>
          </thead>
          <tbody>
            {displayedHistory.map((transfer, index) => (
              <motion.tr
                key={transfer.id || `transfer-${index}`}
                className="bg-white hover:bg-gray-200 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <td className="py-3 px-4 text-sm text-gray-700">
                  {new Date(transfer.date).toLocaleString('fr-FR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">{transfer.transactionId || 'N/A'}</td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  {transfer.sender?.username || 'Unknown'} ({transfer.sender?.role || 'Unknown'})
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  {transfer.receiver?.username || 'Unknown'} ({transfer.receiver?.role || 'Unknown'})
                </td>
                <td
                  className={`py-3 px-4 text-sm font-bold ${
                    transfer.type === 'credit' ? 'text-green-600' : transfer.type === 'debit' ? 'text-red-600' : 'text-gray-700'
                  }`}
                >
                  {transfer.type === 'credit' ? 'Win' : transfer.type === 'debit' ? 'Mise' : transfer.type}
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">{transfer.amount.toFixed(2)} TND</td>
                <td className="py-3 px-4 text-sm text-gray-700">{transfer.note || 'N/A'}</td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  Sender: {transfer.balanceBefore?.sender?.toFixed(2) || 'N/A'} | Receiver: {transfer.balanceBefore?.receiver?.toFixed(2) || 'N/A'}
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  Sender: {transfer.balanceAfter?.sender?.toFixed(2) || 'N/A'} | Receiver: {transfer.balanceAfter?.receiver?.toFixed(2) || 'N/A'}
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">{transfer.rolledBack ? 'Yes' : 'No'}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg disabled:opacity-50"
        >
          Précédent
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </motion.div>
  );
};

export default TransferHistory;
