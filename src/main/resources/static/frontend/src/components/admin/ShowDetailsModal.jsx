import { useEffect } from "react";

function ShowDetailsModal({ admin, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Admin Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">{admin.name[0].toUpperCase()}</span>
            </div>
            <div>
              <h3 className="text-xl font-medium text-white">{admin.name}</h3>
              <p className="text-gray-400">Administrator</p>
            </div>
          </div>

          <div className="space-y-3 text-white">
            <p>
              <span className="text-gray-400">Email:</span> {admin.email}
            </p>
            <p>
              <span className="text-gray-400">Address:</span> {admin.city}
            </p>
            {/* Phone number field removed */}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShowDetailsModal;