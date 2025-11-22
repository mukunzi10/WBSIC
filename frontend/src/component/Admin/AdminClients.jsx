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
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Upload,
  X
} from 'lucide-react';

export default function AdminClients() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddClient, setShowAddClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Sample clients data
  const [clients, setClients] = useState([
    {
      id: 'CLI-12345',
      name: 'Gustave Karekezi',
      email: 'gustave.k@example.com',
      phone: '0786979551',
      address: 'Kigali, Gasabo District',
      idNumber: '1199080001234567',
      policies: 3,
      totalPremium: '135,000 RWF',
      status: 'Active',
      joinDate: '2023-06-21',
      lastActivity: '2025-10-23',
      avatar: 'GK'
    },
    {
      id: 'CLI-12346',
      name: 'Jean Marie Uwimana',
      email: 'jean.uwimana@example.com',
      phone: '0788123456',
      address: 'Kigali, Kicukiro District',
      idNumber: '1198570001234568',
      policies: 2,
      totalPremium: '85,000 RWF',
      status: 'Active',
      joinDate: '2023-08-15',
      lastActivity: '2025-10-22',
      avatar: 'JM'
    },
    {
      id: 'CLI-12347',
      name: 'Alice Mukamana',
      email: 'alice.m@example.com',
      phone: '0789654321',
      address: 'Kigali, Nyarugenge District',
      idNumber: '1199580001234569',
      policies: 1,
      totalPremium: '50,000 RWF',
      status: 'Inactive',
      joinDate: '2024-01-10',
      lastActivity: '2025-09-15',
      avatar: 'AM'
    },
    {
      id: 'CLI-12348',
      name: 'Patrick Nkurunziza',
      email: 'patrick.n@example.com',
      phone: '0787456789',
      address: 'Musanze, Northern Province',
      idNumber: '1199280001234570',
      policies: 4,
      totalPremium: '200,000 RWF',
      status: 'Active',
      joinDate: '2022-11-05',
      lastActivity: '2025-10-24',
      avatar: 'PN'
    },
    {
      id: 'CLI-12349',
      name: 'Sarah Umutoni',
      email: 'sarah.u@example.com',
      phone: '0785987654',
      address: 'Huye, Southern Province',
      idNumber: '1199780001234571',
      policies: 0,
      totalPremium: '0 RWF',
      status: 'Pending',
      joinDate: '2025-10-20',
      lastActivity: '2025-10-20',
      avatar: 'SU'
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
      case 'active':
        return <CheckCircle className="text-green-600" size={18} />;
      case 'inactive':
        return <XCircle className="text-red-600" size={18} />;
      case 'pending':
        return <AlertCircle className="text-yellow-600" size={18} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || client.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'Active').length;
  const pendingClients = clients.filter(c => c.status === 'Pending').length;
  const inactiveClients = clients.filter(c => c.status === 'Inactive').length;

  const handleDeleteClient = (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter(c => c.id !== clientId));
      alert('Client deleted successfully');
    }
  };

  const handleViewClient = (client) => {
    setSelectedClient(client);
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
              <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
              <p className="text-gray-600 mt-1">Manage and monitor all client accounts</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell size={24} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={() => setShowAddClient(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <Plus size={20} />
                <span className="font-semibold">Add Client</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-8 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Clients</p>
                  <p className="text-3xl font-bold text-gray-900">{totalClients}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active</p>
                  <p className="text-3xl font-bold text-green-600">{activeClients}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{pendingClients}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="text-yellow-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Inactive</p>
                  <p className="text-3xl font-bold text-red-600">{inactiveClients}</p>
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
                  placeholder="Search by name, ID, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download size={18} />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Clients Table */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Client</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Policies</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Premium</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Join Date</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {client.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{client.name}</p>
                          <p className="text-sm text-gray-500">{client.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900 flex items-center">
                          <Mail size={14} className="mr-2 text-gray-400" />
                          {client.email}
                        </p>
                        <p className="text-sm text-gray-900 flex items-center">
                          <Phone size={14} className="mr-2 text-gray-400" />
                          {client.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-gray-900">{client.policies}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">{client.totalPremium}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(client.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(client.status)}`}>
                          {client.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{client.joinDate}</p>
                      <p className="text-xs text-gray-500">Last: {client.lastActivity}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleViewClient(client)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit Client"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClient(client.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Client"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredClients.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Clients Found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Client Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Client Details</h2>
              <button
                onClick={() => setSelectedClient(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Client Info */}
              <div className="flex items-center space-x-4 pb-6 border-b">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {selectedClient.avatar}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedClient.name}</h3>
                  <p className="text-gray-600">{selectedClient.id}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedClient.status)}`}>
                    {selectedClient.status}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="text-gray-400" size={18} />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium text-gray-900">{selectedClient.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="text-gray-400" size={18} />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm font-medium text-gray-900">{selectedClient.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="text-gray-400" size={18} />
                      <div>
                        <p className="text-xs text-gray-500">Address</p>
                        <p className="text-sm font-medium text-gray-900">{selectedClient.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Account Information</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">ID Number</p>
                      <p className="text-sm font-medium text-gray-900">{selectedClient.idNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Join Date</p>
                      <p className="text-sm font-medium text-gray-900">{selectedClient.joinDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Last Activity</p>
                      <p className="text-sm font-medium text-gray-900">{selectedClient.lastActivity}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Policy Summary */}
              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Policy Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Active Policies</p>
                    <p className="text-2xl font-bold text-blue-700">{selectedClient.policies}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Premium</p>
                    <p className="text-2xl font-bold text-green-700">{selectedClient.totalPremium}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t">
                <button className="flex-1 px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors">
                  View Policies
                </button>
                <button className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}