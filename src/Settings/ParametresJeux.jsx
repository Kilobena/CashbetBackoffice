import React, { useState } from 'react';

const ParametresJeux = () => {
  const [setting1, setSetting1] = useState('');
  const [setting2, setSetting2] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-indigo-700 p-8 text-white">
      <h2 className="text-2xl font-bold mb-4">Game Settings</h2>
      <form className="space-y-4">
        <div className="bg-white/20 p-4 rounded-lg">
          <label className="font-medium">Setting 1</label>
          <input
            type="text"
            value={setting1}
            onChange={(e) => setSetting1(e.target.value)}
            className="w-full mt-2 p-2 bg-indigo-600 rounded-md text-white"
          />
        </div>
        <div className="bg-white/20 p-4 rounded-lg">
          <label className="font-medium">Setting 2</label>
          <input
            type="text"
            value={setting2}
            onChange={(e) => setSetting2(e.target.value)}
            className="w-full mt-2 p-2 bg-indigo-600 rounded-md text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full p-3 bg-indigo-800 rounded-lg mt-4 hover:scale-105 transition-transform"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default ParametresJeux;
