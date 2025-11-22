import React, { useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FileText, Briefcase, MessageSquare, ThumbsUp, Bell, Settings, LogOut,
  Heart, Car, Home, Plane, Users, GraduationCap, Activity, TrendingUp,
  ChevronRight, X, CheckCircle2, Info, Search, Filter
} from 'lucide-react';

export default function ClientServices() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedService, setSelectedService] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    confirmEmail: '',
    message: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const services = [
    {
      id: 1,
      name: 'Life Insurance',
      category: 'life',
      description: 'Comprehensive life coverage for you and your family with flexible premium options.',
      icon: Heart,
      color: 'bg-red-500',
      features: ['Death benefit', 'Critical illness cover', 'Disability cover'],
      premium: 'From 5,000 RWF/month',
      details: 'Get protection for your loved ones with our Life Insurance plans. Coverage up to 500M RWF.'
    },
    {
      id: 2,
      name: 'Health Insurance',
      category: 'health',
      description: 'Complete healthcare coverage including hospitalization, outpatient, and dental care.',
      icon: Activity,
      color: 'bg-green-500',
      features: ['Hospitalization', 'Outpatient care', 'Dental & Vision'],
      premium: 'From 8,000 RWF/month',
      details: 'Comprehensive health coverage for you and your family. No waiting period for emergencies.'
    },
    {
      id: 3,
      name: 'Motor Insurance',
      category: 'motor',
      description: 'Protect your vehicle with comprehensive or third-party coverage options.',
      icon: Car,
      color: 'bg-blue-500',
      features: ['Accident cover', 'Theft protection', '24/7 roadside assistance'],
      premium: 'From 120,000 RWF/year',
      details: 'Full protection for your vehicle. 24/7 emergency roadside assistance included.'
    },
    {
      id: 4,
      name: 'Home Insurance',
      category: 'property',
      description: 'Safeguard your home and belongings against fire, theft, and natural disasters.',
      icon: Home,
      color: 'bg-orange-500',
      features: ['Building cover', 'Contents insurance', 'Natural disaster protection'],
      premium: 'From 80,000 RWF/year',
      details: 'Protect your most valuable asset with comprehensive home coverage.'
    },
    {
      id: 5,
      name: 'Travel Insurance',
      category: 'travel',
      description: 'Stay protected while traveling with medical, trip cancellation, and luggage coverage.',
      icon: Plane,
      color: 'bg-purple-500',
      features: ['Medical emergencies', 'Trip cancellation', 'Lost luggage'],
      premium: 'From 15,000 RWF/trip',
      details: 'Travel with peace of mind. Coverage for 195 countries worldwide.'
    },
    {
      id: 6,
      name: 'Business Insurance',
      category: 'business',
      description: 'Comprehensive coverage for your business assets, liability, and operations.',
      icon: Briefcase,
      color: 'bg-indigo-500',
      features: ['Property damage', 'Liability cover', 'Business interruption'],
      premium: 'Custom quotes',
      details: 'Tailored business insurance solutions for all business types.'
    },
    {
      id: 7,
      name: 'Education Plan',
      category: 'savings',
      description: 'Secure your children\'s education with our dedicated savings and investment plan.',
      icon: GraduationCap,
      color: 'bg-yellow-500',
      features: ['Guaranteed returns', 'Flexible contributions', 'Tax benefits'],
      premium: 'From 20,000 RWF/month',
      details: 'Start planning your child\'s future today with guaranteed education benefits.'
    },
    {
      id: 8,
      name: 'Investment Plans',
      category: 'savings',
      description: 'Grow your wealth with our diverse investment and retirement planning options.',
      icon: TrendingUp,
      color: 'bg-teal-500',
      features: ['Market-linked returns', 'Retirement planning', 'Wealth accumulation'],
      premium: 'From 30,000 RWF/month',
      details: 'Invest wisely for long-term growth and financial security.'
    },
    {
      id: 9,
      name: 'Group Insurance',
      category: 'group',
      description: 'Employee benefit solutions including life, health, and pension schemes.',
      icon: Users,
      color: 'bg-pink-500',
      features: ['Employee benefits', 'Group life cover', 'Pension schemes'],
      premium: 'Enterprise pricing',
      details: 'Comprehensive employee benefit programs for organizations of all sizes.'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Services', count: services.length },
    { id: 'life', name: 'Life & Health', count: services.filter(s => ['life', 'health'].includes(s.category)).length },
    { id: 'property', name: 'Property & Motor', count: services.filter(s => ['property', 'motor'].includes(s.category)).length },
    { id: 'savings', name: 'Savings & Investment', count: services.filter(s => s.category === 'savings').length },
    { id: 'business', name: 'Business & Group', count: services.filter(s => ['business', 'group'].includes(s.category)).length }
  ];

  const getFilteredServices = useCallback(() => {
    return services.filter(s => {
      const matchesCategory = selectedCategory === 'all' || 
        (selectedCategory === 'life' && ['life', 'health'].includes(s.category)) ||
        (selectedCategory === 'property' && ['property', 'motor'].includes(s.category)) ||
        (selectedCategory === 'business' && ['business', 'group'].includes(s.category)) ||
        (selectedCategory === 'savings' && s.category === 'savings');

      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, services]);

  const filteredServices = getFilteredServices();

  const menuItems = [
    { id: 'policies', label: 'Policies', icon: FileText, path: '/dashboard' },
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
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setTimeout(() => closeModals(), 2000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
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
                const Icon = service.icon;
                return (
                  <div key={service.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden group">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 ${service.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                          <Icon size={28} />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                      <p className="text-gray-700 text-sm">{service.description}</p>
                    </div>

                    <div className="p-6">
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

                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Starting from</p>
                        <p className="text-lg font-bold text-blue-700">{service.premium}</p>
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
              <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} className="mt-4 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
            <button onClick={closeModals} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
              <X size={22} />
            </button>

            {submitStatus === 'success' ? (
              <div className="py-8 text-center">
                <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Application Submitted!</h3>
                <p className="text-gray-600">Thank you for applying for {selectedService?.name}. We'll contact you shortly.</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Apply for {selectedService?.name}</h2>
                <p className="text-gray-600 mb-6">{selectedService?.description}</p>
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-600 outline-none transition ${
                        formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.fullName && <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>}
                  </div>

                  <div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-600 outline-none transition ${
                        formErrors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-600 outline-none transition ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                  </div>

                  <div>
                    <input
                      type="email"
                      name="confirmEmail"
                      placeholder="Confirm Email"
                      value={formData.confirmEmail}
                      onChange={handleChange}
                      className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-600 outline-none transition ${
                        formErrors.confirmEmail ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.confirmEmail && <p className="text-red-500 text-sm mt-1">{formErrors.confirmEmail}</p>}
                  </div>

                  <textarea
                    name="message"
                    placeholder="Additional Message (optional)"
                    value={formData.message}
                    onChange={handleChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 outline-none transition"
                  ></textarea>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} className="mr-2" /> Submit Application
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={closeModals} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 sticky">
              <X size={22} />
            </button>
            <div className="flex items-center space-x-3 mb-4">
              <Info size={24} className="text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">{selectedService?.name}</h2>
            </div>
            <p className="text-gray-700 mb-4">{selectedService?.description}</p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="font-semibold text-blue-700 mb-2">Key Features:</p>
              <ul className="space-y-2">
                {selectedService?.features?.map((f, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <CheckCircle2 size={18} className="text-blue-600 mr-2 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-gray-600 mb-4">{selectedService?.details}</p>
            <p className="text-lg font-semibold text-blue-700 mb-6">Premium: {selectedService?.premium}</p>
            <button
              onClick={() => { closeModals(); openApplyModal(selectedService); }}
              className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              Apply for this Service
            </button>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <button
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-700 text-white rounded-full shadow-lg hover:bg-blue-800 transition-all hover:scale-110 flex items-center justify-center"
        title="Chat with us"
      >
        <MessageSquare size={24} />
      </button>
    </div>
  );
}