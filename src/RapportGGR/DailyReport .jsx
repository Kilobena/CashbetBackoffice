import React, { useEffect, useState } from 'react';
import { fetchDailyReport } from '../service/ReportService';
import { motion } from 'framer-motion';

const DailyReport = () => {
  const [reports, setReports] = useState([]);
  const [allowedSystems, setAllowedSystems] = useState([]);
  const [eachSystem, setEachSystem] = useState({});
  const [selectedSystem, setSelectedSystem] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchReport = async () => {
    if (!selectedDate) {
      setError('Please select a date.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const reportData = await fetchDailyReport({ date: selectedDate });
      if (reportData.data?.casino) {
        setReports(Object.values(reportData.data.casino));
      }
      if (reportData.data?.allowed_systems) {
        setAllowedSystems(['All', ...reportData.data.allowed_systems]);
      }
      if (reportData.data?.each_system) {
        setEachSystem(reportData.data.each_system);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching the report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [selectedDate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSystemChange = (e) => {
    setSelectedSystem(e.target.value);
  };

  const totalPages = Math.ceil(reports.length / itemsPerPage);

  const getCurrentReports = () => {
    const indexOfLastReport = currentPage * itemsPerPage;
    const indexOfFirstReport = indexOfLastReport - itemsPerPage;
    return reports.slice(indexOfFirstReport, indexOfLastReport);
  };

  return (
    <div className="w-full h-full min-h-screen flex flex-col bg-gray-50 p-4">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Rapport quotidien</h1>

      <div className="mb-6">
        <label htmlFor="datePicker" className="block text-md font-medium text-gray-700 mb-2">
          Sélectionnez une date :
        </label>
        <input
          type="date"
          id="datePicker"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {loading ? (
        <p className="text-center text-md font-medium text-gray-700">Chargement...</p>
      ) : error ? (
        <p className="text-center text-md font-medium text-red-500">{error}</p>
      ) : (
        <div className="flex-grow overflow-auto">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Rapports Casino</h2>
            <motion.div className="overflow-auto rounded-lg shadow-sm">
              <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
                <thead className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white">
                  <tr>
                    <th className="py-2 px-4 text-left">Nom d'utilisateur</th>
                    <th className="py-2 px-4 text-left">Nom Réel</th>
                    <th className="py-2 px-4 text-left">Player ID</th>
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Pari</th>
                    <th className="py-2 px-4 text-left">Gain</th>
                    <th className="py-2 px-4 text-left">Net</th>
                    <th className="py-2 px-4 text-left">Jeux joués</th>
                    <th className="py-2 px-4 text-left">Jackpot Contribution</th>
                    <th className="py-2 px-4 text-left">System</th>
                    <th className="py-2 px-4 text-left">Fee</th>
                    <th className="py-2 px-4 text-left">Tip</th>
                    <th className="py-2 px-4 text-left">Tournament</th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentReports().map((report, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                      } hover:bg-gray-200 transition-colors`}
                    >
                      <td className="py-2 px-4">{report.username}</td>
                      <td className="py-2 px-4">{report.username_real}</td>
                      <td className="py-2 px-4">{report.playerid}</td>
                      <td className="py-2 px-4">{formatDate(report.date)}</td>
                      <td className="py-2 px-4">{report.bet} TND</td>
                      <td className="py-2 px-4">{report.win} TND</td>
                      <td className="py-2 px-4">{report.net} TND</td>
                      <td className="py-2 px-4">{report.gamesPlayed}</td>
                      <td className="py-2 px-4">{report.jackpotContribution} TND</td>
                      <td className="py-2 px-4">{report.system}</td>
                      <td className="py-2 px-4">{report.fee}</td>
                      <td className="py-2 px-4">{report.tip}</td>
                      <td className="py-2 px-4">{report.tournament}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyReport;
