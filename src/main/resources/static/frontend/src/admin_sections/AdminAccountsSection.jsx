/**
 * Admin Accounts Management Component
 * 
 * This component provides a comprehensive interface for managing administrator accounts
 * in the application. It displays a list of all admin users and allows for complete CRUD
 * operations:
 * 
 * - Create: Add new admin accounts with custom details
 * - Read: View a list of all admins and their detailed information
 * - Update: Edit existing admin account information
 * - Delete: Remove admin accounts from the system
 * 
 * The component handles authentication via tokens, manages loading and error states,
 * and provides modals for detailed interactions. It's part of the admin dashboard
 * and typically appears as a section when the "Admin Accounts" navigation item is selected.
 * 
 * Key features:
 * - Secure admin management with token authentication
 * - Clean list view of all administrators with avatar initials
 * - Modal dialogs for detailed views and form interactions
 * - Comprehensive error handling and loading states
 * - Confirmation dialogs for destructive actions
 */

import { useState, useEffect } from 'react'; // Import React hooks for state management and side effects
import { Link } from 'react-router-dom'; // Import Link for navigation (though not used in this component)
import AdminService from '../components/service/AdminService'; // Import service for admin API interactions
import ShowDetailsModal from '../components/admin/ShowDetailsModal'; // Import modal for viewing admin details
import EditAdminModal from '../components/admin/EditAdminModal'; // Import modal for editing admin accounts
import AddAdminModal from '../components/admin/AddAdminModal'; // Import modal for adding new admin accounts
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome component for icons
import { faSpinner } from '@fortawesome/free-solid-svg-icons'; // Import spinner icon for loading states

function AdminAccountsSection() {
  // State for storing the list of admin accounts
  const [admins, setAdmins] = useState([]);
  // State for tracking which admin is currently selected for operations
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  // State to control the visibility of the details modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  // State to control the visibility of the edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  // State to control the visibility of the add admin modal
  const [showAddModal, setShowAddModal] = useState(false);
  // State to track loading operations
  const [isLoading, setIsLoading] = useState(true);
  // State to store any error messages
  const [error, setError] = useState(null);

  // Fetch admin users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Function to fetch all admin users from the API
  const fetchUsers = async () => {
    setIsLoading(true); // Start loading state
    setError(null); // Clear any previous errors
    try {
      const token = localStorage.getItem('token'); // Get authentication token from local storage
      const response = await AdminService.getAllUsers(token); // Call API service to get all users
      
      // Check if response contains user data
      if (response && response.ourUsersList) {
        setAdmins(response.ourUsersList); // Update state with admin users
      } else {
        throw new Error('Failed to fetch admin accounts'); // Throw error if response is invalid
      }
    } catch (error) {
      console.error('Error fetching users:', error); // Log error to console
      setError('Error loading admin accounts. Please try again.'); // Set user-friendly error message
    } finally {
      setIsLoading(false); // End loading state regardless of outcome
    }
  };

  // Handler for opening the details modal for a specific admin
  const handleShowDetails = (admin) => {
    setSelectedAdmin(admin); // Set the selected admin
    setShowDetailsModal(true); // Show the details modal
  };

  // Handler for opening the edit modal for a specific admin
  const handleEdit = (admin) => {
    setSelectedAdmin(admin); // Set the selected admin
    setShowEditModal(true); // Show the edit modal
  };

  // Handler for deleting an admin account
  const handleDelete = async (adminId) => {
    try {
      // Show confirmation dialog before deleting
      if (window.confirm('Are you sure you want to delete this admin account?')) {
        const token = localStorage.getItem('token'); // Get authentication token
        await AdminService.deleteUser(adminId, token); // Call API to delete user
        fetchUsers(); // Refresh the user list after deletion
      }
    } catch (error) {
      console.error('Error deleting admin:', error); // Log error to console
      setError('Error deleting admin account. Please try again.'); // Set user-friendly error message
    }
  };

  // Handler for adding a new admin account
  const handleAddAdmin = async (newAdmin) => {
    try {
      setIsLoading(true); // Start loading state
      const token = localStorage.getItem('token'); // Get authentication token
      await AdminService.register(newAdmin, token); // Call API to register new admin
      fetchUsers(); // Refresh the user list after adding
      setShowAddModal(false); // Close the add modal
    } catch (error) {
      console.error('Error adding admin:', error); // Log error to console
      // Show alert with error details from the API response if available
      alert('Failed to add admin: ' + (error.response?.data?.message || error.message));
      setIsLoading(false); // End loading state on error
    }
  };

  // Handler for updating an existing admin account
  const handleUpdateAdmin = async (updatedAdmin) => {
    try {
      setIsLoading(true); // Start loading state
      const token = localStorage.getItem('token'); // Get authentication token
      await AdminService.updateUser(updatedAdmin.id, updatedAdmin, token); // Call API to update user
      fetchUsers(); // Refresh the user list after update
      setShowEditModal(false); // Close the edit modal
    } catch (error) {
      console.error('Error updating admin:', error); // Log error to console
      // Show alert with error details from the API response if available
      alert('Failed to update admin: ' + (error.response?.data?.message || error.message));
      setIsLoading(false); // End loading state on error
    }
  };

  // Function to conditionally render content based on loading and error states
  const renderContent = () => {
    // Show loading indicator when initially loading with no data yet
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
      // Show error message with retry button if there's an error and no data
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
    // Commented out code for showing a message when no admin accounts exist
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
    
    // Default view - list of admin accounts and add button
    return (
      <>
        {/* Admin List - renders each admin as a card with actions */}
        <div className="space-y-4">
          {admins.map((admin) => (
            <div key={admin.id} className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Admin avatar circle with first initial of name */}
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">{admin.name ? admin.name[0].toUpperCase() : 'A'}</span>
                </div>
                <div>
                  {/* Admin name */}
                  <h3 className="text-white font-medium">{admin.name}</h3>
                  {/* Show details button */}
                  <button
                    onClick={() => handleShowDetails(admin)}
                    className="text-purple-400 hover:text-purple-300 text-sm"
                  >
                    Show Details
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {/* Edit button */}
                <button
                  onClick={() => handleEdit(admin)}
                  className="text-gray-400 hover:text-white"
                >
                  Edit
                </button>
                {/* Delete button */}
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

        {/* Add Account Button - opens the add admin modal */}
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
        {/* Commented out section header */}
        {/* <h2 className="text-2xl text-white font-bold">Accounts Dashboard</h2> */}
        
        {/* Commented out refresh button */}
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

      {/* Render main content based on state */}
      {renderContent()}

      {/* Full-screen loading overlay shown during operations with existing data */}
      {isLoading && admins.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-purple-500 text-4xl mb-4" />
            <p className="text-white">Processing...</p>
          </div>
        </div>
      )}

      {/* Conditional rendering of modals */}
      {/* Details modal - shown when viewing admin details */}
      {showDetailsModal && selectedAdmin && (
        <ShowDetailsModal
          admin={selectedAdmin}
          onClose={() => {
            setShowDetailsModal(false); // Hide the modal
            setSelectedAdmin(null); // Clear selected admin
          }}
        />
      )}

      {/* Edit modal - shown when editing an admin */}
      {showEditModal && selectedAdmin && (
        <EditAdminModal
          admin={selectedAdmin}
          onClose={() => {
            setShowEditModal(false); // Hide the modal
            setSelectedAdmin(null); // Clear selected admin
          }}
          onSave={handleUpdateAdmin} // Pass update handler to modal
        />
      )}

      {/* Add modal - shown when adding a new admin */}
      {showAddModal && (
        <AddAdminModal
          onClose={() => setShowAddModal(false)} // Function to close the modal
          onAdd={handleAddAdmin} // Pass add handler to modal
        />
      )}
    </div>
  );
}

export default AdminAccountsSection; // Export the component for use in the admin dashboard