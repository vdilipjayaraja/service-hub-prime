
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Settings, 
  Calendar, 
  Search,
  User,
  Folder,
  FileText,
  Monitor,
  Wrench
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: Home, roles: ['admin', 'technician', 'client'] },
  { title: 'Clients', href: '/clients', icon: Users, roles: ['admin', 'technician'] },
  { title: 'Devices', href: '/devices', icon: Monitor, roles: ['admin', 'technician'] },
  { title: 'Service Requests', href: '/service-requests', icon: FileText, roles: ['admin', 'technician', 'client'] },
  { title: 'Company Assets', href: '/assets', icon: Folder, roles: ['admin', 'technician'] },
  { title: 'Technicians', href: '/technicians', icon: Wrench, roles: ['admin'] },
  { title: 'My Requests', href: '/my-requests', icon: User, roles: ['client'] },
];

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <span className="text-lg font-semibold">IT Manager</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 pb-4 space-y-1">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.title}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
