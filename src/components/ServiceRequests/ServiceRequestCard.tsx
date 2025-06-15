
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, Edit, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { ServiceRequest } from '../../types';

interface ServiceRequestCardProps {
  request: ServiceRequest;
  onView: (request: ServiceRequest) => void;
  canEdit: boolean;
  canSelect: boolean;
  isSelected: boolean;
  onSelect?: (requestId: string, checked: boolean) => void;
}

const ServiceRequestCard: React.FC<ServiceRequestCardProps> = ({
  request,
  onView,
  canEdit,
  canSelect,
  isSelected,
  onSelect
}) => {
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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            {canSelect && onSelect && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => onSelect(request.id, !!checked)}
                className="mt-1"
              />
            )}
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
                {request.assignedAt && (
                  <span><strong>Assigned:</strong> {new Date(request.assignedAt).toLocaleDateString()}</span>
                )}
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
          </div>
          
          <div className="flex space-x-2 ml-4">
            <Button variant="ghost" size="sm" onClick={() => onView(request)} title="Report Preview">
              <Eye className="h-4 w-4" />
            </Button>
            {canEdit && (
              <Button variant="ghost" size="sm" onClick={() => onView(request)} title="Edit Request">
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceRequestCard;
