import React, { useState } from "react";
import {
  MessageSquare,
  Star,
  Send,
  FileText,
  Briefcase,
  ThumbsUp,
  Settings,
  LogOut,
  Bell,
  CheckCircle,
  TrendingUp,
  Users,
  Award,
  Calendar,
  Filter,
  X
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function ClientFeedback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");

  // Feedback Data
  const [feedbackList, setFeedbackList] = useState([
    {
      id: 1,
      category: "Claims Service",
      rating: 5,
      message: "Great experience! My claim was processed very quickly and efficiently. The team was very responsive and kept me updated throughout the process.",
      date: "2025-10-15",
      status: "Reviewed",
      policyNumber: "E390073"
    },
    {
      id: 2,
      category: "Customer Support",
      rating: 4,
      message: "Helpful team, but response took slightly longer than expected. Overall satisfied with the service provided.",
      date: "2025-10-12",
      status: "Reviewed",
      policyNumber: "S390074"
    },
    {
      id: 3,
      category: "Policy Management",
      rating: 5,
      message: "The online portal is very user-friendly. I can easily view and manage all my policies in one place.",
      date: "2025-10-08",
      status: "Reviewed",
      policyNumber: "P390075"
    },
    {
      id: 4,
      category: "Payment Process",
      rating: 4,
      message: "Payment process is smooth, but I would like to see more payment options available.",
      date: "2025-10-05",
      status: "Under Review",
      policyNumber: "E390073"
    }
  ]);

  const [formData, setFormData] = useState({
    category: "",
    rating: 0,
    message: "",
    policyNumber: ""
  });

  const [hoveredStar, setHoveredStar] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRating = (value) => {
    setFormData({ ...formData, rating: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.message || formData.rating === 0 || !formData.policyNumber) {
      alert("Please fill all fields and provide a rating.");
      return;
    }
    const newFeedback = {
      id: feedbackList.length + 1,
      ...formData,
      date: new Date().toISOString().split("T")[0],
      status: "Under Review"
    };
    setFeedbackList([newFeedback, ...feedbackList]);
    setFormData({ category: "", rating: 0, message: "", policyNumber: "" });
    setShowFeedbackForm(false);
  };

  const menuItems = [
    { id: "policies", label: "Policies", icon: FileText, path: "/ClientDashboard" },
    { id: "services", label: "Services", icon: Briefcase, path: "/services" },
    { id: "complaints", label: "Complaints", icon: MessageSquare, path: "/complaints" },
    { id: "feedback", label: "Feedback", icon: ThumbsUp, path: "/feedback" },
  ];

  // Calculate statistics
  const averageRating = (feedbackList.reduce((acc, f) => acc + f.rating, 0) / feedbackList.length).toFixed(1);
  const totalFeedback = feedbackList.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => 
    feedbackList.filter(f => f.rating === rating).length
  );

  const filteredFeedback = filterCategory === "all" 
    ? feedbackList 
    : feedbackList.filter(f => f.category === filterCategory);

  const categories = ["Customer Support", "Claims Service", "Policy Management", "Payment Process"];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col">
        <div className="p-6 border-b border-blue-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="font-bold text-lg">Sanlam | Allianz</div>
          </div>
        </div>

        {/* Navigation Menu */}
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
                    ? "bg-white text-blue-900 border-l-4 border-blue-600"
                    : "text-white hover:bg-blue-700"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-6 border-t border-blue-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold text-lg">
              GK
            </div>
            <div>
              <div className="font-semibold">GUSTAVE KAREKEZI</div>
              <div className="text-sm text-blue-300">0786979551</div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-blue-700 flex justify-around">
          <button className="p-2 hover:bg-blue-700 rounded-full transition-colors">
            <Settings size={20} />
          </button>
          <button onClick={() => navigate("/")} className="p-2 hover:bg-blue-700 rounded-full transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Feedback</h1>
            <p className="text-gray-600 mt-1">Share your experiences and help us improve</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <Bell size={24} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={() => setShowFeedbackForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              <ThumbsUp size={20} />
              <span className="font-semibold">Give Feedback</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="p-8 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                  <p className="text-3xl font-bold text-gray-900">{averageRating}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="text-yellow-500" size={24} />
                </div>
              </div>
              <div className="flex items-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Feedback</p>
                  <p className="text-3xl font-bold text-gray-900">{totalFeedback}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Reviewed</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {feedbackList.filter(f => f.status === "Reviewed").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Satisfaction</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {Math.round((feedbackList.filter(f => f.rating >= 4).length / totalFeedback) * 100)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-purple-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="px-8 pb-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center space-x-4">
              <Filter size={20} className="text-gray-600" />
              <div className="flex space-x-2 overflow-x-auto">
                <button
                  onClick={() => setFilterCategory("all")}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                    filterCategory === "all"
                      ? "bg-blue-700 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All ({feedbackList.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                      filterCategory === cat
                        ? "bg-blue-700 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat} ({feedbackList.filter(f => f.category === cat).length})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <div className="space-y-4">
            {filteredFeedback.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <ThumbsUp className="mx-auto w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Feedback Yet</h3>
                <p className="text-gray-500 mb-4">Be the first to share your experience!</p>
                <button
                  onClick={() => setShowFeedbackForm(true)}
                  className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Give Feedback
                </button>
              </div>
            ) : (
              filteredFeedback.map((feedback) => (
                <div key={feedback.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="p-6">
                    {/* Feedback Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                            {feedback.category}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            feedback.status === "Reviewed" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {feedback.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {feedback.date}
                          </span>
                          <span>•</span>
                          <span>Policy: {feedback.policyNumber}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={20}
                            className={star <= feedback.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                          />
                        ))}
                        <span className="ml-2 text-lg font-bold text-gray-900">{feedback.rating}.0</span>
                      </div>
                    </div>

                    {/* Feedback Message */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">{feedback.message}</p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center text-sm text-gray-500">
                        <CheckCircle size={16} className="mr-2 text-green-600" />
                        Thank you for your feedback!
                      </div>
                      {feedback.status === "Reviewed" && (
                        <span className="text-sm text-blue-700 font-medium">
                          We've reviewed your feedback
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Feedback Form Modal */}
      {showFeedbackForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Share Your Feedback</h2>
                <p className="text-sm text-gray-600 mt-1">Help us improve our services</p>
              </div>
              <button
                onClick={() => setShowFeedbackForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Category and Policy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Policy Number *
                  </label>
                  <input
                    type="text"
                    name="policyNumber"
                    value={formData.policyNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="E390073"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rating *
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={36}
                      className={`cursor-pointer transition-all ${
                        star <= (hoveredStar || formData.rating)
                          ? "text-yellow-400 fill-yellow-400 scale-110"
                          : "text-gray-300"
                      }`}
                      onClick={() => handleRating(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                    />
                  ))}
                  {formData.rating > 0 && (
                    <span className="ml-4 text-lg font-semibold text-gray-700">
                      {formData.rating === 5 ? "Excellent!" : 
                       formData.rating === 4 ? "Good" : 
                       formData.rating === 3 ? "Average" : 
                       formData.rating === 2 ? "Poor" : "Very Poor"}
                    </span>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Feedback *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Share your experience with us..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 20 characters ({formData.message.length}/20)
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> Your feedback helps us improve our services. We review all feedback and may contact you for additional information.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowFeedbackForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send size={20} />
                  <span>Submit Feedback</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-blue-700 text-white rounded-full shadow-lg hover:bg-blue-800 transition-all hover:scale-110 flex items-center justify-center">
        <MessageSquare size={24} />
      </button>
    </div>
  );
}