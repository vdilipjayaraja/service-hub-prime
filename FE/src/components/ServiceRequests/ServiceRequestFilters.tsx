
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { User } from '../../types';

interface ServiceRequestFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  assignmentFilter: string;
  onAssignmentFilterChange: (value: string) => void;
  user: User | null;
}

const ServiceRequestFilters: React.FC<ServiceRequestFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  assignmentFilter,
  onAssignmentFilterChange,
  user
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => onStatusFilterChange('all')}
              size="sm"
            >
              All Status
            </Button>
            <Button
              variant={statusFilter === 'open' ? 'default' : 'outline'}
              onClick={() => onStatusFilterChange('open')}
              size="sm"
            >
              Open
            </Button>
            <Button
              variant={statusFilter === 'assigned' ? 'default' : 'outline'}
              onClick={() => onStatusFilterChange('assigned')}
              size="sm"
            >
              Assigned
            </Button>
            <Button
              variant={statusFilter === 'in_progress' ? 'default' : 'outline'}
              onClick={() => onStatusFilterChange('in_progress')}
              size="sm"
            >
              In Progress
            </Button>
            <Button
              variant={statusFilter === 'resolved' ? 'default' : 'outline'}
              onClick={() => onStatusFilterChange('resolved')}
              size="sm"
            >
              Resolved
            </Button>
            
            {/* Assignment Filters */}
            <Button
              variant={assignmentFilter === 'unassigned' ? 'default' : 'outline'}
              onClick={() => onAssignmentFilterChange('unassigned')}
              size="sm"
            >
              Unassigned
            </Button>
            <Button
              variant={assignmentFilter === 'assigned' ? 'default' : 'outline'}
              onClick={() => onAssignmentFilterChange('assigned')}
              size="sm"
            >
              Assigned
            </Button>
            {user?.role === 'technician' && (
              <Button
                variant={assignmentFilter === 'my_assignments' ? 'default' : 'outline'}
                onClick={() => onAssignmentFilterChange('my_assignments')}
                size="sm"
              >
                My Assignments
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceRequestFilters;
