import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FileText, Briefcase, MessageSquare, ThumbsUp,
  Bell, Settings, LogOut, Plus, Search,
  Clock, CheckCircle, XCircle, AlertCircle, X
} from 'lucide-react';
import { fetchMyComplaints, submitComplaint } from '../api/complaints';
import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function ClientComplaints() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showNewComplaint, setShowNewComplaint] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [error, setError] = useState('');
  const [complaintForm, setComplaintForm] = useState({
    subject: '',
    category: '',
    policyNumber: '',
    description: '',
    priority: 'medium'
  });

  const menuItems = [
    { id: 'policies', label: 'Policies', icon: FileText, path: '/ClientDashboard' },
    { id: 'services', label: 'Services', icon: Briefcase, path: '/services' },
    { id: 'complaints', label: 'Complaints', icon: MessageSquare, path: '/complaints' },
    { id: 'feedback', label: 'Feedback', icon: ThumbsUp, path: '/feedback' }
  ];
  // ----------------- Fetch User & Complaints -----------------
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
         const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        // Fetch user data
        const userResponse = await axios.get(`${BASE_URL}/auth/me`, config);
        setUser(userResponse.data);
          console.log('Fetched user:', userResponse.data);
        // Fetch complaints
        const complaintsData = await fetchMyComplaints();
        setComplaints(complaintsData);
        console.log('Fetched complaints:', complaintsData);
        
      } catch (err) {
        console.error('Failed to load data:', err);
        if (err.message?.includes('No auth token') || err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Failed to load data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [navigate]);

  // ----------------- Helpers -----------------
  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'resolved':
      case 'closed': return <CheckCircle className="text-green-600" size={20} />;
      case 'in progress': return <Clock className="text-blue-600" size={20} />;
      case 'open': return <AlertCircle className="text-orange-600" size={20} />;
      default: return <XCircle className="text-red-600" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'resolved':
      case 'closed': return 'bg-green-100 text-green-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'open': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // ----------------- Handlers -----------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setComplaintForm({ ...complaintForm, [name]: value });
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      const newComplaint = await submitComplaint(complaintForm);
      setComplaints([newComplaint, ...complaints]);
      setShowNewComplaint(false);
      setComplaintForm({
        subject: '',
        category: '',
        policyNumber: '',
        description: '',
        priority: ''
      });
      
      // Show success message (optional)
      alert('Complaint submitted successfully!');
      
    } catch (err) {
      console.error('Failed to submit complaint', err);
      setError(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // ----------------- Filtered Complaints -----------------
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch = c.subject?.toLowerCase().includes(searchQuery.toLowerCase()) 
      || c.id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || c.status?.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Get user initials for avatar
   const getUserInitials = () => {
    if (!user) return "U";
    const names = user.firstName && user.lastName ? [user.firstName, user.lastName] : [];
    if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
    return user.firstName?.[0]?.toUpperCase() || "U";
  };


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col">
        <div className="p-6 border-b border-blue-700 flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-900" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="font-bold text-lg">Sanlam | Allianz</div>
        </div>
        <nav className="flex-1 py-6">
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
        
        {/* User Profile Section */}
        <div className="p-6 border-t border-blue-700 flex items-center space-x-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold">
            {getUserInitials()}
          </div>
          <div className="flex-1">
            {user ? (
              <>
                <div className="font-semibold">{user?.user?.firstName || 'Loading...'}</div>
                <div className="font-semibold">{user?.user?.lastName || 'Loading...'}</div>
                <div className="text-sm text-blue-300">{user?.user?.phone || user?.user?.email}</div>
              </>
            ) : (
              'Loading...'
            )} 
          </div>  
            </div>
        
        <div className="p-4 border-t border-blue-700 flex justify-around">
          <button className="p-2 hover:bg-blue-700 rounded-full transition-colors">
            <Settings size={20} />
          </button>
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-blue-700 rounded-full transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Complaints</h1>
            <p className="text-gray-600 mt-1">Submit and track your complaints</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <Bell size={24} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={() => setShowNewComplaint(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              <Plus size={20} />
              <span className="font-semibold">New Complaint</span>
            </button>
          </div>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mx-8 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="text-red-600" size={20} />
            <span className="text-red-800 text-sm">{error}</span>
            <button onClick={() => setError('')} className="ml-auto">
              <X size={16} className="text-red-600" />
            </button>
          </div>
        )}

        {/* Search & Filter */}
        <div className="bg-white border-b px-8 py-4 flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search complaints by ID or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Complaints List */}
        <section className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="text-center py-20 text-gray-500">Loading complaints...</div>
          ) : filteredComplaints.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              {complaints.length === 0 ? 'No complaints yet. Submit your first complaint!' : 'No complaints match your search criteria.'}
            </div>
          ) : (
            filteredComplaints.map((c) => (
              <div key={c._id || c.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow mb-4 p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-bold text-gray-900">{c.subject}</h3>
                    {getStatusIcon(c.status)}
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(c.status)}`}>
                      {c.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(c.priority)}`}>
                      {c.priority?.toUpperCase()} Priority
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  <span className="font-semibold">{c.id}</span> • Policy: {c.policyNumber} • Category: {c.category}
                </div>
                <p className="text-gray-700 mb-3">{c.description}</p>
                {c.response && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-3 text-sm text-gray-700">
                    <span className="font-semibold">Response from Support Team:</span> {c.response}
                  </div>
                )}
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Submitted: {new Date(c.createdAt).toLocaleDateString()}</span>
                  <span>Last Updated: {new Date(c.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </section>

        {/* New Complaint Modal */}
        {showNewComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Submit New Complaint</h2>
                <button
                  onClick={() => setShowNewComplaint(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  disabled={submitting}
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmitComplaint} className="p-6 space-y-4">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject *"
                  value={complaintForm.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={submitting}
                />
                <input
                  type="text"
                  name="category"
                  placeholder="Category (e.g., Claims, Billing, Service) *"
                  value={complaintForm.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={submitting}
                />
                <input
                  type="text"
                  name="policyNumber"
                  placeholder="Policy Number *"
                  value={complaintForm.policyNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={submitting}
                />
                <textarea
                  name="description"
                  placeholder="Describe your complaint in detail *"
                  value={complaintForm.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                  disabled={submitting}
                />
                <select
                  name="priority"
                  value={complaintForm.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={submitting}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Submitting...
                    </>
                  ) : (
                    'Submit Complaint'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}