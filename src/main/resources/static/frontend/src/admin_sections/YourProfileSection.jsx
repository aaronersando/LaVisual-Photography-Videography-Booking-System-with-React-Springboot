import { useState, useEffect } from 'react';
import AdminService from '../components/service/AdminService';
import { Link, useParams, useNavigate } from 'react-router-dom';

function YourProfileSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileInfo, setProfileInfo] = useState({
    name: '',
    email: '',
    password: '',
    city: ''
  });

  const navigate = useNavigate();
  const { userId } = useParams(); // Fixed: Added parentheses

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
    try {
      const token = localStorage.getItem('token');
      const response = await AdminService.getYourProfile(token);
      setProfileInfo(response.ourUsers);
    } catch (error) {
      console.error('Error fetching profile information:', error);
    }
  };

  const fetchUserDataById = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await AdminService.getUserById(userId, token);
      const { name, email, role, city } = response.ourUsers;
      setUserData({ name, email, role, city });
    } catch (error) {
      console.error('Error fetching user data:', error);
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
      alert('Failed to update profile: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <div className="p-6 pt-20">
      <div className="max-w-2xl mx-auto bg-gray-800/50 rounded-lg shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
              {formData.name ? (
                <span className="text-white text-2xl">{formData.name[0]?.toUpperCase()}</span>
              ) : (
                <span className="text-white text-2xl">A</span>
              )}
            </div>
            <div>
              <h2 className="text-2xl text-white font-bold">Your Profile</h2>
            </div>
          </div>
          {!isEditing && (
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
          <div>
            <label className="block text-sm text-gray-400">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full mt-1 p-3 rounded bg-gray-700/50 text-white border ${
                isEditing ? 'border-purple-500' : 'border-transparent'
              } ${!isEditing && 'cursor-not-allowed'}`}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400">Password</label>
            <input
              type="password"
              name="password"
              value="***************"
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full mt-1 p-3 rounded bg-gray-700/50 text-white border ${
                isEditing ? 'border-purple-500' : 'border-transparent'
              } ${!isEditing && 'cursor-not-allowed'}`}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={true}
              className={`w-full mt-1 p-3 rounded bg-gray-700/50 text-white border ${
                isEditing ? 'border-purple-500' : 'border-transparent'
              } ${!isEditing && 'cursor-not-allowed'}`}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400">Address</label>
            <input
              type="text"
              name="city" // Changed from "address" to "city" to match state property
              value={formData.city}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full mt-1 p-3 rounded bg-gray-700/50 text-white border ${
                isEditing ? 'border-purple-500' : 'border-transparent'
              } ${!isEditing && 'cursor-not-allowed'}`}
            />
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  // Reset formData to current profileInfo
                  setFormData({
                    name: profileInfo.name || '',
                    email: profileInfo.email || '',
                    password: profileInfo.password || '',
                    city: profileInfo.city || ''
                  });
                }}
                className="px-4 py-2 text-white border border-gray-600 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default YourProfileSection;