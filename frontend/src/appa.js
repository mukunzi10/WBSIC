import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ClientRegister from './components/ClientRegister';
import ClientDashboard from './components/ClientDashboard';
import ClientServices from './components/ClientServices';
// Import other components as needed
// import Complaints from './components/Complaints';
// import Feedback from './components/Feedback';

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<ClientRegister />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="/services" element={<ClientServices />} />
        
        {/* Placeholder routes - create these components next */}
        <Route path="/complaints" element={<div className="p-8">Complaints Page - Coming Soon</div>} />
        <Route path="/feedback" element={<div className="p-8">Feedback Page - Coming Soon</div>} />
        
        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;