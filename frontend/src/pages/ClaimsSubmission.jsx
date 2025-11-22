import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FileText, Briefcase, MessageSquare, ThumbsUp, Bell, Settings, LogOut, 
  Plus, Search, Clock, CheckCircle, XCircle, AlertCircle, X, Calendar, 
  DollarSign, Loader2, Upload, AlertTriangle, MapPin, FileCheck, 
  Building, User, Phone, Mail, Info, ChevronRight, Eye, Download
} from 'lucide-react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function ClaimsSubmission() {
  const navigate = useNavigate();
  const location = useLocation();

  // State Management
  const [user, setUser] = useState(null);
  const [claims, setClaims] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showClaimDetails, setShowClaimDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showNewClaim, setShowNewClaim] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [notifications, setNotifications] = useState(0);
  
  const [claimForm, setClaimForm] = useState({
    policyNumber: '',
    policyType: '',
    claimType: '',
    incidentDate: '',
    claimAmount: '',
    description: '',
    location: '',
    witnesses: [],
    policeReportNumber: '',
    hospitalName: '',
    doctorName: '',
    diagnosisDetails: '',
    paymentMethod: 'Bank Transfer',
    accountNumber: '',
    accountName: '',
    bankName: '',
    bankBranch: ''
  });

  // Menu items aligned with ClientDashboard
  const menuItems = [
    { id: 'policies', label: 'Policies', icon: FileText, path: '/clientDashboard' },
    { id: 'services', label: 'Services', icon: Briefcase, path: '/services' },
    { id: 'complaints', label: 'Complaints', icon: MessageSquare, path: '/complaints' },
    { id: 'feedback', label: 'Feedback', icon: ThumbsUp, path: '/feedback' }
  ];

  const policyTypes = {
    'Life': ['Death Benefit', 'Critical Illness', 'Disability', 'Other'],
    'Health': ['Medical Expense', 'Hospitalization', 'Surgery', 'Emergency', 'Other'],
    'Auto': ['Accident', 'Theft', 'Property Damage', 'Natural Disaster', 'Other'],
    'Home': ['Fire', 'Theft', 'Natural Disaster', 'Water Damage', 'Property Damage', 'Other'],
    'Property': ['Fire', 'Theft', 'Natural Disaster', 'Property Damage', 'Other'],
    'Travel': ['Trip Cancellation', 'Medical Emergency', 'Lost Luggage', 'Other']
  };

  const steps = [
    { number: 1, title: 'Claim Details', icon: FileText },
    { number: 2, title: 'Additional Info', icon: User },
    { number: 3, title: 'Documents', icon: Upload },
    { number: 4, title: 'Review & Submit', icon: CheckCircle }
  ];

  const requiredDocuments = [
    'Copy of ID or Passport',
    'Policy document',
    'Incident photos (if applicable)',
    'Police report (for theft/accident)',
    'Medical reports (for health claims)',
    'Bank account statement'
  ];

  // Fetch user data, claims, and policies
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [userRes, claimsRes, policiesRes] = await Promise.all([
          axios.get(`${BASE_URL}/auth/me`, config),
          axios.get(`${BASE_URL}/claims/my-claims`, config),
          axios.get(`${BASE_URL}/policies/my-policies`, config)
        ]);

        setUser(userRes.data);
        setClaims(claimsRes.data.data || []);
        setPolicies(policiesRes.data.data || []);
        setNotifications(Math.floor(Math.random() * 5));
      } catch (err) {
        console.error('Failed to load data:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Failed to load data. Please refresh the page.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [navigate]);

  // Handle policy selection
  const handlePolicyChange = (e) => {
    const policyNumber = e.target.value;
    const selectedPolicy = policies.find(p => p.policyNumber === policyNumber);
    
    setClaimForm(prev => ({
      ...prev,
      policyNumber,
      policyType: selectedPolicy?.type || '',
      claimType: ''
    }));
  };

  // Handle file upload with validation
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + uploadedFiles.length > 10) {
      setError('Maximum 10 files allowed');
      return;
    }
    
    const validFiles = [];
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024;
    
    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        setError(`${file.name} is not a valid file type. Allowed: JPG, PNG, PDF, DOC`);
        continue;
      }
      if (file.size > maxSize) {
        setError(`${file.name} exceeds 5MB limit`);
        continue;
      }
      validFiles.push({
        id: Date.now() + Math.random(),
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB',
        type: file.type,
        file: file,
        documentType: 'Supporting Document'
      });
    }
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (id) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClaimForm(prev => ({ ...prev, [name]: value }));
  };

  // Validation for each step
  const validateStep = (step) => {
    switch(step) {
      case 1:
        if (!claimForm.policyNumber || !claimForm.claimType || !claimForm.incidentDate || 
            !claimForm.claimAmount || !claimForm.description) {
          setError('Please fill in all required fields');
          return false;
        }
        if (parseFloat(claimForm.claimAmount) <= 0) {
          setError('Claim amount must be greater than 0');
          return false;
        }
        if (claimForm.description.length < 20) {
          setError('Description must be at least 20 characters');
          return false;
        }
        break;
      case 2:
        if (claimForm.paymentMethod === 'Bank Transfer') {
          if (!claimForm.accountNumber || !claimForm.accountName || !claimForm.bankName) {
            setError('Please fill in all bank details');
            return false;
          }
        }
        break;
      case 3:
        if (uploadedFiles.length === 0) {
          setError('Please upload at least one supporting document');
          return false;
        }
        break;
      default:
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      setError('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit claim
  const handleSubmitClaim = async () => {
    if (!validateStep(4)) return;
    
    setSubmitting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // Parse witnesses
      const witnessesArray = claimForm.witnesses
        ? claimForm.witnesses.split(',').map(w => ({
            name: w.trim(),
            contact: ''
          }))
        : [];

      // Prepare claim data
      const claimData = {
        policyNumber: claimForm.policyNumber,
        policyType: claimForm.policyType,
        claimType: claimForm.claimType,
        incidentDate: claimForm.incidentDate,
        claimAmount: parseFloat(claimForm.claimAmount),
        description: claimForm.description.trim(),
        location: claimForm.location?.trim() || '',
        witnesses: witnessesArray,
        policeReportNumber: claimForm.policeReportNumber?.trim() || '',
        hospitalName: claimForm.hospitalName?.trim() || '',
        doctorName: claimForm.doctorName?.trim() || '',
        paymentDetails: {
          method: claimForm.paymentMethod,
          accountNumber: claimForm.accountNumber,
          accountName: claimForm.accountName,
          bankName: claimForm.bankName,
          bankBranch: claimForm.bankBranch
        }
      };

      // Submit claim
      const response = await axios.post(`${BASE_URL}/claims`, claimData, config);
      const newClaim = response.data.data;

      // Upload documents
      if (uploadedFiles.length > 0) {
        const formData = new FormData();
        uploadedFiles.forEach((fileObj) => {
          formData.append('documents', fileObj.file);
        });
        
        // Add document types
        uploadedFiles.forEach((fileObj, index) => {
          formData.append(`documentTypes[${index}]`, fileObj.documentType || 'Other');
        });

        await axios.post(
          `${BASE_URL}/claims/${newClaim._id}/documents`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      // Success
      setClaims(prev => [newClaim, ...prev]);
      setShowNewClaim(false);
      setCurrentStep(1);
      resetForm();
      
      setSuccessMessage(`✓ Claim submitted successfully! Reference: ${newClaim.claimNumber}`);
      setTimeout(() => setSuccessMessage(''), 8000);
      
    } catch (err) {
      console.error('Failed to submit claim:', err);
      setError(err.response?.data?.message || 'Failed to submit claim. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setClaimForm({
      policyNumber: '',
      policyType: '',
      claimType: '',
      incidentDate: '',
      claimAmount: '',
      description: '',
      location: '',
      witnesses: [],
      policeReportNumber: '',
      hospitalName: '',
      doctorName: '',
      diagnosisDetails: '',
      paymentMethod: 'Bank Transfer',
      accountNumber: '',
      accountName: '',
      bankName: '',
      bankBranch: ''
    });
    setUploadedFiles([]);
  };

  // View claim details
  const handleViewClaim = (claim) => {
    setSelectedClaim(claim);
    setShowClaimDetails(true);
  };

  // Statistics
  const getStatistics = useCallback(() => {
    const total = claims.length;
    const submitted = claims.filter(c => c.status === 'Submitted').length;
    const underReview = claims.filter(c => c.status === 'Under Review').length;
    const approved = claims.filter(c => ['Approved', 'Paid'].includes(c.status)).length;
    const totalAmount = claims.reduce((sum, c) => sum + (c.claimAmount || 0), 0);
    
    return { total, submitted, underReview, approved, totalAmount };
  }, [claims]);

  // Status styling
  const getStatusColor = (status) => {
    const colors = {
      'Submitted': 'bg-blue-100 text-blue-800 border-blue-200',
      'Under Review': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Documents Required': 'bg-orange-100 text-orange-800 border-orange-200',
      'Approved': 'bg-green-100 text-green-800 border-green-200',
      'Paid': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Rejected': 'bg-red-100 text-red-800 border-red-200',
      'Closed': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Submitted': <Clock className="text-blue-600" size={18} />,
      'Under Review': <AlertCircle className="text-yellow-600" size={18} />,
      'Documents Required': <Upload className="text-orange-600" size={18} />,
      'Approved': <CheckCircle className="text-green-600" size={18} />,
      'Paid': <CheckCircle className="text-emerald-600" size={18} />,
      'Rejected': <XCircle className="text-red-600" size={18} />
    };
    return icons[status] || <AlertCircle size={18} />;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  const getUserInitials = useCallback(() => {
    if (!user) return "U";
    const userData = user.user || user;
    const { firstName, lastName, name } = userData;
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (name) {
      const parts = name.split(" ");
      return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
    }
    return "U";
  }, [user]);

  const filteredClaims = claims.filter(c => {
    const matchesSearch = 
      c.claimNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.policyNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.claimType?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = getStatistics();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-700 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Loading claims...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Aligned with ClientDashboard */}
      <aside className="w-72 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white flex flex-col shadow-2xl">
        <div className="p-6 border-b border-blue-700/50 flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-blue-900" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="font-bold text-lg">Sanlam | Allianz</div>
        </div>

        <nav className="flex-1 py-6 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center space-x-3 px-6 py-4 transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-blue-900 border-l-4 border-blue-500 shadow-lg'
                    : 'text-blue-100 hover:bg-blue-700/50 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-6 border-t border-blue-700/50 flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {getUserInitials()}
          </div>
          <div className="flex-1 min-w-0">
            {user && (
              <>
                <div className="font-semibold truncate">
                  {user.user?.firstName && user.user?.lastName
                    ? `${user.user.firstName} ${user.user.lastName}`
                    : user.user?.name || 'User'}
                </div>
                <div className="text-sm text-blue-300 truncate">
                  {user.user?.email || user.user?.phone || 'N/A'}
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t border-blue-700/50 flex justify-around">
          <button className="p-2 hover:bg-blue-700/50 rounded-full transition-colors" title="Settings">
            <Settings size={20} />
          </button>
          <button onClick={handleLogout} className="p-2 hover:bg-red-500/50 rounded-full transition-colors" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Claims</h1>
            <p className="text-gray-600 mt-1">Submit and track your insurance claims</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={24} />
              {notifications > 0 && (
                <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                  {notifications}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setShowNewClaim(true);
                setCurrentStep(1);
                setError('');
              }}
              className="flex items-center space-x-2 px-5 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors shadow-md hover:shadow-lg font-semibold"
            >
              <Plus size={20} />
              <span>New Claim</span>
            </button>
          </div>
        </header>

        {/* Messages */}
        {successMessage && (
          <div className="mx-8 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
            <span className="text-green-800 flex-1">{successMessage}</span>
            <button onClick={() => setSuccessMessage('')} className="text-green-600 hover:text-green-800">
              <X size={18} />
            </button>
          </div>
        )}

        {error && !showNewClaim && (
          <div className="mx-8 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <span className="text-red-800 flex-1">{error}</span>
            <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Statistics */}
        <section className="bg-white border-b px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 uppercase mb-1">Total Claims</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <FileCheck className="w-10 h-10 text-blue-600 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-5 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600 uppercase mb-1">Submitted</p>
                  <p className="text-3xl font-bold text-yellow-900">{stats.submitted}</p>
                </div>
                <Clock className="w-10 h-10 text-yellow-600 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 uppercase mb-1">Under Review</p>
                  <p className="text-3xl font-bold text-orange-900">{stats.underReview}</p>
                </div>
                <AlertCircle className="w-10 h-10 text-orange-600 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 uppercase mb-1">Approved</p>
                  <p className="text-3xl font-bold text-green-900">{stats.approved}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-600 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 uppercase mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-purple-900">${stats.totalAmount.toLocaleString()}</p>
                </div>
                <DollarSign className="w-10 h-10 text-purple-600 opacity-50" />
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filter */}
        <div className="bg-white border-b px-8 py-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by claim number, policy, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Documents Required">Documents Required</option>
              <option value="Approved">Approved</option>
              <option value="Paid">Paid</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Claims List */}
        <section className="flex-1 overflow-y-auto p-8">
          {filteredClaims.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileCheck className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Claims Found</h3>
              <p className="text-gray-500 mb-6">
                {claims.length === 0 ? 'Submit your first claim to get started.' : 'No claims match your search criteria.'}
              </p>
              {claims.length === 0 && (
                <button
                  onClick={() => setShowNewClaim(true)}
                  className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 inline-flex items-center space-x-2 font-semibold"
                >
                  <Plus size={20} />
                  <span>Submit New Claim</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredClaims.map((claim) => (
                <div key={claim._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold">Claim #{claim.claimNumber}</h3>
                        <p className="text-blue-100 text-sm mt-1">{claim.claimType} - Policy: {claim.policyNumber}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center space-x-1 ${getStatusColor(claim.status)}`}>
                        {getStatusIcon(claim.status)}
                        <span>{claim.status}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="text-gray-400 flex-shrink-0" size={16} />
                        <span className="text-gray-600">
                          <strong>Incident:</strong> {new Date(claim.incidentDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="text-gray-400 flex-shrink-0" size={16} />
                        <span className="text-gray-600">
                          <strong>Amount:</strong> ${claim.claimAmount?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="text-gray-400 flex-shrink-0" size={16} />
                        <span className="text-gray-600 truncate">
                          <strong>Location:</strong> {claim.location || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="text-gray-400 flex-shrink-0" size={16} />
                        <span className="text-gray-600">
                          <strong>Submitted:</strong> {new Date(claim.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">{claim.description}</p>

                    {claim.approvedAmount && (
                      <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r mb-4">
                        <p className="text-green-800 font-semibold">
                          ✓ Approved Amount: ${claim.approvedAmount.toLocaleString()}
                        </p>
                      </div>
                    )}

                    {claim.rejectionReason && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r mb-4">
                        <p className="text-red-800">
                          <strong>Rejection Reason:</strong> {claim.rejectionReason}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleViewClaim(claim)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        <Eye size={18} />
                        <span>View Details</span>
                      </button>
                      {claim.documents && claim.documents.length > 0 && (
                        <button className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold flex items-center space-x-2">
                          <Download size={18} />
                          <span>Documents</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Claim Details Modal */}
        {showClaimDetails && selectedClaim && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={() => setShowClaimDetails(false)}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-5 flex justify-between items-center z-10">
                <div>
                  <h2 className="text-2xl font-bold">Claim Details</h2>
                  <p className="text-blue-100 text-sm mt-1">Reference: {selectedClaim.claimNumber}</p>
                </div>
                <button onClick={() => setShowClaimDetails(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status Banner */}
                <div className={`rounded-lg p-4 border-2 ${getStatusColor(selectedClaim.status)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(selectedClaim.status)}
                      <div>
                        <p className="font-bold text-lg">Status: {selectedClaim.status}</p>
                        <p className="text-sm">Last updated: {new Date(selectedClaim.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Claim Information */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                    <FileText className="mr-2 text-blue-700" size={20} />
                    Claim Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 font-medium">Claim Number</p>
                      <p className="font-semibold text-gray-900">{selectedClaim.claimNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Policy Number</p>
                      <p className="font-semibold text-gray-900">{selectedClaim.policyNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Policy Type</p>
                      <p className="font-semibold text-gray-900">{selectedClaim.policyType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Claim Type</p>
                      <p className="font-semibold text-gray-900">{selectedClaim.claimType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Incident Date</p>
                      <p className="font-semibold text-gray-900">{new Date(selectedClaim.incidentDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Submission Date</p>
                      <p className="font-semibold text-gray-900">{new Date(selectedClaim.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Location</p>
                      <p className="font-semibold text-gray-900">{selectedClaim.location || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Priority</p>
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                        selectedClaim.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        selectedClaim.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        selectedClaim.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {selectedClaim.priority?.toUpperCase() || 'MEDIUM'}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600 font-medium mb-2">Description</p>
                      <p className="text-gray-900 bg-white p-3 rounded border border-gray-200">{selectedClaim.description}</p>
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5 border border-green-200">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                    <DollarSign className="mr-2 text-green-700" size={20} />
                    Financial Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 font-medium">Claimed Amount</p>
                      <p className="font-bold text-gray-900 text-xl">${selectedClaim.claimAmount?.toLocaleString()}</p>
                    </div>
                    {selectedClaim.approvedAmount && (
                      <div>
                        <p className="text-gray-600 font-medium">Approved Amount</p>
                        <p className="font-bold text-green-700 text-xl">${selectedClaim.approvedAmount.toLocaleString()}</p>
                      </div>
                    )}
                  </div>

                  {selectedClaim.paymentDetails && (
                    <div className="mt-4 pt-4 border-t border-green-300">
                      <p className="text-gray-600 font-medium mb-2">Payment Method</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Method</p>
                          <p className="font-semibold text-gray-900">{selectedClaim.paymentDetails.method}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Account Name</p>
                          <p className="font-semibold text-gray-900">{selectedClaim.paymentDetails.accountName}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Information */}
                {(selectedClaim.policeReportNumber || selectedClaim.hospitalName || selectedClaim.witnesses?.length > 0) && (
                  <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                      <Info className="mr-2 text-blue-700" size={20} />
                      Additional Information
                    </h3>
                    <div className="space-y-3 text-sm">
                      {selectedClaim.policeReportNumber && (
                        <div>
                          <p className="text-gray-600 font-medium">Police Report Number</p>
                          <p className="font-semibold text-gray-900">{selectedClaim.policeReportNumber}</p>
                        </div>
                      )}
                      {selectedClaim.hospitalName && (
                        <div>
                          <p className="text-gray-600 font-medium">Hospital</p>
                          <p className="font-semibold text-gray-900">{selectedClaim.hospitalName}</p>
                        </div>
                      )}
                      {selectedClaim.doctorName && (
                        <div>
                          <p className="text-gray-600 font-medium">Doctor</p>
                          <p className="font-semibold text-gray-900">{selectedClaim.doctorName}</p>
                        </div>
                      )}
                      {selectedClaim.witnesses && selectedClaim.witnesses.length > 0 && (
                        <div>
                          <p className="text-gray-600 font-medium mb-2">Witnesses</p>
                          {selectedClaim.witnesses.map((w, idx) => (
                            <p key={idx} className="text-gray-900">{w.name} {w.contact && `- ${w.contact}`}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {selectedClaim.documents && selectedClaim.documents.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                      <Upload className="mr-2 text-purple-700" size={20} />
                      Uploaded Documents ({selectedClaim.documents.length})
                    </h3>
                    <div className="space-y-2">
                      {selectedClaim.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                          <div className="flex items-center space-x-3">
                            <FileCheck className="text-green-600" size={20} />
                            <div>
                              <p className="font-medium text-gray-900">{doc.fileName}</p>
                              <p className="text-xs text-gray-500">{doc.documentType} - Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Download size={18} />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rejection Reason */}
                {selectedClaim.rejectionReason && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                    <h3 className="font-bold text-red-900 mb-2 flex items-center">
                      <XCircle className="mr-2" size={20} />
                      Rejection Reason
                    </h3>
                    <p className="text-red-800">{selectedClaim.rejectionReason}</p>
                  </div>
                )}

                {/* Status History */}
                {selectedClaim.statusHistory && selectedClaim.statusHistory.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                      <Clock className="mr-2 text-gray-700" size={20} />
                      Status History
                    </h3>
                    <div className="space-y-3">
                      {selectedClaim.statusHistory.map((history, idx) => (
                        <div key={idx} className="flex items-start space-x-3 pb-3 border-b last:border-b-0 border-gray-200">
                          <div className="mt-1">
                            {getStatusIcon(history.status)}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{history.status}</p>
                            <p className="text-sm text-gray-600">{new Date(history.changedAt).toLocaleString()}</p>
                            {history.comment && <p className="text-sm text-gray-700 mt-1">{history.comment}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowClaimDetails(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Close
                  </button>
                  {selectedClaim.documents && selectedClaim.documents.length > 0 && (
                    <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2">
                      <Download size={20} />
                      <span>Download All Documents</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Claim Modal - Multi-Step Form */}
        {showNewClaim && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-5 flex justify-between items-center z-10">
                <div>
                  <h2 className="text-2xl font-bold">Submit New Claim</h2>
                  <p className="text-blue-100 text-sm mt-1">Step {currentStep} of 4</p>
                </div>
                <button 
                  onClick={() => {
                    if (!submitting) {
                      setShowNewClaim(false);
                      setCurrentStep(1);
                      setError('');
                      resetForm();
                    }
                  }} 
                  disabled={submitting}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="px-6 py-4 bg-gray-50 border-b">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.number;
                    const isCompleted = currentStep > step.number;
                    
                    return (
                      <React.Fragment key={step.number}>
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                            isCompleted ? 'bg-green-500 text-white' :
                            isActive ? 'bg-blue-700 text-white' :
                            'bg-gray-200 text-gray-500'
                          }`}>
                            {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
                          </div>
                          <span className={`mt-2 text-xs font-medium text-center ${
                            isActive ? 'text-blue-700' : 'text-gray-600'
                          }`}>
                            {step.title}
                          </span>
                        </div>
                        {index < steps.length - 1 && (
                          <div className={`flex-1 h-1 mx-2 rounded ${
                            isCompleted ? 'bg-green-500' : 'bg-gray-200'
                          }`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6">
                {/* Step 1: Claim Details */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Select Policy <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="policyNumber"
                          value={claimForm.policyNumber}
                          onChange={handlePolicyChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                          disabled={submitting}
                        >
                          <option value="">Choose a policy</option>
                          {policies.filter(p => p.status === 'Active').map(policy => (
                            <option key={policy._id} value={policy.policyNumber}>
                              {policy.policyNumber} - {policy.type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Claim Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="claimType"
                          value={claimForm.claimType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                          disabled={submitting || !claimForm.policyType}
                        >
                          <option value="">Select claim type</option>
                          {claimForm.policyType && policyTypes[claimForm.policyType]?.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Incident Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="incidentDate"
                          value={claimForm.incidentDate}
                          onChange={handleInputChange}
                          max={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                          disabled={submitting}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Claim Amount ($) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="claimAmount"
                          value={claimForm.claimAmount}
                          onChange={handleInputChange}
                          placeholder="Enter amount"
                          min="1"
                          step="0.01"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                          disabled={submitting}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Incident Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={claimForm.location}
                        onChange={handleInputChange}
                        placeholder="e.g., Kigali City, Gasabo District"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={submitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Detailed Description <span className="text-red-500">*</span> (min. 20 characters)
                      </label>
                      <textarea
                        name="description"
                        value={claimForm.description}
                        onChange={handleInputChange}
                        placeholder="Provide a detailed description of the incident..."
                        rows="5"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        required
                        disabled={submitting}
                      />
                      <p className="text-xs text-gray-500 mt-1">{claimForm.description.length} / 20 characters</p>
                    </div>
                  </div>
                )}

                {/* Step 2: Additional Information */}
                {currentStep === 2 && (
                  <div className="space-y-5">
                    {(['Accident', 'Theft'].includes(claimForm.claimType)) && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Police Report Number
                        </label>
                        <input
                          type="text"
                          name="policeReportNumber"
                          value={claimForm.policeReportNumber}
                          onChange={handleInputChange}
                          placeholder="e.g., PR-2024-XXXXX"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={submitting}
                        />
                      </div>
                    )}

                    {['Medical Expense', 'Hospitalization', 'Surgery', 'Emergency'].includes(claimForm.claimType) && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Hospital/Clinic Name
                          </label>
                          <input
                            type="text"
                            name="hospitalName"
                            value={claimForm.hospitalName}
                            onChange={handleInputChange}
                            placeholder="Hospital name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={submitting}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Doctor's Name
                          </label>
                          <input
                            type="text"
                            name="doctorName"
                            value={claimForm.doctorName}
                            onChange={handleInputChange}
                            placeholder="Dr. John Doe"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={submitting}
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Witnesses (comma separated)
                      </label>
                      <input
                        type="text"
                        name="witnesses"
                        value={claimForm.witnesses}
                        onChange={handleInputChange}
                        placeholder="John Doe, Jane Smith"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={submitting}
                      />
                    </div>

                    <div className="border-t pt-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Building className="mr-2 text-blue-700" size={20} />
                        Bank Account Details
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Payment Method <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="paymentMethod"
                            value={claimForm.paymentMethod}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={submitting}
                            required
                          >
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Mobile Money">Mobile Money</option>
                            <option value="Check">Check</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Bank/Provider Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="bankName"
                            value={claimForm.bankName}
                            onChange={handleInputChange}
                            placeholder="Bank of Kigali"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={submitting}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Account Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="accountNumber"
                            value={claimForm.accountNumber}
                            onChange={handleInputChange}
                            placeholder="XXXXXXXXXXXXXXX"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={submitting}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Account Holder Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="accountName"
                            value={claimForm.accountName}
                            onChange={handleInputChange}
                            placeholder="As per bank records"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={submitting}
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Bank Branch
                          </label>
                          <input
                            type="text"
                            name="bankBranch"
                            value={claimForm.bankBranch}
                            onChange={handleInputChange}
                            placeholder="Branch name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={submitting}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Upload Documents */}
                {currentStep === 3 && (
                  <div className="space-y-5">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Info className="mr-2 text-blue-700" size={20} />
                        Required Documents
                      </h3>
                      <ul className="space-y-1">
                        {requiredDocuments.map((doc, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-700">
                            <CheckCircle className="text-green-600 mr-2 flex-shrink-0" size={16} />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                      <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Supporting Documents</h3>
                      <p className="text-gray-600 mb-4">Click to browse or drag and drop files here</p>
                      <label className="inline-block px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 cursor-pointer transition-colors">
                        Choose Files
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          disabled={submitting}
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-2">Supported: PDF, JPG, PNG, DOC (Max 5MB each, 10 files total)</p>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900">Uploaded Files ({uploadedFiles.length})</h3>
                        {uploadedFiles.map(file => (
                          <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center space-x-3">
                              <FileCheck className="text-green-600" size={24} />
                              <div>
                                <p className="font-medium text-gray-900">{file.name}</p>
                                <p className="text-sm text-gray-500">{file.size}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFile(file.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                              disabled={submitting}
                            >
                              <X size={20} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Review & Submit */}
                {currentStep === 4 && (
                  <div className="space-y-5">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                        <FileText className="mr-2 text-blue-700" size={24} />
                        Claim Details
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 font-medium">Policy Number</p>
                          <p className="font-semibold text-gray-900">{claimForm.policyNumber}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">Claim Type</p>
                          <p className="font-semibold text-gray-900">{claimForm.claimType}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">Incident Date</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(claimForm.incidentDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">Claim Amount</p>
                          <p className="font-semibold text-gray-900">${parseFloat(claimForm.claimAmount).toLocaleString()}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-600 font-medium">Description</p>
                          <p className="text-gray-900">{claimForm.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                        <Building className="mr-2 text-green-700" size={24} />
                        Payment Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 font-medium">Payment Method</p>
                          <p className="font-semibold text-gray-900">{claimForm.paymentMethod}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">Bank Name</p>
                          <p className="font-semibold text-gray-900">{claimForm.bankName}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">Account Number</p>
                          <p className="font-semibold text-gray-900">{claimForm.accountNumber}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">Account Name</p>
                          <p className="font-semibold text-gray-900">{claimForm.accountName}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                        <Upload className="mr-2 text-purple-700" size={24} />
                        Uploaded Documents
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} uploaded
                      </p>
                      <ul className="space-y-2">
                        {uploadedFiles.map(file => (
                          <li key={file.id} className="flex items-center text-sm text-gray-700">
                            <FileCheck className="text-green-600 mr-2" size={16} />
                            {file.name} ({file.size})
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                      <p className="text-sm text-yellow-800">
                        <strong>⚠️ Important:</strong> Please review all information carefully. Once submitted, 
                        you cannot edit the claim details. Our team will review your claim within 24-48 hours.
                      </p>
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <AlertCircle className="text-red-600" size={20} />
                    <span className="text-red-800 text-sm">{error}</span>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  {currentStep > 1 ? (
                    <button
                      onClick={handlePrevious}
                      disabled={submitting}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                  ) : <div />}

                  {currentStep < 4 ? (
                    <button
                      onClick={handleNext}
                      disabled={submitting}
                      className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Next</span>
                      <ChevronRight size={20} />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitClaim}
                      disabled={submitting}
                      className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle size={20} />
                          <span>Submit Claim</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}