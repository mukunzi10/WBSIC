// ClientDashboard.jsx - Main Dashboard Component
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, FileText, CreditCard, AlertTriangle, 
  CheckCircle, Clock, TrendingUp, Shield
} from 'lucide-react';

const ClientDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - Replace with actual API calls
  const dashboardData = {
    user: {
      name: "John Doe",
      memberSince: "2023-01-15",
      customerId: "CUST-001234"
    },
    overview: {
      totalPolicies: 3,
      activePolicies: 2,
      pendingClaims: 1,
      totalPremium: 450000,
      recentActivity: [
        { id: 1, type: 'payment', description: 'Premium Payment', date: '2024-01-15', status: 'completed' },
        { id: 2, type: 'claim', description: 'Auto Claim Submission', date: '2024-01-10', status: 'pending' },
        { id: 3, type: 'policy', description: 'Policy Renewal', date: '2024-01-05', status: 'completed' }
      ]
    },
    policies: [
      {
        id: 1,
        policyNumber: "POL-001",
        type: "Auto Insurance",
        premium: 200000,
        status: "active",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        coverage: "Comprehensive"
      },
      {
        id: 2,
        policyNumber: "POL-002",
        type: "Health Insurance",
        premium: 250000,
        status: "active",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        coverage: "Family Plan"
      }
    ],
    claims: [
      {
        id: 1,
        claimNumber: "CLM-001",
        policyNumber: "POL-001",
        type: "Auto Accident",
        date: "2024-01-08",
        amount: 750000,
        status: "pending",
        description: "Rear-end collision repair"
      }
    ],
    payments: [
      {
        id: 1,
        invoiceNumber: "INV-001",
        policyNumber: "POL-001",
        amount: 200000,
        dueDate: "2024-01-15",
        status: "paid",
        paymentDate: "2024-01-14"
      }
    ]
  };

  const paymentHistoryData = [
    { month: 'Jan', amount: 450000 },
    { month: 'Feb', amount: 450000 },
    { month: 'Mar', amount: 450000 },
    { month: 'Apr', amount: 450000 },
    { month: 'May', amount: 450000 },
    { month: 'Jun', amount: 450000 }
  ];

  const policyDistributionData = [
    { name: 'Auto', value: 40 },
    { name: 'Health', value: 35 },
    { name: 'Life', value: 15 },
    { name: 'Property', value: 10 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Rwanda Insurance Portal
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {dashboardData.user.name}
                </p>
                <p className="text-sm text-gray-500">
                  ID: {dashboardData.user.customerId}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {dashboardData.user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['overview', 'policies', 'claims', 'payments', 'documents'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Dashboard */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.overview.totalPolicies}</div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardData.overview.activePolicies} active policies
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.overview.pendingClaims}</div>
                  <p className="text-xs text-muted-foreground">
                    Requires your attention
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Premium</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    RWF {dashboardData.overview.totalPremium.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Monthly premium amount
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Date(dashboardData.user.memberSince).getFullYear()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(dashboardData.user.memberSince).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={paymentHistoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`RWF ${value.toLocaleString()}`, 'Amount']} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#0088FE" 
                        strokeWidth={2}
                        name="Premium Amount"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Policy Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={policyDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {policyDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.overview.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {activity.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        )}
                        <div>
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Policies Tab */}
        {activeTab === 'policies' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Policies</h2>
              <Button>Add New Policy</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboardData.policies.map((policy) => (
                <Card key={policy.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{policy.type}</CardTitle>
                      <Badge variant={policy.status === 'active' ? 'default' : 'secondary'}>
                        {policy.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">Policy No: {policy.policyNumber}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Premium:</span>
                      <span className="font-semibold">RWF {policy.premium.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Coverage:</span>
                      <span className="font-semibold">{policy.coverage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Valid Until:</span>
                      <span className="font-semibold">
                        {new Date(policy.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button variant="outline" size="sm">Make Claim</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Claims Tab */}
        {activeTab === 'claims' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Claims History</h2>
              <Button>File New Claim</Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Claim Number</th>
                        <th className="text-left p-4">Policy</th>
                        <th className="text-left p-4">Type</th>
                        <th className="text-left p-4">Date</th>
                        <th className="text-left p-4">Amount</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.claims.map((claim) => (
                        <tr key={claim.id} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-medium">{claim.claimNumber}</td>
                          <td className="p-4">{claim.policyNumber}</td>
                          <td className="p-4">{claim.type}</td>
                          <td className="p-4">{new Date(claim.date).toLocaleDateString()}</td>
                          <td className="p-4">RWF {claim.amount.toLocaleString()}</td>
                          <td className="p-4">
                            <Badge variant={
                              claim.status === 'approved' ? 'default' :
                              claim.status === 'pending' ? 'secondary' : 'destructive'
                            }>
                              {claim.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Button variant="outline" size="sm">View Details</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Payment History</h2>
            
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Invoice No</th>
                        <th className="text-left p-4">Policy</th>
                        <th className="text-left p-4">Amount</th>
                        <th className="text-left p-4">Due Date</th>
                        <th className="text-left p-4">Payment Date</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.payments.map((payment) => (
                        <tr key={payment.id} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-medium">{payment.invoiceNumber}</td>
                          <td className="p-4">{payment.policyNumber}</td>
                          <td className="p-4">RWF {payment.amount.toLocaleString()}</td>
                          <td className="p-4">{new Date(payment.dueDate).toLocaleDateString()}</td>
                          <td className="p-4">
                            {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : '-'}
                          </td>
                          <td className="p-4">
                            <Badge variant={payment.status === 'paid' ? 'default' : 'destructive'}>
                              {payment.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            {payment.status !== 'paid' ? (
                              <Button size="sm">Pay Now</Button>
                            ) : (
                              <Button variant="outline" size="sm">Download Receipt</Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default ClientDashboard