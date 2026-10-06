import React from 'react';

const Blank = ({ title = "Blank Page" }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200/80 dark:border-gray-800 shadow-sm">
      <div className="w-20 h-20 mb-6 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
        <i className="ri-layout-3-line text-4xl text-primary-500 dark:text-primary-400"></i>
      </div>
      <h1 className="text-2xl font-Cairo font-bold text-gray-700 dark:text-gray-200 mb-2">
        {title}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm font-Cairo max-w-md text-center">
        This is an empty template page. You can replace this component with your actual system screens and functionality.
      </p>
    </div>
  );
};

export default Blank;
