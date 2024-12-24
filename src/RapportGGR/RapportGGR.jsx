import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReportGGR = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="p-8 shadow-lg rounded-lg text-center w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Report Options</h1>
        <p className="mb-6 text-gray-600 text-base">
          Please select an option to view the report.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/getDailyReport')}
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-md hover:bg-blue-700 transition"
          >
            Daily Repport
          </button>
          <button
            onClick={() => navigate('/SytemDaily')}
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-md hover:bg-blue-700 transition"
          >
            System Daily
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportGGR;
