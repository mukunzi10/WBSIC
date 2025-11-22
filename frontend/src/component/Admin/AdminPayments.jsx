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
  CreditCard,
  TrendingUp,
  TrendingDown,
  Receipt,
  Wallet,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Send,
  CheckCheck,
  Ban,
  AlertTriangle,
  FileCheck,
  Printer,
  Share2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function AdminPayments() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [processData, setProcessData] = useState({
    status: '',
    transactionId: '',
    notes: ''
  });

  // Sample payments data
  const [payments, setPayments] = useState([
    {
      id: 'PAY-2024-001',
      paymentNumber: 'PAY-2024-001',
      type: 'Premium',
      clientName: 'John Doe',
      clientID: 'CLI-12345',
      policyNumber: 'E390073',
      amount: '150000',
      currency: 'RWF',
      status: 'Completed',
      method: 'Bank Transfer',
      date: '2025-10-25',
      dueDate: '2025-10-20',
      processedDate: '2025-10-25',
      transactionId: 'TRX-2024-8901',
      reference: 'INV-2024-001',
      category: 'Health Insurance',
      notes: 'Monthly premium payment - October 2025'
    },
    {
      id: 'PAY-2024-002',
      paymentNumber: 'PAY-2024-002',
      type: 'Claim',
      clientName: 'Alice Johnson',
      clientID: 'CLI-12347',
      policyNumber: 'P390075',
      amount: '2300000',
      currency: 'RWF',
      status: 'Pending',
      method: 'Mobile Money',
      date: '2025-10-24',
      dueDate: '2025-10-24',
      processedDate: null,
      transactionId: null,
      reference: 'CLM-2024-178',
      category: 'Property Insurance',
      notes: 'Fire damage claim payout - approved amount'
    },
    {
      id: 'PAY-2024-003',
      paymentNumber: 'PAY-2024-003',
      type: 'Premium',
      clientName: 'Jane Smith',
      clientID: 'CLI-12346',
      policyNumber: 'S390074',
      amount: '180000',
      currency: 'RWF',
      status: 'Overdue',
      method: 'Bank Transfer',
      date: '2025-10-15',
      dueDate: '2025-10-15',
      processedDate: null,
      transactionId: null,
      reference: 'INV-2024-002',
      category: 'Motor Insurance',
      notes: 'Quarterly premium - Q4 2025'
    },
    {
      id: 'PAY-2024-004',
      paymentNumber: 'PAY-2024-004',
      type: 'Claim',
      clientName: 'Patrick Nkurunziza',
      clientID: 'CLI-12348',
      policyNumber: 'E390073',
      amount: '250000',
      currency: 'RWF',
      status: 'Processing',
      method: 'Bank Transfer',
      date: '2025-10-23',
      dueDate: '2025-10-23',
      processedDate: null,
      transactionId: 'TRX-2024-8902',
      reference: 'CLM-2024-156',
      category: 'Health Insurance',
      notes: 'Medical claim reimbursement'
    },
    {
      id: 'PAY-2024-005',
      paymentNumber: 'PAY-2024-005',
      type: 'Refund',
      clientName: 'Sarah Umutoni',
      clientID: 'CLI-12349',
      policyNumber: 'H390076',
      amount: '75000',
      currency: 'RWF',
      status: 'Completed',
      method: 'Mobile Money',
      date: '2025-10-22',
      dueDate: '2025-10-22',
      processedDate: '2025-10-22',
      transactionId: 'TRX-2024-8903',
      reference: 'REF-2024-001',
      category: 'Property Insurance',
      notes: 'Policy cancellation refund - prorated amount'
    },
    {
      id: 'PAY-2024-006',
      paymentNumber: 'PAY-2024-006',
      type: 'Premium',
      clientName: 'Jean Marie Uwimana',
      clientID: 'CLI-12350',
      policyNumber: 'L390077',
      amount: '200000',
      currency: 'RWF',
      status: 'Failed',
      method: 'Bank Transfer',
      date: '2025-10-21',
      dueDate: '2025-10-21',
      processedDate: null,
      transactionId: null,
      reference: 'INV-2024-003',
      category: 'Life Insurance',
      notes: 'Annual premium - payment failed due to insufficient funds'
    },
    {
      id: 'PAY-2024-007',
      paymentNumber: 'PAY-2024-007',
      type: 'Premium',
      clientName: 'Marie Claire Mukamana',
      clientID: 'CLI-12351',
      policyNumber: 'H390078',
      amount: '95000',
      currency: 'RWF',
      status: 'Completed',
      method: 'Cash',
      date: '2025-10-24',
      dueDate: '2025-10-24',
      processedDate: '2025-10-24',
      transactionId: 'TRX-2024-8904',
      reference: 'INV-2024-004',
      category: 'Health Insurance',
      notes: 'Monthly premium - October 2025'
    },
    {
      id: 'PAY-2024-008',
      paymentNumber: 'PAY-2024-008',
      type: 'Claim',
      clientName: 'Emmanuel Habimana',
      clientID: 'CLI-12352',
      policyNumber: 'M390079',
      amount: '850000',
      currency: 'RWF',
      status: 'Pending',
      method: 'Bank Transfer',
      date: '2025-10-25',
      dueDate: '2025-10-25',
      processedDate: null,
      transactionId: null,
      reference: 'CLM-2024-192',
      category: 'Motor Insurance',
      notes: 'Accident claim payout - awaiting final approval'
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

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="text-green-600" size={18} />;
      case 'pending':
        return <Clock className="text-yellow-600" size={18} />;
      case 'processing':
        return <RefreshCw className="text-blue-600" size={18} />;
      case 'failed':
        return <XCircle className="text-red-600" size={18} />;
      case 'overdue':
        return <AlertTriangle className="text-orange-600" size={18} />;
      default:
        return <AlertCircle className="text-gray-600" size={18} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'overdue':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeIcon = (type) => {
    switch(type.toLowerCase()) {
      case 'premium':
        return <Wallet className="text-blue-600" size={18} />;
      case 'claim':
        return <Receipt className="text-green-600" size={18} />;
      case 'refund':
        return <ArrowDownRight className="text-purple-600" size={18} />;
      default:
        return <DollarSign className="text-gray-600" size={18} />;
    }
  };

  const getTypeColor = (type) => {
    switch(type.toLowerCase()) {
      case 'premium':
        return 'bg-blue-100 text-blue-800';
      case 'claim':
        return 'bg-green-100 text-green-800';
      case 'refund':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const sortedAndFilteredPayments = [...payments]
    .filter(payment => {
      const matchesSearch = 
        payment.paymentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.policyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.transactionId?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || payment.status.toLowerCase() === filterStatus.toLowerCase();
      const matchesType = filterType === 'all' || payment.type.toLowerCase() === filterType.toLowerCase();
      
      let matchesPeriod = true;
      if (filterPeriod !== 'all') {
        const paymentDate = new Date(payment.date);
        const today = new Date();
        if (filterPeriod === 'today') {
          matchesPeriod = paymentDate.toDateString() === today.toDateString();
        } else if (filterPeriod === 'week') {
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesPeriod = paymentDate >= weekAgo;
        } else if (filterPeriod === 'month') {
          matchesPeriod = paymentDate.getMonth() === today.getMonth();
        }
      }
      
      return matchesSearch && matchesStatus && matchesType && matchesPeriod;
    })
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField === 'amount') {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      }
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  // Calculate statistics
  const totalPayments = payments.length;
  const completedPayments = payments.filter(p => p.status === 'Completed').length;
  const pendingPayments = payments.filter(p => p.status === 'Pending' || p.status === 'Processing').length;
  const overduePayments = payments.filter(p => p.status === 'Overdue').length;
  const failedPayments = payments.filter(p => p.status === 'Failed').length;

  const totalAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const completedAmount = payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const pendingAmount = payments.filter(p => p.status === 'Pending' || p.status === 'Processing').reduce((sum, p) => sum + parseFloat(p.amount), 0);
  
  const premiumPayments = payments.filter(p => p.type === 'Premium').reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const claimPayments = payments.filter(p => p.type === 'Claim').reduce((sum, p) => sum + parseFloat(p.amount), 0);

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  const handleProcessPayment = (payment) => {
    setSelectedPayment(payment);
    setShowProcessModal(true);
    setProcessData({
      status: '',
      transactionId: '',
      notes: ''
    });
  };

  const handleSubmitProcess = () => {
    if (!processData.status) {
      alert('Please select a status');
      return;
    }

    if (processData.status === 'completed' && !processData.transactionId) {
      alert('Please enter transaction ID for completed payments');
      return;
    }

    const updatedPayments = payments.map(payment => {
      if (payment.id === selectedPayment.id) {
        return {
          ...payment,
          status: processData.status === 'completed' ? 'Completed' : 
                  processData.status === 'failed' ? 'Failed' : 'Processing',
          processedDate: processData.status === 'completed' ? new Date().toISOString().split('T')[0] : null,
          transactionId: processData.status === 'completed' ? processData.transactionId : null,
          notes: processData.notes || payment.notes
        };
      }
      return payment;
    });

    setPayments(updatedPayments);
    setShowProcessModal(false);
    setSelectedPayment(null);
    alert('Payment processed successfully!');
  };

  const handleSelectPayment = (paymentId) => {
    setSelectedPayments(prev => 
      prev.includes(paymentId) 
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPayments.length === sortedAndFilteredPayments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(sortedAndFilteredPayments.map(p => p.id));
    }
  };

  const handleBulkExport = () => {
    if (selectedPayments.length === 0) {
      alert('Please select at least one payment');
      return;
    }
    alert(`Exporting ${selectedPayments.length} payment(s)...`);
    console.log('Selected payments:', selectedPayments);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW').format(amount);
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
              <div className="text-sm text-blue-300">Finance Manager</div>
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
              <h1 className="text-3xl font-bold text-gray-900">Payments Management</h1>
              <p className="text-gray-600 mt-1">Track and process all financial transactions</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Plus size={18} />
                <span>Record Payment</span>
              </button>
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell size={24} />
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {pendingPayments}
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
                  <p className="text-sm text-gray-600 mb-1">Total Payments</p>
                  <p className="text-3xl font-bold text-gray-900">{totalPayments}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-blue-600" size={24} />
                </div>
              </div>
              <div className="flex items-center text-sm">
                <TrendingUp size={16} className="text-green-600 mr-1" />
                <span className="text-green-600 font-semibold">12%</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-600">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{completedPayments}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {formatCurrency(completedAmount)} RWF
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-yellow-600">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{pendingPayments}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="text-yellow-600" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {formatCurrency(pendingAmount)} RWF
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-orange-600">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Overdue/Failed</p>
                  <p className="text-3xl font-bold text-orange-600">{overduePayments + failedPayments}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="text-orange-600" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600">Requires attention</p>
            </div>
                  </div>
            {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1">Total Value</p>
                  <p className="text-3xl font-bold">{formatCurrency(totalAmount)}</p>
                  <p className="text-sm text-blue-500 mt-1">RWF</p>
                </div>
                <div className="w-14 h-14 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Wallet size={28} />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-700 text-black rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Premium Income</p>
                  <p className="text-3xl font-bold">{formatCurrency(premiumPayments)}</p>
                  <p className="text-sm text-green-100 mt-1">RWF</p>
                </div>
                <div className="w-14 h-14 bg-green-500 rounded-lg flex items-center justify-center">
                  <ArrowUpRight size={28} />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-black rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 mb-1">Claim Payouts</p>
                  <p className="text-3xl font-bold">{formatCurrency(claimPayments)}</p>
                  <p className="text-sm text-purple-100 mt-1">RWF</p>
                </div>
                <div className="w-14 h-14 bg-purple-500 rounded-lg flex items-center justify-center">
                  <ArrowDownRight size={28} />
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
                  placeholder="Search by payment number, client, policy, or transaction ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="premium">Premium</option>
                  <option value="claim">Claim</option>
                  <option value="refund">Refund</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="overdue">Overdue</option>
                  <option value="failed">Failed</option>
                </select>
                <select
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setFilterType('all');
                    setFilterStatus('all');
                    setFilterPeriod('all');
                  }}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw size={18} />
                  <span>Reset</span>
                </button>
              </div>
            </div>
            
            {/* Bulk Actions Bar */}
            {selectedPayments.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {selectedPayments.length} payment(s) selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={handleBulkExport}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
                  >
                    <Download size={14} className="inline mr-1" />
                    Export
                  </button>
                  <button
                    onClick={() => setSelectedPayments([])}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 transition"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payments Table */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-700 to-blue-800 text-white">
                  <tr>
                    <th className="px-4 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedPayments.length === sortedAndFilteredPayments.length && sortedAndFilteredPayments.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                    </th>
                    <th 
                      onClick={() => handleSort('paymentNumber')}
                      className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-blue-600 transition"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Payment #</span>
                        {sortField === 'paymentNumber' && (
                          sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('clientName')}
                      className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-blue-600 transition"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Client</span>
                        {sortField === 'clientName' && (
                          sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                    <th 
                      onClick={() => handleSort('amount')}
                      className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-blue-600 transition"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Amount</span>
                        {sortField === 'amount' && (
                          sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Method</th>
                    <th 
                      onClick={() => handleSort('status')}
                      className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-blue-600 transition"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Status</span>
                        {sortField === 'status' && (
                          sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('date')}
                      className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-blue-600 transition"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Date</span>
                        {sortField === 'date' && (
                          sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedAndFilteredPayments.map((payment) => (
                    <tr 
                      key={payment.id} 
                      className={`hover:bg-blue-50 transition-colors ${selectedPayments.includes(payment.id) ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedPayments.includes(payment.id)}
                          onChange={() => handleSelectPayment(payment.id)}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{payment.paymentNumber}</p>
                          <p className="text-sm text-gray-500">{payment.reference}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{payment.clientName}</p>
                          <p className="text-sm text-gray-500">{payment.policyNumber}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(payment.type)}
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(payment.type)}`}>
                            {payment.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{formatCurrency(payment.amount)}</p>
                        <p className="text-xs text-gray-500">{payment.currency}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <CreditCard size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-700">{payment.method}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(payment.status)}
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 font-medium">{payment.date}</p>
                        {payment.status === 'Overdue' && (
                          <p className="text-xs text-red-600">Due: {payment.dueDate}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleViewPayment(payment)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          {(payment.status === 'Pending' || payment.status === 'Processing') && (
                            <button
                              onClick={() => handleProcessPayment(payment)}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                              title="Process Payment"
                            >
                              <Send size={18} />
                            </button>
                          )}
                          <button
                            className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                            title="Download Receipt"
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {sortedAndFilteredPayments.length === 0 && (
              <div className="text-center py-16">
                <DollarSign className="mx-auto w-20 h-20 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Payments Found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterType('all');
                    setFilterStatus('all');
                    setFilterPeriod('all');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
          
          {/* Results Summary */}
          {sortedAndFilteredPayments.length > 0 && (
            <div className="mt-4 text-sm text-gray-600 text-center">
              Showing {sortedAndFilteredPayments.length} of {totalPayments} payments
            </div>
          )}
        </div>
      </div>

      {/* View Payment Details Modal */}
      {showDetailsModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-700 to-blue-800 text-white px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center space-x-3">
                <Receipt size={28} />
                <div>
                  <h2 className="text-2xl font-bold">Payment Details</h2>
                  <p className="text-sm text-blue-200">{selectedPayment.paymentNumber}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedPayment(null);
                }}
                className="p-2 hover:bg-blue-600 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Banner */}
              <div className={`p-5 rounded-lg flex items-center justify-between border-l-4 shadow-sm ${
                selectedPayment.status === 'Completed' ? 'bg-green-50 border-green-500' :
                selectedPayment.status === 'Failed' ? 'bg-red-50 border-red-500' :
                selectedPayment.status === 'Overdue' ? 'bg-orange-50 border-orange-500' :
                selectedPayment.status === 'Processing' ? 'bg-blue-50 border-blue-500' :
                'bg-yellow-50 border-yellow-500'
              }`}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow">
                    {getStatusIcon(selectedPayment.status)}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-gray-900">{selectedPayment.status}</p>
                    <p className="text-sm text-gray-600">
                      {selectedPayment.type} Payment • {selectedPayment.method}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Amount</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(selectedPayment.amount)}</p>
                  <p className="text-sm text-gray-600">{selectedPayment.currency}</p>
                </div>
              </div>

              {/* Payment Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client Details */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                    <Users className="mr-2" size={20} />
                    Client Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Client Name</p>
                      <p className="font-medium text-gray-900">{selectedPayment.clientName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Client ID</p>
                      <p className="font-medium text-gray-900">{selectedPayment.clientID}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Policy Number</p>
                      <p className="font-medium text-gray-900">{selectedPayment.policyNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Category</p>
                      <p className="font-medium text-gray-900">{selectedPayment.category}</p>
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="mr-2" size={20} />
                    Transaction Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Payment Date</p>
                      <p className="font-medium text-gray-900">{selectedPayment.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Due Date</p>
                      <p className="font-medium text-gray-900">{selectedPayment.dueDate}</p>
                    </div>
                    {selectedPayment.processedDate && (
                      <div>
                        <p className="text-gray-500 text-xs">Processed Date</p>
                        <p className="font-medium text-gray-900">{selectedPayment.processedDate}</p>
                      </div>
                    )}
                    {selectedPayment.transactionId && (
                      <div>
                        <p className="text-gray-500 text-xs">Transaction ID</p>
                        <p className="font-medium text-gray-900">{selectedPayment.transactionId}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-500 text-xs">Payment Method</p>
                      <p className="font-medium text-gray-900">{selectedPayment.method}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedPayment.notes && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                    <FileText className="mr-2" size={20} />
                    Notes & Remarks
                  </h3>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <p className="text-gray-700">{selectedPayment.notes}</p>
                  </div>
                </div>
              )}

              {/* Amount Breakdown */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-4">Payment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Type:</span>
                    <span className="font-semibold text-gray-900">{selectedPayment.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Reference:</span>
                    <span className="font-semibold text-gray-900">{selectedPayment.reference}</span>
                  </div>
                  <div className="border-t border-blue-200 pt-2 mt-2"></div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Total Amount:</span>
                    <span className="font-bold text-blue-900 text-xl">{formatCurrency(selectedPayment.amount)} {selectedPayment.currency}</span>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-6 flex justify-between items-center border-t">
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                    <Printer size={18} />
                    <span>Print Receipt</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                    <Download size={18} />
                    <span>Download PDF</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                    <Share2 size={18} />
                    <span>Share</span>
                  </button>
                </div>
                <div className="flex space-x-3">
                  {(selectedPayment.status === 'Pending' || selectedPayment.status === 'Processing') && (
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        handleProcessPayment(selectedPayment);
                      }}
                      className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                    >
                      <Send size={18} />
                      <span>Process Payment</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedPayment(null);
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Process Payment Modal */}
      {showProcessModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl">
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
              <div className="flex items-center space-x-3">
                <Send size={28} />
                <div>
                  <h2 className="text-2xl font-bold">Process Payment</h2>
                  <p className="text-sm text-green-100">{selectedPayment.paymentNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setShowProcessModal(false)}
                className="p-2 hover:bg-green-600 rounded-full transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Payment Summary */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Client</p>
                    <p className="font-semibold text-gray-900">{selectedPayment.clientName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Payment Type</p>
                    <p className="font-semibold text-gray-900">{selectedPayment.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Amount</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(selectedPayment.amount)} {selectedPayment.currency}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Method</p>
                    <p className="font-semibold text-gray-900">{selectedPayment.method}</p>
                  </div>
                </div>
              </div>

              {/* Status Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Process Status *</label>
                <div className="grid grid-cols-3 gap-3">
                  <label className={`flex flex-col items-center justify-center space-y-2 p-4 border-2 rounded-lg cursor-pointer transition ${
                    processData.status === 'completed' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 hover:border-green-300'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value="completed"
                      checked={processData.status === 'completed'}
                      onChange={(e) => setProcessData({...processData, status: e.target.value})}
                      className="w-5 h-5"
                    />
                    <CheckCircle className="text-green-600" size={24} />
                    <span className="font-semibold text-gray-900 text-sm">Complete</span>
                  </label>
                  
                  <label className={`flex flex-col items-center justify-center space-y-2 p-4 border-2 rounded-lg cursor-pointer transition ${
                    processData.status === 'processing' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-300'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value="processing"
                      checked={processData.status === 'processing'}
                      onChange={(e) => setProcessData({...processData, status: e.target.value})}
                      className="w-5 h-5"
                    />
                    <RefreshCw className="text-blue-600" size={24} />
                    <span className="font-semibold text-gray-900 text-sm">Processing</span>
                  </label>
                  
                  <label className={`flex flex-col items-center justify-center space-y-2 p-4 border-2 rounded-lg cursor-pointer transition ${
                    processData.status === 'failed' 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300 hover:border-red-300'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value="failed"
                      checked={processData.status === 'failed'}
                      onChange={(e) => setProcessData({...processData, status: e.target.value})}
                      className="w-5 h-5"
                    />
                    <XCircle className="text-red-600" size={24} />
                    <span className="font-semibold text-gray-900 text-sm">Failed</span>
                  </label>
                </div>
              </div>

              {/* Transaction ID - Only for completed */}
              {processData.status === 'completed' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Transaction ID *</label>
                  <input
                    type="text"
                    value={processData.transactionId}
                    onChange={(e) => setProcessData({...processData, transactionId: e.target.value})}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter transaction ID"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Reference number from payment gateway or bank
                  </p>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Processing Notes
                </label>
                <textarea
                  value={processData.notes}
                  onChange={(e) => setProcessData({...processData, notes: e.target.value})}
                  rows="4"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Add any notes or remarks about this transaction..."
                ></textarea>
              </div>

              {/* Warning for failed */}
              {processData.status === 'failed' && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex items-start">
                    <AlertTriangle className="text-red-600 mr-3 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-semibold text-red-900">Payment Failure</p>
                      <p className="text-sm text-red-700 mt-1">
                        This will mark the payment as failed. Please ensure you've verified the failure reason and added appropriate notes.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t px-6 py-4 flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setShowProcessModal(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitProcess}
                disabled={!processData.status}
                className={`px-6 py-3 text-white rounded-lg transition font-semibold ${
                  processData.status === 'completed'
                    ? 'bg-green-600 hover:bg-green-700'
                    : processData.status === 'failed'
                    ? 'bg-red-600 hover:bg-red-700'
                    : processData.status === 'processing'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {processData.status === 'completed' ? 'Complete Payment' : 
                 processData.status === 'failed' ? 'Mark as Failed' :
                 processData.status === 'processing' ? 'Continue Processing' : 
                 'Select Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}