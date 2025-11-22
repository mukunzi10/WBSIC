import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Briefcase, 
  MessageSquare, 
  ThumbsUp,
  Bell,
  Settings,
  LogOut,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  User,
  Phone,
  Mail,
  MapPin,
  FileCheck,
  Clock,
  Shield,
  ChevronRight,
  Info
} from 'lucide-react';

export default function ClaimsSubmission() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [formData, setFormData] = useState({
    // Claim Information
    policyNumber: '',
    claimType: '',
    incidentDate: '',
    incidentLocation: '',
    claimAmount: '',
    description: '',
    
    // Claimant Information
    claimantName: '',
    claimantRelation: '',
    claimantPhone: '',
    claimantEmail: '',
    claimantAddress: '',
    
    // Additional Details
    policeReportNumber: '',
    hospitalName: '',
    doctorName: '',
    diagnosisDetails: '',
    witnessName: '',
    witnessPhone: '',
    
    // Bank Details
    bankName: '',
    accountNumber: '',
    accountName: '',
    bankBranch: ''
  });

  const menuItems = [
    { id: 'policies', label: 'Policies', icon: FileText, path: '/dashboard' },
    { id: 'services', label: 'Services', icon: Briefcase, path: '/services' },
    { id: 'complaints', label: 'Complaints', icon: MessageSquare, path: '/complaints' },
    { id: 'feedback', label: 'Feedback', icon: ThumbsUp, path: '/feedback' }
  ];

  const claimTypes = [
    { value: 'medical', label: 'Medical/Health Claim', icon: '🏥' },
    { value: 'accident', label: 'Accident Claim', icon: '🚗' },
    { value: 'life', label: 'Life Insurance Claim', icon: '👤' },
    { value: 'property', label: 'Property Damage', icon: '🏠' },
    { value: 'theft', label: 'Theft Claim', icon: '🔒' },
    { value: 'fire', label: 'Fire Damage', icon: '🔥' },
    { value: 'natural', label: 'Natural Disaster', icon: '⛈️' },
    { value: 'other', label: 'Other', icon: '📋' }
  ];

  const steps = [
    { number: 1, title: 'Claim Details', icon: FileText },
    { number: 2, title: 'Claimant Info', icon: User },
    { number: 3, title: 'Documents', icon: Upload },
    { number: 4, title: 'Review', icon: CheckCircle }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      type: file.type,
      file: file
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const removeFile = (id) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== id));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    console.log('Claim submitted:', { ...formData, documents: uploadedFiles });
    alert('Claim submitted successfully! Reference number: CLM-2024-' + Math.floor(Math.random() * 10000));
    navigate('/dashboard');
  };

  const requiredDocuments = [
    'Completed claim form',
    'Copy of ID or Passport',
    'Police report (if applicable)',
    'Medical reports and receipts',
    'Photos of damage (if applicable)',
    'Bank account details'
  ];

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
        <div className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Submit Insurance Claim</h1>
            <p className="text-gray-600 mt-1">Complete the form to file your insurance claim</p>
          </div>
          <button className="relative p-2 text-gray-600 hover:text-gray-900">
            <Bell size={24} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="bg-white border-b px-8 py-6">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      isCompleted ? 'bg-green-500 text-white' :
                      isActive ? 'bg-blue-700 text-white' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? <CheckCircle size={24} /> : <Icon size={24} />}
                    </div>
                    <span className={`mt-2 text-sm font-medium ${
                      isActive ? 'text-blue-700' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 rounded ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            {/* Step 1: Claim Details */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Claim Details</h2>
                  <p className="text-gray-600 mt-1">Provide information about your insurance claim</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Policy Number *
                    </label>
                    <input
                      type="text"
                      name="policyNumber"
                      value={formData.policyNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="E390073"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Claim Type *
                    </label>
                    <select
                      name="claimType"
                      value={formData.claimType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Claim Type</option>
                      {claimTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Incident Date *
                    </label>
                    <input
                      type="date"
                      name="incidentDate"
                      value={formData.incidentDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Estimated Claim Amount (RWF) *
                    </label>
                    <input
                      type="number"
                      name="claimAmount"
                      value={formData.claimAmount}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="500,000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Incident Location *
                  </label>
                  <input
                    type="text"
                    name="incidentLocation"
                    value={formData.incidentLocation}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City, District, Street"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Provide a detailed description of the incident..."
                  />
                </div>

                {/* Conditional Fields Based on Claim Type */}
                {(formData.claimType === 'accident' || formData.claimType === 'theft') && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Police Report Number
                    </label>
                    <input
                      type="text"
                      name="policeReportNumber"
                      value={formData.policeReportNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="PR-2024-XXXXX"
                    />
                  </div>
                )}

                {formData.claimType === 'medical' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Hospital/Clinic Name
                      </label>
                      <input
                        type="text"
                        name="hospitalName"
                        value={formData.hospitalName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Hospital name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Doctor's Name
                      </label>
                      <input
                        type="text"
                        name="doctorName"
                        value={formData.doctorName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Dr. John Doe"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Claimant Information */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Claimant Information</h2>
                  <p className="text-gray-600 mt-1">Provide details about the person making the claim</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="claimantName"
                      value={formData.claimantName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Full legal name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Relationship to Policy Holder *
                    </label>
                    <select
                      name="claimantRelation"
                      value={formData.claimantRelation}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Relationship</option>
                      <option value="self">Self</option>
                      <option value="spouse">Spouse</option>
                      <option value="child">Child</option>
                      <option value="parent">Parent</option>
                      <option value="sibling">Sibling</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="claimantPhone"
                      value={formData.claimantPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+250 XXX XXX XXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="claimantEmail"
                      value={formData.claimantEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Physical Address *
                  </label>
                  <textarea
                    name="claimantAddress"
                    value={formData.claimantAddress}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Complete address including city and district"
                  />
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Account Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Bank of Kigali"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="XXXXXXXXXXXXXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Account Holder Name *
                      </label>
                      <input
                        type="text"
                        name="accountName"
                        value={formData.accountName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="As per bank records"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Branch *
                      </label>
                      <input
                        type="text"
                        name="bankBranch"
                        value={formData.bankBranch}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Branch name"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Documents */}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Upload Documents</h2>
                  <p className="text-gray-600 mt-1">Please upload all required supporting documents</p>
                </div>

                {/* Required Documents List */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Info className="mr-2" size={20} />
                    Required Documents
                  </h3>
                  <ul className="space-y-2">
                    {requiredDocuments.map((doc, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="text-green-600 mr-2" size={16} />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Files</h3>
                  <p className="text-gray-600 mb-4">Drag and drop files here, or click to browse</p>
                  <label className="inline-block px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 cursor-pointer transition-colors">
                    Choose Files
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">Supported formats: PDF, JPG, PNG, DOC (Max 5MB each)</p>
                </div>

                {/* Uploaded Files List */}
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
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Review Your Claim</h2>
                  <p className="text-gray-600 mt-1">Please verify all information before submitting</p>
                </div>

                {/* Claim Details Summary */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="mr-2 text-blue-700" size={20} />
                      Claim Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Policy Number</p>
                        <p className="font-semibold text-gray-900">{formData.policyNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Claim Type</p>
                        <p className="font-semibold text-gray-900">{claimTypes.find(t => t.value === formData.claimType)?.label}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Incident Date</p>
                        <p className="font-semibold text-gray-900">{formData.incidentDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Claim Amount</p>
                        <p className="font-semibold text-gray-900">{formData.claimAmount} RWF</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="mr-2 text-blue-700" size={20} />
                      Claimant Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Name</p>
                        <p className="font-semibold text-gray-900">{formData.claimantName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Phone</p>
                        <p className="font-semibold text-gray-900">{formData.claimantPhone}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Email</p>
                        <p className="font-semibold text-gray-900">{formData.claimantEmail}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Bank Account</p>
                        <p className="font-semibold text-gray-900">{formData.accountNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Upload className="mr-2 text-blue-700" size={20} />
                      Uploaded Documents
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">You have uploaded {uploadedFiles.length} files.</p>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {uploadedFiles.map(file => (
                        <li key={file.id}>{file.name} ({file.size})</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <button
                  onClick={handlePrevious}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Previous
                </button>
              ) : <div />}

              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Submit Claim
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}