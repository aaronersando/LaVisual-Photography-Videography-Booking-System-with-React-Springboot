import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, startOfMonth, endOfMonth, parseISO, subMonths } from 'date-fns';
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
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCalendarAlt, faMoneyBillWave, faChartLine, faUsers, faCamera, faVideo } from '@fortawesome/free-solid-svg-icons';

// Register ChartJS components
ChartJS.register(
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
);

function DataAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState({
    totalBookings: 0,
    totalProfit: 0,
    monthlyAvgBookings: 0,
    monthlyAvgProfit: 0,
    currentMonthBookings: 0,
    currentMonthProfit: 0,
    monthlyBookings: [],
    monthlyProfit: [],
    categoryDistribution: {},
    packagePopularity: {}
  });
  const [timeRange, setTimeRange] = useState('year'); // 'year', 'quarter', 'month'

  // Fetch analytics data
  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      // API endpoint with time range parameter
      const response = await axios.get(`http://localhost:8080/api/analytics/dashboard?range=${timeRange}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setAnalyticsData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch analytics data');
      }
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Error loading analytics data. Please try again.');
      
      // For demo/development purposes - generate mock data
      generateMockData();
    } finally {
      setLoading(false);
    }
  };

  // Generate mock data for development/demo purposes
  const generateMockData = () => {
    // Generate last 12 months
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = subMonths(new Date(), 11 - i);
      return format(date, 'MMM yyyy');
    });
    
    // Random data for monthly bookings (10-30 range)
    const bookings = months.map(() => Math.floor(Math.random() * 20) + 10);
    
    // Random data for monthly profit (₱30k-₱100k range)
    const profit = bookings.map(booking => booking * (Math.floor(Math.random() * 3000) + 3000));
    
    // Category distribution
    const categories = {
      'Photography': Math.floor(Math.random() * 50) + 50,
      'Videography': Math.floor(Math.random() * 30) + 30,
      'Combo Package': Math.floor(Math.random() * 20) + 10
    };
    
    // Package popularity
    const packages = {
      'Intimate Session': Math.floor(Math.random() * 15) + 15,
      'Wedding': Math.floor(Math.random() * 10) + 10,
      'Event Coverage': Math.floor(Math.random() * 10) + 5,
      'Wedding Complete': Math.floor(Math.random() * 5) + 5,
      'Pre-Photoshoot': Math.floor(Math.random() * 5) + 3,
      'Wedding Film': Math.floor(Math.random() * 5) + 2
    };
    
    // Calculate totals and averages
    const totalBookings = bookings.reduce((sum, val) => sum + val, 0);
    const totalProfit = profit.reduce((sum, val) => sum + val, 0);
    
    setAnalyticsData({
      totalBookings,
      totalProfit,
      monthlyAvgBookings: Math.round(totalBookings / 12),
      monthlyAvgProfit: Math.round(totalProfit / 12),
      currentMonthBookings: bookings[bookings.length - 1],
      currentMonthProfit: profit[profit.length - 1],
      monthlyBookings: months.map((month, i) => ({ month, value: bookings[i] })),
      monthlyProfit: months.map((month, i) => ({ month, value: profit[i] })),
      categoryDistribution: categories,
      packagePopularity: packages
    });
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', { 
      style: 'currency', 
      currency: 'PHP',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Prepare data for monthly bookings chart
  const bookingsChartData = {
    labels: analyticsData.monthlyBookings.map(item => item.month),
    datasets: [
      {
        label: 'Bookings',
        data: analyticsData.monthlyBookings.map(item => item.value),
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(147, 51, 234)',
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  // Prepare data for monthly profit chart
  const profitChartData = {
    labels: analyticsData.monthlyProfit.map(item => item.month),
    datasets: [
      {
        label: 'Profit',
        data: analyticsData.monthlyProfit.map(item => item.value),
        backgroundColor: 'rgba(79, 70, 229, 0.7)',
        borderColor: 'rgb(79, 70, 229)',
        borderWidth: 1
      }
    ]
  };

  // Prepare data for category distribution chart
  const categoryChartData = {
    labels: Object.keys(analyticsData.categoryDistribution),
    datasets: [
      {
        data: Object.values(analyticsData.categoryDistribution),
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
        borderWidth: 1
      }
    ]
  };

  // Prepare data for package popularity chart
  const packageChartData = {
    labels: Object.keys(analyticsData.packagePopularity),
    datasets: [
      {
        data: Object.values(analyticsData.packagePopularity),
        backgroundColor: [
          'rgba(147, 51, 234, 0.7)',  // Purple
          'rgba(79, 70, 229, 0.7)',   // Indigo
          'rgba(59, 130, 246, 0.7)',  // Blue
          'rgba(16, 185, 129, 0.7)',  // Green
          'rgba(245, 158, 11, 0.7)',  // Yellow
          'rgba(239, 68, 68, 0.7)'    // Red
        ],
        borderWidth: 0,
        hoverOffset: 5
      }
    ]
  };

  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    }
  };

  const barChartOptions = {
    ...lineChartOptions,
    plugins: {
      ...lineChartOptions.plugins,
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Profit: ${formatCurrency(context.parsed.y)}`;
          }
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'white',
          font: {
            size: 12
          },
          padding: 20
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center pt-20">
        <div className="inline-block animate-spin text-purple-500 text-4xl mb-4">
          <FontAwesomeIcon icon={faSpinner} />
        </div>
        <p className="text-gray-300">Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/20 text-red-100 rounded-md mt-20">
        <p className="font-bold mb-2">Failed to load analytics data</p>
        <p className="mb-4">{error}</p>
        <button
          onClick={fetchAnalyticsData}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-10 px-4">
      <h2 className="text-2xl text-white font-bold mb-6">Analytics Dashboard</h2>
      
      {/* Time range selector */}
      <div className="flex justify-end mb-6">
        <div className="bg-gray-800 rounded-lg p-1 inline-flex">
          <button 
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded-md ${timeRange === 'month' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Month
          </button>
          <button 
            onClick={() => setTimeRange('quarter')}
            className={`px-4 py-2 rounded-md ${timeRange === 'quarter' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Quarter
          </button>
          <button 
            onClick={() => setTimeRange('year')}
            className={`px-4 py-2 rounded-md ${timeRange === 'year' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Year
          </button>
        </div>
      </div>
      
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Total Bookings */}
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
        
        {/* Total Revenue */}
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
        
        {/* Monthly Average Bookings */}
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
        
        {/* Monthly Average Profit */}
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
        
        {/* Current Month Bookings */}
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
        
        {/* Current Month Profit */}
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
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Bookings Chart */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl text-white font-semibold mb-4">Monthly Bookings</h3>
          <div className="h-80">
            <Line data={bookingsChartData} options={lineChartOptions} />
          </div>
        </div>
        
        {/* Monthly Profit Chart */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl text-white font-semibold mb-4">Monthly Revenue</h3>
          <div className="h-80">
            <Bar data={profitChartData} options={barChartOptions} />
          </div>
        </div>
      </div>
      
      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl text-white font-semibold mb-4">Service Category Distribution</h3>
          <div className="h-80 flex items-center justify-center">
            <div style={{ width: '80%', height: '100%' }}>
              <Pie data={categoryChartData} options={pieChartOptions} />
            </div>
          </div>
        </div>
        
        {/* Package Popularity */}
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

export default DataAnalytics;