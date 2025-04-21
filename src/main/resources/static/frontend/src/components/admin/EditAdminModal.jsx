import { useState, useEffect } from 'react';

function EditAdminModal({ admin, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    city: '',
    role: ''
  });

  // Initialize form data when admin prop changes
  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name || '',
        email: admin.email || '',
        password: '', // Clear password field on open
        city: admin.city || '',
        role: admin.role || 'ADMIN'
      });
    }
  }, [admin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create data object to submit to API (matching YourProfileSection approach)
    const updateData = {
      id: admin.id,
      name: formData.name,
      email: formData.email,
      // Only include password if provided
      ...(formData.password && formData.password.trim() !== '' ? { password: formData.password } : {}),
      city: formData.city,
      role: formData.role || admin.role // Preserve existing role
    };
    
    // Pass the update data to parent component's onSave handler
    onSave(updateData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 mt-10 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">{admin.name ? admin.name[0]?.toUpperCase() : 'A'}</span>
            </div>
            <h2 className="text-xl font-semibold text-white">Edit Admin</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm text-gray-400">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-gray-700 text-white rounded border border-gray-600"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-gray-700 text-white rounded border border-gray-600"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Password (leave blank to keep current)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-gray-700 text-white rounded border border-gray-600"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Address</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-gray-700 text-white rounded border border-gray-600"
              required
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white border border-gray-600 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditAdminModal;