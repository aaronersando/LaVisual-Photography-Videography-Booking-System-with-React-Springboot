import { useState } from 'react';
import ShowDetailsModal from '../components/admin/ShowDetailsModal';
import EditAdminModal from '../components/admin/EditAdminModal';
import AddAdminModal from '../components/admin/AddAdminModal';

function AdminAccountsSection() {
  const [admins, setAdmins] = useState([
    {
      id: 1,
      name: 'Admin 1',
      email: 'agersando@gmail.com',
      password: 'testing 1',
      address: 'Plaridel, Bulacan',
      phoneNumber: '09665469008'
    },
    {
      id: 2,
      name: 'Admin 2',
      email: 'cuevas@gmail.com',
      password: 'testing 2',
      address: 'Plaridel, Bulacan',
      phoneNumber: '09665469008'
    }
  ]);

  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleShowDetails = (admin) => {
    setSelectedAdmin(admin);
    setShowDetailsModal(true);
  };

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setShowEditModal(true);
  };

  const handleDelete = (adminId) => {
    if (window.confirm('Are you sure you want to delete this admin account?')) {
      setAdmins(admins.filter(admin => admin.id !== adminId));
    }
  };

  const handleAddAdmin = (newAdmin) => {
    setAdmins([...admins, { ...newAdmin, id: admins.length + 1 }]);
    setShowAddModal(false);
  };

  const handleUpdateAdmin = (updatedAdmin) => {
    setAdmins(admins.map(admin => 
      admin.id === updatedAdmin.id ? updatedAdmin : admin
    ));
    setShowEditModal(false);
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
                <span className="text-white text-lg">A</span>
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