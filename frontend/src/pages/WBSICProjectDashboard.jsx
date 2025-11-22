import React, { useState } from 'react';
import { CheckCircle, Circle, Clock, Users, FileText, DollarSign, Activity, Shield } from 'lucide-react';

const WBSICProjectDashboard = () => {
  const [selectedEpic, setSelectedEpic] = useState(null);
  const [taskStatus, setTaskStatus] = useState({});

  const epics = [
    {
      id: 1,
      name: "Customer & User Management",
      description: "Manage user registration, authentication, and profiles.",
      icon: Users,
      color: "bg-blue-500",
      tasks: [
        "Design database schema for users and roles",
        "Implement registration and login API",
        "Develop React user registration and login pages",
        "Integrate JWT authentication",
        "Containerize user management service"
      ]
    },
    {
      id: 2,
      name: "Policy Management",
      description: "Create and manage insurance policies.",
      icon: Shield,
      color: "bg-green-500",
      tasks: [
        "Design database schema for policies",
        "Create policy CRUD API",
        "Develop React policy dashboard",
        "Implement role-based access",
        "Write unit tests for policy services"
      ]
    },
    {
      id: 3,
      name: "Claims Processing",
      description: "Automate and track the claim approval process.",
      icon: FileText,
      color: "bg-purple-500",
      tasks: [
        "Define claims data model",
        "Build claim submission API",
        "Develop frontend claim form",
        "Integrate notification system",
        "Deploy claim microservice with Docker"
      ]
    },
    {
      id: 4,
      name: "Payments & Billing",
      description: "Manage payment records, invoices, and billing automation.",
      icon: DollarSign,
      color: "bg-yellow-500",
      tasks: [
        "Integrate payment gateway",
        "Create billing APIs",
        "Build payment history page",
        "Automate payment reminders",
        "Add Docker volume for payment data"
      ]
    },
    {
      id: 5,
      name: "Reporting & Analytics Dashboard",
      description: "Generate data insights and visualize reports.",
      icon: Activity,
      color: "bg-red-500",
      tasks: [
        "Create analytics API",
        "Integrate Chart.js or Recharts",
        "Build admin analytics dashboard",
        "Implement export-to-CSV",
        "Deploy dashboard on Kubernetes"
      ]
    }
  ];

  const toggleTaskStatus = (epicId, taskIndex) => {
    const key = `${epicId}-${taskIndex}`;
    setTaskStatus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getEpicProgress = (epic) => {
    const completed = epic.tasks.filter((_, idx) => 
      taskStatus[`${epic.id}-${idx}`]
    ).length;
    return Math.round((completed / epic.tasks.length) * 100);
  };

  const totalTasks = epics.reduce((sum, epic) => sum + epic.tasks.length, 0);
  const completedTasks = Object.values(taskStatus).filter(Boolean).length;
  const overallProgress = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            WBSIC Project Dashboard
          </h1>
          <p className="text-slate-600 mb-4">
            Web-Based Self-Service Insurance Claims System
          </p>
          
          {/* Overall Progress */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-slate-700">
                Overall Progress
              </span>
              <span className="text-sm font-bold text-slate-900">
                {completedTasks} / {totalTasks} tasks ({overallProgress}%)
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Epic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {epics.map((epic) => {
            const Icon = epic.icon;
            const progress = getEpicProgress(epic);
            
            return (
              <div
                key={epic.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedEpic(selectedEpic === epic.id ? null : epic.id)}
              >
                <div className={`${epic.color} text-white p-4 rounded-t-lg`}>
                  <div className="flex items-center gap-3">
                    <Icon size={24} />
                    <h3 className="font-bold text-lg">{epic.name}</h3>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-slate-600 text-sm mb-4">{epic.description}</p>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600">Progress</span>
                      <span className="font-semibold text-slate-800">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`${epic.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-500 mt-2">
                    {epic.tasks.filter((_, idx) => taskStatus[`${epic.id}-${idx}`]).length} of {epic.tasks.length} tasks complete
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Task Details */}
        {selectedEpic && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              {epics.find(e => e.id === selectedEpic)?.name} - Tasks
            </h2>
            
            <div className="space-y-3">
              {epics.find(e => e.id === selectedEpic)?.tasks.map((task, idx) => {
                const key = `${selectedEpic}-${idx}`;
                const isComplete = taskStatus[key];
                
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer border border-slate-200"
                    onClick={() => toggleTaskStatus(selectedEpic, idx)}
                  >
                    {isComplete ? (
                      <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                    ) : (
                      <Circle className="text-slate-400 flex-shrink-0" size={20} />
                    )}
                    <span className={`flex-1 ${isComplete ? 'line-through text-slate-500' : 'text-slate-700'}`}>
                      {task}
                    </span>
                  </div>
                );
              })}
            </div>
            
            <button
              onClick={() => setSelectedEpic(null)}
              className="mt-4 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        )}

        {/* Tech Stack Footer */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="font-bold text-slate-800 mb-3">Technology Stack</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-semibold text-slate-700">Frontend:</span>
              <p className="text-slate-600">React, Chart.js/Recharts</p>
            </div>
            <div>
              <span className="font-semibold text-slate-700">Backend:</span>
              <p className="text-slate-600">Node.js, REST APIs</p>
            </div>
            <div>
              <span className="font-semibold text-slate-700">Auth:</span>
              <p className="text-slate-600">JWT Authentication</p>
            </div>
            <div>
              <span className="font-semibold text-slate-700">Deploy:</span>
              <p className="text-slate-600">Docker, Kubernetes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WBSICProjectDashboard;