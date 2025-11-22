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
  Shield,
  User,
  Lock,
  Mail,
  Globe,
  Database,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  AlertCircle,
  Phone,
  MapPin,
  Building,
  Smartphone,
  Monitor,
  FileCheck,
  HardDrive,
  CheckCircle,
  Upload,
  Download,
  Info,
} from 'lucide-react';

export default function AdminSettings() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('general');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // GENERAL
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'Sanlam | Allianz Insurance',
    email: 'info@sanlam.rw',
    phone: '+250 788 123 456',
    address: 'KN 4 Ave, Kigali, Rwanda',
    website: 'www.sanlam.rw',
    timezone: 'Africa/Kigali',
    currency: 'RWF',
    language: 'English',
  });

  // PROFILE
  const [profileSettings, setProfileSettings] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@sanlam.rw',
    phone: '+250 786 979 551',
    role: 'System Administrator',
    department: 'IT & Operations',
  });

  // SECURITY
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorAuth: true,
    sessionTimeout: '30',
    loginNotifications: true,
    allowMultipleSessions: false,
  });

  // NOTIFICATIONS
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newClaims: true,
    policyExpiry: true,
    paymentReceived: true,
    systemAlerts: true,
    weeklyReports: false,
    marketingEmails: false,
  });

  // SYSTEM
  const [systemSettings, setSystemSettings] = useState({
    maintenance: false,
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: '365',
    apiAccess: true,
    debugMode: false,
    analyticsTracking: true,
  });

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'clients', label: 'Clients', icon: Users, path: '/admin/clients' },
    { id: 'policies', label: 'Policies', icon: Shield, path: '/admin/policies' },
    { id: 'claims', label: 'Claims', icon: FileText, path: '/admin/claims' },
    { id: 'payments', label: 'Payments', icon: DollarSign, path: '/admin/payments' },
    { id: 'complaints', label: 'Complaints', icon: MessageSquare, path: '/admin/complaints' },
    { id: 'reports', label: 'Reports', icon: BarChart3, path: '/admin/reports' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const settingsTabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Database },
  ];

  const handleGeneralChange = (e) =>
    setGeneralSettings({ ...generalSettings, [e.target.name]: e.target.value });
  const handleProfileChange = (e) =>
    setProfileSettings({ ...profileSettings, [e.target.name]: e.target.value });
  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings({
      ...securitySettings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  const handleNotificationChange = (e) =>
    setNotificationSettings({ ...notificationSettings, [e.target.name]: e.target.checked });
  const handleSystemChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSystemSettings({
      ...systemSettings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSaveSettings = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleChangePassword = () => {
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (securitySettings.newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    alert('Password changed successfully!');
    setSecuritySettings({
      ...securitySettings,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col">
        <div className="p-6 border-b border-blue-700 flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-900"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <div className="font-bold text-lg">Sanlam | Allianz</div>
            <div className="text-xs text-blue-300">Admin Panel</div>
          </div>
        </div>

        <nav className="flex-1 py-6 overflow-y-auto">
          {menuItems.map(({ id, label, icon: Icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={id}
                to={path}
                className={`w-full flex items-center space-x-3 px-6 py-4 transition-all ${
                  isActive
                    ? 'bg-white text-blue-900 border-l-4 border-blue-600'
                    : 'text-white hover:bg-blue-700'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-blue-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold text-lg">
              AD
            </div>
            <div>
              <div className="font-semibold">Admin User</div>
              <div className="text-sm text-blue-300">System Administrator</div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-blue-700 flex justify-around">
          <button className="p-2 hover:bg-blue-700 rounded-full transition-colors">
            <Settings size={20} />
          </button>
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-blue-700 rounded-full transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">
              Manage system preferences and configurations
            </p>
          </div>
          <button className="relative p-2 text-gray-600 hover:text-gray-900">
            <Bell size={24} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        {/* Success message */}
        {saveSuccess && (
          <div className="mx-8 mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <CheckCircle className="text-green-600" size={20} />
            <span className="text-green-800 font-medium">
              Settings saved successfully!
            </span>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white border-b px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {settingsTabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === id
                    ? 'border-blue-700 text-blue-700 font-semibold'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* General Settings */}
          {activeTab === 'general' && (
            <h2>Icon</h2>
          )}

          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <User
              profileSettings={profileSettings}
              handleProfileChange={handleProfileChange}
              handleSaveSettings={handleSaveSettings}
            />
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <EyeOff
              securitySettings={securitySettings}
              handleSecurityChange={handleSecurityChange}
              handleChangePassword={handleChangePassword}
              handleSaveSettings={handleSaveSettings}
              showCurrentPassword={showCurrentPassword}
              showNewPassword={showNewPassword}
              showConfirmPassword={showConfirmPassword}
              setShowCurrentPassword={setShowCurrentPassword}
              setShowNewPassword={setShowNewPassword}
              setShowConfirmPassword={setShowConfirmPassword}
            />
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <Smartphone
              notificationSettings={notificationSettings}
              handleNotificationChange={handleNotificationChange}
              handleSaveSettings={handleSaveSettings}
            />
          )}

          {/* System */}
          
        </div>
      </div>
    </div>
  );
}

// --- Components (GeneralTab, ProfileTab, SecurityTab, NotificationsTab, SystemTab) can be modularized below ---
// For brevity, if you’d like, I can generate each subcomponent as a clean separate file structure next.
