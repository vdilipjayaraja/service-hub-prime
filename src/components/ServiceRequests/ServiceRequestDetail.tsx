import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Clock, AlertCircle, CheckCircle, XCircle, UserCheck, FileText } from 'lucide-react';
import { ServiceRequest } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useTechnicians } from '../../hooks/useTechnicians';
import { useServiceRequests } from '../../hooks/useServiceRequests';

interface ServiceRequestDetailProps {
  request: ServiceRequest;
  onBack: () => void;
}

const UNASSIGNED = "unassigned";

const ServiceRequestDetail: React.FC<ServiceRequestDetailProps> = ({ request, onBack }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { getAvailableTechnicians, getTechnicianById } = useTechnicians();
  const { updateServiceRequest } = useServiceRequests();

  // Use UNASSIGNED constant if assignedTo is not present
  const [assignedTo, setAssignedTo] = useState(
    request.assignedTo && request.assignedTo !== "" ? request.assignedTo : UNASSIGNED
  );
  const [status, setStatus] = useState(request.status);
  const [resolutionNotes, setResolutionNotes] = useState(request.resolutionNotes || '');

  const canEdit = user?.role === 'admin' || user?.role === 'technician';
  // Prevent assignment/reassignment for resolved tickets
  const canAssign = (user?.role === 'admin') && status !== 'resolved' && request.status !== 'resolved';
  const availableTechnicians = getAvailableTechnicians();
  // Only get assigned technician if not UNASSIGNED
  const assignedTechnician = assignedTo !== UNASSIGNED ? getTechnicianById(assignedTo) : null;

  const isResolved = request.status === 'resolved';

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

  const handleUpdate = () => {
    // Prevent updates that would change assignment for resolved tickets
    if (isResolved && assignedTo !== (request.assignedTo && request.assignedTo !== "" ? request.assignedTo : UNASSIGNED)) {
      toast({
        title: "Error",
        description: "Cannot change assignment for resolved tickets",
        variant: "destructive"
      });
      return;
    }

    // Whenever assignedTo is UNASSIGNED, store as undefined/null in update
    const isAssigned = assignedTo !== UNASSIGNED;
    const updates: Partial<ServiceRequest> = {
      status,
      resolutionNotes,
      updatedAt: new Date().toISOString(),
      assignedTo: isAssigned ? assignedTo : undefined,
    };

    // If assignment changed and not resolved, add assignment timestamp
    if (!isResolved && assignedTo !== (request.assignedTo && request.assignedTo !== "" ? request.assignedTo : UNASSIGNED)) {
      if (isAssigned) {
        updates.assignedAt = new Date().toISOString();
        if (status === 'open') {
          updates.status = 'assigned';
          setStatus('assigned');
        }
      } else {
        updates.assignedAt = undefined;
      }
    }

    updateServiceRequest({ id: request.id, updates });
    toast({
      title: "Success",
      description: "Service request updated successfully"
    });
  };

  const handleAssign = () => {
    if (assignedTo === UNASSIGNED || isResolved) return;

    const updates: Partial<ServiceRequest> = {
      assignedTo,
      status: 'assigned',
      assignedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    updateServiceRequest({ id: request.id, updates });
    setStatus('assigned');
    toast({
      title: "Success",
      description: "Request assigned successfully"
    });
  };

  // PDF download handler for resolved tickets
  const handleDownloadPdf = () => {
    import("../../utils/serviceRequestPdf").then(({ generateServiceRequestPdf }) => {
      generateServiceRequestPdf({ ...request, resolutionNotes });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{request.title}</h1>
            <p className="text-gray-600">Ticket: {request.ticketId}</p>
            {isResolved && (
              <Badge className="mt-1 bg-green-100 text-green-800">
                <CheckCircle className="mr-1 h-3 w-3" />
                Resolved - No reassignment allowed
              </Badge>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          {/* Hide Assign button for resolved tickets */}
          {canAssign && assignedTo === UNASSIGNED && !isResolved && (
            <Button onClick={handleAssign} disabled={assignedTo === UNASSIGNED}>
              <UserCheck className="mr-2 h-4 w-4" />
              Assign
            </Button>
          )}
          {canEdit && (
            <Button onClick={handleUpdate}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          )}
          {/* Show Download PDF button if resolved */}
          {status === 'resolved' && (
            <Button variant="outline" onClick={handleDownloadPdf}>
              <FileText className="mr-2 h-4 w-4" />
              Download PDF Report
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold">Description</h4>
                <p className="text-gray-700 mt-1">{request.description}</p>
              </div>
              
              {canEdit && !isResolved && (
                <div>
                  <h4 className="font-semibold mb-2">Resolution Notes</h4>
                  <Textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Add resolution notes..."
                    rows={4}
                  />
                </div>
              )}
              
              {(isResolved || request.resolutionNotes) && (
                <div>
                  <h4 className="font-semibold">Resolution</h4>
                  <div className="mt-1 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800">{request.resolutionNotes || resolutionNotes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status & Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Current Status</h4>
                {canEdit && !isResolved ? (
                  <Select value={status} onValueChange={(value: ServiceRequest['status']) => setStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge className={getStatusColor(request.status)}>
                    {getStatusIcon(request.status)}
                    <span className="ml-1 capitalize">{request.status.replace('_', ' ')}</span>
                  </Badge>
                )}
              </div>

              {/* Hide assignment controls for resolved tickets */}
              {canAssign && !isResolved && (
                <div>
                  <h4 className="font-semibold mb-2">Assign Technician</h4>
                  <Select value={assignedTo} onValueChange={setAssignedTo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select technician" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                      {availableTechnicians.map(tech => (
                        <SelectItem key={tech.id} value={tech.id}>
                          {tech.name} ({tech.activeRequests} active)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {assignedTechnician && (
                <div>
                  <h4 className="font-semibold">Assigned Technician</h4>
                  <div className="mt-1 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="font-medium text-blue-900">{assignedTechnician.name}</p>
                    <p className="text-sm text-blue-700">{assignedTechnician.email}</p>
                    <Badge variant="outline" className="mt-1">
                      {assignedTechnician.activeRequests} active requests
                    </Badge>
                  </div>
                  {request.assignedAt && (
                    <p className="text-sm text-gray-600 mt-2">
                      Assigned: {new Date(request.assignedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}

              <div>
                <h4 className="font-semibold">Priority</h4>
                <Badge variant="outline" className="mt-1">
                  {request.priority.toUpperCase()}
                </Badge>
              </div>

              <div>
                <h4 className="font-semibold">Client</h4>
                <p className="text-gray-700">{request.clientName}</p>
              </div>

              <div>
                <h4 className="font-semibold">Created</h4>
                <p className="text-gray-700">{new Date(request.createdAt).toLocaleDateString()}</p>
              </div>

              <div>
                <h4 className="font-semibold">Last Updated</h4>
                <p className="text-gray-700">{new Date(request.updatedAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestDetail;
