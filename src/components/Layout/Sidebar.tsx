
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
  Wrench,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { useIsMobile } from '../../hooks/use-mobile';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

interface SidebarProps {
  onClose?: () => void;
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: Home, roles: ['admin', 'technician', 'client'] },
  { title: 'Clients', href: '/clients', icon: Users, roles: ['admin'] },
  { title: 'Devices', href: '/devices', icon: Monitor, roles: ['admin', 'technician', 'client'] },
  { title: 'Service Requests', href: '/service-requests', icon: FileText, roles: ['admin', 'technician'] },
  { title: 'Company Assets', href: '/assets', icon: Folder, roles: ['admin', 'technician'] },
  { title: 'Technicians', href: '/technicians', icon: Wrench, roles: ['admin'] },
  { title: 'My Requests', href: '/my-requests', icon: User, roles: ['client'] },
];

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <div className={`${isMobile ? 'w-72' : 'w-64'} bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border h-full`}>
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">IT Manager</span>
          </div>
          {isMobile && (
            <button 
              onClick={onClose}
              className="p-2 hover:bg-sidebar-accent rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      
      <nav className="flex-1 px-3 md:px-4 pb-4 space-y-1">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={isMobile ? onClose : undefined}
            className={({ isActive }) =>
              cn(
                'flex items-center px-3 md:px-4 py-3 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            <span className="truncate">{item.title}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.name}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
