import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminService from '../components/service/AdminService';
import ShowDetailsModal from '../components/admin/ShowDetailsModal';
import EditAdminModal from '../components/admin/EditAdminModal';
import AddAdminModal from '../components/admin/AddAdminModal';

function AdminAccountsSection() {
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await AdminService.getAllUsers(token);
      setAdmins(response.ourUsersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleShowDetails = (admin) => {
    setSelectedAdmin(admin);
    setShowDetailsModal(true);
  };

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setShowEditModal(true);
  };

  const handleDelete = async (adminId) => {
    try {
      if (window.confirm('Are you sure you want to delete this admin account?')) {
        const token = localStorage.getItem('token');
        await AdminService.deleteUser(adminId, token);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
    }
  };

  const handleAddAdmin = async (newAdmin) => {
    try {
      const token = localStorage.getItem('token');
      await AdminService.register(newAdmin, token);
      fetchUsers();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding admin:', error);
      alert('Failed to add admin: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdateAdmin = async (updatedAdmin) => {
    try {
      const token = localStorage.getItem('token');
      await AdminService.updateUser(updatedAdmin.id, updatedAdmin, token);
      fetchUsers();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating admin:', error);
      alert('Failed to update admin: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="p-6 pt-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-white font-bold">Accounts Dashboard</h2>
      </div>

      {/* Admin List */}
      <div className="space-y-4">
        {admins.map((admin) => (
          <div key={admin.id} className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">{admin.name ? admin.name[0].toUpperCase() : 'A'}</span>
              </div>
              <div>
                <h3 className="text-white font-medium">{admin.name}</h3>
                <button
                  onClick={() => handleShowDetails(admin)}
                  className="text-purple-400 hover:text-purple-300 text-sm"
                >
                  Show Details
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleEdit(admin)}
                className="text-gray-400 hover:text-white"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(admin.id)}
                className="text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Account Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="mt-6 w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        Add Account
      </button>

      {/* Modals */}
      {showDetailsModal && selectedAdmin && (
        <ShowDetailsModal
          admin={selectedAdmin}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedAdmin(null);
          }}
        />
      )}

      {showEditModal && selectedAdmin && (
        <EditAdminModal
          admin={selectedAdmin}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAdmin(null);
          }}
          onSave={handleUpdateAdmin}
        />
      )}

      {showAddModal && (
        <AddAdminModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddAdmin}
        />
      )}
    </div>
  );
}

export default AdminAccountsSection;