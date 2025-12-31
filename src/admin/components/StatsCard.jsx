import React from 'react'

const StatCard = ({ title, value, icon, bg }) => {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-5 flex items-center gap-4 hover:shadow-md transition">
        <div className={`p-3 rounded-lg ${bg}`}>
          {icon}
        </div>
  
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="text-2xl font-semibold text-gray-800">{value}</h2>
        </div>
      </div>
    );
  };
  
  export default StatCard;