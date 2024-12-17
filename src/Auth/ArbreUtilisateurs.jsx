import React from 'react';
import { motion } from 'framer-motion';

const ArbreUtilisateurs = ({ userTreeData }) => {
  return (
    <div className="flex h-screen">
      <div className="w-72 bg-gray-50 p-4 h-full shadow-lg overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">User Tree</h3>
        {userTreeData ? (
          <div>{/* Render UserTree structure here */}</div>
        ) : (
          <p className="text-gray-500">No users found.</p>
        )}
      </div>

      <motion.div className="flex-1 p-6 bg-gray-50 overflow-y-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* User details structure here */}
      </motion.div>
    </div>
  );
};

export default ArbreUtilisateurs;
