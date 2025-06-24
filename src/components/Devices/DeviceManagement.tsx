
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Monitor, Laptop, Smartphone, Plus, Search, Edit, Trash2, ChevronDown, ChevronRight, Server, Printer } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

interface Device {
  id: string;
  client_id: string;
  device_code: string;
  device_type: 'PC' | 'Server' | 'Network' | 'CCTV' | 'Printer' | 'Other';
  manufacturer?: string;
  model?: string;
  serial_number?: string;
  purchase_date?: string;
  warranty_expiry?: string;
  status: 'active' | 'in_repair' | 'retired' | 'maintenance';
  location?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

const DeviceManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [expandedLocations, setExpandedLocations] = useState<Set<string>>(new Set());
  const [editDevice, setEditDevice] = useState<Device | null>(null);
  const [newDevice, setNewDevice] = useState({
    device_type: '',
    manufacturer: '',
    model: '',
    serial_number: '',
    location: '',
    notes: '',
    client_id: ''
  });

  const queryClient = useQueryClient();

  // Fetch devices
  const { data: devices = [], isLoading, error } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      try {
        const response = await apiService.getDevices();
        return response;
      } catch (error) {
        console.error('Error fetching devices:', error);
        throw error;
      }
    }
  });

  // Fetch clients for the dropdown
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      try {
        const response = await apiService.getClients();
        return response;
      } catch (error) {
        console.error('Error fetching clients:', error);
        return [];
      }
    }
  });

  // Create device mutation
  const createDeviceMutation = useMutation({
    mutationFn: async (deviceData: any) => {
      const deviceCode = generateDeviceCode(deviceData.location, deviceData.device_type);
      return apiService.createDevice({
        ...deviceData,
        device_code: deviceCode,
        status: 'active'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      setIsAddDialogOpen(false);
      setNewDevice({
        device_type: '',
        manufacturer: '',
        model: '',
        serial_number: '',
        location: '',
        notes: '',
        client_id: ''
      });
      toast({
        title: "Success",
        description: "Device added successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating device:', error);
      toast({
        title: "Error",
        description: "Failed to add device",
        variant: "destructive",
      });
    }
  });

  // Update device mutation
  const updateDeviceMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      return apiService.updateDevice(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      setIsEditDialogOpen(false);
      setEditDevice(null);
      toast({
        title: "Success",
        description: "Device updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating device:', error);
      toast({
        title: "Error",
        description: "Failed to update device",
        variant: "destructive",
      });
    }
  });

  const locationCodes: { [key: string]: string } = {
    'Office A-101': 'KH',
    'Remote': 'RM',
    'Server Room': 'SR',
    'Office B-201': 'KB'
  };

  const deviceTypeCodes: { [key: string]: string } = {
    'PC': 'DES',
    'Server': 'SRV',
    'Network': 'NET',
    'CCTV': 'CTV',
    'Printer': 'PRT',
    'Other': 'OTH'
  };

  const generateDeviceCode = (location: string, type: string) => {
    const locationCode = locationCodes[location] || 'XX';
    const typeCode = deviceTypeCodes[type] || 'XXX';
    const existingDevices = devices.filter((d: Device) => d.location === location && d.device_type === type);
    const sequence = String(existingDevices.length + 1).padStart(2, '0');
    return `${locationCode}${sequence}${typeCode}`;
  };

  const getStatusBadgeColor = (status: Device['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'in_repair': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      case 'retired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeviceIcon = (type: Device['device_type']) => {
    switch (type) {
      case 'PC': return <Monitor className="w-4 h-4" />;
      case 'Server': return <Server className="w-4 h-4" />;
      case 'Network': return <Monitor className="w-4 h-4" />;
      case 'CCTV': return <Smartphone className="w-4 h-4" />;
      case 'Printer': return <Printer className="w-4 h-4" />;
      case 'Other': return <Monitor className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const filteredDevices = devices.filter((device: Device) =>
    device.device_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (device.location && device.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (device.serial_number && device.serial_number.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const devicesByLocation = filteredDevices.reduce((acc: Record<string, Device[]>, device: Device) => {
    const location = device.location || 'Unknown Location';
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(device);
    return acc;
  }, {});

  const toggleLocation = (location: string) => {
    const newExpanded = new Set(expandedLocations);
    if (newExpanded.has(location)) {
      newExpanded.delete(location);
    } else {
      newExpanded.add(location);
    }
    setExpandedLocations(newExpanded);
  };

  const handleAddDevice = () => {
    if (newDevice.device_type && newDevice.location && newDevice.client_id) {
      createDeviceMutation.mutate(newDevice);
    } else {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
    }
  };

  const handleEditDevice = () => {
    if (editDevice) {
      const { id, created_at, updated_at, ...updates } = editDevice;
      updateDeviceMutation.mutate({ id, ...updates });
    }
  };

  const openEditDialog = (device: Device) => {
    setEditDevice({ ...device });
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading devices...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading devices. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Device Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Device
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Device</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-select">Client</Label>
                <Select value={newDevice.client_id} onValueChange={(value) => setNewDevice({ ...newDevice, client_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client: any) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="device-type">Device Type</Label>
                <Select value={newDevice.device_type} onValueChange={(value) => setNewDevice({ ...newDevice, device_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select device type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PC">PC</SelectItem>
                    <SelectItem value="Server">Server</SelectItem>
                    <SelectItem value="Network">Network</SelectItem>
                    <SelectItem value="CCTV">CCTV</SelectItem>
                    <SelectItem value="Printer">Printer</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input 
                  id="manufacturer" 
                  placeholder="Device manufacturer" 
                  value={newDevice.manufacturer}
                  onChange={(e) => setNewDevice({ ...newDevice, manufacturer: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input 
                  id="model" 
                  placeholder="Device model" 
                  value={newDevice.model}
                  onChange={(e) => setNewDevice({ ...newDevice, model: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={newDevice.location} onValueChange={(value) => setNewDevice({ ...newDevice, location: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Office A-101">Office A-101</SelectItem>
                    <SelectItem value="Office B-201">Office B-201</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Server Room">Server Room</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="serial-number">Serial Number</Label>
                <Input 
                  id="serial-number" 
                  placeholder="Device serial number" 
                  value={newDevice.serial_number}
                  onChange={(e) => setNewDevice({ ...newDevice, serial_number: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Additional notes" 
                  value={newDevice.notes}
                  onChange={(e) => setNewDevice({ ...newDevice, notes: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddDevice} disabled={createDeviceMutation.isPending}>
                  {createDeviceMutation.isPending ? 'Adding...' : 'Add Device'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Device</DialogTitle>
          </DialogHeader>
          {editDevice && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-device-code">Device Code</Label>
                <Input 
                  id="edit-device-code" 
                  value={editDevice.device_code}
                  onChange={(e) => setEditDevice({ ...editDevice, device_code: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-device-type">Device Type</Label>
                <Select value={editDevice.device_type} onValueChange={(value) => setEditDevice({ ...editDevice, device_type: value as Device['device_type'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PC">PC</SelectItem>
                    <SelectItem value="Server">Server</SelectItem>
                    <SelectItem value="Network">Network</SelectItem>
                    <SelectItem value="CCTV">CCTV</SelectItem>
                    <SelectItem value="Printer">Printer</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={editDevice.status} onValueChange={(value) => setEditDevice({ ...editDevice, status: value as Device['status'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="in_repair">In Repair</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-manufacturer">Manufacturer</Label>
                <Input 
                  id="edit-manufacturer" 
                  value={editDevice.manufacturer || ''}
                  onChange={(e) => setEditDevice({ ...editDevice, manufacturer: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-model">Model</Label>
                <Input 
                  id="edit-model" 
                  value={editDevice.model || ''}
                  onChange={(e) => setEditDevice({ ...editDevice, model: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Select value={editDevice.location || ''} onValueChange={(value) => setEditDevice({ ...editDevice, location: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Office A-101">Office A-101</SelectItem>
                    <SelectItem value="Office B-201">Office B-201</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Server Room">Server Room</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-serial-number">Serial Number</Label>
                <Input 
                  id="edit-serial-number" 
                  value={editDevice.serial_number || ''}
                  onChange={(e) => setEditDevice({ ...editDevice, serial_number: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea 
                  id="edit-notes" 
                  value={editDevice.notes || ''}
                  onChange={(e) => setEditDevice({ ...editDevice, notes: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditDevice} disabled={updateDeviceMutation.isPending}>
                  {updateDeviceMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Device Overview</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {Object.keys(devicesByLocation).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No devices found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(devicesByLocation).map(([location, locationDevices]) => (
                  <React.Fragment key={location}>
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={6}>
                        <Collapsible>
                          <CollapsibleTrigger 
                            className="flex items-center space-x-2 w-full text-left"
                            onClick={() => toggleLocation(location)}
                          >
                            {expandedLocations.has(location) ? 
                              <ChevronDown className="w-4 h-4" /> : 
                              <ChevronRight className="w-4 h-4" />
                            }
                            <span className="font-medium">{location} ({locationDevices.length} devices)</span>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            {expandedLocations.has(location) && locationDevices.map((device: Device) => (
                              <div key={device.id} className="ml-6 py-2 border-b last:border-b-0">
                                <div className="grid grid-cols-6 gap-4 items-center">
                                  <div className="flex items-center space-x-2">
                                    {getDeviceIcon(device.device_type)}
                                    <div>
                                      <p className="font-medium">{device.device_code}</p>
                                      <p className="text-sm text-gray-500">{device.serial_number}</p>
                                    </div>
                                  </div>
                                  <div>{device.device_type}</div>
                                  <div>
                                    <Badge className={getStatusBadgeColor(device.status)}>
                                      {device.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </Badge>
                                  </div>
                                  <div>{device.location}</div>
                                  <div>{device.manufacturer || 'N/A'}</div>
                                  <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(device)}>
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceManagement;
