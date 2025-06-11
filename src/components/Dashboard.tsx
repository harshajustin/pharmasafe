import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePatients } from '../hooks/usePatients';
import { useDrugInteractions } from '../hooks/useDrugInteractions';
import { hasPermission, getRoleDisplayName, getRoleColor } from '../utils/rbac';
import { 
  Users, 
  AlertTriangle, 
  FileText, 
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  Database,
  UserCog,
  BarChart3,
  PieChart,
  Settings,
  Lock,
  Eye,
  Plus
} from 'lucide-react';

interface DashboardStats {
  totalPatients: number;
  activeInteractions: number;
  reportsGenerated: number;
  criticalAlerts: number;
  totalUsers?: number;
  systemUptime?: string;
  apiCalls?: number;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  action: () => void;
  requiredPermission: { resource: string; action: string } | null;
  customAccess?: () => boolean;
}

interface DashboardWidget {
  id: string;
  title: string;
  component: React.ComponentType;
  requiredPermission: { resource: string; action: string };
  gridSize: 'small' | 'medium' | 'large';
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
    type: 'interaction' | 'report' | 'alert' | 'user' | 'system';
    description: string;
    time: string;
    severity?: 'low' | 'medium' | 'high';
    user?: string;
  }>>([]);

  // Role-based dashboard configuration
  const getDashboardConfig = () => {
    const baseConfig = {
      welcomeMessage: `Welcome back, ${user?.name}`,
      subtitle: '',
      showSystemStats: false,
      showUserManagement: false,
      showApiSettings: false,
    };

    switch (user?.role) {
      case 'admin':
        return {
          ...baseConfig,
          subtitle: 'System Administration Dashboard',
          showSystemStats: true,
          showUserManagement: true,
          showApiSettings: true,
        };
      case 'doctor':
        return {
          ...baseConfig,
          subtitle: 'Clinical Decision Support Dashboard',
          showSystemStats: false,
          showUserManagement: false,
          showApiSettings: false,
        };
      case 'nurse':
        return {
          ...baseConfig,
          subtitle: 'Patient Care Support Dashboard',
          showSystemStats: false,
          showUserManagement: false,
          showApiSettings: false,
        };
      default:
        return baseConfig;
    }
  };

  const dashboardConfig = getDashboardConfig();

  // Role-based quick actions
  const getQuickActions = (): QuickAction[] => {
    const actions: QuickAction[] = [];

    if (hasPermission(user?.role || 'nurse', 'patients', 'write')) {
      actions.push({
        id: 'add-patient',
        label: 'Add New Patient',
        icon: Users,
        color: 'bg-blue-50 hover:bg-blue-100 text-blue-700',
        action: () => console.log('Add patient'),
        requiredPermission: { resource: 'patients', action: 'write' }
      });
    }

    // DDI Analyzer - Admin and Doctor only
    if (user?.role === 'admin' || user?.role === 'doctor') {
      actions.push({
        id: 'ddi-analyzer',
        label: 'Analyze Drug Interactions',
        icon: AlertTriangle,
        color: 'bg-orange-50 hover:bg-orange-100 text-orange-700',
        action: () => window.location.href = '/ddi-analyzer',
        requiredPermission: null,
        customAccess: () => user?.role === 'admin' || user?.role === 'doctor'
      });
    }

    if (hasPermission(user?.role || 'nurse', 'reports', 'execute')) {
      actions.push({
        id: 'generate-report',
        label: 'Generate Report',
        icon: FileText,
        color: 'bg-green-50 hover:bg-green-100 text-green-700',
        action: () => console.log('Generate report'),
        requiredPermission: { resource: 'reports', action: 'execute' }
      });
    }

    if (hasPermission(user?.role || 'nurse', 'users', 'write')) {
      actions.push({
        id: 'manage-users',
        label: 'Manage Users',
        icon: UserCog,
        color: 'bg-purple-50 hover:bg-purple-100 text-purple-700',
        action: () => console.log('Manage users'),
        requiredPermission: { resource: 'users', action: 'write' }
      });
    }

    return actions;
  };

  useEffect(() => {
    if (!patientsLoading && patients.length > 0) {
      // Calculate role-specific dashboard statistics
      const baseStats = {
        totalPatients: patients.length,
        activeInteractions: 8,
        reportsGenerated: 24,
        criticalAlerts: 2,
      };

      // Add admin-specific stats
      if (user?.role === 'admin') {
        setStats({
          ...baseStats,
          totalUsers: 15,
          systemUptime: '99.9%',
          apiCalls: 1247,
        });
      } else {
        setStats(baseStats);
      }

      // Role-specific recent activity
      const baseActivity = [
        {
          id: '1',
          type: 'alert' as const,
          description: 'Critical interaction detected for John Anderson',
          time: '2 hours ago',
          severity: 'high' as const,
          user: 'Dr. Sarah Smith'
        },
        {
          id: '2',
          type: 'report' as const,
          description: 'DDI report generated for Maria Rodriguez',
          time: '4 hours ago',
          user: user?.name || 'Unknown'
        },
        {
          id: '3',
          type: 'interaction' as const,
          description: 'New moderate interaction identified',
          time: '6 hours ago',
          severity: 'medium' as const,
          user: 'Dr. Emily Wilson'
        },
      ];

      // Add admin-specific activity
      if (user?.role === 'admin') {
        baseActivity.unshift(
          {
            id: '0',
            type: 'user' as const,
            description: 'New user account created: Dr. James Miller',
            time: '1 hour ago',
            user: 'System Administrator'
          },
          {
            id: '00',
            type: 'system' as const,
            description: 'System backup completed successfully',
            time: '3 hours ago',
            user: 'System'
          }
        );
      }

      setRecentActivity(baseActivity);
    }
  }, [patients, patientsLoading, user]);

  const StatCard: React.FC<{
    title: string;
    value: number | string;
    icon: React.ElementType;
    color: string;
    change?: string;
    description?: string;
  }> = ({ title, value, icon: Icon, color, change, description }) => (
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
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
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
    } else if (type === 'user') {
      return <UserCog className="h-5 w-5 text-purple-500" />;
    } else if (type === 'system') {
      return <Settings className="h-5 w-5 text-gray-500" />;
    } else {
      return <Activity className="h-5 w-5 text-green-500" />;
    }
  };

  const SystemStatusWidget: React.FC = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Database className="h-5 w-5 mr-2" />
          System Status
        </h2>
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
        {user?.role === 'admin' && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">System Load</span>
              <span className="text-sm text-gray-900">23%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Memory Usage</span>
              <span className="text-sm text-gray-900">67%</span>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const UserActivityWidget: React.FC = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          User Activity
        </h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Active Sessions</span>
            <span className="text-sm font-medium text-gray-900">12</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Today's Logins</span>
            <span className="text-sm font-medium text-gray-900">28</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Failed Attempts</span>
            <span className="text-sm font-medium text-red-600">3</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header with Role-based Welcome */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {dashboardConfig.welcomeMessage}
            </h1>
            <p className="text-gray-600 mt-1">{dashboardConfig.subtitle}</p>
            <div className="flex items-center mt-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user?.role || 'nurse')}`}>
                <Shield className="h-4 w-4 mr-1" />
                {getRoleDisplayName(user?.role || 'nurse')}
              </span>
              {user?.department && (
                <span className="ml-3 text-sm text-gray-600">
                  {user.department} Department
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Last Login</p>
            <p className="text-lg font-semibold text-gray-900">Today, 9:30 AM</p>
          </div>
        </div>
      </div>

      {/* Role-based Stats Grid */}
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
        
        {/* Admin-only stats */}
        {user?.role === 'admin' && (
          <>
            <StatCard
              title="Total Users"
              value={stats.totalUsers || 0}
              icon={UserCog}
              color="bg-purple-500"
              description="Active system users"
            />
            <StatCard
              title="System Uptime"
              value={stats.systemUptime || 'N/A'}
              icon={Database}
              color="bg-indigo-500"
              description="Last 30 days"
            />
            <StatCard
              title="API Calls"
              value={stats.apiCalls || 0}
              icon={BarChart3}
              color="bg-teal-500"
              description="This month"
            />
            <StatCard
              title="Storage Used"
              value="67%"
              icon={PieChart}
              color="bg-orange-500"
              description="Database capacity"
            />
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className={user?.role === 'admin' ? 'lg:col-span-2' : 'lg:col-span-2'}>
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
                      <div className="flex items-center mt-1 space-x-2">
                        <p className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {activity.time}
                        </p>
                        {activity.user && (
                          <p className="text-xs text-gray-400">
                            by {activity.user}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Role-based Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              {getQuickActions().map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className={`w-full ${action.color} font-medium py-3 px-4 rounded-lg transition-colors text-left`}
                  >
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 mr-3" />
                      {action.label}
                    </div>
                  </button>
                );
              })}
              
              {/* Show limited access message for nurses */}
              {user?.role === 'nurse' && getQuickActions().length < 3 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center text-gray-600">
                    <Lock className="h-4 w-4 mr-2" />
                    <span className="text-sm">Limited actions available for your role</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* System Status */}
          <SystemStatusWidget />

          {/* Admin-only User Activity Widget */}
          {user?.role === 'admin' && <UserActivityWidget />}
        </div>
      </div>

      {/* Admin-only System Overview */}
      {user?.role === 'admin' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              System Administration Overview
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Security Status</h3>
                <p className="text-sm text-blue-700">All systems secure. No threats detected.</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Secure
                  </span>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-2">Backup Status</h3>
                <p className="text-sm text-green-700">Last backup: 2 hours ago</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Up to date
                  </span>
                </div>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="font-medium text-yellow-900 mb-2">Maintenance</h3>
                <p className="text-sm text-yellow-700">Next scheduled: Sunday 2:00 AM</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Clock className="h-3 w-3 mr-1" />
                    Scheduled
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;