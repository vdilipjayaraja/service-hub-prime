
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, UserCheck } from 'lucide-react';
import { ServiceRequest } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useTechnicians } from '../../hooks/useTechnicians';
import { useNotifications } from '../../hooks/useNotifications';
import ServiceRequestForm from './ServiceRequestForm';
import ServiceRequestDetail from './ServiceRequestDetail';
import AssignmentDialog from './AssignmentDialog';
import ServiceRequestFilters from './ServiceRequestFilters';
import ServiceRequestCard from './ServiceRequestCard';
import BulkSelectionBar from './BulkSelectionBar';
import EmptyState from './EmptyState';

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
  const { toast } = useToast();
  const { getTechnicianById } = useTechnicians();
  const { addAssignmentNotification } = useNotifications();
  const [requests, setRequests] = useState<ServiceRequest[]>(mockServiceRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [assignmentFilter, setAssignmentFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [viewingRequest, setViewingRequest] = useState<ServiceRequest | undefined>();
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);

  const canAssign = user?.role === 'admin';
  const canEdit = user?.role === 'admin' || user?.role === 'technician';

  // Separate active and resolved requests
  const activeRequests = requests.filter(request => request.status !== 'resolved');
  const resolvedRequests = requests.filter(request => request.status === 'resolved');

  const filterRequests = (requestList: ServiceRequest[]) => {
    return requestList.filter(request => {
      const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.clientName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
      
      // Assignment filter
      let matchesAssignment = true;
      if (assignmentFilter === 'unassigned') {
        matchesAssignment = !request.assignedTo;
      } else if (assignmentFilter === 'assigned') {
        matchesAssignment = !!request.assignedTo;
      } else if (assignmentFilter === 'my_assignments' && user?.role === 'technician') {
        matchesAssignment = request.assignedTo === user.id;
      }
      
      // Role-based filtering
      if (user?.role === 'client') {
        return matchesSearch && matchesStatus && matchesPriority && matchesAssignment && request.clientId === user.id;
      }
      if (user?.role === 'technician') {
        return matchesSearch && matchesStatus && matchesPriority && matchesAssignment && request.assignedTo === user.id;
      }
      
      return matchesSearch && matchesStatus && matchesPriority && matchesAssignment;
    });
  };

  const filteredActiveRequests = filterRequests(activeRequests);
  const filteredResolvedRequests = filterRequests(resolvedRequests);

  // Only allow selection of active requests (not resolved)
  const selectedRequestObjects = activeRequests.filter(req => selectedRequests.includes(req.id));

  const handleSelectRequest = (requestId: string, checked: boolean) => {
    const request = requests.find(r => r.id === requestId);
    // Prevent selection of resolved requests
    if (request?.status === 'resolved') return;
    
    if (checked) {
      setSelectedRequests(prev => [...prev, requestId]);
    } else {
      setSelectedRequests(prev => prev.filter(id => id !== requestId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Only select active requests, not resolved ones
      setSelectedRequests(filteredActiveRequests.map(req => req.id));
    } else {
      setSelectedRequests([]);
    }
  };

  const handleBulkAssign = (technicianId: string, requestIds: string[]) => {
    const technician = getTechnicianById(technicianId);
    if (!technician) return;

    setRequests(prev => prev.map(req => {
      if (requestIds.includes(req.id)) {
        const updatedRequest = {
          ...req,
          assignedTo: technicianId,
          technicianName: technician.name,
          status: 'assigned' as const,
          assignedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Add notification for assignment
        addAssignmentNotification(req.ticketId, technician.name);
        
        return updatedRequest;
      }
      return req;
    }));

    setSelectedRequests([]);
    toast({
      title: "Success",
      description: `${requestIds.length} request(s) assigned to ${technician.name}`
    });
  };

  const handleNewRequest = () => {
    setShowForm(true);
  };

  const handleSubmitRequest = (requestData: Omit<ServiceRequest, 'id' | 'ticketId' | 'createdAt' | 'updatedAt'>) => {
    const newRequest: ServiceRequest = {
      ...requestData,
      id: Date.now().toString(),
      ticketId: `TKT-2024-${String(requests.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setRequests(prev => [...prev, newRequest]);
    setShowForm(false);
  };

  const handleViewRequest = (request: ServiceRequest) => {
    setViewingRequest(request);
  };

  const handleUpdateRequest = (id: string, updates: Partial<ServiceRequest>) => {
    setRequests(prev => prev.map(r => 
      r.id === id ? { ...r, ...updates } : r
    ));
  };

  const getPageTitle = () => {
    switch (user?.role) {
      case 'client': return 'My Service Requests';
      case 'technician': return 'Assigned Requests';
      default: return 'Service Requests';
    }
  };

  if (showForm) {
    return (
      <ServiceRequestForm
        onSubmit={handleSubmitRequest}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  if (viewingRequest) {
    return (
      <ServiceRequestDetail
        request={viewingRequest}
        onBack={() => setViewingRequest(undefined)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
          <p className="text-gray-600">Track and manage service requests</p>
        </div>
        <div className="flex space-x-2">
          {(user?.role === 'client' || user?.role === 'admin') && (
            <Button onClick={handleNewRequest}>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          )}
        </div>
      </div>

      <ServiceRequestFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        assignmentFilter={assignmentFilter}
        onAssignmentFilterChange={setAssignmentFilter}
        user={user}
      />

      {/* Active Service Requests */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Active Service Requests</h2>
          {canAssign && filteredActiveRequests.length > 0 && (
            <span className="text-sm text-gray-600">
              {selectedRequests.length} of {filteredActiveRequests.length} selected
            </span>
          )}
        </div>

        {canAssign && filteredActiveRequests.length > 0 && (
          <BulkSelectionBar
            selectedCount={selectedRequests.length}
            totalCount={filteredActiveRequests.length}
            allSelected={selectedRequests.length === filteredActiveRequests.length}
            onSelectAll={handleSelectAll}
            onBulkAssign={() => setShowAssignmentDialog(true)}
          />
        )}

        {filteredActiveRequests.map((request) => (
          <ServiceRequestCard
            key={request.id}
            request={request}
            onView={handleViewRequest}
            canEdit={canEdit}
            canSelect={canAssign}
            isSelected={selectedRequests.includes(request.id)}
            onSelect={handleSelectRequest}
          />
        ))}

        {filteredActiveRequests.length === 0 && <EmptyState user={user} />}
      </div>

      {/* Resolved Service Requests */}
      {filteredResolvedRequests.length > 0 && (
        <div className="space-y-4">
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resolved Service Requests</h2>
            {filteredResolvedRequests.map((request) => (
              <ServiceRequestCard
                key={request.id}
                request={request}
                onView={handleViewRequest}
                canEdit={false}
                canSelect={false}
                isSelected={false}
                onSelect={() => {}}
              />
            ))}
          </div>
        </div>
      )}

      {showAssignmentDialog && (
        <AssignmentDialog
          isOpen={showAssignmentDialog}
          onClose={() => setShowAssignmentDialog(false)}
          selectedRequests={selectedRequestObjects}
          onAssign={handleBulkAssign}
        />
      )}
    </div>
  );
};

export default ServiceRequestList;
