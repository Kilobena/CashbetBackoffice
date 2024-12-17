import React, { useState } from 'react';

const CMS = () => {
  const [contentList, setContentList] = useState([
    { id: 1, title: 'Content 1' },
    { id: 2, title: 'Content 2' }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-indigo-700 p-8 text-white">
      <h2 className="text-2xl font-bold mb-4">Content Management</h2>
      <div className="space-y-4">
        {contentList.map((content) => (
          <div key={content.id} className="flex justify-between items-center bg-white/20 p-4 rounded-lg hover:scale-105 transition-transform">
            <p className="font-medium">{content.title}</p>
            <button className="bg-indigo-600 p-2 rounded-md hover:bg-indigo-700">Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CMS;
