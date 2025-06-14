
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { ServiceRequest } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface ServiceRequestDetailProps {
  request: ServiceRequest;
  onUpdate: (id: string, updates: Partial<ServiceRequest>) => void;
  onBack: () => void;
}

const ServiceRequestDetail: React.FC<ServiceRequestDetailProps> = ({ request, onUpdate, onBack }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [status, setStatus] = useState(request.status);
  const [resolutionNotes, setResolutionNotes] = useState(request.resolutionNotes || '');

  const canEdit = user?.role === 'admin' || user?.role === 'technician';

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
    onUpdate(request.id, {
      status,
      resolutionNotes,
      updatedAt: new Date().toISOString()
    });
    toast({
      title: "Success",
      description: "Service request updated successfully"
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
          </div>
        </div>
        {canEdit && (
          <Button onClick={handleUpdate}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        )}
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
              
              {canEdit && (
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
              
              {!canEdit && request.resolutionNotes && (
                <div>
                  <h4 className="font-semibold">Resolution</h4>
                  <div className="mt-1 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800">{request.resolutionNotes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status & Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Current Status</h4>
                {canEdit ? (
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

              {request.technicianName && (
                <div>
                  <h4 className="font-semibold">Assigned Technician</h4>
                  <p className="text-gray-700">{request.technicianName}</p>
                </div>
              )}

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
