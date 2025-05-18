/**
 * Admin Profile Management Component
 * 
 * This component provides functionality for administrators to view and edit their personal profile.
 * It's part of the admin dashboard system and allows authenticated users to manage details like
 * their name, password, and address. The component offers a user-friendly interface with
 * edit/view modes, loading states, and error handling.
 * 
 * Key features:
 * - Fetches and displays the current admin's profile data
 * - Provides profile editing with appropriate form validation
 * - Handles secure password changes with option to preserve current password
 * - Manages API communication with proper authentication tokens
 * - Shows appropriate loading spinners and error messages
 * - Displays avatar with user initials or fallback icon
 * - Responsive design that matches the admin dashboard theme
 * 
 * The component is typically loaded in the admin dashboard when a user clicks on
 * their profile or selects the profile management option from the navigation.
 */

import { useState, useEffect } from 'react'; // Import React hooks for state management and side effects
import AdminService from '../components/service/AdminService'; // Import the service that handles API calls
import { Link, useParams, useNavigate } from 'react-router-dom'; // Import routing utilities
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome component
import { faSpinner, faExclamationTriangle, faUserCircle } from '@fortawesome/free-solid-svg-icons'; // Import specific icons

function YourProfileSection() {
  // State to track whether the user is currently editing their profile
  const [isEditing, setIsEditing] = useState(false);
  // State to track loading states during API calls
  const [isLoading, setIsLoading] = useState(true);
  // State to store any error messages
  const [error, setError] = useState(null);
  // State to store the user's profile data fetched from the server
  const [profileInfo, setProfileInfo] = useState({
    name: '',
    email: '',
    password: '',
    city: ''
  });

  // Hook for programmatic navigation
  const navigate = useNavigate();
  // Extract userId from URL parameters (if present)
  const { userId } = useParams();

  // State to store the form data that the user can modify
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    city: ''
  });

  // Secondary state for storing another user's data when viewing as an admin
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    city: ''
  });

  // Effect hook that runs when the component mounts or userId changes
  useEffect(() => {
    fetchProfileInfo(); // Fetch the current user's profile data
    
    // If a userId is provided in the URL, fetch that specific user's data
    if (userId) {
      fetchUserDataById(userId);
    }
  }, [userId]); // Dependencies array - effect runs when userId changes

  // Effect hook to update form data whenever profile information changes
  useEffect(() => {
    if (profileInfo) {
      setFormData({
        name: profileInfo.name || '',
        email: profileInfo.email || '',
        password: profileInfo.password || '',
        city: profileInfo.city || ''
      });
    }
  }, [profileInfo]); // Dependencies array - effect runs when profileInfo changes

  // Function to fetch the current user's profile data from the API
  const fetchProfileInfo = async () => {
    setIsLoading(true); // Start loading state
    setError(null); // Clear any previous errors
    try {
      const token = localStorage.getItem('token'); // Get authentication token from storage
      const response = await AdminService.getYourProfile(token); // Call API service
      
      // If API call was successful, update the profile info state
      if (response && response.ourUsers) {
        setProfileInfo(response.ourUsers);
      } else {
        throw new Error('Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching profile information:', error); // Log error to console
      setError('Error loading profile information. Please try again.'); // Set user-friendly error
    } finally {
      setIsLoading(false); // End loading state regardless of outcome
    }
  };

  // Function to fetch another user's data by their ID (used by admins)
  const fetchUserDataById = async (userId) => {
    try {
      const token = localStorage.getItem('token'); // Get authentication token
      const response = await AdminService.getUserById(userId, token); // Call API service
      
      // If API call was successful, extract and store user data
      if (response && response.ourUsers) {
        const { name, email, role, city } = response.ourUsers;
        setUserData({ name, email, role, city });
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // No error state update here as this is a secondary function
    }
  };

  // Event handler for form input changes
  const handleChange = (e) => {
    const { name, value } = e.target; // Extract field name and new value
    setFormData(prev => ({
      ...prev, // Keep all existing form data
      [name]: value // Update only the changed field
    }));
  };

  // Event handler for form submission (saving profile changes)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    try {
      setIsLoading(true); // Start loading state
      const token = localStorage.getItem('token'); // Get authentication token
      
      // Get the user ID from the profile data
      const userId = profileInfo.id;
      
      // Validate that we have a user ID
      if (!userId) {
        throw new Error('User ID not found');
      }
      
      // Prepare data object for API call
      const updateData = {
        id: userId,
        name: formData.name,
        email: formData.email,
        password: formData.password || null, // Only send password if provided
        city: formData.city,
        role: profileInfo.role // Keep existing role unchanged
      };
      
      // Call API service to update the user
      await AdminService.updateUser(userId, updateData, token);
      
      // Update local state with the new data
      setProfileInfo({
        ...profileInfo,
        ...updateData
      });
      setIsEditing(false); // Exit editing mode
      
      // Show success message
      alert('Profile updated successfully');
      
      // Refresh data from server to ensure consistency
      fetchProfileInfo();
      
    } catch (error) {
      console.error('Error updating profile:', error); // Log error to console
      setError('Failed to update profile: ' + (error.message || 'Unknown error')); // Set user-friendly error
    } finally {
      setIsLoading(false); // End loading state regardless of outcome
    }
  };

  // Function that renders different content based on component state
  const renderContent = () => {
    // Show loading spinner when initially loading with no data yet
    if (isLoading && !profileInfo.name) {
      return (
        <div className="p-4 text-center pt-15">
          <div className="inline-block animate-spin text-purple-500 text-4xl mb-4">
            <FontAwesomeIcon icon={faSpinner} />
          </div>
          <p className="text-gray-300">Loading Profile Data...</p>
        </div>
      );
    } 
    // Show error message when loading fails and no data is available
    else if (error && !profileInfo.name) {
      return (
        <div className="p-4 bg-red-500/20 text-red-100 rounded-md">
          <div className="flex items-center mb-2">
            <p className="font-bold">Failed to load profile data</p>
          </div>
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchProfileInfo}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md"
          >
            Retry
          </button>
        </div>
      );
    } 
    // Show profile form when data is loaded successfully
    else {
      return (
        <div className="max-w-2xl mx-auto bg-gray-800/50 rounded-lg shadow-xl">
          {/* Profile header with avatar and title */}
          <div className="p-6 border-b border-gray-700 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                {formData.name ? (
                  <span className="text-white text-2xl">{formData.name[0]?.toUpperCase()}</span>
                ) : (
                  <span className="text-white text-2xl">
                    <FontAwesomeIcon icon={faUserCircle} />
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-2xl text-white font-bold">Your Profile</h2>
              </div>
            </div>
            {/* Edit button - only shown when not currently editing or loading */}
            {!isEditing && !isLoading && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-purple-400 hover:text-purple-300"
              >
                Edit
              </button>
            )}
          </div>

          {/* Profile form with user information */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Loading overlay - shown when saving changes */}
            {isLoading && isEditing && (
              <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center z-10">
                <div className="animate-spin text-purple-500 text-4xl">
                  <FontAwesomeIcon icon={faSpinner} />
                </div>
              </div>
            )}
            
            {/* Error message - only shown when in edit mode */}
            {error && isEditing && (
              <div className="bg-red-500/20 text-red-100 p-3 rounded-md mb-4">
                <p>{error}</p>
                <button 
                  className="text-red-300 underline mt-1" 
                  onClick={() => setError(null)}
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Name input field */}
            <div>
              <label className="block text-sm text-gray-400">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing || isLoading}
                className={`w-full mt-1 p-3 rounded bg-gray-700/50 text-white border ${
                  isEditing ? 'border-purple-500' : 'border-transparent'
                } ${(!isEditing || isLoading) && 'cursor-not-allowed'}`}
              />
            </div>

            {/* Password input field - shows masked password in view mode */}
            <div>
              <label className="block text-sm text-gray-400">Password</label>
              <input
                type="password"
                name="password"
                value={isEditing ? formData.password : "***************"}
                onChange={handleChange}
                disabled={!isEditing || isLoading}
                className={`w-full mt-1 p-3 rounded bg-gray-700/50 text-white border ${
                  isEditing ? 'border-purple-500' : 'border-transparent'
                } ${(!isEditing || isLoading) && 'cursor-not-allowed'}`}
                placeholder={isEditing ? "Enter new password" : ""}
              />
              {/* Help text for password field */}
              {isEditing && (
                <p className="text-xs text-gray-400 mt-1">Leave blank to keep current password</p>
              )}
            </div>

            {/* Email input field - always disabled to prevent changes */}
            <div>
              <label className="block text-sm text-gray-400">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={true}
                className={`w-full mt-1 p-3 rounded bg-gray-700/50 text-white border border-transparent cursor-not-allowed`}
              />
            </div>

            {/* Address/City input field */}
            <div>
              <label className="block text-sm text-gray-400">Address</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={!isEditing || isLoading}
                className={`w-full mt-1 p-3 rounded bg-gray-700/50 text-white border ${
                  isEditing ? 'border-purple-500' : 'border-transparent'
                } ${(!isEditing || isLoading) && 'cursor-not-allowed'}`}
              />
            </div>

            {/* Form buttons - only shown in edit mode */}
            {isEditing && (
              <div className="flex justify-end space-x-4 pt-4">
                {/* Cancel button - resets form and exits edit mode */}
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setError(null);
                    // Reset form data to current profile info values
                    setFormData({
                      name: profileInfo.name || '',
                      email: profileInfo.email || '',
                      password: '',
                      city: profileInfo.city || ''
                    });
                  }}
                  disabled={isLoading}
                  className="px-4 py-2 text-white border border-gray-600 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                {/* Submit button - saves changes */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      );
    }
  };

  // Main component render with top padding to position content below navbar
  return (
    <div className="pt-20">
      {renderContent()} {/* Call the function to render appropriate content */}
    </div>
  );
}

export default YourProfileSection; // Export the component for use in the app