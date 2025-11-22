import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FileText, Briefcase, MessageSquare, ThumbsUp, Bell, Settings, LogOut,
  Heart, Car, Home, Plane, Users, GraduationCap, Activity, TrendingUp,
  ChevronRight, X, CheckCircle2, Info, Search, AlertTriangle
} from 'lucide-react';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Map category or service type to icons
const ICONS_MAP = {
  life: Heart,
  health: Activity,
  motor: Car,
  property: Home,
  travel: Plane,
  business: Briefcase,
  group: Users,
  savings: GraduationCap,
  investment: TrendingUp
};

export default function ClientServices() {
  const navigate = useNavigate();
  const location = useLocation();

  const [services, setServices] = useState([]); // Initialize as empty array
  const [categories, setCategories] = useState([
    { id: 'all', name: 'All Services', count: 0 }
  ]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedService, setSelectedService] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    confirmEmail: '',
    message: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(`${BASE_URL}/services`);
        if (!res.ok) throw new Error('Failed to fetch services');
        
        const data = await res.json();
        
        // Ensure data is an array
        const servicesArray = Array.isArray(data) ? data : 
                             (data.services && Array.isArray(data.services)) ? data.services : 
                             [];
        
        setServices(servicesArray);

        // Build categories dynamically only if we have services
        if (servicesArray.length > 0) {
          setCategories([
            { id: 'all', name: 'All Services', count: servicesArray.length },
            { 
              id: 'life', 
              name: 'Life & Health', 
              count: servicesArray.filter(s => ['life', 'health'].includes(s.category)).length 
            },
            { 
              id: 'property', 
              name: 'Property & Motor', 
              count: servicesArray.filter(s => ['property', 'motor'].includes(s.category)).length 
            },
            { 
              id: 'savings', 
              name: 'Savings & Investment', 
              count: servicesArray.filter(s => s.category === 'savings').length 
            },
            { 
              id: 'business', 
              name: 'Business & Group', 
              count: servicesArray.filter(s => ['business', 'group'].includes(s.category)).length 
            }
          ]);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const getFilteredServices = useCallback(() => {
    // Safety check: ensure services is an array
    if (!Array.isArray(services)) {
      return [];
    }

    return services.filter(s => {
      const matchesCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'life' && ['life', 'health'].includes(s.category)) ||
        (selectedCategory === 'property' && ['property', 'motor'].includes(s.category)) ||
        (selectedCategory === 'business' && ['business', 'group'].includes(s.category)) ||
        (selectedCategory === 'savings' && s.category === 'savings');

      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, services]);

  const filteredServices = getFilteredServices();

  const menuItems = [
    { id: 'policies', label: 'Policies', icon: FileText, path: '/ClientDashboard' },
    { id: 'services', label: 'Services', icon: Briefcase, path: '/services' },
    { id: 'complaints', label: 'Complaints', icon: MessageSquare, path: '/complaints' },
    { id: 'feedback', label: 'Feedback', icon: ThumbsUp, path: '/feedback' }
  ];

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.confirmEmail.trim()) errors.confirmEmail = 'Confirm email is required';
    if (formData.email !== formData.confirmEmail) errors.confirmEmail = 'Emails do not match';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email format';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openApplyModal = (service) => {
    setSelectedService(service);
    setShowApplyModal(true);
    setSubmitStatus(null);
    setFormData({ fullName: '', phone: '', email: '', confirmEmail: '', message: '' });
  };

  const openDetailsModal = (service) => {
    setSelectedService(service);
    setShowDetailsModal(true);
  };

  const closeModals = () => {
    setShowApplyModal(false);
    setShowDetailsModal(false);
    setSelectedService(null);
    setFormErrors({});
    setSubmitStatus(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/services/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ ...formData, serviceId: selectedService.id })
      });
      
      if (!res.ok) throw new Error('Failed to submit application');

      setSubmitStatus('success');
      setTimeout(() => closeModals(), 2000);
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Services</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
            </div>
          </div>
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

        <div className="p-6 border-t border-blue-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold text-lg">
              GK
            </div>
            <div className="flex-1">
              <div className="font-semibold">GUSTAVE KAREKEZI</div>
              <div className="text-sm text-blue-300">0786979551</div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-blue-700 flex justify-around">
          <button className="p-2 hover:bg-blue-700 rounded-full transition-colors" title="Settings">
            <Settings size={20} />
          </button>
          <button onClick={() => navigate('/')} className="p-2 hover:bg-blue-700 rounded-full transition-colors" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Insurance Services</h1>
            <p className="text-gray-600 mt-1">Browse and apply for our insurance services</p>
          </div>
          <button className="relative p-2 text-gray-600 hover:text-gray-900" title="Notifications">
            <Bell size={24} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white border-b px-8 py-4 space-y-4">
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-4 py-2">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search services by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  selectedCategory === category.id ? 'bg-blue-600' : 'bg-gray-300'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="flex-1 overflow-y-auto p-8">
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredServices.map((service) => {
                const Icon = ICONS_MAP[service.category] || Briefcase;
                return (
                  <div key={service.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden group">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 bg-blue-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                          <Icon size={28} />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                      <p className="text-gray-700 text-sm">{service.description}</p>
                    </div>

                    <div className="p-6">
                      {service.features && Array.isArray(service.features) && service.features.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Key Features</p>
                          <ul className="space-y-2">
                            {service.features.map((feature, index) => (
                              <li key={index} className="flex items-center text-sm text-gray-700">
                                <div className="w-1.5 h-1.5 bg-blue-700 rounded-full mr-2"></div>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Starting from</p>
                        <p className="text-lg font-bold text-blue-700">{service.premium || 'Contact us'}</p>
                      </div>

                      <div className="flex space-x-2">
                        <button onClick={() => openApplyModal(service)} className="flex-1 bg-blue-700 text-white py-3 rounded font-semibold hover:bg-blue-800 transition-colors flex items-center justify-center">
                          Apply Now
                          <ChevronRight size={18} className="ml-1" />
                        </button>
                        <button onClick={() => openDetailsModal(service)} className="px-4 bg-gray-100 text-gray-700 py-3 rounded font-semibold hover:bg-gray-200 transition-colors">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Search size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No services found matching your criteria</p>
              <button 
                onClick={() => { 
                  setSearchQuery(''); 
                  setSelectedCategory('all'); 
                }} 
                className="mt-4 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal & Details Modal would go here */}
    </div>
  );
}