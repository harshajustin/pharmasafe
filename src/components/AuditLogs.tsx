import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../utils/rbac';
import {
  Search,
  Calendar,
  User,
  Activity,
  Filter,
  Download,
  Eye,
  Edit,
  Shield,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { AuditLog } from '../types';

const AuditLogs: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedAction, setSelectedAction] = useState('all');

  const canViewAllLogs = hasPermission(user?.role || 'nurse', 'audit', 'read');
  const canExportLogs = hasPermission(user?.role || 'nurse', 'audit', 'write');

  useEffect(() => {
    // Mock audit logs data with role-based filtering
    const allLogs: AuditLog[] = [
      {
        id: '1',
        userId: user?.id || '1',
        userName: user?.name || 'Dr. Sarah Smith',
        action: 'VIEW_PATIENT',
        resource: 'Patient: John Anderson (MID-001)',
        details: 'Viewed patient details and medication list',
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.100'
      },
      {
        id: '2',
        userId: user?.id || '1',
        userName: user?.name || 'Dr. Sarah Smith',
        action: 'GENERATE_REPORT',
        resource: 'DDI Report for John Anderson',
        details: 'Generated drug interaction analysis report',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        ipAddress: '192.168.1.100'
      },
      {
        id: '3',
        userId: '2',
        userName: 'Nurse Michael Johnson',
        action: 'UPDATE_MEDICATION',
        resource: 'Patient: Maria Rodriguez (MID-002)',
        details: 'Updated medication dosage for Sertraline',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        ipAddress: '192.168.1.105'
      },
      {
        id: '4',
        userId: user?.id || '1',
        userName: user?.name || 'Dr. Sarah Smith',
        action: 'ANALYZE_INTERACTIONS',
        resource: 'Patient: John Anderson (MID-001)',
        details: 'Performed drug-drug interaction analysis',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        ipAddress: '192.168.1.100'
      },
      {
        id: '5',
        userId: '2',
        userName: 'Nurse Michael Johnson',
        action: 'ADD_PATIENT',
        resource: 'New Patient: Robert Wilson (MID-003)',
        details: 'Added new patient to the system',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        ipAddress: '192.168.1.105'
      },
      {
        id: '6',
        userId: user?.id || '1',
        userName: user?.name || 'Dr. Sarah Smith',
        action: 'LOGIN',
        resource: 'Authentication System',
        details: 'User logged into the system',
        timestamp: new Date(Date.now() - 18000000).toISOString(),
        ipAddress: '192.168.1.100'
      },
      {
        id: '7',
        userId: user?.id || '1',
        userName: user?.name || 'Dr. Sarah Smith',
        action: 'DOWNLOAD_REPORT',
        resource: 'DDI Report for Maria Rodriguez',
        details: 'Downloaded interaction analysis report',
        timestamp: new Date(Date.now() - 21600000).toISOString(),
        ipAddress: '192.168.1.100'
      },
      {
        id: '8',
        userId: '2',
        userName: 'Nurse Michael Johnson',
        action: 'VIEW_AUDIT_LOGS',
        resource: 'Audit Log System',
        details: 'Accessed audit logs for security review',
        timestamp: new Date(Date.now() - 25200000).toISOString(),
        ipAddress: '192.168.1.105'
      },
      // Admin-only logs
      {
        id: '9',
        userId: '1',
        userName: 'System Administrator',
        action: 'CREATE_USER',
        resource: 'User Management System',
        details: 'Created new user account for Dr. James Miller',
        timestamp: new Date(Date.now() - 28800000).toISOString(),
        ipAddress: '192.168.1.50'
      },
      {
        id: '10',
        userId: '1',
        userName: 'System Administrator',
        action: 'MODIFY_PERMISSIONS',
        resource: 'RBAC System',
        details: 'Updated role permissions for nurse role',
        timestamp: new Date(Date.now() - 32400000).toISOString(),
        ipAddress: '192.168.1.50'
      }
    ];

    // Filter logs based on user role
    let filteredLogs = allLogs;
    if (user?.role === 'nurse') {
      // Nurses can only see their own actions and general system activities
      filteredLogs = allLogs.filter(log => 
        log.userId === user.id || 
        ['LOGIN', 'VIEW_PATIENT', 'VIEW_AUDIT_LOGS'].includes(log.action)
      );
    } else if (user?.role === 'doctor') {
      // Doctors can see all clinical activities but not admin actions
      filteredLogs = allLogs.filter(log => 
        !['CREATE_USER', 'MODIFY_PERMISSIONS', 'DELETE_USER'].includes(log.action)
      );
    }
    // Admins see all logs

    setLogs(filteredLogs);
  }, [user]);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = selectedAction === 'all' || log.action === selectedAction;
    
    return matchesSearch && matchesAction;
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'VIEW_PATIENT':
      case 'VIEW_AUDIT_LOGS':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'UPDATE_MEDICATION':
      case 'ADD_PATIENT':
      case 'CREATE_USER':
        return <Edit className="h-4 w-4 text-green-500" />;
      case 'GENERATE_REPORT':
      case 'DOWNLOAD_REPORT':
        return <Download className="h-4 w-4 text-purple-500" />;
      case 'ANALYZE_INTERACTIONS':
        return <Activity className="h-4 w-4 text-orange-500" />;
      case 'LOGIN':
        return <Shield className="h-4 w-4 text-gray-500" />;
      case 'MODIFY_PERMISSIONS':
        return <Shield className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'VIEW_PATIENT':
      case 'VIEW_AUDIT_LOGS':
        return 'bg-blue-50 text-blue-700';
      case 'UPDATE_MEDICATION':
      case 'ADD_PATIENT':
      case 'CREATE_USER':
        return 'bg-green-50 text-green-700';
      case 'GENERATE_REPORT':
      case 'DOWNLOAD_REPORT':
        return 'bg-purple-50 text-purple-700';
      case 'ANALYZE_INTERACTIONS':
        return 'bg-orange-50 text-orange-700';
      case 'LOGIN':
        return 'bg-gray-50 text-gray-700';
      case 'MODIFY_PERMISSIONS':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const formatAction = (action: string) => {
    return action.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const uniqueActions = [...new Set(logs.map(log => log.action))];

  if (!canViewAllLogs) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
          <div>
            <h3 className="text-lg font-medium text-red-800">Access Denied</h3>
            <p className="text-red-600">You don't have permission to view audit logs.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600">Monitor all system activities and user actions</p>
        </div>
        {canExportLogs && (
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
            <Download className="h-5 w-5 mr-2" />
            Export Logs
          </button>
        )}
      </div>

      {/* Role-based Access Notice */}
      {user?.role === 'nurse' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> As a nurse, you have read-only access to audit logs for your own actions and general system monitoring.
            </p>
          </div>
        </div>
      )}

      {user?.role === 'doctor' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Eye className="h-5 w-5 text-blue-600 mr-2" />
            <p className="text-sm text-blue-800">
              <strong>Clinical Access:</strong> You can view all clinical activities and patient-related actions.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search logs..."
            />
          </div>
          
          <div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
            </select>
          </div>
          
          <div>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Actions</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>
                  {formatAction(action)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              {filteredLogs.length} of {logs.length} logs
            </span>
          </div>
        </div>
      </div>

      {/* Activity Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Actions</p>
              <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(logs.map(log => log.userId)).size}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Patient Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {logs.filter(log => log.action === 'VIEW_PATIENT').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Analyses</p>
              <p className="text-2xl font-bold text-gray-900">
                {logs.filter(log => log.action === 'ANALYZE_INTERACTIONS').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getActionIcon(log.action)}
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getActionColor(log.action)}`}>
                        {formatAction(log.action)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                    <div className="text-sm text-gray-500">ID: {log.userId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {log.resource}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {log.details}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;