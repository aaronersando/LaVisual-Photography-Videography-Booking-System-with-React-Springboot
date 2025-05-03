import { useState, useEffect } from 'react';
import AdminService from '../components/service/AdminService';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faExclamationTriangle, faUserCircle } from '@fortawesome/free-solid-svg-icons';

function YourProfileSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileInfo, setProfileInfo] = useState({
    name: '',
    email: '',
    password: '',
    city: ''
  });

  const navigate = useNavigate();
  const { userId } = useParams();

  // Initialize formData with empty values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    city: ''
  });

  // Optional: Add userData state if you need it for the getUserById functionality
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    city: ''
  });

  // Fetch profile data when component mounts
  useEffect(() => {
    fetchProfileInfo();
    
    // Only fetch user data if userId exists
    if (userId) {
      fetchUserDataById(userId);
    }
  }, [userId]);

  // Update formData whenever profileInfo changes
  useEffect(() => {
    if (profileInfo) {
      setFormData({
        name: profileInfo.name || '',
        email: profileInfo.email || '',
        password: profileInfo.password || '',
        city: profileInfo.city || ''
      });
    }
  }, [profileInfo]);

  const fetchProfileInfo = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await AdminService.getYourProfile(token);
      
      if (response && response.ourUsers) {
        setProfileInfo(response.ourUsers);
      } else {
        throw new Error('Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching profile information:', error);
      setError('Error loading profile information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserDataById = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await AdminService.getUserById(userId, token);
      
      if (response && response.ourUsers) {
        const { name, email, role, city } = response.ourUsers;
        setUserData({ name, email, role, city });
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // We don't set the main error state here as this is secondary functionality
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      // Get the user ID from profileInfo
      const userId = profileInfo.id;
      
      if (!userId) {
        throw new Error('User ID not found');
      }
      
      // Create data object to submit to API
      const updateData = {
        id: userId,
        name: formData.name,
        email: formData.email,
        password: formData.password || null, // Only send password if provided
        city: formData.city,
        role: profileInfo.role // Keep existing role
      };
      
      // Use the existing updateUser method instead of creating updateProfile
      await AdminService.updateUser(userId, updateData, token);
      
      // Update local state with new data
      setProfileInfo({
        ...profileInfo,
        ...updateData
      });
      setIsEditing(false);
      
      // Show success message
      alert('Profile updated successfully');
      
      // Refresh profile data from server to ensure everything is up to date
      fetchProfileInfo();
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile: ' + (error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Render content based on loading and error states
  const renderContent = () => {
    if (isLoading && !profileInfo.name) {
      return (
        <div className="p-4 text-center pt-15">
          <div className="inline-block animate-spin text-purple-500 text-4xl mb-4">
            <FontAwesomeIcon icon={faSpinner} />
          </div>
          <p className="text-gray-300">Loading Profile Data...</p>
        </div>
      );
    } else if (error && !profileInfo.name) {
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
    } else {
      return (
        <div className="max-w-2xl mx-auto bg-gray-800/50 rounded-lg shadow-xl">
          {/* Header */}
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
            {!isEditing && !isLoading && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-purple-400 hover:text-purple-300"
              >
                Edit
              </button>
            )}
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {isLoading && isEditing && (
              <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center z-10">
                <div className="animate-spin text-purple-500 text-4xl">
                  <FontAwesomeIcon icon={faSpinner} />
                </div>
              </div>
            )}
            
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
              {isEditing && (
                <p className="text-xs text-gray-400 mt-1">Leave blank to keep current password</p>
              )}
            </div>

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

            {isEditing && (
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setError(null);
                    // Reset formData to current profileInfo
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

  return (
    <div className="pt-20">
      {renderContent()}
    </div>
  );
}

export default YourProfileSection;