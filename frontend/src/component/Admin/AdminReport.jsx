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
  Download,
  TrendingUp,
  TrendingDown,
  Shield,
  Calendar,
  Filter,
  FileSpreadsheet,
  PieChart,
  Activity,
  Printer,
  Mail,
  Share2
} from 'lucide-react';

export default function AdminReports() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedReportType, setSelectedReportType] = useState('overview');

  // Sample analytics data
  const analyticsData = {
    revenue: {
      current: '45,680,000',
      previous: '42,150,000',
      growth: 8.4,
      trend: 'up'
    },
    policies: {
      total: 1247,
      active: 1098,
      new: 87,
      cancelled: 12,
      growth: 7.5
    },
    claims: {
      total: 156,
      approved: 128,
      pending: 23,
      rejected: 5,
      totalAmount: '28,450,000',
      averageProcessingDays: 4.2
    },
    clients: {
      total: 856,
      new: 67,
      active: 789,
      inactive: 67,
      retention: 92.2
    }
  };

  // Policy distribution by type
  const policyDistribution = [
    { type: 'Life Insurance', count: 402, percentage: 32.2, revenue: '20,100,000', color: 'bg-purple-500' },
    { type: 'Health Insurance', count: 324, percentage: 26.0, revenue: '11,340,000', color: 'bg-green-500' },
    { type: 'Motor Insurance', count: 248, percentage: 19.9, revenue: '8,928,000', color: 'bg-blue-500' },
    { type: 'Property Insurance', count: 186, percentage: 14.9, revenue: '3,720,000', color: 'bg-orange-500' },
    { type: 'Travel Insurance', count: 87, percentage: 7.0, revenue: '1,305,000', color: 'bg-pink-500' }
  ];

  // Monthly performance data
  const monthlyData = [
    { month: 'Jan', policies: 98, claims: 12, revenue: 3800000 },
    { month: 'Feb', policies: 105, claims: 15, revenue: 4100000 },
    { month: 'Mar', policies: 112, claims: 18, revenue: 4300000 },
    { month: 'Apr', policies: 108, claims: 14, revenue: 4200000 },
    { month: 'May', policies: 115, claims: 16, revenue: 4500000 },
    { month: 'Jun', policies: 122, claims: 19, revenue: 4700000 },
    { month: 'Jul', policies: 118, claims: 17, revenue: 4600000 },
    { month: 'Aug', policies: 125, claims: 20, revenue: 4850000 },
    { month: 'Sep', policies: 130, claims: 22, revenue: 5000000 },
    { month: 'Oct', policies: 135, claims: 25, revenue: 5200000 }
  ];

  // Top performing agents
  const topAgents = [
    { name: 'John Doe', policies: 45, revenue: '2,250,000', conversion: 85.5 },
    { name: 'Jane Smith', policies: 38, revenue: '1,900,000', conversion: 82.3 },
    { name: 'Alice Johnson', policies: 32, revenue: '1,600,000', conversion: 78.9 },
    { name: 'Bob Wilson', policies: 28, revenue: '1,400,000', conversion: 75.2 },
    { name: 'Sarah Connor', policies: 25, revenue: '1,250,000', conversion: 72.8 }
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

  const reportTypes = [
    { id: 'overview', name: 'Business Overview', icon: BarChart3 },
    { id: 'financial', name: 'Financial Report', icon: DollarSign },
    { id: 'policies', name: 'Policy Analysis', icon: Shield },
    { id: 'claims', name: 'Claims Report', icon: FileText },
    { id: 'clients', name: 'Client Analytics', icon: Users }
  ];

  const handleExportReport = (format) => {
    alert(`Exporting report in ${format.toUpperCase()} format...`);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleEmailReport = () => {
    alert('Email report functionality would be implemented here');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col">
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

        <div className="p-4 border-t border-blue-700 flex justify-around">
          <button className="p-2 hover:bg-blue-700 rounded-full transition-colors">
            <Settings size={20} />
          </button>
          <button onClick={() => navigate('/')} className="p-2 hover:bg-blue-700 rounded-full transition-colors">
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
              <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-600 mt-1">Comprehensive business insights and data analysis</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell size={24} />
              </button>
              <button
                onClick={handlePrintReport}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Printer size={18} />
                <span className="font-semibold">Print</span>
              </button>
              <button
                onClick={handleEmailReport}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Mail size={18} />
                <span className="font-semibold">Email</span>
              </button>
              <button
                onClick={() => handleExportReport('pdf')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <Download size={18} />
                <span className="font-semibold">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b px-8 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar size={20} className="text-gray-600" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-600" />
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {reportTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            <div className="flex-1"></div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleExportReport('excel')}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileSpreadsheet size={18} />
                <span>Excel</span>
              </button>
              <button
                onClick={() => handleExportReport('pdf')}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download size={18} />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Key Metrics */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Key Performance Indicators</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Revenue Card */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign size={32} />
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                    analyticsData.revenue.trend === 'up' ? 'bg-green-400' : 'bg-red-400'
                  }`}>
                    {analyticsData.revenue.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span className="text-sm font-semibold">{analyticsData.revenue.growth}%</span>
                  </div>
                </div>
                <p className="text-sm opacity-90 mb-2">Total Revenue</p>
                <p className="text-3xl font-bold">{analyticsData.revenue.current} RWF</p>
                <p className="text-sm opacity-75 mt-2">Previous: {analyticsData.revenue.previous} RWF</p>
              </div>

              {/* Policies Card */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Shield size={32} />
                  <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-blue-400">
                    <TrendingUp size={16} />
                    <span className="text-sm font-semibold">{analyticsData.policies.growth}%</span>
                  </div>
                </div>
                <p className="text-sm opacity-90 mb-2">Active Policies</p>
                <p className="text-3xl font-bold">{analyticsData.policies.active}</p>
                <p className="text-sm opacity-75 mt-2">Total: {analyticsData.policies.total} policies</p>
              </div>

              {/* Claims Card */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <FileText size={32} />
                  <div className="px-2 py-1 rounded-full bg-purple-400">
                    <span className="text-sm font-semibold">{analyticsData.claims.averageProcessingDays}d avg</span>
                  </div>
                </div>
                <p className="text-sm opacity-90 mb-2">Claims Processed</p>
                <p className="text-3xl font-bold">{analyticsData.claims.approved}</p>
                <p className="text-sm opacity-75 mt-2">Total: {analyticsData.claims.total} claims</p>
              </div>

              {/* Clients Card */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Users size={32} />
                  <div className="px-2 py-1 rounded-full bg-orange-400">
                    <span className="text-sm font-semibold">{analyticsData.clients.retention}%</span>
                  </div>
                </div>
                <p className="text-sm opacity-90 mb-2">Active Clients</p>
                <p className="text-3xl font-bold">{analyticsData.clients.active}</p>
                <p className="text-sm opacity-75 mt-2">New this month: {analyticsData.clients.new}</p>
              </div>
            </div>
          </div>

          {/* Policy Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <PieChart className="mr-2 text-blue-700" size={20} />
                Policy Distribution by Type
              </h3>
              <div className="space-y-4">
                {policyDistribution.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 ${item.color} rounded`}></div>
                        <span className="text-sm font-medium text-gray-900">{item.type}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{item.count} policies</p>
                        <p className="text-xs text-gray-500">{item.percentage}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600">Revenue: {item.revenue} RWF</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Performance Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Activity className="mr-2 text-blue-700" size={20} />
                Monthly Performance Trends
              </h3>
              <div className="space-y-3">
                {monthlyData.slice(-6).map((data, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-16 text-sm font-semibold text-gray-700">{data.month}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Policies: {data.policies}</span>
                        <span>Revenue: {(data.revenue/1000000).toFixed(1)}M RWF</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${(data.policies / 150) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="mr-2 text-blue-700" size={20} />
              Top Performing Agents
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Agent Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Policies Sold</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Revenue Generated</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Conversion Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topAgents.map((agent, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-500' :
                          'bg-blue-500'
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{agent.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{agent.policies}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-green-600">{agent.revenue} RWF</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          agent.conversion >= 80 ? 'bg-green-100 text-green-800' :
                          agent.conversion >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {agent.conversion}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                            style={{ width: `${agent.conversion}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Claims Statistics</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Approved</span>
                  <span className="font-semibold text-green-600">{analyticsData.claims.approved}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="font-semibold text-yellow-600">{analyticsData.claims.pending}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Rejected</span>
                  <span className="font-semibold text-red-600">{analyticsData.claims.rejected}</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-900">Total Amount</span>
                    <span className="font-bold text-blue-700">{analyticsData.claims.totalAmount} RWF</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Policy Status</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active</span>
                  <span className="font-semibold text-green-600">{analyticsData.policies.active}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">New This Month</span>
                  <span className="font-semibold text-blue-600">{analyticsData.policies.new}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cancelled</span>
                  <span className="font-semibold text-red-600">{analyticsData.policies.cancelled}</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-900">Growth Rate</span>
                    <span className="font-bold text-green-700">+{analyticsData.policies.growth}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Client Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Clients</span>
                  <span className="font-semibold text-gray-900">{analyticsData.clients.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">New Clients</span>
                  <span className="font-semibold text-blue-600">{analyticsData.clients.new}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Inactive</span>
                  <span className="font-semibold text-red-600">{analyticsData.clients.inactive}</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-900">Retention Rate</span>
                    <span className="font-bold text-green-700">{analyticsData.clients.retention}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}