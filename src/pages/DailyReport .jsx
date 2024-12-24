import React, { useEffect, useState } from 'react';
import { fetchDailyReport } from '../service/ReportService';
import { motion } from 'framer-motion';

const DailyReport = () => {
  const [reports, setReports] = useState([]); // Main casino reports
  const [allowedSystems, setAllowedSystems] = useState([]);
  const [eachSystem, setEachSystem] = useState({});
  const [selectedSystem, setSelectedSystem] = useState('All'); // Default to show all systems
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Set to current date
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

      // Parse main casino report data
      if (reportData.data?.casino) {
        setReports(Object.values(reportData.data.casino));
      }

      // Parse allowed systems
      if (reportData.data?.allowed_systems) {
        setAllowedSystems(['All', ...reportData.data.allowed_systems]);
      }

      // Parse each system data
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

  const filteredSystemData = selectedSystem === 'All' 
    ? Object.entries(eachSystem) // Show all systems if "All" is selected
    : Object.entries(eachSystem).filter(([system]) => system === selectedSystem);

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Rapport quotidien</h1>

      {/* Date Picker */}
      <div className="mb-6">
        <label htmlFor="datePicker" className="block text-lg font-medium text-gray-700">
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

      {/* System Filter */}
      <div className="mb-6">
        <label htmlFor="systemFilter" className="block text-lg font-medium text-gray-700">
          Filtrer par système :
        </label>
        <select
          id="systemFilter"
          value={selectedSystem}
          onChange={handleSystemChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
        >
          {allowedSystems.map((system, index) => (
            <option key={index} value={system}>
              {system}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-lg font-medium text-gray-700">Chargement...</p>
      ) : error ? (
        <p className="text-center text-lg font-medium text-red-500">{error}</p>
      ) : (
        <>
          {/* Casino Reports */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Rapports Casino</h2>
            <motion.div className="overflow-x-auto rounded-lg shadow-sm">
              <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
                <thead className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">Nom d'utilisateur</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Pari</th>
                    <th className="py-3 px-4 text-left">Gain</th>
                    <th className="py-3 px-4 text-left">Net</th>
                    <th className="py-3 px-4 text-left">Jeux joués</th>
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
                      <td className="py-3 px-4">{report.username}</td>
                      <td className="py-3 px-4">{formatDate(report.date)}</td>
                      <td className="py-3 px-4">{report.bet} TND</td>
                      <td className="py-3 px-4">{report.win} TND</td>
                      <td className="py-3 px-4">{report.net} TND</td>
                      <td className="py-3 px-4">{report.gamesPlayed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>

          {/* Filtered System Data */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Données par système</h2>
            {filteredSystemData.length === 0 ? (
              <p className="text-center text-lg text-gray-600">Aucune donnée disponible pour le système sélectionné.</p>
            ) : (
              filteredSystemData.map(([system, details], index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-lg font-bold text-gray-700">Système : {system}</h3>
                  <motion.div className="overflow-x-auto rounded-lg shadow-sm">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
                      <thead className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white">
                        <tr>
                          <th className="py-3 px-4 text-left">player id</th>
                          <th className="py-3 px-4 text-left">Date</th>
                          <th className="py-3 px-4 text-left">Pari</th>
                          <th className="py-3 px-4 text-left">Gain</th>
                          <th className="py-3 px-4 text-left">Net</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.values(details).map((detail, index) => (
                          <tr
                            key={index}
                            className={`${
                              index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                            } hover:bg-gray-200 transition-colors`}
                          >
                            <td className="py-3 px-4">{detail.playerid || 'N/A'}</td>
                            <td className="py-3 px-4">{formatDate(detail.date)}</td>
                            <td className="py-3 px-4">{detail.bet} TND</td>
                            <td className="py-3 px-4">{detail.win} TND</td>
                            <td className="py-3 px-4">{detail.net} TND</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DailyReport;
