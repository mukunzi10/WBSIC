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
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Shield,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Download,
  Upload,
  X,
  User,
  Mail,
  Phone,
  TrendingUp,
  TrendingDown,
  Activity,
  RefreshCw,
  MoreVertical,
  ExpandIcon

} from 'lucide-react';

export default function AdminPolicies() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showAddPolicy, setShowAddPolicy] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Sample policies data with more details
  const [policies, setPolicies] = useState([
    {
      id: 'E390073',
      policyNumber: 'POL-2023-001',
      type: 'Life Insurance',
      holder: 'Gustave Karekezi',
      holderID: 'CLI-12345',
      holderEmail: 'gustave.k@example.com',
      holderPhone: '0786979551',
      premium: '50,000',
      coverage: '10,000,000',
      status: 'Active',
      startDate: '2023-06-21',
      endDate: '2026-06-21',
      nextPayment: '2025-11-15',
      paymentFrequency: 'Monthly',
      beneficiary: 'Marie Karekezi',
      claimsCount: 2,
      totalPaid: '850,000',
      daysUntilRenewal: 225
    },
    {
      id: 'S390074',
      policyNumber: 'POL-2023-002',
      type: 'Health Insurance',
      holder: 'Jean Marie Uwimana',
      holderID: 'CLI-12346',
      holderEmail: 'jean.uwimana@example.com',
      holderPhone: '0788123456',
      premium: '35,000',
      coverage: '5,000,000',
      status: 'Lapsed',
      startDate: '2023-08-15',
      endDate: '2026-08-15',
      nextPayment: '2025-11-20',
      paymentFrequency: 'Monthly',
      beneficiary: 'Self',
      claimsCount: 1,
      totalPaid: '455,000',
      daysUntilRenewal: 230
    },
    {
      id: 'P390075',
      policyNumber: 'POL-2024-003',
      type: 'Motor Insurance',
      holder: 'Alice Mukamana',
      holderID: 'CLI-12347',
      holderEmail: 'alice.m@example.com',
      holderPhone: '0789654321',
      premium: '120,000',
      coverage: '15,000,000',
      status: 'Active',
      startDate: '2024-01-10',
      endDate: '2025-01-10',
      nextPayment: '2025-01-10',
      paymentFrequency: 'Annually',
      beneficiary: 'N/A',
      claimsCount: 0,
      totalPaid: '120,000',
      daysUntilRenewal: 76
    },
    {
      id: 'H390076',
      policyNumber: 'POL-2022-004',
      type: 'Property Insurance',
      holder: 'Patrick Nkurunziza',
      holderID: 'CLI-12348',
      holderEmail: 'patrick.n@example.com',
      holderPhone: '0787456789',
      premium: '80,000',
      coverage: '20,000,000',
      status: 'Active',
      startDate: '2022-11-05',
      endDate: '2025-11-05',
      nextPayment: '2025-11-05',
      paymentFrequency: 'Annually',
      beneficiary: 'N/A',
      claimsCount: 3,
      totalPaid: '240,000',
      daysUntilRenewal: 10
    },
    {
      id: 'T390077',
      policyNumber: 'POL-2025-005',
      type: 'Travel Insurance',
      holder: 'Sarah Umutoni',
      holderID: 'CLI-12349',
      holderEmail: 'sarah.u@example.com',
      holderPhone: '0785987654',
      premium: '15,000',
      coverage: '2,000,000',
      status: 'Pending',
      startDate: '2025-11-01',
      endDate: '2025-12-01',
      nextPayment: '2025-11-01',
      paymentFrequency: 'One-time',
      beneficiary: 'Self',
      claimsCount: 0,
      totalPaid: '0',
      daysUntilRenewal: 6
    },
    {
      id: 'L390078',
      policyNumber: 'POL-2023-006',
      type: 'Life Insurance',
      holder: 'Patrick Nkurunziza',
      holderID: 'CLI-12348',
      holderEmail: 'patrick.n@example.com',
      holderPhone: '0787456789',
      premium: '75,000',
      coverage: '25,000,000',
      status: 'Active',
      startDate: '2023-03-15',
      endDate: '2028-03-15',
      nextPayment: '2025-11-15',
      paymentFrequency: 'Monthly',
      beneficiary: 'Grace Nkurunziza',
      claimsCount: 1,
      totalPaid: '1,950,000',
      daysUntilRenewal: 871
    },
    {
      id: 'M390079',
      policyNumber: 'POL-2024-007',
      type: 'Health Insurance',
      holder: 'Jean Marie Uwimana',
      holderID: 'CLI-12346',
      holderEmail: 'jean.uwimana@example.com',
      holderPhone: '0788123456',
      premium: '50,000',
      coverage: '8,000,000',
      status: 'Expired',
      startDate: '2023-04-20',
      endDate: '2024-04-20',
      nextPayment: '-',
      paymentFrequency: 'Monthly',
      beneficiary: 'Self',
      claimsCount: 2,
      totalPaid: '600,000',
      daysUntilRenewal: -188
    }
  ]);

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

  const policyTypes = [
    'Life Insurance',
    'Health Insurance',
    'Motor Insurance',
    'Property Insurance',
    'Travel Insurance',
    'Business Insurance'
  ];

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'active':
        return <CheckCircle className="text-green-600" size={18} />;
      case 'expired':
      case 'lapsed':
        return <XCircle className="text-red-600" size={18} />;
      case 'pending':
        return <AlertCircle className="text-yellow-600" size={18} />;
      case 'suspended':
        return <Clock className="text-orange-600" size={18} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
      case 'lapsed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'Life Insurance': 'bg-purple-100 text-purple-800',
      'Health Insurance': 'bg-green-100 text-green-800',
      'Motor Insurance': 'bg-blue-100 text-blue-800',
      'Property Insurance': 'bg-orange-100 text-orange-800',
      'Travel Insurance': 'bg-pink-100 text-pink-800',
      'Business Insurance': 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredPolicies = () => {
    let filtered = policies.filter(policy => {
      const matchesSearch = 
        policy.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.policyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.holder.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || policy.status.toLowerCase() === filterStatus.toLowerCase();
      const matchesType = filterType === 'all' || policy.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        
        if (sortConfig.key === 'premium' || sortConfig.key === 'coverage') {
          aVal = parseInt(aVal.replace(/,/g, ''));
          bVal = parseInt(bVal.replace(/,/g, ''));
        }
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  const filteredPolicies = sortedAndFilteredPolicies();

  const totalPolicies = policies.length;
  const activePolicies = policies.filter(p => p.status === 'Active').length;
  const pendingPolicies = policies.filter(p => p.status === 'Pending').length;
  const expiredPolicies = policies.filter(p => p.status === 'Expired' || p.status === 'Lapsed').length;
  const expiringSoon = policies.filter(p => p.daysUntilRenewal > 0 && p.daysUntilRenewal <= 30).length;

  // Calculate financial metrics
  const totalPremiumValue = policies.reduce((sum, p) => sum + parseInt(p.premium.replace(/,/g, '')), 0);
  const totalCoverageValue = policies.reduce((sum, p) => sum + parseInt(p.coverage.replace(/,/g, '')), 0);

  const handleDeletePolicy = (policyId) => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      setPolicies(policies.filter(p => p.id !== policyId));
      alert('Policy deleted successfully');
    }
  };

  const handleViewPolicy = (policy) => {
    setSelectedPolicy(policy);
  };

  const handleRenewPolicy = (policyId) => {
    const updatedPolicies = policies.map(p => {
      if (p.id === policyId) {
        return {
          ...p,
          status: 'Active',
          daysUntilRenewal: 365
        };
      }
      return p;
    });
    setPolicies(updatedPolicies);
    alert('Policy renewed successfully!');
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
              <h1 className="text-3xl font-bold text-gray-900">Policy Management</h1>
              <p className="text-gray-600 mt-1">Manage and monitor all insurance policies</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell size={24} />
                {expiringSoon > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {expiringSoon}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowAddPolicy(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <Plus size={20} />
                <span className="font-semibold">New Policy</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="p-8 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shield className="text-blue-600" size={24} />
                </div>
                <TrendingUp className="text-green-600" size={20} />
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Policies</p>
              <p className="text-3xl font-bold text-gray-900">{totalPolicies}</p>
              <p className="text-xs text-gray-500 mt-1">+12% from last month</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <Activity className="text-green-600" size={20} />
              </div>
              <p className="text-sm text-gray-600 mb-1">Active Policies</p>
              <p className="text-3xl font-bold text-green-600">{activePolicies}</p>
              <p className="text-xs text-gray-500 mt-1">{((activePolicies/totalPolicies)*100).toFixed(1)}% of total</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="text-yellow-600" size={24} />
                </div>
                <Clock className="text-yellow-600" size={20} />
              </div>
              <p className="text-sm text-gray-600 mb-1">Expiring Soon</p>
              <p className="text-3xl font-bold text-yellow-600">{ExpandIcon}</p>
              <p className="text-xs text-gray-500 mt-1">Within 30 days</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-purple-600" size={24} />
                </div>
                <TrendingUp className="text-purple-600" size={20} />
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Premium</p>
              <p className="text-2xl font-bold text-purple-600">{(totalPremiumValue/1000).toFixed(0)}K</p>
              <p className="text-xs text-gray-500 mt-1">RWF per month</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="text-red-600" size={24} />
                </div>
                <TrendingDown className="text-red-600" size={20} />
              </div>
              <p className="text-sm text-gray-600 mb-1">Expired/Lapsed</p>
              <p className="text-3xl font-bold text-red-600">{expiredPolicies}</p>
              <p className="text-xs text-gray-500 mt-1">Needs attention</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="px-8 pb-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by policy ID, number, or holder name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  {policyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="lapsed">Lapsed</option>
                  <option value="expired">Expired</option>
                </select>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download size={18} />
                  <span>Export</span>
                </button>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setFilterStatus('all');
                    setFilterType('all');
                  }}
                  className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Reset Filters"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Policies Table */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-blue-800"
                    onClick={() => handleSort('id')}
                  >
                    Policy Info {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-blue-800"
                    onClick={() => handleSort('holder')}
                  >
                    Holder {sortConfig.key === 'holder' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-blue-800"
                    onClick={() => handleSort('premium')}
                  >
                    Premium {sortConfig.key === 'premium' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Coverage</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Renewal</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPolicies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{policy.id}</p>
                        <p className="text-sm text-gray-500">{policy.policyNumber}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(policy.type)}`}>
                        {policy.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{policy.holder}</p>
                        <p className="text-sm text-gray-500">{policy.holderID}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{policy.premium} RWF</p>
                        <p className="text-xs text-gray-500">{policy.paymentFrequency}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">{policy.coverage} RWF</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(policy.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(policy.status)}`}>
                          {policy.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {policy.daysUntilRenewal > 0 ? (
                        <div>
                          <p className={`text-sm font-semibold ${policy.daysUntilRenewal <= 30 ? 'text-red-600' : 'text-gray-900'}`}>
                            {policy.daysUntilRenewal} days
                          </p>
                          {policy.daysUntilRenewal <= 30 && (
                            <p className="text-xs text-red-600">Expiring soon!</p>
                          )}
                        </div>
                      ) : policy.daysUntilRenewal < 0 ? (
                        <p className="text-sm text-red-600 font-semibold">Expired</p>
                      ) : (
                        <p className="text-sm text-gray-500">-</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleViewPolicy(policy)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit Policy"
                        >
                          <Edit size={18} />
                        </button>
                        {(policy.status === 'Expired' || policy.status === 'Lapsed') && (
                          <button
                            onClick={() => handleRenewPolicy(policy.id)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Renew Policy"
                          >
                            <RefreshCw size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletePolicy(policy.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Policy"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPolicies.length === 0 && (
              <div className="text-center py-12">
                <Shield className="mx-auto w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Policies Found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>

          {/* Results Summary */}
          {filteredPolicies.length > 0 && (
            <div className="mt-4 text-sm text-gray-600 text-center">
              Showing {filteredPolicies.length} of {totalPolicies} policies
            </div>
          )}
        </div>
      </div>

      {/* View Policy Modal */}
      {selectedPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Policy Details</h2>
                <p className="text-sm text-gray-600">{selectedPolicy.policyNumber}</p>
              </div>
              <button
                onClick={() => setSelectedPolicy(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Policy Status Banner */}
              <div className={`p-4 rounded-lg flex items-center justify-between ${
                selectedPolicy.status === 'Active' ? 'bg-green-50 border-l-4 border-green-500' :
                selectedPolicy.status === 'Pending' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
                'bg-red-50 border-l-4 border-red-500'
              }`}>
                <div className="flex items-center space-x-3">
                  {getStatusIcon(selectedPolicy.status)}
                  <div>
                    <p className="font-semibold text-gray-900">{selectedPolicy.status} Policy</p>
                    <p className="text-sm text-gray-600">Policy ID: {selectedPolicy.id}</p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getTypeColor(selectedPolicy.type)}`}>
                  {selectedPolicy.type}
                </span>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-600 mb-1">Total Paid</p>
                  <p className="text-lg font-bold text-blue-700">{selectedPolicy.totalPaid} RWF</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-600 mb-1">Claims Filed</p>
                  <p className="text-lg font-bold text-green-700">{selectedPolicy.claimsCount}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-600 mb-1">Premium</p>
                  <p className="text-lg font-bold text-purple-700">{selectedPolicy.premium} RWF</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-600 mb-1">Days to Renewal</p>
                  <p className="text-lg font-bold text-orange-700">
                    {selectedPolicy.daysUntilRenewal > 0 ? selectedPolicy.daysUntilRenewal : 'Expired'}
                  </p>
                </div>
              </div>

              {/* Policy Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Policy Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 text-lg border-b pb-2 flex items-center">
                    <Shield className="mr-2 text-blue-700" size={20} />
                    Policy Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <p className="text-sm text-gray-600">Policy Number</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedPolicy.policyNumber}</p>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <p className="text-sm text-gray-600">Policy Type</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedPolicy.type}</p>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <p className="text-sm text-gray-600">Coverage Amount</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedPolicy.coverage} RWF</p>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <p className="text-sm text-gray-600">Premium Amount</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedPolicy.premium} RWF</p>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <p className="text-sm text-gray-600">Payment Frequency</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedPolicy.paymentFrequency}</p>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <p className="text-sm text-gray-600">Beneficiary</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedPolicy.beneficiary}</p>
                    </div>
                  </div>
                </div>

                {/* Policy Holder Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 text-lg border-b pb-2 flex items-center">
                    <User className="mr-2 text-blue-700" size={20} />
                    Policy Holder
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedPolicy.holder}</p>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <p className="text-sm text-gray-600">Client ID</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedPolicy.holderID}</p>
                    </div>
                    <div className="flex items-center p-2 bg-gray-50 rounded">
                      <Mail className="text-gray-400 mr-2" size={16} />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium text-gray-900">{selectedPolicy.holderEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-2 bg-gray-50 rounded">
                      <Phone className="text-gray-400 mr-2" size={16} />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm font-medium text-gray-900">{selectedPolicy.holderPhone}</p>
                      </div>
                    </div>
                    <div className="pt-2">
                      <button className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-semibold flex items-center justify-center">
                        <User size={18} className="mr-2" />
                        View Client Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Policy Timeline */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 text-lg mb-4 flex items-center">
                  <Calendar className="mr-2 text-blue-700" size={20} />
                  Policy Timeline
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <p className="text-xs text-gray-600 mb-1 flex items-center">
                      <Calendar size={14} className="mr-1" />
                      Start Date
                    </p>
                    <p className="text-xl font-bold text-blue-700">{selectedPolicy.startDate}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                    <p className="text-xs text-gray-600 mb-1 flex items-center">
                      <DollarSign size={14} className="mr-1" />
                      Next Payment
                    </p>
                    <p className="text-xl font-bold text-green-700">{selectedPolicy.nextPayment}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                    <p className="text-xs text-gray-600 mb-1 flex items-center">
                      <Clock size={14} className="mr-1" />
                      End Date
                    </p>
                    <p className="text-xl font-bold text-purple-700">{selectedPolicy.endDate}</p>
                  </div>
                </div>
              </div>

              {/* Warning Alert for Expiring Soon */}
              {selectedPolicy.daysUntilRenewal > 0 && selectedPolicy.daysUntilRenewal <= 30 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex items-start">
                    <AlertCircle className="text-red-600 mt-0.5 mr-3" size={20} />
                    <div>
                      <p className="font-semibold text-red-800">Policy Expiring Soon!</p>
                      <p className="text-sm text-red-700 mt-1">
                        This policy will expire in {selectedPolicy.daysUntilRenewal} days. Please contact the client for renewal.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t">
                <button className="flex-1 px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors flex items-center justify-center">
                  <Edit size={18} className="mr-2" />
                  Edit Policy
                </button>
                <button className="flex-1 px-6 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition-colors flex items-center justify-center">
                  <FileText size={18} className="mr-2" />
                  View Claims ({selectedPolicy.claimsCount})
                </button>
                <button className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <Download size={18} className="mr-2" />
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}