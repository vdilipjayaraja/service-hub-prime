
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Monitor, FileText, Folder, AlertCircle, CheckCircle, MapPin } from 'lucide-react';
import { PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useNavigate } from 'react-router-dom';
import { DashboardStats } from '../../models/DashboardStats';
import { useIsMobile } from '../../hooks/use-mobile';
import RecentActivityCard from './RecentActivityCard';

const PIE_COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e42", // orange
  "#a78bfa", // purple
  "#ef4444", // red
  "#22c55e", // green
];

const getPieData = (title: string, value: number) => {
  // Mock: Render as completed vs. rest for demonstration
  let total = value;
  let available = Math.max(1, Math.round(value * 0.75));
  return [
    { name: "Stat", value: value },
    { name: "Other", value: available }
  ];
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { stats, isLoading } = useDashboardStats();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    return `${greeting}, ${user?.name}!`;
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    description?: string;
    pieColor: string;
  }> = ({ title, value, icon: Icon, color, description, pieColor }) => (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium truncate">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color} flex-shrink-0`} />
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 sm:space-x-3">
          {!isMobile && (
            <div className="hidden sm:flex items-center justify-center" style={{ minWidth: 56, minHeight: 56 }}>
              <PieChart width={56} height={56}>
                <Pie
                  data={getPieData(title, value)}
                  dataKey="value"
                  innerRadius={20}
                  outerRadius={28}
                  stroke="none"
                  paddingAngle={2}
                  startAngle={90}
                  endAngle={-270}
                  cx={28}
                  cy={28}
                >
                  <Cell key="cell-0" fill={pieColor} />
                  <Cell key="cell-1" fill="#e5e7eb" />
                </Pie>
              </PieChart>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-xl sm:text-2xl font-bold">{isLoading ? '...' : value}</div>
            {description && (
              <p className="text-xs text-muted-foreground truncate">{description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-client':
        navigate('/clients');
        break;
      case 'review-assets':
        navigate('/assets');
        break;
      case 'view-tickets':
        navigate('/service-requests');
        break;
      case 'request-asset':
        navigate('/assets');
        break;
      case 'submit-request':
        navigate('/my-requests');
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{getWelcomeMessage()}</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">Here's what's happening with your IT management system today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {user?.role === 'client' ? (
          <StatCard
            title="No of Locations"
            value={stats.totalClients}
            icon={MapPin}
            color="text-blue-600"
            pieColor={PIE_COLORS[0]}
            description="Managed locations"
          />
        ) : (
          <StatCard
            title="Total Clients"
            value={stats.totalClients}
            icon={Users}
            color="text-blue-600"
            pieColor={PIE_COLORS[0]}
            description="Active client accounts"
          />
        )}
        <StatCard
          title="Active Devices"
          value={stats.activeDevices}
          icon={Monitor}
          color="text-green-600"
          pieColor={PIE_COLORS[1]}
          description="Devices under management"
        />
        <StatCard
          title="Open Tickets"
          value={stats.openTickets}
          icon={FileText}
          color="text-orange-600"
          pieColor={PIE_COLORS[2]}
          description="Requires attention"
        />
        <StatCard
          title="Available Assets"
          value={stats.availableAssets}
          icon={Folder}
          color="text-purple-600"
          pieColor={PIE_COLORS[3]}
          description="Ready for assignment"
        />
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon={AlertCircle}
          color="text-red-600"
          pieColor={PIE_COLORS[4]}
          description="Awaiting approval"
        />
        <StatCard
          title="Resolved Today"
          value={stats.resolvedToday}
          icon={CheckCircle}
          color="text-green-600"
          pieColor={PIE_COLORS[5]}
          description="Tickets completed"
        />
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <RecentActivityCard />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription className="text-sm">Common tasks for your role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 md:space-y-3">
              {user?.role === 'admin' && (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start p-2 md:p-3 h-auto bg-blue-50 border-blue-200 hover:bg-blue-100"
                    onClick={() => handleQuickAction('add-client')}
                  >
                    <div className="text-left">
                      <h4 className="font-medium text-blue-900 text-sm">Add New Client</h4>
                      <p className="text-xs text-blue-700">Register a new client or walk-in customer</p>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start p-2 md:p-3 h-auto bg-green-50 border-green-200 hover:bg-green-100"
                    onClick={() => handleQuickAction('review-assets')}
                  >
                    <div className="text-left">
                      <h4 className="font-medium text-green-900 text-sm">Review Asset Requests</h4>
                      <p className="text-xs text-green-700">Approve or reject pending asset requests</p>
                    </div>
                  </Button>
                </>
              )}
              {user?.role === 'technician' && (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start p-2 md:p-3 h-auto bg-orange-50 border-orange-200 hover:bg-orange-100"
                    onClick={() => handleQuickAction('view-tickets')}
                  >
                    <div className="text-left">
                      <h4 className="font-medium text-orange-900 text-sm">View Assigned Tickets</h4>
                      <p className="text-xs text-orange-700">Check your current service requests</p>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start p-2 md:p-3 h-auto bg-purple-50 border-purple-200 hover:bg-purple-100"
                    onClick={() => handleQuickAction('request-asset')}
                  >
                    <div className="text-left">
                      <h4 className="font-medium text-purple-900 text-sm">Request Asset</h4>
                      <p className="text-xs text-purple-700">Request company assets for your tasks</p>
                    </div>
                  </Button>
                </>
              )}
              {user?.role === 'client' && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start p-2 md:p-3 h-auto bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
                  onClick={() => handleQuickAction('submit-request')}
                >
                  <div className="text-left">
                    <h4 className="font-medium text-indigo-900 text-sm">Submit Service Request</h4>
                    <p className="text-xs text-indigo-700">Report an issue or request assistance</p>
                  </div>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
