import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FileText,
  Briefcase,
  MessageSquare,
  ThumbsUp,
  Bell,
  Settings,
  LogOut,
  XCircle,
  Loader2,
  Download,
  AlertCircle,
  TrendingUp,
  Calendar,
  DollarSign,
} from "lucide-react";
import axios from "axios";

export default function ClientDashboard() {
  // Use environment variable if available, otherwise fallback to localhost
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [user, setUser] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [modalType, setModalType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState(0);

  // Authorization helper
  const getAuthConfig = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return { headers: { Authorization: `Bearer ${token}` } };
  }, []);

  // Format currency values
  const formatCurrency = useCallback((value) => {
    const num = parseFloat(value) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(num);
  }, []);

  // Format dates
  const formatDate = useCallback((dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  }, []);

  // Normalize policy data from various API response formats
  const normalizePolicies = useCallback((data) => {
    console.log("Normalizing policies, input:", data);
    
    if (!data) {
      console.log("No data provided to normalize");
      return [];
    }
    
    let policiesArray = [];
    
    // Handle different response structures
    if (Array.isArray(data)) {
      policiesArray = data;
    } else if (data.policies && Array.isArray(data.policies)) {
      policiesArray = data.policies;
    } else if (data.data && Array.isArray(data.data)) {
      policiesArray = data.data;
    } else if (typeof data === 'object') {
      // If it's a single policy object, wrap it in array
      policiesArray = [data];
    }
    
    if (!Array.isArray(policiesArray) || policiesArray.length === 0) {
      console.log("No valid policies array found");
      return [];
    }

    console.log(`Normalizing ${policiesArray.length} policies`);
    
    const normalized = policiesArray.map((p, index) => {
      console.log(`Policy ${index}:`, p);
      return {
        _id: p._id || p.id || `policy-${Date.now()}-${index}`,
        policyNumber: p.policyNumber || p.policy_number || p.number || "N/A",
        name: p.name || p.policy_name || p.policyName || p.type || "Unnamed Policy",
        premium: formatCurrency(p.premium || p.premium_amount || p.premiumAmount || 0),
        totalPaid: formatCurrency(p.totalPaid || p.total_paid || p.paid || 0),
        effectiveDate: formatDate(p.effectiveDate || p.effective_date || p.startDate || p.start_date),
        pendingDues: formatCurrency(p.pendingDues || p.pending_dues || p.outstanding || 0),
        status: p.status || p.state || "Active",
      };
    });
    
    console.log("Normalized policies:", normalized);
    return normalized;
  }, [formatCurrency, formatDate]);

  // Calculate dashboard statistics
  const calculateStats = useCallback(() => {
    if (!policies.length) return { totalPolicies: 0, activePolicies: 0, totalPaid: 'FRW 0.00' };
    
    const activePolicies = policies.filter(p => p.status === 'Active').length;
    const totalPaidAmount = policies.reduce((sum, p) => {
      const amount = parseFloat(p.totalPaid.replace(/[^0-9.-]+/g, "")) || 0;
      return sum + amount;
    }, 0);

    return {
      totalPolicies: policies.length,
      activePolicies,
      totalPaid: formatCurrency(totalPaidAmount),
    };
  }, [policies, formatCurrency]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const config = getAuthConfig();

        if (!config) {
          console.warn("No authentication token found");
          navigate("/login", { state: { from: location.pathname } });
          return;
        }

        console.log("Fetching user data...");
        // Fetch user first
        const userRes = await axios.get(`${BASE_URL}/api/auth/me`, config);
        console.log("User response:", userRes.data);
        setUser(userRes.data.user || userRes.data);

        console.log("Fetching policies...");
        // Fetch policies
        const policyRes = await axios.get(`${BASE_URL}/api/policies/my-policies`, config);
        console.log("Raw policy response:", policyRes.data);
        
        // Handle different response structures
        let policiesData = null;
        if (Array.isArray(policyRes.data)) {
          policiesData = policyRes.data;
        } else if (policyRes.data.policies && Array.isArray(policyRes.data.policies)) {
          policiesData = policyRes.data.policies;
        } else if (policyRes.data.data && Array.isArray(policyRes.data.data)) {
          policiesData = policyRes.data.data;
        } else {
          console.warn("Unexpected policy response structure:", policyRes.data);
          policiesData = [];
        }

        console.log("Policies data to normalize:", policiesData);
        const normalizedPolicies = normalizePolicies(policiesData);
        console.log("Normalized policies:", normalizedPolicies);
        
        setPolicies(normalizedPolicies);
        setNotifications(Math.floor(Math.random() * 5)); // Mock notifications

      } catch (err) {
        console.error("Dashboard fetch error:", err);
        console.error("Error response:", err.response?.data);
        console.error("Error status:", err.response?.status);
        
        const status = err.response?.status;
        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          (status === 401
            ? "Your session has expired. Please log in again."
            : status === 403
            ? "You don't have permission to access this resource."
            : status === 404
            ? "API endpoint not found. Please check your backend configuration."
            : status === 500
            ? "Server error. Please try again later."
            : err.message || "Unable to load dashboard data. Please check your connection.");

        setError(message);
        
        if (status === 401 || status === 403) {
          localStorage.removeItem("token");
          setTimeout(() => navigate("/login"), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, location.pathname, getAuthConfig, normalizePolicies, BASE_URL]);

  // Logout handler
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  }, [navigate]);

  // Modal handlers
  const openModal = useCallback((type, policy) => {
    setSelectedPolicy(policy);
    setModalType(type);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedPolicy(null);
    setModalType("");
  }, []);

  // Get user initials for avatar
  const getUserInitials = useCallback(() => {
    if (!user) return "U";
    const { firstName, lastName, name } = user;
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (name) {
      const parts = name.split(" ");
      return parts.length > 1
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : name.substring(0, 2).toUpperCase();
    }
    return "U";
  }, [user]);

  // Navigation menu items
  const menuItems = [
    { id: "policies", label: "Policies", icon: FileText, path: "/clientDashboard" },
    { id: "services", label: "Services", icon: Briefcase, path: "/services" },
    { id: "complaints", label: "Complaints", icon: MessageSquare, path: "/complaints" },
    { id: "feedback", label: "Feedback", icon: ThumbsUp, path: "/feedback" },
  ];

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'suspended':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-700 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Loading your dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
        <div className="text-center max-w-md mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors font-semibold"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white flex flex-col shadow-2xl">
        {/* Logo */}
        <div className="p-6 border-b border-blue-700/50 flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-blue-900" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="font-bold text-lg">Sanlam | Allianz</div>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-6 overflow-y-auto">
          {menuItems.map(({ id, label, icon: Icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={id}
                to={path}
                className={`flex items-center space-x-3 px-6 py-4 transition-all duration-200 ${
                  isActive
                    ? "bg-white text-blue-900 border-l-4 border-blue-500 shadow-lg"
                    : "text-blue-100 hover:bg-blue-700/50 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile */}
        <div className="p-6 border-t border-blue-700/50 flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {getUserInitials()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.name || "User"}
            </div>
            <div className="text-sm text-blue-300 truncate">{user?.email || user?.phone || "N/A"}</div>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="p-4 border-t border-blue-700/50 flex justify-around">
          <button
            className="p-2 hover:bg-blue-700/50 rounded-full transition-colors"
            title="Settings"
          >
            <Settings size={20} />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-500/50 rounded-full transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Policies</h1>
            <p className="text-gray-600 mt-1">Manage your insurance policies and coverage</p>
          </div>
          <button className="relative p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <Bell size={24} />
            {notifications > 0 && (
              <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                {notifications}
              </span>
            )}
          </button>
        </header>

        {/* Stats Cards */}
        <section className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 uppercase">Total Policies</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">{stats.totalPolicies}</p>
                </div>
                <FileText className="w-12 h-12 text-blue-600 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 uppercase">Active Policies</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">{stats.activePolicies}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-600 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 uppercase">Total Paid</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">{stats.totalPaid}</p>
                </div>
                <DollarSign className="w-12 h-12 text-purple-600 opacity-50" />
              </div>
            </div>
          </div>
        </section>

        {/* Policies Grid */}
        <section className="flex-1 overflow-y-auto p-8">
          {policies.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Policies Found</h3>
              <p className="text-gray-500 mb-6">You don't have any policies yet. Contact your agent to get started.</p>
              <button className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors font-semibold">
                Contact Agent
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {policies.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold">{p.policyNumber}</h3>
                        <p className="text-blue-100 text-sm mt-1">{p.name}</p>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(p.status)}`}>
                        {p.status}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Premium</p>
                        <p className="text-lg font-bold text-gray-900">{p.premium}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Total Paid</p>
                        <p className="text-lg font-bold text-gray-900">{p.totalPaid}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center text-gray-500 mb-1">
                          <Calendar size={14} className="mr-1" />
                          <p className="text-xs uppercase font-semibold">Effective Date</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{p.effectiveDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Pending Dues</p>
                        <p className={`text-sm font-semibold ${
                          parseFloat(p.pendingDues.replace(/[^0-9.-]+/g, "")) > 0
                            ? "text-red-600"
                            : "text-green-600"
                        }`}>
                          {p.pendingDues}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => openModal("statement", p)}
                        className="bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                      >
                        Statement
                      </button>
                      <button
                        onClick={() => openModal("contract", p)}
                        className="bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                      >
                        Contract
                      </button>
                      <Link
                        to="/claims"
                        state={{ policy: p }}
                        className="bg-red-600 text-white text-center py-2.5 rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm flex items-center justify-center"
                      >
                        Claim
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modal */}
      {modalType && selectedPolicy && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                title="Close"
              >
                <XCircle size={28} />
              </button>
              <h2 className="text-2xl font-bold pr-10">
                {modalType === "statement" ? "Policy Statement" : "Policy Contract"}
              </h2>
              <p className="text-blue-100 mt-1">{selectedPolicy.policyNumber}</p>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {modalType === "statement" ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Policy Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Policy Number</p>
                        <p className="font-semibold text-gray-900">{selectedPolicy.policyNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Policy Name</p>
                        <p className="font-semibold text-gray-900">{selectedPolicy.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getStatusColor(selectedPolicy.status)}`}>
                          {selectedPolicy.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Effective Date</p>
                        <p className="font-semibold text-gray-900">{selectedPolicy.effectiveDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Payment Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Premium Amount</span>
                        <span className="font-semibold text-gray-900">{selectedPolicy.premium}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Paid</span>
                        <span className="font-semibold text-green-600">{selectedPolicy.totalPaid}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-300">
                        <span className="text-gray-600">Pending Dues</span>
                        <span className="font-semibold text-red-600">{selectedPolicy.pendingDues}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <strong>Note:</strong> This is a summary statement of your payments and coverage details. 
                    For detailed transaction history, please download the full statement.
                  </p>

                  <button className="w-full bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors font-semibold flex items-center justify-center space-x-2">
                    <Download size={20} />
                    <span>Download Full Statement</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Contract Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Policy Number</span>
                        <span className="font-semibold text-gray-900">{selectedPolicy.policyNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Policy Name</span>
                        <span className="font-semibold text-gray-900">{selectedPolicy.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contract Status</span>
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getStatusColor(selectedPolicy.status)}`}>
                          {selectedPolicy.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-700">
                      <strong>Contract Document:</strong> Your policy contract contains the full terms and conditions, 
                      coverage details, exclusions, and legal information related to your insurance policy.
                    </p>
                  </div>

                  <button className="w-full bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors font-semibold flex items-center justify-center space-x-2">
                    <Download size={20} />
                    <span>Download Contract PDF</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}