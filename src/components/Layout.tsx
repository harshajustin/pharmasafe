import React, { ReactNode, useState } from 'react';
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
  AlertTriangle,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-3 flex items-center">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="ml-2 text-lg font-bold text-gray-900">MedSafe DDI</span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="bg-blue-100 rounded-full p-1.5">
            <User className="h-4 w-4 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeSidebar}></div>
          <div className="relative flex flex-col w-64 bg-white shadow-xl">
            {/* Mobile Sidebar Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-blue-600" />
                <span className="ml-2 text-lg font-bold text-gray-900">MedSafe DDI</span>
              </div>
              <button
                onClick={closeSidebar}
                className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile User Info */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-2">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user?.role || 'nurse')}`}>
                      <Shield className="h-3 w-3 mr-1" />
                      {getRoleDisplayName(user?.role || 'nurse')}
                    </span>
                  </div>
                  {user?.department && (
                    <p className="text-xs text-gray-500 mt-1 truncate">{user.department}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeSidebar}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Role Notice */}
            {user?.role === 'nurse' && (
              <div className="px-2 py-3 mx-2 mb-2 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700">
                  <strong>Note:</strong> You have read-only access. Contact an administrator for additional permissions.
                </p>
              </div>
            )}

            {/* Mobile Logout */}
            <div className="px-2 py-3 border-t border-gray-200">
              <button
                onClick={() => {
                  handleLogout();
                  closeSidebar();
                }}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-64 lg:bg-white lg:shadow-lg lg:flex lg:flex-col">
        {/* Desktop Logo */}
        <div className="flex items-center px-6 py-4 border-b border-gray-200">
          <Shield className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">MedSafe DDI</span>
        </div>

        {/* Desktop User Info */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-2">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
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

        {/* Desktop Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
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

        {/* Desktop Role Notice */}
        {user?.role === 'nurse' && (
          <div className="px-4 py-3 mx-4 mb-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>Note:</strong> You have read-only access. Contact an administrator for additional permissions.
            </p>
          </div>
        )}

        {/* Desktop Logout */}
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

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;