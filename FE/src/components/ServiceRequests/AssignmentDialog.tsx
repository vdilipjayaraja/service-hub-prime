
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useTechnicians } from '../../hooks/useTechnicians';
import { ServiceRequest } from '../../types';
import { useToast } from '@/components/ui/use-toast';

interface AssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRequests: ServiceRequest[];
  onAssign: (technicianId: string, requestIds: string[]) => void;
}

const AssignmentDialog: React.FC<AssignmentDialogProps> = ({
  isOpen,
  onClose,
  selectedRequests,
  onAssign
}) => {
  const { getAvailableTechnicians } = useTechnicians();
  const { toast } = useToast();
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>('');

  const availableTechnicians = getAvailableTechnicians();

  const handleAssign = () => {
    if (!selectedTechnicianId) {
      toast({
        title: "Error",
        description: "Please select a technician",
        variant: "destructive"
      });
      return;
    }

    const requestIds = selectedRequests.map(req => req.id);
    onAssign(selectedTechnicianId, requestIds);
    onClose();
    setSelectedTechnicianId('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Service Requests</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Selected Requests ({selectedRequests.length})</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {selectedRequests.map(request => (
                <div key={request.id} className="p-2 bg-gray-50 rounded text-sm">
                  <div className="font-medium">{request.title}</div>
                  <div className="text-gray-600">{request.ticketId}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Assign to Technician</h4>
            <Select value={selectedTechnicianId} onValueChange={setSelectedTechnicianId}>
              <SelectTrigger>
                <SelectValue placeholder="Select technician" />
              </SelectTrigger>
              <SelectContent>
                {availableTechnicians.map(tech => (
                  <SelectItem key={tech.id} value={tech.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{tech.name}</span>
                      <Badge variant="outline" className="ml-2">
                        {tech.activeRequests} active
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={!selectedTechnicianId}>
              Assign Requests
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentDialog;
