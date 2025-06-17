import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Monitor, FileText, Folder, AlertCircle, CheckCircle, MapPin } from 'lucide-react';
import { PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useNavigate } from 'react-router-dom';
import { DashboardStats } from '../../types';

// Mock data for demonstration
const mockStats: DashboardStats = {
  totalClients: 45,
  activeDevices: 128,
  openTickets: 12,
  availableAssets: 23,
  pendingRequests: 5,
  resolvedToday: 8
};

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-3">
          <div className="hidden xl:flex items-center justify-center" style={{ minWidth: 56, minHeight: 56 }}>
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
          <div>
            <div className="text-2xl font-bold">{isLoading ? '...' : value}</div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
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

  const recentActivity = [
    { id: 1, action: 'New service request', client: 'ABC Corp', time: '2 minutes ago', status: 'open' },
    { id: 2, action: 'Device maintenance completed', client: 'XYZ Ltd', time: '15 minutes ago', status: 'resolved' },
    { id: 3, action: 'Asset assigned to technician', client: 'Internal', time: '1 hour ago', status: 'assigned' },
    { id: 4, action: 'Client profile updated', client: 'Tech Startup', time: '2 hours ago', status: 'updated' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{getWelcomeMessage()}</h1>
        <p className="text-gray-600">Here's what's happening with your IT management system today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your IT management system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.client} • {activity.time}</p>
                  </div>
                  <Badge 
                    variant={activity.status === 'resolved' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for your role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user?.role === 'admin' && (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start p-3 h-auto bg-blue-50 border-blue-200 hover:bg-blue-100"
                    onClick={() => handleQuickAction('add-client')}
                  >
                    <div className="text-left">
                      <h4 className="font-medium text-blue-900">Add New Client</h4>
                      <p className="text-sm text-blue-700">Register a new client or walk-in customer</p>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start p-3 h-auto bg-green-50 border-green-200 hover:bg-green-100"
                    onClick={() => handleQuickAction('review-assets')}
                  >
                    <div className="text-left">
                      <h4 className="font-medium text-green-900">Review Asset Requests</h4>
                      <p className="text-sm text-green-700">Approve or reject pending asset requests</p>
                    </div>
                  </Button>
                </>
              )}
              {user?.role === 'technician' && (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start p-3 h-auto bg-orange-50 border-orange-200 hover:bg-orange-100"
                    onClick={() => handleQuickAction('view-tickets')}
                  >
                    <div className="text-left">
                      <h4 className="font-medium text-orange-900">View Assigned Tickets</h4>
                      <p className="text-sm text-orange-700">Check your current service requests</p>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start p-3 h-auto bg-purple-50 border-purple-200 hover:bg-purple-100"
                    onClick={() => handleQuickAction('request-asset')}
                  >
                    <div className="text-left">
                      <h4 className="font-medium text-purple-900">Request Asset</h4>
                      <p className="text-sm text-purple-700">Request company assets for your tasks</p>
                    </div>
                  </Button>
                </>
              )}
              {user?.role === 'client' && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start p-3 h-auto bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
                  onClick={() => handleQuickAction('submit-request')}
                >
                  <div className="text-left">
                    <h4 className="font-medium text-indigo-900">Submit Service Request</h4>
                    <p className="text-sm text-indigo-700">Report an issue or request assistance</p>
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
