/**
 * Admin Dashboard Component
 * 
 * This component serves as the main administrative interface for the photography/videography business.
 * It provides a centralized dashboard with multiple sections for managing different aspects of the business:
 * 
 * - Analytics: View business metrics and charts
 * - Calendar: Manage booking schedules and appointments
 * - Admin Accounts: Control user access and manage administrator accounts
 * - Profile Management: Update personal admin information
 * - Pending Bookings: Review and approve/reject booking requests
 * 
 * The component features a responsive design with a collapsible sidebar navigation, a fixed header
 * with user profile information, and a dynamic content area that renders different admin sections
 * based on user selection. It also handles authentication checking and profile data fetching.
 * 
 * This is a protected route component that should only be accessible to authenticated administrators.
 */

import { useState, useEffect } from 'react'; // Import React hooks for state management and side effects
import { Link, Routes, Route } from 'react-router-dom'; // Import routing components from React Router
import CalendarSection from '../../admin_sections/CalendarSection'; // Import calendar management component
import AdminAccountsSection from '../../admin_sections/AdminAccountsSection'; // Import admin user management component
import YourProfileSection from '../../admin_sections/YourProfileSection'; // Import profile management component
import AdminService from '../../components/service/AdminService'; // Import admin authentication service
import PendingBookings from '../../admin_sections/PendingBookings'; // Import pending bookings management component
import DataAnalytics from '../../admin_sections/DataAnalytics'; // Import analytics dashboard component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome icon component
import { 
  faBars, faCalendar, faCircleUser, faSignOut, faUser, 
  faUserAlt, faUserCheck, faUserClock, faUserEdit, 
  faUserFriends, faUserGear, faChartLine 
} from '@fortawesome/free-solid-svg-icons'; // Import specific icons from FontAwesome


function Admin() {
  // State to control sidebar navigation visibility (default is open)
  const [isNavOpen, setIsNavOpen] = useState(true);
  // State to track which dashboard section is currently active (default is analytics)
  const [currentSection, setCurrentSection] = useState('analytics');

  // Check if user is authenticated and has admin role using AdminService
  const isAuthenticated = AdminService.isAuthenticated();
  const isAdmin = AdminService.isAdmin();

  // State to store the admin's profile information with a default name
  const [adminProfile, setAdminProfile] = useState({ name: 'Admin' });

  // Effect hook that runs once when component mounts to fetch admin profile data
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        // Get authentication token from browser storage
        const token = localStorage.getItem('token');
        if (token) {
          // Call API service to get current admin's profile info
          const response = await AdminService.getYourProfile(token);
          console.log('Admin profile response:', response); // Log response for debugging
          // Update state with profile data if available
          if (response && response.ourUsers) {
            setAdminProfile(response.ourUsers);
          }
        }
      } catch (error) {
        // Log any errors that occur during profile fetching
        console.error('Error fetching admin profile:', error);
      }
    };

    // Execute the profile fetching function
    fetchAdminProfile();
  }, []); // Empty dependency array means this effect runs only once after initial render
  
  // Handler function for logging out
  const handleLogout = () => {
    // Show confirmation dialog before logging out
    const confirmDelete = window.confirm('Are you sure you want to logout this user?');
    if (confirmDelete) {
        // Call logout method from AdminService if user confirms
        AdminService.logout();
    }
  };

  // Function to toggle sidebar navigation visibility
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  // Main component render
  return (
    // Main container with dark background
    <div className="min-h-screen bg-gray-900">
      
      {/* Fixed header with dashboard title and user profile */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 shadow-lg px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Left side with hamburger menu and dashboard title */}
          <div className="flex items-center space-x-4">
            <button onClick={toggleNav} className="text-white hover:cursor-pointer">
              <FontAwesomeIcon icon={faBars} className='text-xl'/>
            </button>
            <h1 className="text-2xl text-white font-bold">Admin Dashboard</h1>
          </div>
          {/* Right side with user profile avatar and name - clicking navigates to profile section */}
          <Link to="#" className="flex items-center space-x-2" onClick={() => setCurrentSection('profile')}>
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
              <span className="text-white font-medium">
                {/* Display first letter of admin name as avatar, or 'A' if name not available */}
                {adminProfile && adminProfile.name ? adminProfile.name[0]?.toUpperCase() : 'A'}
              </span>
            </div>
            {/* Display admin name or 'Admin' if name not available */}
            <h2 className="text-white">{adminProfile && adminProfile.name ? adminProfile.name : 'Admin'}</h2>
          </Link>
        </div>
      </header>

      {/* Main content area with sidebar and dynamic content */}
      <div className="flex">
        {/* Collapsible sidebar navigation with slide animation */}
        <nav className={`fixed left-0 top-0 h-full w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out ${isNavOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ marginTop: '72px' }}>
          <div className="flex flex-col p-4">
            {/* Analytics dashboard button - highlighted when active */}
            <button
              onClick={() => setCurrentSection('analytics')}
              className={`flex hover:cursor-pointer items-center space-x-2 p-3 rounded-lg ${currentSection === 'analytics' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            >
                <FontAwesomeIcon icon={faChartLine} className='text-xl w-6 h-6'/>
                <span>Analytics</span>
            </button>
            {/* Calendar/schedule management button */}
            <button
              onClick={() => setCurrentSection('calendar')}
              className={`flex hover:cursor-pointer items-center space-x-2 p-3 rounded-lg ${currentSection === 'calendar' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            >
                <FontAwesomeIcon icon={faCalendar} className='text-xl w-6 h-6'/>
                <span>Calendar</span>
              </button>

              {/* Admin accounts management button */}
              <button
                onClick={() => setCurrentSection('accounts')}
                className={`flex items-center space-x-2 p-3 hover:cursor-pointer rounded-lg ${currentSection === 'accounts' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                <FontAwesomeIcon icon={faUserFriends} className='text-xl w-6 h-6'/>
              <span>Admin Accounts</span>
            </button>

            {/* Profile management button */}
            <button
              onClick={() => setCurrentSection('profile')}
              className={`flex items-center space-x-2 p-3 rounded-lg hover:cursor-pointer ${currentSection === 'profile' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            >
                <FontAwesomeIcon icon={faUserGear} className='text-xl w-6 h-6'/>
              <span>Your Profile</span>
            </button>

            {/* Pending bookings review button */}
            <button
              onClick={() => setCurrentSection('pendingBookings')}
              className={`flex items-center space-x-2 p-3 rounded-lg hover:cursor-pointer ${currentSection === 'pendingBookings' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            >
                <FontAwesomeIcon icon={faUserClock} className='text-xl w-6 h-6'/>
              <span>Pending Bookings</span>
            </button>

            {/* Logout button - navigates to home page and triggers logout */}
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

        {/* Main content area - adjusts margin based on sidebar visibility */}
        <main className={`flex-1 px-6 transition-all duration-300 ${isNavOpen ? 'ml-64' : ''}`}>
          {/* Conditional rendering based on which section is active */}
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

export default Admin; // Export the component for use in the application