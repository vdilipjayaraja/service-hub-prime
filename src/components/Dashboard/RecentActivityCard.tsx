
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

interface Activity {
  id: number;
  action: string;
  client: string;
  time: string;
  status: 'open' | 'resolved' | 'assigned' | 'updated';
}

const RecentActivityCard: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');

  const recentActivity: Activity[] = [
    { id: 1, action: 'New service request', client: 'ABC Corp', time: '2 minutes ago', status: 'open' },
    { id: 2, action: 'Device maintenance completed', client: 'XYZ Ltd', time: '15 minutes ago', status: 'resolved' },
    { id: 3, action: 'Asset assigned to technician', client: 'Internal', time: '1 hour ago', status: 'assigned' },
    { id: 4, action: 'Client profile updated', client: 'Tech Startup', time: '2 hours ago', status: 'updated' },
    { id: 5, action: 'Service request resolved', client: 'ABC Corp', time: '3 hours ago', status: 'resolved' },
    { id: 6, action: 'New device registered', client: 'XYZ Ltd', time: '4 hours ago', status: 'updated' },
  ];

  const filteredActivity = recentActivity.filter(activity => {
    const statusMatch = statusFilter === 'all' || activity.status === statusFilter;
    const timeMatch = timeFilter === 'all' || 
      (timeFilter === 'recent' && activity.time.includes('minutes')) ||
      (timeFilter === 'today' && (activity.time.includes('minutes') || activity.time.includes('hour')));
    
    return statusMatch && timeMatch;
  });

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <CardDescription className="text-sm">Latest updates from your IT management system</CardDescription>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="updated">Updated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="recent">Last Hour</SelectItem>
              <SelectItem value="today">Today</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 md:space-y-4">
          {filteredActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-0 mr-2">
                <p className="text-xs md:text-sm font-medium truncate">{activity.action}</p>
                <p className="text-xs text-gray-500 truncate">{activity.client} • {activity.time}</p>
              </div>
              <Badge 
                variant={activity.status === 'resolved' ? 'default' : 'secondary'}
                className="text-xs flex-shrink-0"
              >
                {activity.status}
              </Badge>
            </div>
          ))}
          {filteredActivity.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No activities match the selected filters
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
