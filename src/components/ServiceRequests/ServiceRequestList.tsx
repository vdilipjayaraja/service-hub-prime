
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Eye, Edit, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { ServiceRequest } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

// Mock data for demonstration
const mockServiceRequests: ServiceRequest[] = [
  {
    id: '1',
    ticketId: 'TKT-2024-001',
    clientId: '1',
    deviceId: '1',
    title: 'Computer won\'t start',
    description: 'Desktop computer in accounting department not powering on. Checked power cable and outlet.',
    status: 'open',
    priority: 'high',
    assignedTo: '2',
    submittedBy: '1',
    createdAt: '2024-06-14T09:00:00Z',
    updatedAt: '2024-06-14T09:00:00Z',
    clientName: 'ABC Corporation',
    technicianName: 'John Technician'
  },
  {
    id: '2',
    ticketId: 'TKT-2024-002',
    clientId: '2',
    title: 'Slow internet connection',
    description: 'Internet speed has been very slow for the past few days. Unable to load emails quickly.',
    status: 'in_progress',
    priority: 'medium',
    assignedTo: '2',
    submittedBy: '2',
    createdAt: '2024-06-13T14:30:00Z',
    updatedAt: '2024-06-14T10:15:00Z',
    clientName: 'Jane Doe',
    technicianName: 'John Technician'
  },
  {
    id: '3',
    ticketId: 'TKT-2024-003',
    clientId: '3',
    title: 'Printer not working',
    description: 'Office printer showing error message and not printing documents.',
    status: 'resolved',
    priority: 'low',
    assignedTo: '2',
    submittedBy: '3',
    createdAt: '2024-06-12T11:00:00Z',
    updatedAt: '2024-06-13T16:45:00Z',
    resolutionNotes: 'Replaced toner cartridge and cleaned paper feed mechanism.',
    clientName: 'Walk-in Customer #001',
    technicianName: 'John Technician'
  }
];

const ServiceRequestList: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>(mockServiceRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.clientName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    
    // Filter by user role
    if (user?.role === 'client') {
      return matchesSearch && matchesStatus && matchesPriority && request.clientId === user.id;
    }
    if (user?.role === 'technician') {
      return matchesSearch && matchesStatus && matchesPriority && request.assignedTo === user.id;
    }
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'open': return <AlertCircle className="h-4 w-4" />;
      case 'assigned': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'assigned': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: ServiceRequest['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPageTitle = () => {
    switch (user?.role) {
      case 'client': return 'My Service Requests';
      case 'technician': return 'Assigned Requests';
      default: return 'Service Requests';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
          <p className="text-gray-600">Track and manage service requests</p>
        </div>
        {(user?.role === 'client' || user?.role === 'admin') && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'open' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('open')}
                size="sm"
              >
                Open
              </Button>
              <Button
                variant={statusFilter === 'in_progress' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('in_progress')}
                size="sm"
              >
                In Progress
              </Button>
              <Button
                variant={statusFilter === 'resolved' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('resolved')}
                size="sm"
              >
                Resolved
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold">{request.title}</h3>
                    <Badge className={getStatusColor(request.status)}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status.replace('_', ' ')}</span>
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(request.priority)}>
                      {request.priority.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span><strong>Ticket:</strong> {request.ticketId}</span>
                    <span><strong>Client:</strong> {request.clientName}</span>
                    {request.technicianName && (
                      <span><strong>Technician:</strong> {request.technicianName}</span>
                    )}
                    <span><strong>Created:</strong> {new Date(request.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <p className="text-gray-700 mt-2">{request.description}</p>
                  
                  {request.resolutionNotes && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>Resolution:</strong> {request.resolutionNotes}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  {(user?.role === 'admin' || user?.role === 'technician') && (
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No service requests found</h3>
            <p className="text-gray-600">
              {user?.role === 'client' 
                ? "You haven't submitted any service requests yet."
                : "No requests match your current filters."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ServiceRequestList;
