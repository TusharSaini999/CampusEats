import React from 'react';

const AlertModal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm transition-opacity">
      <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 border border-slate-200 transform transition-all duration-300 scale-100">
        <p className="text-center text-lg font-medium text-slate-800">{message}</p>
        <div className="mt-6 flex justify-center">
          <button
            className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-md shadow-violet-500/30"
            onClick={onClose}
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
