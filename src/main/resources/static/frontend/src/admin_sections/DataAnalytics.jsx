/**
 * Analytics Dashboard Component
 * 
 * This component displays a comprehensive analytics dashboard for a photography/videography business.
 * It shows key metrics like total bookings, revenue, monthly averages, and current month performance.
 * The dashboard features multiple visualizations including line charts, bar charts, pie charts, and 
 * doughnut charts to represent different aspects of the business data.
 * 
 * Key features:
 * - Fetches analytics data from the backend API with authentication
 * - Provides time range filtering (monthly, quarterly, yearly)
 * - Displays high-level KPIs in card format with icons
 * - Shows trend analysis with multiple chart types
 * - Falls back to mock data generation for development/testing
 * - Handles loading states and error conditions
 * - Fully responsive layout that works across device sizes
 * 
 * This component is typically used in the admin dashboard section of the application
 * to give business owners insight into their booking patterns and revenue.
 */

import React, { useState, useEffect } from 'react'; // Import React and core hooks
import axios from 'axios'; // Import axios for API requests
import { format, startOfMonth, endOfMonth, parseISO, subMonths } from 'date-fns'; // Import date utilities
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js'; // Import Chart.js components
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2'; // Import React wrappers for Chart.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome for icons
import { faSpinner, faCalendarAlt, faMoneyBillWave, faChartLine, faUsers, faCamera, faVideo } from '@fortawesome/free-solid-svg-icons'; // Import specific icons

// Register ChartJS components so they can be used in any chart
ChartJS.register(
  CategoryScale, // For category axes (like months)
  LinearScale, // For linear axes (like amounts)
  PointElement, // For points in line charts
  LineElement, // For lines in line charts
  BarElement, // For bars in bar charts
  ArcElement, // For pie and doughnut slices
  Title, // For chart titles
  Tooltip, // For tooltips on hover
  Legend, // For chart legends
  Filler // For filling area under line charts
);

function DataAnalytics() {
  // State for tracking loading status of data fetching
  const [loading, setLoading] = useState(true);
  // State for storing any error that occurs
  const [error, setError] = useState(null);
  // State for storing all analytics data with default empty values
  const [analyticsData, setAnalyticsData] = useState({
    totalBookings: 0, // Total number of bookings
    totalProfit: 0, // Total revenue from all bookings
    monthlyAvgBookings: 0, // Average bookings per month
    monthlyAvgProfit: 0, // Average revenue per month
    currentMonthBookings: 0, // Bookings in the current month
    currentMonthProfit: 0, // Revenue in the current month
    monthlyBookings: [], // Array of booking counts per month
    monthlyProfit: [], // Array of revenue amounts per month
    categoryDistribution: {}, // Object mapping service categories to booking counts
    packagePopularity: {} // Object mapping package names to booking counts
  });
  // State for tracking selected time range with default as 'year'
  const [timeRange, setTimeRange] = useState('year'); // Options: 'year', 'quarter', 'month'

  // Effect hook to fetch data whenever timeRange changes
  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  // Function to fetch analytics data from the API
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true); // Start loading state
      setError(null); // Clear any previous errors
      
      // Get authentication token from localStorage
      const token = localStorage.getItem('token');
      
      // Make API request with timeRange parameter and authentication
      const response = await axios.get(`http://localhost:8080/api/analytics/dashboard?range=${timeRange}`, {
        headers: { Authorization: `Bearer ${token}` } // Send token for authentication
      });
      
      // If API request was successful, update state with the data
      if (response.data.success) {
        setAnalyticsData(response.data.data);
      } else {
        // If API indicates an error, set the error message
        setError(response.data.message || 'Failed to fetch analytics data');
      }
    } catch (err) {
      // Handle any exceptions during the API call
      console.error('Error fetching analytics data:', err);
      setError('Error loading analytics data. Please try again.');
      
      // Generate mock data for development/demo purposes when API fails
      generateMockData();
    } finally {
      // Always set loading to false when done, regardless of success/failure
      setLoading(false);
    }
  };

  // Function to generate mock data for development and testing
  const generateMockData = () => {
    // Generate array of the last 12 months in "MMM yyyy" format (e.g., "Jan 2023")
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = subMonths(new Date(), 11 - i); // Calculate date for each month, starting 11 months ago
      return format(date, 'MMM yyyy'); // Format as "MMM yyyy"
    });
    
    // Generate random booking counts between 10-30 for each month
    const bookings = months.map(() => Math.floor(Math.random() * 20) + 10);
    
    // Generate random profit values based on booking counts (each booking generates ₱3000-₱6000)
    const profit = bookings.map(booking => booking * (Math.floor(Math.random() * 3000) + 3000));
    
    // Generate random data for category distribution
    const categories = {
      'Photography': Math.floor(Math.random() * 50) + 50, // 50-100 photography bookings
      'Videography': Math.floor(Math.random() * 30) + 30, // 30-60 videography bookings
      'Combo Package': Math.floor(Math.random() * 20) + 10 // 10-30 combo package bookings
    };
    
    // Generate random data for package popularity
    const packages = {
      'Intimate Session': Math.floor(Math.random() * 15) + 15, // 15-30 intimate sessions
      'Wedding': Math.floor(Math.random() * 10) + 10, // 10-20 weddings
      'Event Coverage': Math.floor(Math.random() * 10) + 5, // 5-15 event coverages
      'Wedding Complete': Math.floor(Math.random() * 5) + 5, // 5-10 complete wedding packages
      'Pre-Photoshoot': Math.floor(Math.random() * 5) + 3, // 3-8 pre-wedding photoshoots
      'Wedding Film': Math.floor(Math.random() * 5) + 2 // 2-7 wedding films
    };
    
    // Calculate total bookings and profit for summary stats
    const totalBookings = bookings.reduce((sum, val) => sum + val, 0);
    const totalProfit = profit.reduce((sum, val) => sum + val, 0);
    
    // Update state with generated mock data
    setAnalyticsData({
      totalBookings,
      totalProfit,
      monthlyAvgBookings: Math.round(totalBookings / 12), // Average bookings per month
      monthlyAvgProfit: Math.round(totalProfit / 12), // Average profit per month
      currentMonthBookings: bookings[bookings.length - 1], // Most recent month's bookings
      currentMonthProfit: profit[profit.length - 1], // Most recent month's profit
      monthlyBookings: months.map((month, i) => ({ month, value: bookings[i] })), // Format for chart display
      monthlyProfit: months.map((month, i) => ({ month, value: profit[i] })), // Format for chart display
      categoryDistribution: categories,
      packagePopularity: packages
    });
  };

  // Helper function to format currency values in PHP format
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', { 
      style: 'currency', 
      currency: 'PHP', // Philippine Peso
      maximumFractionDigits: 0 // No decimal places
    }).format(value);
  };

  // Configuration for monthly bookings line chart
  const bookingsChartData = {
    labels: analyticsData.monthlyBookings.map(item => item.month), // Month labels
    datasets: [
      {
        label: 'Bookings',
        data: analyticsData.monthlyBookings.map(item => item.value), // Booking values
        borderColor: 'rgb(147, 51, 234)', // Purple line color
        backgroundColor: 'rgba(147, 51, 234, 0.1)', // Light purple fill
        fill: true, // Fill area under the line
        tension: 0.4, // Curved line (0 = straight, 1 = very curved)
        pointBackgroundColor: 'rgb(147, 51, 234)', // Point color
        pointRadius: 4, // Size of points
        pointHoverRadius: 6 // Size of points on hover
      }
    ]
  };

  // Configuration for monthly profit bar chart
  const profitChartData = {
    labels: analyticsData.monthlyProfit.map(item => item.month), // Month labels
    datasets: [
      {
        label: 'Profit',
        data: analyticsData.monthlyProfit.map(item => item.value), // Profit values
        backgroundColor: 'rgba(79, 70, 229, 0.7)', // Semi-transparent indigo bars
        borderColor: 'rgb(79, 70, 229)', // Indigo border
        borderWidth: 1 // Border thickness
      }
    ]
  };

  // Configuration for category distribution pie chart
  const categoryChartData = {
    labels: Object.keys(analyticsData.categoryDistribution), // Category names
    datasets: [
      {
        data: Object.values(analyticsData.categoryDistribution), // Category values
        backgroundColor: [
          'rgba(147, 51, 234, 0.7)',  // Purple
          'rgba(79, 70, 229, 0.7)',   // Indigo
          'rgba(59, 130, 246, 0.7)'   // Blue
        ],
        borderColor: [
          'rgb(147, 51, 234)',
          'rgb(79, 70, 229)',
          'rgb(59, 130, 246)'
        ],
        borderWidth: 1 // Slice border thickness
      }
    ]
  };

  // Configuration for package popularity doughnut chart
  const packageChartData = {
    labels: Object.keys(analyticsData.packagePopularity), // Package names
    datasets: [
      {
        data: Object.values(analyticsData.packagePopularity), // Package values
        backgroundColor: [
          'rgba(147, 51, 234, 0.7)',  // Purple
          'rgba(79, 70, 229, 0.7)',   // Indigo
          'rgba(59, 130, 246, 0.7)',  // Blue
          'rgba(16, 185, 129, 0.7)',  // Green
          'rgba(245, 158, 11, 0.7)',  // Yellow
          'rgba(239, 68, 68, 0.7)'    // Red
        ],
        borderWidth: 0, // No border
        hoverOffset: 5 // Offset when hovering over a slice
      }
    ]
  };

  // Options for line charts
  const lineChartOptions = {
    responsive: true, // Resize chart when container resizes
    maintainAspectRatio: false, // Allow custom height
    plugins: {
      legend: {
        position: 'top', // Legend position
        labels: {
          color: 'white', // Legend text color
          font: {
            size: 12 // Legend font size
          }
        }
      },
      tooltip: {
        mode: 'index', // Show tooltip for all datasets at current index
        intersect: false // Show tooltip when hover near the point, not only on it
      }
    },
    scales: {
      y: {
        beginAtZero: true, // Start Y axis from zero
        grid: {
          color: 'rgba(255, 255, 255, 0.1)' // Light grid lines
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)' // Y-axis label color
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)' // Light grid lines
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)' // X-axis label color
        }
      }
    }
  };

  // Options for bar charts, extending line chart options
  const barChartOptions = {
    ...lineChartOptions, // Copy all line chart options
    plugins: {
      ...lineChartOptions.plugins, // Copy plugin options
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Profit: ${formatCurrency(context.parsed.y)}`; // Format tooltip to show currency
          }
        }
      }
    }
  };

  // Options for pie and doughnut charts
  const pieChartOptions = {
    responsive: true, // Resize chart when container resizes
    maintainAspectRatio: false, // Allow custom height
    plugins: {
      legend: {
        position: 'right', // Legend on right side
        labels: {
          color: 'white', // Legend text color
          font: {
            size: 12 // Legend font size
          },
          padding: 20 // Padding between legend items
        }
      }
    }
  };

  // Conditional rendering for loading state
  if (loading) {
    return (
      <div className="p-4 text-center pt-20 mt-14">
        <div className="inline-block animate-spin text-purple-500 text-4xl mb-4">
          <FontAwesomeIcon icon={faSpinner} /> {/* Spinning loading icon */}
        </div>
        <p className="text-gray-300">Loading Analytics Data...</p>
      </div>
    );
  }

  // Conditional rendering for error state
  if (error) {
    return (
      <div className="p-4 bg-red-500/20 text-red-100 rounded-md mt-20">
        <p className="font-bold mb-2">Failed to load analytics data</p>
        <p className="mb-4">{error}</p>
        <button
          onClick={fetchAnalyticsData} // Retry button calls fetchAnalyticsData again
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  // Main dashboard rendering when data is loaded successfully
  return (
    <div className="pt-20 pb-10 px-4">
      <h2 className="text-2xl text-white font-bold mb-6">Analytics Dashboard</h2>
      
      {/* Time range selector - toggles between month, quarter, year views */}
      <div className="flex justify-end mb-6">
        <div className="bg-gray-800 rounded-lg p-1 inline-flex">
          <button 
            onClick={() => setTimeRange('month')} // Change time range to month
            className={`px-4 py-2 rounded-md ${timeRange === 'month' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Month
          </button>
          <button 
            onClick={() => setTimeRange('quarter')} // Change time range to quarter
            className={`px-4 py-2 rounded-md ${timeRange === 'quarter' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Quarter
          </button>
          <button 
            onClick={() => setTimeRange('year')} // Change time range to year
            className={`px-4 py-2 rounded-md ${timeRange === 'year' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Year
          </button>
        </div>
      </div>
      
      {/* Key metrics cards section - responsive grid with 1, 2, or 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Total Bookings card */}
        <div className="bg-gradient-to-br from-purple-800/40 to-purple-600/40 rounded-lg p-6 border border-purple-700/50 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Bookings</p>
              <h3 className="text-3xl font-bold text-white mt-1">{analyticsData.totalBookings}</h3>
              <p className="text-purple-300 text-sm mt-2">All time</p>
            </div>
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-purple-300 text-2xl" />
            </div>
          </div>
        </div>
        
        {/* Total Revenue card */}
        <div className="bg-gradient-to-br from-indigo-800/40 to-indigo-600/40 rounded-lg p-6 border border-indigo-700/50 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Revenue</p>
              <h3 className="text-3xl font-bold text-white mt-1">{formatCurrency(analyticsData.totalProfit)}</h3>
              <p className="text-indigo-300 text-sm mt-2">All time</p>
            </div>
            <div className="bg-indigo-500/20 p-3 rounded-lg">
              <FontAwesomeIcon icon={faMoneyBillWave} className="text-indigo-300 text-2xl" />
            </div>
          </div>
        </div>
        
        {/* Monthly Average Bookings card */}
        <div className="bg-gradient-to-br from-blue-800/40 to-blue-600/40 rounded-lg p-6 border border-blue-700/50 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Avg. Monthly Bookings</p>
              <h3 className="text-3xl font-bold text-white mt-1">{analyticsData.monthlyAvgBookings}</h3>
              <p className="text-blue-300 text-sm mt-2">Per month</p>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <FontAwesomeIcon icon={faChartLine} className="text-blue-300 text-2xl" />
            </div>
          </div>
        </div>
        
        {/* Monthly Average Profit card */}
        <div className="bg-gradient-to-br from-green-800/40 to-green-600/40 rounded-lg p-6 border border-green-700/50 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Avg. Monthly Revenue</p>
              <h3 className="text-3xl font-bold text-white mt-1">{formatCurrency(analyticsData.monthlyAvgProfit)}</h3>
              <p className="text-green-300 text-sm mt-2">Per month</p>
            </div>
            <div className="bg-green-500/20 p-3 rounded-lg">
              <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-300 text-2xl" />
            </div>
          </div>
        </div>
        
        {/* Current Month Bookings card */}
        <div className="bg-gradient-to-br from-yellow-800/40 to-yellow-600/40 rounded-lg p-6 border border-yellow-700/50 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">This Month's Bookings</p>
              <h3 className="text-3xl font-bold text-white mt-1">{analyticsData.currentMonthBookings}</h3>
              <p className="text-yellow-300 text-sm mt-2">Current month</p>
            </div>
            <div className="bg-yellow-500/20 p-3 rounded-lg">
              <FontAwesomeIcon icon={faUsers} className="text-yellow-300 text-2xl" />
            </div>
          </div>
        </div>
        
        {/* Current Month Profit card */}
        <div className="bg-gradient-to-br from-red-800/40 to-red-600/40 rounded-lg p-6 border border-red-700/50 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">This Month's Revenue</p>
              <h3 className="text-3xl font-bold text-white mt-1">{formatCurrency(analyticsData.currentMonthProfit)}</h3>
              <p className="text-red-300 text-sm mt-2">Current month</p>
            </div>
            <div className="bg-red-500/20 p-3 rounded-lg">
              <FontAwesomeIcon icon={faMoneyBillWave} className="text-red-300 text-2xl" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Time-series charts section - 1 column on mobile, 2 on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Bookings Chart - line chart */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl text-white font-semibold mb-4">Monthly Bookings</h3>
          <div className="h-80">
            <Line data={bookingsChartData} options={lineChartOptions} />
          </div>
        </div>
        
        {/* Monthly Profit Chart - bar chart */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl text-white font-semibold mb-4">Monthly Revenue</h3>
          <div className="h-80">
            <Bar data={profitChartData} options={barChartOptions} />
          </div>
        </div>
      </div>
      
      {/* Distribution charts section - 1 column on mobile, 2 on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution - pie chart */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl text-white font-semibold mb-4">Service Category Distribution</h3>
          <div className="h-80 flex items-center justify-center">
            <div style={{ width: '80%', height: '100%' }}>
              <Pie data={categoryChartData} options={pieChartOptions} />
            </div>
          </div>
        </div>
        
        {/* Package Popularity - doughnut chart */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl text-white font-semibold mb-4">Package Popularity</h3>
          <div className="h-80 flex items-center justify-center">
            <div style={{ width: '80%', height: '100%' }}>
              <Doughnut data={packageChartData} options={pieChartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataAnalytics; // Export the component for use in other parts of the application