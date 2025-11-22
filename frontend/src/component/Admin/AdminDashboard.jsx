import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
  Activity,
  UserCheck,
  FileClock,
  Wallet
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data
  const stats = {
    totalClients: 1247,
    totalPolicies: 3856,
    activeClaims: 89,
    totalRevenue: '456.8M',
    pendingApprovals: 23,
    monthlyGrowth: 12.5,
    newClientsThisMonth: 87,
    claimsProcessed: 156
  };

  const recentActivities = [
    {
      id: 1,
      type: 'claim',
      title: 'New claim submitted',
      description: 'CLM-2024-189 - Medical claim for 800,000 RWF',
      user: 'John Doe',
      time: '5 min ago',
      status: 'pending',
      icon: FileClock,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      id: 2,
      type: 'policy',
      title: 'Policy activated',
      description: 'POL-2024-456 - Life Insurance',
      user: 'Jane Smith',
      time: '15 min ago',
      status: 'success',
      icon: Shield,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment received',
      description: '50,000 RWF - Premium payment',
      user: 'Alice Johnson',
      time: '1 hour ago',
      status: 'success',
      icon: Wallet,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 4,
      type: 'user',
      title: 'New user registered',
      description: 'Client ID: CLI-2024-789',
      user: 'Bob Wilson',
      time: '2 hours ago',
      status: 'info',
      icon: UserCheck,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 5,
      type: 'claim',
      title: 'Claim approved',
      description: 'CLM-2024-178 - Property damage claim',
      user: 'Sarah Connor',
      time: '3 hours ago',
      status: 'success',
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100'
    }
  ];

  const pendingClaims = [
    {
      id: 'CLM-2024-189',
      claimant: 'John Doe',
      type: 'Medical',
      amount: '800,000 RWF',
      date: '2025-10-23',
      status: 'Under Review',
      priority: 'High'
    },
    {
      id: 'CLM-2024-190',
      claimant: 'Jane Smith',
      type: 'Accident',
      amount: '1,200,000 RWF',
      date: '2025-10-22',
      status: 'Pending Documents',
      priority: 'Medium'
    },
    {
      id: 'CLM-2024-191',
      claimant: 'Alice Johnson',
      type: 'Property',
      amount: '2,500,000 RWF',
      date: '2025-10-21',
      status: 'Under Review',
      priority: 'High'
    }
  ];

  const topPolicies = [
    { type: 'Life Insurance', count: 1245, percentage: 32.3, trend: 'up' },
    { type: 'Health Insurance', count: 987, percentage: 25.6, trend: 'up' },
    { type: 'Motor Insurance', count: 756, percentage: 19.6, trend: 'down' },
    { type: 'Property Insurance', count: 543, percentage: 14.1, trend: 'up' },
    { type: 'Travel Insurance', count: 325, percentage: 8.4, trend: 'up' }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'clients', label: 'Clients', icon: Users, path: '/admin/clients' },
    { id: 'policies', label: 'Policies', icon: Shield, path: '/admin/policies' },
    { id: 'claims', label: 'Claims', icon: FileText, path: '/admin/claims' },
    { id: 'payments', label: 'Payments', icon: DollarSign, path: '/admin/payments' },
    { id: 'complaints', label: 'Complaints', icon: MessageSquare, path: '/admin/complaints' },
    { id: 'reports', label: 'Reports', icon: BarChart3, path: '/admin/reports' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' }
  ];

  const getPriorityColor = (priority) => {
    switch(priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    if (status.includes('Review')) return 'bg-blue-100 text-blue-800';
    if (status.includes('Pending')) return 'bg-yellow-100 text-yellow-800';
    if (status.includes('Approved')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-blue-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <div className="font-bold text-lg">Sanlam | Allianz</div>
              <div className="text-xs text-blue-300">Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`w-full flex items-center space-x-3 px-6 py-4 transition-all ${
                  isActive
                    ? 'bg-white text-blue-900 border-l-4 border-blue-600'
                    : 'text-white hover:bg-blue-700'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Admin Profile */}
        <div className="p-6 border-t border-blue-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold text-lg">
              AD
            </div>
            <div className="flex-1">
              <div className="font-semibold">Admin User</div>
              <div className="text-sm text-blue-300">System Administrator</div>
            </div>
          </div>
        </div>

        {/* Bottom Icons */}
        <div className="p-4 border-t border-blue-700 flex justify-around">
          <button className="p-2 hover:bg-blue-700 rounded-full transition-colors">
            <Settings size={20} />
          </button>
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-blue-700 rounded-full transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, Admin</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell size={24} />
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {stats.pendingApprovals}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Clients */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="text-blue-600" size={24} />
                </div>
                <span className="flex items-center text-green-600 text-sm font-semibold">
                  <TrendingUp size={16} className="mr-1" />
                  +{stats.monthlyGrowth}%
                </span>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">Total Clients</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.totalClients.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">+{stats.newClientsThisMonth} this month</p>
            </div>

            {/* Total Policies */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="text-purple-600" size={24} />
                </div>
                <span className="flex items-center text-green-600 text-sm font-semibold">
                  <TrendingUp size={16} className="mr-1" />
                  +8.2%
                </span>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">Active Policies</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.totalPolicies.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">Across all types</p>
            </div>

            {/* Active Claims */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FileText className="text-yellow-600" size={24} />
                </div>
                <span className="flex items-center text-red-600 text-sm font-semibold">
                  <TrendingDown size={16} className="mr-1" />
                  -3.1%
                </span>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">Active Claims</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.activeClaims}</p>
              <p className="text-xs text-gray-500 mt-2">{stats.claimsProcessed} processed this month</p>
            </div>

            {/* Total Revenue */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-green-600" size={24} />
                </div>
                <span className="flex items-center text-green-600 text-sm font-semibold">
                  <TrendingUp size={16} className="mr-1" />
                  +15.3%
                </span>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">Total Revenue</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.totalRevenue}</p>
              <p className="text-xs text-gray-500 mt-2">RWF This Year</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Pending Claims */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Pending Claims</h2>
                  <Link to="/admin/claims" className="text-blue-700 text-sm font-semibold hover:underline">
                    View All
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {pendingClaims.map((claim) => (
                    <div key={claim.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{claim.id}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(claim.priority)}`}>
                            {claim.priority}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(claim.status)}`}>
                            {claim.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{claim.claimant} • {claim.type}</p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">{claim.amount}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-2">{claim.date}</p>
                        <button className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition-colors">
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Policies */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Top Policies</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {topPolicies.map((policy, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{policy.type}</span>
                        <div className="flex items-center space-x-2">
                          {policy.trend === 'up' ? (
                            <TrendingUp className="text-green-600" size={16} />
                          ) : (
                            <TrendingDown className="text-red-600" size={16} />
                          )}
                          <span className="text-sm font-semibold text-gray-900">{policy.count}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-700 h-2 rounded-full transition-all"
                          style={{ width: `${policy.percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">{policy.percentage}% of total</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start space-x-4">
                      <div className={`w-10 h-10 ${activity.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}