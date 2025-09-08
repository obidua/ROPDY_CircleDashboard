import React from 'react';

const StatCard = ({ label, value }) => (
  <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm p-5 rounded-lg shadow-lg border border-admin-new-green/30 hover:border-admin-new-green hover:shadow-xl hover:shadow-admin-new-green/20 transition-all duration-300">
    <h3 className="text-base text-admin-cyan dark:text-admin-cyan-dark">{label}</h3>
    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">{value}</p>
  </div>
);

export default StatCard;