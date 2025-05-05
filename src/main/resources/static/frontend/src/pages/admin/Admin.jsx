import { useState, useEffect } from 'react'; 
import { Link, Routes, Route } from 'react-router-dom';
import CalendarSection from '../../admin_sections/CalendarSection';
import AdminAccountsSection from '../../admin_sections/AdminAccountsSection';
import YourProfileSection from '../../admin_sections/YourProfileSection';
import AdminService from '../../components/service/AdminService';
import PendingBookings from '../../admin_sections/PendingBookings';
import DataAnalytics from '../../admin_sections/DataAnalytics';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, faCalendar, faCircleUser, faSignOut, faUser, 
  faUserAlt, faUserCheck, faUserClock, faUserEdit, 
  faUserFriends, faUserGear, faChartLine 
} from '@fortawesome/free-solid-svg-icons';


function Admin() {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [currentSection, setCurrentSection] = useState('analytics');

  const isAuthenticated = AdminService.isAuthenticated();
  const isAdmin = AdminService.isAdmin();

  const [adminProfile, setAdminProfile] = useState({ name: 'Admin' });

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await AdminService.getYourProfile(token);
          console.log('Admin profile response:', response); 
          if (response && response.ourUsers) {
            setAdminProfile(response.ourUsers);
          }
        }
      } catch (error) {
        console.error('Error fetching admin profile:', error);
      }
    };

    fetchAdminProfile();
  }, []); 
  
  const handleLogout = () => {
    const confirmDelete = window.confirm('Are you sure you want to logout this user?');
    if (confirmDelete) {
        AdminService.logout();
    }
  };


  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    
    <div className="min-h-screen bg-gray-900">
      

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 shadow-lg px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button onClick={toggleNav} className="text-white hover:cursor-pointer">
              <FontAwesomeIcon icon={faBars} className='text-xl'/>
            </button>
            <h1 className="text-2xl text-white font-bold">Admin Dashboard</h1>
          </div>
          <Link to="#" className="flex items-center space-x-2" onClick={() => setCurrentSection('profile')}>
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
              <span className="text-white font-medium">
                {adminProfile && adminProfile.name ? adminProfile.name[0]?.toUpperCase() : 'A'}
              </span>
            </div>
            <h2 className="text-white">{adminProfile && adminProfile.name ? adminProfile.name : 'Admin'}</h2>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Vertical Navigation */}
        <nav className={`fixed left-0 top-0 h-full w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out ${isNavOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ marginTop: '72px' }}>
          <div className="flex flex-col p-4">
            <button
              onClick={() => setCurrentSection('analytics')}
              className={`flex hover:cursor-pointer items-center space-x-2 p-3 rounded-lg ${currentSection === 'analytics' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            >
                <FontAwesomeIcon icon={faChartLine} className='text-xl w-6 h-6'/>
                <span>Analytics</span>
            </button>
            <button
              onClick={() => setCurrentSection('calendar')}
              className={`flex hover:cursor-pointer items-center space-x-2 p-3 rounded-lg ${currentSection === 'calendar' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            >
                <FontAwesomeIcon icon={faCalendar} className='text-xl w-6 h-6'/>
                <span>Calendar</span>
              </button>

              <button
                onClick={() => setCurrentSection('accounts')}
                className={`flex items-center space-x-2 p-3 hover:cursor-pointer rounded-lg ${currentSection === 'accounts' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                <FontAwesomeIcon icon={faUserFriends} className='text-xl w-6 h-6'/>
              <span>Admin Accounts</span>
            </button>

            <button
              onClick={() => setCurrentSection('profile')}
              className={`flex items-center space-x-2 p-3 rounded-lg hover:cursor-pointer ${currentSection === 'profile' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            >
                <FontAwesomeIcon icon={faUserGear} className='text-xl w-6 h-6'/>
              <span>Your Profile</span>
            </button>

            <button
              onClick={() => setCurrentSection('pendingBookings')}
              className={`flex items-center space-x-2 p-3 rounded-lg hover:cursor-pointer ${currentSection === 'pendingBookings' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            >
                <FontAwesomeIcon icon={faUserClock} className='text-xl w-6 h-6'/>
              <span>Pending Bookings</span>
            </button>

            <Link to={"/"} onClick={handleLogout}>
              <button
                className={`flex items-center space-x-2 p-3 rounded-lg hover:cursor-pointer ${currentSection === 'logout' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700 w-full  active:bg-purple-600'}`}
              >
                <FontAwesomeIcon icon={faSignOut} className='text-xl w-6 h-6'/>
                <span>Log out</span>
              </button>
            </Link>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className={`flex-1 px-6 transition-all duration-300 ${isNavOpen ? 'ml-64' : ''}`}>
          {currentSection === 'analytics' && <DataAnalytics />}
          {currentSection === 'calendar' && <CalendarSection />}
          {currentSection === 'accounts' && <AdminAccountsSection />}
          {currentSection === 'profile' && <YourProfileSection />}
          {currentSection === 'pendingBookings' && <PendingBookings />}
        </main>
      </div>
    </div>
  );
}

export default Admin;