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
  MapPin,
  FileCheck,
  ThumbsUp,
  ThumbsDown,
  Send,
  Paperclip
} from 'lucide-react';

export default function AdminClaims() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    decision: '',
    approvedAmount: '',
    comments: ''
  });

  // Sample claims data
  const [claims, setClaims] = useState([
    {
      id: 'CLM-2024-189',
      claimNumber: 'CLM-2024-189',
      claimant: 'John Doe',
      clientID: 'CLI-12345',
      policyNumber: 'E390073',
      policyType: 'Health Insurance',
      claimType: 'Medical',
      claimAmount: '800,000 RWF',
      approvedAmount: null,
      status: 'Under Review',
      priority: 'High',
      dateSubmitted: '2025-10-20',
      dateUpdated: '2025-10-23',
      incidentDate: '2025-10-15',
      description: 'Hospitalization for surgery - kidney stones removal',
      documents: 3,
      assignedTo: 'Admin User',
      email: 'john.doe@example.com',
      phone: '0788123456'
    },
    {
      id: 'CLM-2024-190',
      claimNumber: 'CLM-2024-190',
      claimant: 'Jane Smith',
      clientID: 'CLI-12346',
      policyNumber: 'S390074',
      policyType: 'Motor Insurance',
      claimType: 'Accident',
      claimAmount: '1,200,000 RWF',
      approvedAmount: null,
      status: 'Pending Documents',
      priority: 'Medium',
      dateSubmitted: '2025-10-22',
      dateUpdated: '2025-10-22',
      incidentDate: '2025-10-18',
      description: 'Vehicle collision on Kigali-Musanze highway',
      documents: 2,
      assignedTo: 'Admin User',
      email: 'jane.smith@example.com',
      phone: '0789654321'
    },
    {
      id: 'CLM-2024-178',
      claimNumber: 'CLM-2024-178',
      claimant: 'Alice Johnson',
      clientID: 'CLI-12347',
      policyNumber: 'P390075',
      policyType: 'Property Insurance',
      claimType: 'Fire Damage',
      claimAmount: '2,500,000 RWF',
      approvedAmount: '2,300,000 RWF',
      status: 'Approved',
      priority: 'High',
      dateSubmitted: '2025-10-10',
      dateUpdated: '2025-10-21',
      incidentDate: '2025-10-05',
      description: 'Kitchen fire caused significant damage to property',
      documents: 5,
      assignedTo: 'Admin User',
      email: 'alice.j@example.com',
      phone: '0787456789'
    },
    {
      id: 'CLM-2024-156',
      claimNumber: 'CLM-2024-156',
      claimant: 'Patrick Nkurunziza',
      clientID: 'CLI-12348',
      policyNumber: 'E390073',
      policyType: 'Health Insurance',
      claimType: 'Medical',
      claimAmount: '250,000 RWF',
      approvedAmount: '250,000 RWF',
      status: 'Paid',
      priority: 'Low',
      dateSubmitted: '2025-10-05',
      dateUpdated: '2025-10-18',
      incidentDate: '2025-10-01',
      description: 'Outpatient consultation and medication',
      documents: 4,
      assignedTo: 'Admin User',
      email: 'patrick.n@example.com',
      phone: '0785987654'
    },
    {
      id: 'CLM-2024-145',
      claimNumber: 'CLM-2024-145',
      claimant: 'Sarah Umutoni',
      clientID: 'CLI-12349',
      policyNumber: 'H390076',
      policyType: 'Property Insurance',
      claimType: 'Theft',
      claimAmount: '600,000 RWF',
      approvedAmount: null,
      status: 'Rejected',
      priority: 'Medium',
      dateSubmitted: '2025-09-28',
      dateUpdated: '2025-10-15',
      incidentDate: '2025-09-25',
      description: 'Burglary - electronics and valuables stolen',
      documents: 2,
      assignedTo: 'Admin User',
      email: 'sarah.u@example.com',
      phone: '0786123456'
    },
    {
      id: 'CLM-2024-191',
      claimNumber: 'CLM-2024-191',
      claimant: 'Jean Marie Uwimana',
      clientID: 'CLI-12346',
      policyNumber: 'S390074',
      policyType: 'Health Insurance',
      claimType: 'Medical',
      claimAmount: '450,000 RWF',
      approvedAmount: null,
      status: 'Investigation',
      priority: 'High',
      dateSubmitted: '2025-10-24',
      dateUpdated: '2025-10-24',
      incidentDate: '2025-10-20',
      description: 'Emergency room visit and treatment',
      documents: 3,
      assignedTo: 'Admin User',
      email: 'jean.uwimana@example.com',
      phone: '0788123456'
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

  const claimTypes = [
    'Medical',
    'Accident',
    'Fire Damage',
    'Theft',
    'Property Damage',
    'Natural Disaster',
    'Other'
  ];

  const getStatusIcon = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'approved' || statusLower === 'paid') {
      return <CheckCircle className="text-green-600" size={18} />;
    } else if (statusLower === 'rejected') {
      return <XCircle className="text-red-600" size={18} />;
    } else if (statusLower.includes('review') || statusLower === 'investigation') {
      return <Clock className="text-blue-600" size={18} />;
    } else if (statusLower.includes('pending')) {
      return <AlertCircle className="text-yellow-600" size={18} />;
    }
    return null;
  };

  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'approved') return 'bg-green-100 text-green-800';
    if (statusLower === 'paid') return 'bg-green-100 text-green-800';
    if (statusLower === 'rejected') return 'bg-red-100 text-red-800';
    if (statusLower.includes('review')) return 'bg-blue-100 text-blue-800';
    if (statusLower === 'investigation') return 'bg-purple-100 text-purple-800';
    if (statusLower.includes('pending')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

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

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = 
      claim.claimNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.claimant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.policyNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || claim.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesType = filterType === 'all' || claim.claimType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalClaims = claims.length;
  const underReview = claims.filter(c => c.status === 'Under Review' || c.status === 'Investigation').length;
  const approved = claims.filter(c => c.status === 'Approved' || c.status === 'Paid').length;
  const rejected = claims.filter(c => c.status === 'Rejected').length;
  const pendingDocs = claims.filter(c => c.status === 'Pending Documents').length;

  const handleViewClaim = (claim) => {
    setSelectedClaim(claim);
  };

  const handleReviewClaim = (claim) => {
    setSelectedClaim(claim);
    setShowReviewModal(true);
    setReviewData({
      decision: '',
      approvedAmount: claim.claimAmount.replace(' RWF', ''),
      comments: ''
    });
  };

  const handleSubmitReview = () => {
    if (!reviewData.decision) {
      alert('Please select a decision');
      return;
    }

    const updatedClaims = claims.map(claim => {
      if (claim.id === selectedClaim.id) {
        return {
          ...claim,
          status: reviewData.decision === 'approve' ? 'Approved' : 'Rejected',
          approvedAmount: reviewData.decision === 'approve' ? `${reviewData.approvedAmount} RWF` : null,
          dateUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return claim;
    });

    setClaims(updatedClaims);
    setShowReviewModal(false);
    setSelectedClaim(null);
    alert(`Claim ${reviewData.decision === 'approve' ? 'approved' : 'rejected'} successfully!`);
  };

  const handleDeleteClaim = (claimId) => {
    if (window.confirm('Are you sure you want to delete this claim?')) {
      setClaims(claims.filter(c => c.id !== claimId));
      alert('Claim deleted successfully');
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Claims Management</h1>
              <p className="text-gray-600 mt-1">Review and process insurance claims</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell size={24} />
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {underReview}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-8 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-3 mb-2">
            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Claims</p>
                  <p className="text-3xl font-bold text-gray-900">{totalClaims}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Under Review</p>
                  <p className="text-3xl font-bold text-blue-600">{underReview}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Approved</p>
                  <p className="text-3xl font-bold text-green-600">{approved}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Docs</p>
                  <p className="text-3xl font-bold text-yellow-600">{pendingDocs}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="text-yellow-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">{rejected}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="text-red-600" size={24} />
                </div>
              </div>
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
                  placeholder="Search by claim number, claimant, or policy..."
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
                  {claimTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="under review">Under Review</option>
                  <option value="pending documents">Pending Documents</option>
                  <option value="investigation">Investigation</option>
                  <option value="approved">Approved</option>
                  <option value="paid">Paid</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download size={18} />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Claims Table */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Claim Info</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Claimant</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Priority</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{claim.claimNumber}</p>
                        <p className="text-sm text-gray-500">{claim.policyNumber}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{claim.claimant}</p>
                        <p className="text-sm text-gray-500">{claim.clientID}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{claim.claimType}</p>
                        <p className="text-xs text-gray-500">{claim.policyType}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{claim.claimAmount}</p>
                      {claim.approvedAmount && (
                        <p className="text-sm text-green-600">Approved: {claim.approvedAmount}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(claim.priority)}`}>
                        {claim.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(claim.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(claim.status)}`}>
                          {claim.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{claim.dateSubmitted}</p>
                      <p className="text-xs text-gray-500">Updated: {claim.dateUpdated}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleViewClaim(claim)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        {(claim.status === 'Under Review' || claim.status === 'Investigation') && (
                          <button
                            onClick={() => handleReviewClaim(claim)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Review Claim"
                          >
                            <FileCheck size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteClaim(claim.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Claim"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredClaims.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Claims Found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Claim Modal */}
      {selectedClaim && !showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Claim Details</h2>
                <p className="text-sm text-gray-600">{selectedClaim.claimNumber}</p>
              </div>
              <button
                onClick={() => setSelectedClaim(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Banner */}
              <div className={`p-4 rounded-lg flex items-center justify-between border-l-4 ${
                selectedClaim.status === 'Approved' || selectedClaim.status === 'Paid' ? 'bg-green-50 border-green-500' :
                selectedClaim.status === 'Rejected' ? 'bg-red-50 border-red-500' :
                selectedClaim.status.includes('Review') || selectedClaim.status === 'Investigation' ? 'bg-blue-50 border-blue-500' :
                'bg-yellow-50 border-yellow-500'
              }`}>
                <div className="flex items-center space-x-3">
                  {getStatusIcon(selectedClaim.status)}
                  <div>
                    <p className="font-semibold text-gray-900">{selectedClaim.status}</p>
                    <p className="text-sm text-gray-600">Priority: {selectedClaim.priority}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Claim Amount</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedClaim.claimAmount}</p>
                  {selectedClaim.approvedAmount && (
                    <p className="text-sm text-green-600 font-semibold">Approved: {selectedClaim.approvedAmount}</p>
                  )}
                </div>
              </div>

              {/* Claim Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Claimant Details */}
                <div className="space-y-4">
                                  <h3 className="font-semibold text-gray-900">Claimant Details</h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center">
                      <User className="text-gray-500 mr-2" size={16} />
                      <span>{selectedClaim.claimant}</span>
                    </p>
                    <p className="flex items-center">
                      <Mail className="text-gray-500 mr-2" size={16} />
                      <span>{selectedClaim.email}</span>
                    </p>
                    <p className="flex items-center">
                      <Phone className="text-gray-500 mr-2" size={16} />
                      <span>{selectedClaim.phone}</span>
                    </p>
                    <p className="flex items-center">
                      <MapPin className="text-gray-500 mr-2" size={16} />
                      <span>Rwanda (Registered)</span>
                    </p>
                  </div>
                </div>

                {/* Policy & Incident Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Policy & Incident Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Policy Number:</strong> {selectedClaim.policyNumber}</p>
                    <p><strong>Policy Type:</strong> {selectedClaim.policyType}</p>
                    <p><strong>Claim Type:</strong> {selectedClaim.claimType}</p>
                    <p><strong>Incident Date:</strong> {selectedClaim.incidentDate}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description of Incident</h3>
                <p className="text-gray-700 text-sm bg-gray-50 p-4 rounded-lg border">
                  {selectedClaim.description}
                </p>
              </div>

              {/* Documents Section */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Attached Documents</h3>
                <div className="bg-gray-50 p-4 rounded-lg border flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileCheck className="text-blue-600" size={20} />
                    <span>{selectedClaim.documents} document(s) uploaded</span>
                  </div>
                  <button className="flex items-center text-blue-700 hover:text-blue-900 font-medium">
                    <Download size={18} className="mr-1" /> Download All
                  </button>
                </div>
              </div>

              {/* Assigned Admin */}
              <div className="text-sm text-gray-600">
                <p><strong>Assigned To:</strong> {selectedClaim.assignedTo}</p>
                <p><strong>Last Updated:</strong> {selectedClaim.dateUpdated}</p>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 flex justify-end space-x-3 border-t">
                {(selectedClaim.status === 'Under Review' || selectedClaim.status === 'Investigation') && (
                  <button
                    onClick={() => handleReviewClaim(selectedClaim)}
                    className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Review Claim
                  </button>
                )}
                <button
                  onClick={() => setSelectedClaim(null)}
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-900">Review Claim</h2>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Claim Number:</p>
                <p className="text-gray-700">{selectedClaim.claimNumber}</p>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">Decision</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="decision"
                      value="approve"
                      checked={reviewData.decision === 'approve'}
                      onChange={(e) => setReviewData({...reviewData, decision: e.target.value})}
                    />
                    <span>Approve</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="decision"
                      value="reject"
                      checked={reviewData.decision === 'reject'}
                      onChange={(e) => setReviewData({...reviewData, decision: e.target.value})}
                    />
                    <span>Reject</span>
                  </label>
                </div>
              </div>

              {reviewData.decision === 'approve' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Approved Amount (RWF)</label>
                  <input
                    type="number"
                    value={reviewData.approvedAmount}
                    onChange={(e) => setReviewData({...reviewData, approvedAmount: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Comments</label>
                <textarea
                  value={reviewData.comments}
                  onChange={(e) => setReviewData({...reviewData, comments: e.target.value})}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Add any remarks..."
                ></textarea>
              </div>
            </div>

            <div className="border-t px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="px-5 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
