import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/Login";
import ClientRegister from "./pages/ClientRegister";
import ClientDashboard from "./pages/ClientDashboard";
import ClientServices from "./pages/ClientServices";
import ClientComplaints from "./pages/ClientComplaints";
import ClientFeedback from "./pages/ClientFeedback";
import ClaimsSubmission from './pages/ClaimsSubmission';
import LoginPage from "./pages/LoginPage";
import AdminDashboard from './component/Admin/AdminDashboard';
import AdminClients from './component/Admin/AdminClients';
import AdminPolicies from './component/Admin/AdminPolicies';  
import AdminClaims from './component/Admin/AdminClaims';
import AdminPayments from './component/Admin/AdminPayments';
import AdminComplaints from './component/Admin/AdminComplaints';
import AdminReports from './component/Admin/AdminReport';
import AdminSettings from './component/Admin/AdminSettings';
import Policies from './pages/Policies';
import "./App.css"

function App() {
    return (
    <Router>
        <Routes>
           <Route path="/policies" element={<div className="p-8">Complaints Page - Coming Soon</div>} />
        {/* Authentication Routes */}
          <Route path="/" element={<LoginPage />} />
           <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<ClientRegister />} />
        {/*Client Dashboard Routes */}
        <Route path="/ClientDashboard" element={<ClientDashboard />} />
          <Route path="/services" element={<ClientServices />} />
          <Route path="/complaints" element={<ClientComplaints />} />
          <Route path="/feedback" element={<ClientFeedback />} />
          <Route path="/claims" element={<ClaimsSubmission />} />
          <Route path="/policies" element={<Policies />} />
          {/* End Client Routes */}
         
          {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/clients" element={<AdminClients />} />  
          <Route path="/admin/policies" element={<AdminPolicies />} />
          <Route path="/admin/claims" element={<AdminClaims />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/complaints" element={<AdminComplaints />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        {/* Placeholder routes - create these components next */}
          <Route path="*" element={<div className="p-8 text-gray-500  text-lg"> Page Under- Construction ,It Will Be Available Soon!</div>} />
        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
