import React, { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasPermission, getRoleDisplayName, getRoleColor } from '../utils/rbac';
import { 
  Home, 
  Users, 
  FileText, 
  Activity, 
  Settings, 
  LogOut, 
  User,
  Shield,
  UserCog,
  AlertTriangle
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define navigation items with role-based visibility
  const navItems = [
    { 
      path: '/', 
      icon: Home, 
      label: 'Dashboard',
      requiredPermission: { resource: 'dashboard', action: 'read' as const }
    },
    { 
      path: '/patients', 
      icon: Users, 
      label: 'Patients',
      requiredPermission: { resource: 'patients', action: 'read' as const }
    },
    { 
      path: '/ddi-analyzer', 
      icon: AlertTriangle, 
      label: 'DDI Analyzer',
      requiredPermission: null, // Custom access control in component
      customAccess: () => user?.role === 'admin' || user?.role === 'doctor'
    },
    { 
      path: '/reports', 
      icon: FileText, 
      label: 'Reports',
      requiredPermission: { resource: 'reports', action: 'read' as const }
    },
    { 
      path: '/audit', 
      icon: Activity, 
      label: 'Audit Logs',
      requiredPermission: { resource: 'audit', action: 'read' as const }
    },
    { 
      path: '/users', 
      icon: UserCog, 
      label: 'User Management',
      requiredPermission: { resource: 'users', action: 'read' as const }
    },
    { 
      path: '/settings', 
      icon: Settings, 
      label: 'Settings',
      requiredPermission: { resource: 'settings', action: 'read' as const }
    },
  ];

  // Filter navigation items based on user permissions
  const visibleNavItems = navItems.filter(item => {
    if (item.customAccess) {
      return item.customAccess();
    }
    if (item.requiredPermission) {
      return hasPermission(user?.role || 'nurse', item.requiredPermission.resource, item.requiredPermission.action);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">MedSafe DDI</span>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-2">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <div className="flex items-center mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user?.role || 'nurse')}`}>
                    <Shield className="h-3 w-3 mr-1" />
                    {getRoleDisplayName(user?.role || 'nurse')}
                  </span>
                </div>
                {user?.department && (
                  <p className="text-xs text-gray-500 mt-1">{user.department}</p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Role-based feature notice */}
          {user?.role === 'nurse' && (
            <div className="px-4 py-3 mx-4 mb-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Note:</strong> You have read-only access. Contact an administrator for additional permissions.
              </p>
            </div>
          )}

          {/* Logout */}
          <div className="px-4 py-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;