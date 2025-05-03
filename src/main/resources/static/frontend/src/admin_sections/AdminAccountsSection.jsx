import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminService from '../components/service/AdminService';
import ShowDetailsModal from '../components/admin/ShowDetailsModal';
import EditAdminModal from '../components/admin/EditAdminModal';
import AddAdminModal from '../components/admin/AddAdminModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function AdminAccountsSection() {
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await AdminService.getAllUsers(token);
      
      if (response && response.ourUsersList) {
        setAdmins(response.ourUsersList);
      } else {
        throw new Error('Failed to fetch admin accounts');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error loading admin accounts. Please try again.');
    } finally {
      setIsLoading(false);
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
      setError('Error deleting admin account. Please try again.');
    }
  };

  const handleAddAdmin = async (newAdmin) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      await AdminService.register(newAdmin, token);
      fetchUsers();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding admin:', error);
      alert('Failed to add admin: ' + (error.response?.data?.message || error.message));
      setIsLoading(false);
    }
  };

  const handleUpdateAdmin = async (updatedAdmin) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      await AdminService.updateUser(updatedAdmin.id, updatedAdmin, token);
      fetchUsers();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating admin:', error);
      alert('Failed to update admin: ' + (error.response?.data?.message || error.message));
      setIsLoading(false);
    }
  };

  // Render content based on loading and error states
  const renderContent = () => {
    if (isLoading && admins.length === 0) {
      return (
        <div className="p-4 text-center pt-13">
          <div className="inline-block animate-spin text-purple-500 text-4xl mb-4">
            <FontAwesomeIcon icon={faSpinner} />
          </div>
          <p className="text-gray-300">Loading admin accounts...</p>
        </div>
      );
    } else if (error && admins.length === 0) {
      return (
        <div className="p-4 bg-red-500/20 text-red-100 rounded-md ">
          <p className="font-bold mb-2">Failed to load admin accounts</p>
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md"
          >
            Retry
          </button>
        </div>
      );
    } 
    // else if (!admins || admins.length === 0) {
    //   return (
    //     <div className="p-4 bg-yellow-500/20 text-yellow-100 rounded-md mt-20">
    //       <p className="font-bold mb-2">No Admin Accounts Found</p>
    //       <p className="mb-4">No admin accounts are available to display.</p>
    //       <div className="flex space-x-4">
    //         {/* <button
    //           onClick={fetchUsers}
    //           className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-md"
    //         >
    //           Refresh
    //         </button> */}
    //         <button
    //           onClick={() => setShowAddModal(true)}
    //           className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md"
    //         >
    //           Add Admin
    //         </button>
    //       </div>
    //     </div>
    //   );
    // }
    
    return (
      <>
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
          className="mt-6 w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Please wait...' : 'Add Account'}
        </button>
      </>
    );
  };

  return (
    <div className=" pt-15">
      <div className="flex justify-between items-center mb-6">
        {/* <h2 className="text-2xl text-white font-bold">Accounts Dashboard</h2> */}
        
        {/* Refresh button */}
        {/* {!isLoading && admins.length > 0 && (
          <button 
            onClick={fetchUsers} 
            className="px-4 py-2 text-sm bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2 pt-10" />
            ) : (
              'Refresh'
            )}
          </button>
        )} */}
      </div>

      {renderContent()}

      {/* Loading overlay for operations */}
      {isLoading && admins.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-purple-500 text-4xl mb-4" />
            <p className="text-white">Processing...</p>
          </div>
        </div>
      )}

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