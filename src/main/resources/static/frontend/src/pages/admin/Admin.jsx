import { useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import CalendarSection from '../../admin_sections/CalendarSection';
import AdminAccountsSection from '../../admin_sections/AdminAccountsSection';
import YourProfileSection from '../../admin_sections/YourProfileSection';
import AdminService from '../../components/service/AdminService';


function Admin() {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [currentSection, setCurrentSection] = useState('calendar');

  const isAuthenticated = AdminService.isAuthenticated();
  const isAdmin = AdminService.isAdmin();

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
            <button onClick={toggleNav} className="text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-2xl text-white font-bold">Admin Dashboard</h1>
          </div>
          <Link to="/" className="flex items-center space-x-2" onClick={handleLogout}>
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
              <span className="text-white font-medium">A</span>
            </div>
            <h2>Admin 1</h2>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Vertical Navigation */}
        <nav className={`fixed left-0 top-0 h-full w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out ${isNavOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ marginTop: '72px' }}>
          <div className="flex flex-col p-4">
            <button
              onClick={() => setCurrentSection('calendar')}
              className={`flex items-center space-x-2 p-3 rounded-lg ${currentSection === 'calendar' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Calendar</span>
            </button>

            <button
              onClick={() => setCurrentSection('accounts')}
              className={`flex items-center space-x-2 p-3 rounded-lg ${currentSection === 'accounts' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Admin Accounts</span>
            </button>

            <button
              onClick={() => setCurrentSection('profile')}
              className={`flex items-center space-x-2 p-3 rounded-lg ${currentSection === 'profile' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Your Profile</span>
            </button>

            <Link to={"/"} onClick={handleLogout}>
              <button
                className={`flex items-center space-x-2 p-3 rounded-lg ${currentSection === 'logout' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700 w-full  active:bg-purple-600'}`}
              >
                <i className="fa fa-sign-out pl-2" aria-hidden="true"></i>
                <span>Log out</span>
              </button>
            </Link>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className={`flex-1 px-6 transition-all duration-300 ${isNavOpen ? 'ml-64' : ''}`}>
          {currentSection === 'calendar' && <CalendarSection />}
          {currentSection === 'accounts' && <AdminAccountsSection />}
          {currentSection === 'profile' && <YourProfileSection />}
        </main>
      </div>
    </div>
  );
}

export default Admin;
