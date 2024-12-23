import React, { useState, useEffect } from 'react';
import TransferService from '../service/Trunsuction';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import { motion } from 'framer-motion';

const TransferHistory = () => {
  const transferService = new TransferService();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredHistory = history.filter(
    (transfer) =>
      transfer.sender?.username.includes(searchTerm) ||
      transfer.receiver?.username.includes(searchTerm) ||
      transfer.type.includes(searchTerm)
  );

  const displayedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <motion.div
      className="container mx-auto p-6 bg-gray-50 rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Historique des transactions</h1>

      {/* Search bar and items per page dropdown */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Rechercher par utilisateur ou type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg w-1/3"
        />
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
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-medium cursor-pointer" onClick={() => handleSort('date')}>
                Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium">Transaction ID</th>
              <th className="py-3 px-4 text-left text-sm font-medium">De (Role)</th>
              <th className="py-3 px-4 text-left text-sm font-medium">À (Role)</th>
              <th className="py-3 px-4 text-left text-sm font-medium cursor-pointer" onClick={() => handleSort('type')}>
                Type {sortConfig.key === 'type' && (sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium cursor-pointer" onClick={() => handleSort('amount')}>
                Montant {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />)}
              </th>
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
                <td className="py-3 px-4">{new Date(transfer.date).toLocaleString()}</td>
                <td className="py-3 px-4">{transfer.id}</td>
                <td className="py-3 px-4">
                  {transfer.sender?.username} ({transfer.sender?.role})
                </td>
                <td className="py-3 px-4">
                  {transfer.receiver?.username} ({transfer.receiver?.role})
                </td>
                <td className="py-3 px-4">{transfer.type}</td>
                <td className="py-3 px-4">{transfer.amount} TND</td>
              </motion.tr>
            ))}

            {displayedHistory.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 p-3">Aucune transaction trouvée</td>
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
        <span>{currentPage} / {Math.ceil(filteredHistory.length / itemsPerPage)}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredHistory.length / itemsPerPage)))}
          disabled={currentPage === Math.ceil(filteredHistory.length / itemsPerPage)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </motion.div>
  );
};

export default TransferHistory;
