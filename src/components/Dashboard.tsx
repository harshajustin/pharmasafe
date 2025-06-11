import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePatients } from '../hooks/usePatients';
import { useDrugInteractions } from '../hooks/useDrugInteractions';
import { 
  Users, 
  AlertTriangle, 
  FileText, 
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface DashboardStats {
  totalPatients: number;
  activeInteractions: number;
  reportsGenerated: number;
  criticalAlerts: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { patients, loading: patientsLoading } = usePatients();
  const { analyzeDrugInteractions } = useDrugInteractions();
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    activeInteractions: 0,
    reportsGenerated: 0,
    criticalAlerts: 0,
  });
  const [recentActivity, setRecentActivity] = useState<Array<{
    id: string;
    type: 'interaction' | 'report' | 'alert';
    description: string;
    time: string;
    severity?: 'low' | 'medium' | 'high';
  }>>([]);

  useEffect(() => {
    if (!patientsLoading && patients.length > 0) {
      // Calculate dashboard statistics
      const totalPatients = patients.length;
      let activeInteractions = 0;
      
      // Simulate interaction analysis for dashboard stats
      patients.forEach(async (patient) => {
        if (patient.currentMedications.length > 1) {
          const interactions = await analyzeDrugInteractions(patient.currentMedications);
          activeInteractions += interactions.length;
        }
      });

      setStats({
        totalPatients,
        activeInteractions: 8, // Mock data for demo
        reportsGenerated: 24,
        criticalAlerts: 2,
      });

      // Mock recent activity
      setRecentActivity([
        {
          id: '1',
          type: 'alert',
          description: 'Critical interaction detected for John Anderson',
          time: '2 hours ago',
          severity: 'high'
        },
        {
          id: '2',
          type: 'report',
          description: 'DDI report generated for Maria Rodriguez',
          time: '4 hours ago'
        },
        {
          id: '3',
          type: 'interaction',
          description: 'New moderate interaction identified',
          time: '6 hours ago',
          severity: 'medium'
        },
        {
          id: '4',
          type: 'report',
          description: 'Weekly interaction summary completed',
          time: '1 day ago'
        }
      ]);
    }
  }, [patients, patientsLoading, analyzeDrugInteractions]);

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
    change?: string;
  }> = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ActivityIcon: React.FC<{ type: string; severity?: string }> = ({ type, severity }) => {
    if (type === 'alert') {
      return <AlertTriangle className={`h-5 w-5 ${severity === 'high' ? 'text-red-500' : 'text-yellow-500'}`} />;
    } else if (type === 'report') {
      return <FileText className="h-5 w-5 text-blue-500" />;
    } else {
      return <Activity className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}
        </h1>
        <p className="text-gray-600 mt-1">
          {user?.role === 'doctor' ? 'Monitor drug interactions and patient safety' : 'Support clinical decision making'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={Users}
          color="bg-blue-500"
          change="+12% from last month"
        />
        <StatCard
          title="Active Interactions"
          value={stats.activeInteractions}
          icon={AlertTriangle}
          color="bg-yellow-500"
          change="+3 this week"
        />
        <StatCard
          title="Reports Generated"
          value={stats.reportsGenerated}
          icon={FileText}
          color="bg-green-500"
          change="+8% from last week"
        />
        <StatCard
          title="Critical Alerts"
          value={stats.criticalAlerts}
          icon={XCircle}
          color="bg-red-500"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <ActivityIcon type={activity.type} severity={activity.severity} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.description}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-3 px-4 rounded-lg transition-colors text-left">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-3" />
                  Add New Patient
                </div>
              </button>
              <button className="w-full bg-green-50 hover:bg-green-100 text-green-700 font-medium py-3 px-4 rounded-lg transition-colors text-left">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-3" />
                  Generate Report
                </div>
              </button>
              <button className="w-full bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-medium py-3 px-4 rounded-lg transition-colors text-left">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-3" />
                  Check Interactions
                </div>
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">DrugBank API</span>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Audit Logging</span>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;