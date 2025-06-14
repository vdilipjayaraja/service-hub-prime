import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Monitor, FileText, Folder, AlertCircle, CheckCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardStats } from '../../types';
import AdminStatsChart from './AdminStatsChart';

// Mock data for demonstration
const mockStats: DashboardStats = {
  totalClients: 45,
  activeDevices: 128,
  openTickets: 12,
  availableAssets: 23,
  pendingRequests: 5,
  resolvedToday: 8
};

// Mock trend data (percentage change)
const mockTrends = {
  totalClients: 6,     // up 6%
  activeDevices: -3,   // down 3%
  openTickets: -8,     // down 8%
  availableAssets: 5,  // up 5%
  pendingRequests: 0,  // no change
  resolvedToday: 15    // up 15%
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  // Simple date filter (use real date pickers in production)
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({
    start: "",
    end: ""
  });

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    return `${greeting}, ${user?.name}!`;
  };

  // StatCard with trend
  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    percentageChange: number;
    description?: string;
  }> = ({ title, value, icon: Icon, color, percentageChange, description }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="flex items-end space-x-3">
          <div className="text-2xl font-bold">{value}</div>
          <div className="flex items-center text-xs">
            {percentageChange > 0 && (
              <span className="flex items-center text-green-600"><ArrowUpRight className="h-3 w-3 mr-1" />+{percentageChange}%</span>
            )}
            {percentageChange < 0 && (
              <span className="flex items-center text-red-600"><ArrowDownRight className="h-3 w-3 mr-1" />{percentageChange}%</span>
            )}
            {percentageChange === 0 && (
              <span className="text-gray-400">0%</span>
            )}
          </div>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  const recentActivity = [
    { id: 1, action: 'New service request', client: 'ABC Corp', time: '2 minutes ago', status: 'open' },
    { id: 2, action: 'Device maintenance completed', client: 'XYZ Ltd', time: '15 minutes ago', status: 'resolved' },
    { id: 3, action: 'Asset assigned to technician', client: 'Internal', time: '1 hour ago', status: 'assigned' },
    { id: 4, action: 'Client profile updated', client: 'Tech Startup', time: '2 hours ago', status: 'updated' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{getWelcomeMessage()}</h1>
        <p className="text-gray-600">Here's what's happening with your IT management system today.</p>
      </div>

      {/* Date Filter */}
      <div className="flex flex-wrap items-center space-x-4 mb-2">
        <label>
          <span className="text-sm font-medium mr-1">Start:</span>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={dateRange.start}
            onChange={e => setDateRange(d => ({ ...d, start: e.target.value }))}
          />
        </label>
        <label>
          <span className="text-sm font-medium mx-1">End:</span>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={dateRange.end}
            onChange={e => setDateRange(d => ({ ...d, end: e.target.value }))}
          />
        </label>
        <span className="ml-4 text-gray-400 text-xs">(Filtering not functional in demo)</span>
      </div>

      {/* Enhanced Stats + Trends Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Clients"
          value={mockStats.totalClients}
          icon={Users}
          color="text-blue-600"
          percentageChange={mockTrends.totalClients}
          description="Active client accounts"
        />
        <StatCard
          title="Active Devices"
          value={mockStats.activeDevices}
          icon={Monitor}
          color="text-green-600"
          percentageChange={mockTrends.activeDevices}
          description="Devices under management"
        />
        <StatCard
          title="Open Tickets"
          value={mockStats.openTickets}
          icon={FileText}
          color="text-orange-600"
          percentageChange={mockTrends.openTickets}
          description="Requires attention"
        />
        <StatCard
          title="Available Assets"
          value={mockStats.availableAssets}
          icon={Folder}
          color="text-purple-600"
          percentageChange={mockTrends.availableAssets}
          description="Ready for assignment"
        />
        <StatCard
          title="Pending Requests"
          value={mockStats.pendingRequests}
          icon={AlertCircle}
          color="text-red-600"
          percentageChange={mockTrends.pendingRequests}
          description="Awaiting approval"
        />
        <StatCard
          title="Resolved Today"
          value={mockStats.resolvedToday}
          icon={CheckCircle}
          color="text-green-600"
          percentageChange={mockTrends.resolvedToday}
          description="Tickets completed"
        />
      </div>

      {/* Admin Trends & Stats Chart */}
      <div className="bg-white rounded-lg shadow px-4 py-6 mt-2">
        <AdminStatsChart />
      </div>

      {/* Recent Activity & Quick Actions */}
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
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900">Add New Client</h4>
                    <p className="text-sm text-blue-700">Register a new client or walk-in customer</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900">Review Asset Requests</h4>
                    <p className="text-sm text-green-700">Approve or reject pending asset requests</p>
                  </div>
                </>
              )}
              {user?.role === 'technician' && (
                <>
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-medium text-orange-900">View Assigned Tickets</h4>
                    <p className="text-sm text-orange-700">Check your current service requests</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-900">Request Asset</h4>
                    <p className="text-sm text-purple-700">Request company assets for your tasks</p>
                  </div>
                </>
              )}
              {user?.role === 'client' && (
                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <h4 className="font-medium text-indigo-900">Submit Service Request</h4>
                  <p className="text-sm text-indigo-700">Report an issue or request assistance</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
