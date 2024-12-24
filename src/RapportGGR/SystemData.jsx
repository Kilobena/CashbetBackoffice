// New Component for System Data
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchDailyReport } from '../service/ReportService';

const SystemData = () => {
    const [allowedSystems, setAllowedSystems] = useState([]);
    const [eachSystem, setEachSystem] = useState({});
    const [selectedSystem, setSelectedSystem] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Current date
  

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
    const fetchReport = async () => {
      if (!selectedDate) {
        setError('Please select a date.');
        return;
      }
  
      setError(null);
      setLoading(true);
      try {
        const reportData = await fetchDailyReport({ date: selectedDate });
        console.log("response",reportData)
  
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
  
    const filteredSystemData = selectedSystem === 'All'
      ? Object.entries(eachSystem)
      : Object.entries(eachSystem).filter(([system]) => system === selectedSystem);
  
    return (
      <div className="w-full p-4 bg-gray-50 rounded-xl shadow-lg text-sm">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Données par système</h2>
  
        {/* Date Picker */}
        <div className="mb-4">
          <label htmlFor="datePicker" className="block text-md font-medium text-gray-700">
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
        <div className="mb-4">
          <label htmlFor="systemFilter" className="block text-md font-medium text-gray-700">
            Filtrer par système :
          </label>
          <select
            id="systemFilter"
            value={selectedSystem}
            onChange={(e) => setSelectedSystem(e.target.value)}
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
          <p className="text-center text-md font-medium text-gray-700">Chargement...</p>
        ) : error ? (
          <p className="text-center text-md font-medium text-red-500">{error}</p>
        ) : (
          filteredSystemData.map(([system, details], index) => (
            <div key={index} className="mb-4">
              <h3 className="text-md font-bold text-gray-700">Système : {system}</h3>
              <motion.div className="overflow-x-auto rounded-lg shadow-sm">
                <table className="w-full bg-white rounded-lg overflow-hidden shadow-md">
                  <thead className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white">
                    <tr>
                  
                    <th className="py-2 px-4 text-left">Player ID</th>
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Pari</th>
                    <th className="py-2 px-4 text-left">Gain</th>
                    <th className="py-2 px-4 text-left">Net</th>
                    <th className="py-2 px-4 text-left">Jeux joués</th>
                    <th className="py-2 px-4 text-left">Jackpot Contribution</th>
                 
                    <th className="py-2 px-4 text-left">Fee</th>
                    <th className="py-2 px-4 text-left">Tip</th>
                    <th className="py-2 px-4 text-left">Tournament</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(details).map((detail, idx) => (
                      <tr
                        key={idx}
                        className={`${
                          idx % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                        } hover:bg-gray-200 transition-colors`}
                      >
                      
                      <td className="py-2 px-4">{detail.playerid}</td>
                      <td className="py-2 px-4">{formatDate(detail.date)}</td>
                      <td className="py-2 px-4">{detail.bet} TND</td>
                      <td className="py-2 px-4">{detail.win} TND</td>
                      <td className="py-2 px-4">{detail.net} TND</td>
                      <td className="py-2 px-4">{detail.gamesPlayed}</td>
                      <td className="py-2 px-4">{detail.jackpotContribution} TND</td>
                      <td className="py-2 px-4">{detail.fee}</td>
                      <td className="py-2 px-4">{detail.tip}</td>
                      <td className="py-2 px-4">{detail.tournament}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            </div>
          ))
        )}
      </div>
    );
  };
  
  export default SystemData;