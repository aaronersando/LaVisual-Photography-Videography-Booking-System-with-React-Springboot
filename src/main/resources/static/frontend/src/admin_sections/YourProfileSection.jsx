import { useState , useEffect} from 'react';
import AdminService from '../components/service/AdminService';
import { Link } from 'react-router-dom';

function YourProfileSection() {
  const [isEditing, setIsEditing] = useState(false);
  // const [profile, setProfile] = useState({
  //   name: 'Admin 1',
  //   email: 'agersando29@gmail.com',
  //   password: 'testing 1',
  //   address: 'Plaridel Bulacan',
  //   phoneNumber: '09665469008'
  // });
  const [profileInfo, setProfileInfo] = useState({});

  useEffect(() => {
    fetchProfileInfo();
}, []);

  const fetchProfileInfo = async () => {
    try {

        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        const response = await AdminService.getYourProfile(token);
        setProfileInfo(response.ourUsers);
    } catch (error) {
        console.error('Error fetching profile information:', error);
    }
};


  const [formData, setFormData] = useState(profileInfo);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="p-6 pt-20">
      <div className="max-w-2xl mx-auto bg-gray-800/50 rounded-lg shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
              {/* <span className="text-white text-2xl">{(formData.name[0]).toUpperCase()}</span> */}
              <span className="text-white text-2xl">A</span>
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
              value={isEditing ? formData.name : profileInfo.name}
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
              value={isEditing ? formData.password : profileInfo.password}
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
              value={isEditing ? formData.email : profileInfo.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full mt-1 p-3 rounded bg-gray-700/50 text-white border ${
                isEditing ? 'border-purple-500' : 'border-transparent'
              } ${!isEditing && 'cursor-not-allowed'}`}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400">Address</label>
            <input
              type="text"
              name="address"
              value={isEditing ? formData.address : profileInfo.city}
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
                  setFormData(profile);
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