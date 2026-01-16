
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Settings, LogOut, ArrowLeft, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import NotificationDropdown from '../Notifications/NotificationDropdown';
import ThemeToggle from '../Theme/ThemeToggle';
import { useIsMobile } from '../../hooks/use-mobile';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  // Don't show back button on dashboard (home page)
  const showBackButton = location.pathname !== '/dashboard';

  return (
    <header className="bg-background border-b border-border px-3 md:px-6 py-3 md:py-4 flex items-center justify-between">
      <div className="flex items-center space-x-2 md:space-x-4 min-w-0">
        {isMobile && (
          <Button variant="ghost" size="sm" onClick={onMenuClick}>
            <Menu className="h-4 w-4" />
          </Button>
        )}
        {showBackButton && !isMobile && (
          <Button variant="ghost" size="sm" onClick={handleBackClick}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-lg md:text-2xl font-bold text-foreground truncate">
            TechSolutions IT
          </h1>
        </div>
        <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
          {user?.role?.toUpperCase()}
        </Badge>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-4">
        {!isMobile && <NotificationDropdown />}
        {!isMobile && <ThemeToggle />}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="text-xs">
                  {user?.name?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
                <Badge variant="secondary" className="text-xs w-fit sm:hidden mt-1">
                  {user?.role?.toUpperCase()}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isMobile && (
              <>
                <DropdownMenuItem>
                  <NotificationDropdown />
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ThemeToggle />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={handleProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
