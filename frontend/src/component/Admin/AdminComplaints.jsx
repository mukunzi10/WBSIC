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
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Send,
  CheckCheck,
  AlertTriangle,
  MessageCircle,
  Printer,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Flag,
  User,
  Mail,
  Phone,
  FileCheck,
  Archive
} from 'lucide-react';

export default function AdminComplaints() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedComplaints, setSelectedComplaints] = useState([]);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [responseData, setResponseData] = useState({
    message: ''
  });
  const [resolveData, setResolveData] = useState({
    resolution: '',
    notes: '',
    satisfaction: ''
  });

  // Sample complaints data
  const [complaints, setComplaints] = useState([
    {
      id: 'CMP-2024-001',
      complaintNumber: 'CMP-2024-001',
      clientName: 'John Doe',
      clientID: 'CLI-12345',
      email: 'john.doe@example.com',
      phone: '0788123456',
      policyNumber: 'E390073',
      category: 'Claim Processing',
      subject: 'Delayed claim settlement',
      description: 'My claim has been pending for over 3 weeks without any update. I need urgent assistance as I have medical bills to pay.',
      status: 'Open',
      priority: 'High',
      date: '2025-10-23',
      lastUpdated: '2025-10-25',
      assignedTo: 'Admin User',
      responses: [
        {
          date: '2025-10-24',
          author: 'Admin User',
          message: 'We have escalated your claim to our senior claims team. You should receive an update within 48 hours.'
        }
      ],
      resolution: null
    },
    {
      id: 'CMP-2024-002',
      complaintNumber: 'CMP-2024-002',
      clientName: 'Jane Smith',
      clientID: 'CLI-12346',
      email: 'jane.smith@example.com',
      phone: '0789654321',
      policyNumber: 'S390074',
      category: 'Premium Payment',
      subject: 'Incorrect premium amount charged',
      description: 'I was charged 200,000 RWF instead of the agreed 180,000 RWF for my quarterly premium. Please investigate and refund the difference.',
      status: 'In Progress',
      priority: 'Medium',
      date: '2025-10-22',
      lastUpdated: '2025-10-24',
      assignedTo: 'Admin User',
      responses: [
        {
          date: '2025-10-23',
          author: 'Admin User',
          message: 'Thank you for bringing this to our attention. We are reviewing your payment records.'
        },
        {
          date: '2025-10-24',
          author: 'Admin User',
          message: 'We have identified the error. A refund of 20,000 RWF will be processed within 5 business days.'
        }
      ],
      resolution: null
    },
    {
      id: 'CMP-2024-003',
      complaintNumber: 'CMP-2024-003',
      clientName: 'Alice Johnson',
      clientID: 'CLI-12347',
      email: 'alice.j@example.com',
      phone: '0787456789',
      policyNumber: 'P390075',
      category: 'Customer Service',
      subject: 'Poor customer service experience',
      description: 'Called customer service multiple times but was put on hold for over 30 minutes each time. Very frustrating experience.',
      status: 'Resolved',
      priority: 'Low',
      date: '2025-10-18',
      lastUpdated: '2025-10-21',
      assignedTo: 'Admin User',
      responses: [
        {
          date: '2025-10-19',
          author: 'Admin User',
          message: 'We sincerely apologize for the inconvenience. We are improving our call center capacity.'
        }
      ],
      resolution: {
        date: '2025-10-21',
        notes: 'Apologized to customer. Provided direct contact for future inquiries. Implementing additional training for call center staff.',
        satisfaction: 'Satisfied'
      }
    },
    {
      id: 'CMP-2024-004',
      complaintNumber: 'CMP-2024-004',
      clientName: 'Patrick Nkurunziza',
      clientID: 'CLI-12348',
      email: 'patrick.n@example.com',
      phone: '0785987654',
      policyNumber: 'E390073',
      category: 'Policy Coverage',
      subject: 'Coverage details unclear',
      description: 'The policy document is confusing. I need clarification on what is covered under my health insurance plan.',
      status: 'Open',
      priority: 'Medium',
      date: '2025-10-25',
      lastUpdated: '2025-10-25',
      assignedTo: 'Admin User',
      responses: [],
      resolution: null
    },
    {
      id: 'CMP-2024-005',
      complaintNumber: 'CMP-2024-005',
      clientName: 'Sarah Umutoni',
      clientID: 'CLI-12349',
      email: 'sarah.u@example.com',
      phone: '0786123456',
      policyNumber: 'H390076',
      category: 'Claim Rejection',
      subject: 'Unfair claim rejection',
      description: 'My theft claim was rejected without proper explanation. I provided all required documentation including police report.',
      status: 'Escalated',
      priority: 'High',
      date: '2025-10-20',
      lastUpdated: '2025-10-24',
      assignedTo: 'Senior Manager',
      responses: [
        {
          date: '2025-10-21',
          author: 'Admin User',
          message: 'We are reviewing your claim rejection. A senior manager will contact you within 2 business days.'
        },
        {
          date: '2025-10-24',
          author: 'Senior Manager',
          message: 'After review, we found insufficient evidence of forced entry. However, we will conduct a field investigation.'
        }
      ],
      resolution: null
    },
    {
      id: 'CMP-2024-006',
      complaintNumber: 'CMP-2024-006',
      clientName: 'Emmanuel Habimana',
      clientID: 'CLI-12352',
      email: 'emmanuel.h@example.com',
      phone: '0784567890',
      policyNumber: 'M390079',
      category: 'Billing Issue',
      subject: 'Double charged for premium',
      description: 'I was charged twice for the same premium payment on October 15th. Please refund one payment immediately.',
      status: 'In Progress',
      priority: 'High',
      date: '2025-10-21',
      lastUpdated: '2025-10-23',
      assignedTo: 'Finance Team',
      responses: [
        {
          date: '2025-10-22',
          author: 'Finance Team',
          message: 'We have confirmed the duplicate charge. Refund is being processed.'
        }
      ],
      resolution: null
    },
    {
      id: 'CMP-2024-007',
      complaintNumber: 'CMP-2024-007',
      clientName: 'Marie Claire Mukamana',
      clientID: 'CLI-12351',
      email: 'marie.c@example.com',
      phone: '0783456789',
      policyNumber: 'H390078',
      category: 'Documentation',
      subject: 'Missing policy documents',
      description: 'I never received my policy documents after signing up 2 months ago. Need them urgently for visa application.',
      status: 'Resolved',
      priority: 'Medium',
      date: '2025-10-16',
      lastUpdated: '2025-10-20',
      assignedTo: 'Admin User',
      responses: [
        {
          date: '2025-10-17',
          author: 'Admin User',
          message: 'We apologize for the oversight. Your documents have been sent to your email.'
        }
      ],
      resolution: {
        date: '2025-10-20',
        notes: 'Sent policy documents via email and courier. Customer confirmed receipt.',
        satisfaction: 'Satisfied'
      }
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

  const categories = [
    'Claim Processing',
    'Premium Payment',
    'Customer Service',
    'Policy Coverage',
    'Claim Rejection',
    'Billing Issue',
    'Documentation',
    'Other'
  ];

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'resolved':
        return <CheckCircle className="text-green-600" size={18} />;
      case 'open':
        return <AlertCircle className="text-blue-600" size={18} />;
      case 'in progress':
        return <Clock className="text-yellow-600" size={18} />;
      case 'escalated':
        return <Flag className="text-red-600" size={18} />;
      case 'closed':
        return <XCircle className="text-gray-600" size={18} />;
      default:
        return <MessageCircle className="text-gray-600" size={18} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'open':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'escalated':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedAndFilteredComplaints = [...complaints]
    .filter(complaint => {
      const matchesSearch = 
        complaint.complaintNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.policyNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || complaint.status.toLowerCase() === filterStatus.toLowerCase();
      const matchesPriority = filterPriority === 'all' || complaint.priority.toLowerCase() === filterPriority.toLowerCase();
      const matchesCategory = filterCategory === 'all' || complaint.category === filterCategory;
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    })
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  // Calculate statistics
  const totalComplaints = complaints.length;
  const openComplaints = complaints.filter(c => c.status === 'Open').length;
  const inProgressComplaints = complaints.filter(c => c.status === 'In Progress').length;
  const escalatedComplaints = complaints.filter(c => c.status === 'Escalated').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
  
  const resolutionRate = totalComplaints > 0 ? ((resolvedComplaints / totalComplaints) * 100).toFixed(1) : 0;
  const avgResponseTime = '2.5 hours'; // This would be calculated from actual data

  const handleViewComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setShowDetailsModal(true);
  };

  const handleResolveComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setShowResolveModal(true);
    setResolveData({
      resolution: '',
      notes: '',
      satisfaction: ''
    });
  };

  const handleSendResponse = (complaint) => {
    setSelectedComplaint(complaint);
    setShowResponseModal(true);
    setResponseData({
      message: ''
    });
  };

  const handleSubmitResponse = () => {
    if (!responseData.message.trim()) {
      alert('Please enter a response message');
      return;
    }

    const updatedComplaints = complaints.map(complaint => {
      if (complaint.id === selectedComplaint.id) {
        return {
          ...complaint,
          responses: [
            ...complaint.responses,
            {
              date: new Date().toISOString().split('T')[0],
              author: 'Admin User',
              message: responseData.message
            }
          ],
          lastUpdated: new Date().toISOString().split('T')[0],
          status: complaint.status === 'Open' ? 'In Progress' : complaint.status
        };
      }
      return complaint;
    });

    setComplaints(updatedComplaints);
    setShowResponseModal(false);
    setSelectedComplaint(null);
    alert('Response sent successfully!');
  };

  const handleSubmitResolve = () => {
    if (!resolveData.resolution) {
      alert('Please select a resolution type');
      return;
    }

    if (!resolveData.notes.trim()) {
      alert('Please enter resolution notes');
      return;
    }

    const updatedComplaints = complaints.map(complaint => {
      if (complaint.id === selectedComplaint.id) {
        return {
          ...complaint,
          status: 'Resolved',
          lastUpdated: new Date().toISOString().split('T')[0],
          resolution: {
            date: new Date().toISOString().split('T')[0],
            notes: resolveData.notes,
            satisfaction: resolveData.satisfaction || 'Not Specified'
          }
        };
      }
      return complaint;
    });

    setComplaints(updatedComplaints);
    setShowResolveModal(false);
    setSelectedComplaint(null);
    alert('Complaint resolved successfully!');
  };

  const handleSelectComplaint = (complaintId) => {
    setSelectedComplaints(prev => 
      prev.includes(complaintId) 
        ? prev.filter(id => id !== complaintId)
        : [...prev, complaintId]
    );
  };

  const handleSelectAll = () => {
    if (selectedComplaints.length === sortedAndFilteredComplaints.length) {
      setSelectedComplaints([]);
    } else {
      setSelectedComplaints(sortedAndFilteredComplaints.map(c => c.id));
    }
  };

  const handleBulkExport = () => {
    if (selectedComplaints.length === 0) {
      alert('Please select at least one complaint');
      return;
    }
    alert(`Exporting ${selectedComplaints.length} complaint(s)...`);
    console.log('Selected complaints:', selectedComplaints);
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
              <div className="text-sm text-blue-300">Support Manager</div>
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
              <h1 className="text-3xl font-bold text-gray-900">Complaints Management</h1>
              <p className="text-gray-600 mt-1">Track and resolve customer complaints efficiently</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download size={18} />
                <span>Export Report</span>
              </button>
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell size={24} />
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {openComplaints + escalatedComplaints}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-8 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-600">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Complaints</p>
                  <p className="text-3xl font-bold text-gray-900">{totalComplaints}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="text-blue-600" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600">All time</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-yellow-600">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active</p>
                  <p className="text-3xl font-bold text-yellow-600">{openComplaints + inProgressComplaints}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="text-yellow-600" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600">Open + In Progress</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-red-600">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Escalated</p>
                  <p className="text-3xl font-bold text-red-600">{escalatedComplaints}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Flag className="text-red-600" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600">Requires attention</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-600">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Resolved</p>
                  <p className="text-3xl font-bold text-green-600">{resolvedComplaints}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600">{resolutionRate}% resolution rate</p>
            </div>
          </div>

          {/* Performance Metrics - Single Row */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg shadow-md p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 mb-1 text-sm">Avg Response Time</p>
                    <p className="text-2xl font-bold">{avgResponseTime}</p>
                    <p className="text-xs text-blue-100 mt-1">Target: &lt; 4 hours</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Clock size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-600 to-green-700 text-gray-500 rounded-lg shadow-md p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 mb-1 text-sm">Resolution Rate</p>
                    <p className="text-2xl font-bold">{resolutionRate}%</p>
                    <p className="text-xs text-green-100 mt-1">Target: &gt; 90%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <CheckCheck size={24}  className='text-white'/>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-gray-500 rounded-lg shadow-md p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 mb-1 text-sm">Satisfaction Score</p>
                    <p className="text-2xl font-bold">4.2/5.0</p>
                    <p className="text-xs text-purple-100 mt-1">Based on feedback</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <ThumbsUp size={24} className='text-white' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="px-8 pb-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by complaint number, client, subject, or policy..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in progress">In Progress</option>
                  <option value="escalated">Escalated</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                              <option value="all">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <button
                  onClick={handleBulkExport}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download size={18} />
                  <span>Export Selected</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedComplaints.length === sortedAndFilteredComplaints.length &&
                        sortedAndFilteredComplaints.length > 0
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold cursor-pointer"
                    onClick={() => handleSort('complaintNumber')}
                  >
                    Complaint #
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Client</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Subject</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Priority</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    Date
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {sortedAndFilteredComplaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedComplaints.includes(complaint.id)}
                        onChange={() => handleSelectComplaint(complaint.id)}
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{complaint.complaintNumber}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{complaint.clientName}</p>
                      <p className="text-xs text-gray-500">{complaint.clientID}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{complaint.subject}</td>
                    <td className="px-6 py-4 text-sm">{complaint.category}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(
                          complaint.priority
                        )}`}
                      >
                        {complaint.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(complaint.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            complaint.status
                          )}`}
                        >
                          {complaint.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{complaint.date}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleViewComplaint(complaint)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleSendResponse(complaint)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Send Response"
                        >
                          <Send size={18} />
                        </button>
                        {complaint.status !== 'Resolved' && (
                          <button
                            onClick={() => handleResolveComplaint(complaint)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                            title="Resolve Complaint"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {sortedAndFilteredComplaints.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Complaints Found</h3>
                <p className="text-gray-500">Try adjusting your filters or search.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* === DETAILS MODAL === */}
      {showDetailsModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-900">Complaint Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={22} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-600">Complaint No.</p>
                  <p className="font-bold text-gray-900">{selectedComplaint.complaintNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold text-gray-900">{selectedComplaint.date}</p>
                </div>
              </div>

              <div className="bg-gray-50 border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Client Info</h3>
                <p><strong>Name:</strong> {selectedComplaint.clientName}</p>
                <p><strong>Email:</strong> {selectedComplaint.email}</p>
                <p><strong>Phone:</strong> {selectedComplaint.phone}</p>
                <p><strong>Policy:</strong> {selectedComplaint.policyNumber}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Subject</h3>
                <p className="text-gray-900">{selectedComplaint.subject}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Description</h3>
                <p className="text-gray-700 bg-gray-50 border rounded-lg p-3">{selectedComplaint.description}</p>
              </div>

              {/* Responses */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Responses</h3>
                {selectedComplaint.responses.length > 0 ? (
                  <div className="space-y-3">
                    {selectedComplaint.responses.map((res, i) => (
                      <div key={i} className="p-3 border rounded-lg bg-gray-50">
                        <p className="text-sm text-gray-600">{res.date} - {res.author}</p>
                        <p className="text-gray-800">{res.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No responses yet.</p>
                )}
              </div>

              {/* Resolution */}
              {selectedComplaint.resolution && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Resolution</h3>
                  <p><strong>Date:</strong> {selectedComplaint.resolution.date}</p>
                  <p><strong>Notes:</strong> {selectedComplaint.resolution.notes}</p>
                  <p><strong>Satisfaction:</strong> {selectedComplaint.resolution.satisfaction}</p>
                </div>
              )}

              <div className="pt-4 flex justify-end space-x-3 border-t">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === RESPONSE MODAL === */}
      {showResponseModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-900">Send Response</h2>
              <button onClick={() => setShowResponseModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={22} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <textarea
                value={responseData.message}
                onChange={(e) => setResponseData({ message: e.target.value })}
                rows="5"
                placeholder="Write your response message here..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <div className="border-t px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowResponseModal(false)}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitResponse}
                className="px-5 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === RESOLVE MODAL === */}
      {showResolveModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-900">Resolve Complaint</h2>
              <button onClick={() => setShowResolveModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={22} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Resolution Type</label>
                <select
                  value={resolveData.resolution}
                  onChange={(e) => setResolveData({ ...resolveData, resolution: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select resolution</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                  <option value="Escalated">Escalated</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Resolution Notes</label>
                <textarea
                  value={resolveData.notes}
                  onChange={(e) => setResolveData({ ...resolveData, notes: e.target.value })}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Client Satisfaction</label>
                <select
                  value={resolveData.satisfaction}
                  onChange={(e) => setResolveData({ ...resolveData, satisfaction: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select satisfaction level</option>
                  <option value="Satisfied">Satisfied</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Dissatisfied">Dissatisfied</option>
                </select>
              </div>
            </div>
            <div className="border-t px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowResolveModal(false)}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitResolve}
                className="px-5 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

      