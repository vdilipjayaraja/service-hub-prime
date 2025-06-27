
import React, { useState } from 'react';
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
import { Monitor, Laptop, Smartphone, Plus, Search, Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: 'Desktop' | 'Laptop' | 'Mobile' | 'Server' | 'Printer';
  status: 'Active' | 'Inactive' | 'Maintenance' | 'Retired';
  location: string;
  lastSeen: string;
  serialNumber: string;
  notes: string;
}

const DeviceManagement: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      name: 'KH01DES',
      type: 'Desktop',
      status: 'Active',
      location: 'Office A-101',
      lastSeen: '2024-01-15 09:30',
      serialNumber: 'DT001234',
      notes: 'Primary workstation'
    },
    {
      id: '2',
      name: 'RM01LAP',
      type: 'Laptop',
      status: 'Active',
      location: 'Remote',
      lastSeen: '2024-01-15 14:22',
      serialNumber: 'LT002345',
      notes: 'Mobile worker laptop'
    },
    {
      id: '3',
      name: 'SR01SRV',
      type: 'Server',
      status: 'Maintenance',
      location: 'Server Room',
      lastSeen: '2024-01-14 23:15',
      serialNumber: 'SV001456',
      notes: 'Scheduled maintenance'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [expandedLocations, setExpandedLocations] = useState<Set<string>>(new Set());
  const [newDevice, setNewDevice] = useState({
    type: '',
    serialNumber: '',
    location: '',
    notes: ''
  });
  const [editDevice, setEditDevice] = useState<Device | null>(null);

  const locationCodes: { [key: string]: string } = {
    'Office A-101': 'KH',
    'Remote': 'RM',
    'Server Room': 'SR',
    'Office B-201': 'KB'
  };

  const deviceTypeCodes: { [key: string]: string } = {
    'Desktop': 'DES',
    'Laptop': 'LAP',
    'Mobile': 'MOB',
    'Server': 'SRV',
    'Printer': 'PRT'
  };

  const generateDeviceCode = (location: string, type: string) => {
    const locationCode = locationCodes[location] || 'XX';
    const typeCode = deviceTypeCodes[type] || 'XXX';
    const existingDevices = devices.filter(d => d.location === location && d.type === type);
    const sequence = String(existingDevices.length + 1).padStart(2, '0');
    return `${locationCode}${sequence}${typeCode}`;
  };

  const getStatusBadgeColor = (status: Device['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Retired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'Desktop': return <Monitor className="w-4 h-4" />;
      case 'Laptop': return <Laptop className="w-4 h-4" />;
      case 'Mobile': return <Smartphone className="w-4 h-4" />;
      case 'Server': return <Monitor className="w-4 h-4" />;
      case 'Printer': return <Monitor className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const devicesByLocation = filteredDevices.reduce((acc, device) => {
    if (!acc[device.location]) {
      acc[device.location] = [];
    }
    acc[device.location].push(device);
    return acc;
  }, {} as Record<string, Device[]>);

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
    if (newDevice.type && newDevice.location) {
      const deviceCode = generateDeviceCode(newDevice.location, newDevice.type);
      const device: Device = {
        id: Date.now().toString(),
        name: deviceCode,
        type: newDevice.type as Device['type'],
        status: 'Active',
        location: newDevice.location,
        lastSeen: new Date().toISOString().slice(0, 16).replace('T', ' '),
        serialNumber: newDevice.serialNumber,
        notes: newDevice.notes
      };
      setDevices([...devices, device]);
      setNewDevice({ type: '', serialNumber: '', location: '', notes: '' });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditDevice = () => {
    if (editDevice) {
      setDevices(devices.map(d => d.id === editDevice.id ? editDevice : d));
      setIsEditDialogOpen(false);
      setEditDevice(null);
    }
  };

  const handleDeleteDevice = (deviceId: string) => {
    if (confirm('Are you sure you want to delete this device?')) {
      setDevices(devices.filter(d => d.id !== deviceId));
    }
  };

  const openEditDialog = (device: Device) => {
    setEditDevice({ ...device });
    setIsEditDialogOpen(true);
  };

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
                <Label htmlFor="device-type">Device Type</Label>
                <Select value={newDevice.type} onValueChange={(value) => setNewDevice({ ...newDevice, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select device type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Desktop">Desktop</SelectItem>
                    <SelectItem value="Laptop">Laptop</SelectItem>
                    <SelectItem value="Mobile">Mobile</SelectItem>
                    <SelectItem value="Server">Server</SelectItem>
                    <SelectItem value="Printer">Printer</SelectItem>
                  </SelectContent>
                </Select>
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
                  value={newDevice.serialNumber}
                  onChange={(e) => setNewDevice({ ...newDevice, serialNumber: e.target.value })}
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
                <Button onClick={handleAddDevice}>
                  Add Device
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
                <Label htmlFor="edit-device-name">Device Name</Label>
                <Input 
                  id="edit-device-name" 
                  value={editDevice.name}
                  onChange={(e) => setEditDevice({ ...editDevice, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-device-type">Device Type</Label>
                <Select value={editDevice.type} onValueChange={(value) => setEditDevice({ ...editDevice, type: value as Device['type'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Desktop">Desktop</SelectItem>
                    <SelectItem value="Laptop">Laptop</SelectItem>
                    <SelectItem value="Mobile">Mobile</SelectItem>
                    <SelectItem value="Server">Server</SelectItem>
                    <SelectItem value="Printer">Printer</SelectItem>
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
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Select value={editDevice.location} onValueChange={(value) => setEditDevice({ ...editDevice, location: value })}>
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
                  value={editDevice.serialNumber}
                  onChange={(e) => setEditDevice({ ...editDevice, serialNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea 
                  id="edit-notes" 
                  value={editDevice.notes}
                  onChange={(e) => setEditDevice({ ...editDevice, notes: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditDevice}>
                  Save Changes
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last Seen</TableHead>
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
                          {expandedLocations.has(location) && locationDevices.map((device) => (
                            <div key={device.id} className="ml-6 py-2 border-b last:border-b-0">
                              <div className="grid grid-cols-6 gap-4 items-center">
                                <div className="flex items-center space-x-2">
                                  {getDeviceIcon(device.type)}
                                  <div>
                                    <p className="font-medium">{device.name}</p>
                                    <p className="text-sm text-gray-500">{device.serialNumber}</p>
                                  </div>
                                </div>
                                <div>{device.type}</div>
                                <div>
                                  <Badge className={getStatusBadgeColor(device.status)}>
                                    {device.status}
                                  </Badge>
                                </div>
                                <div>{device.location}</div>
                                <div>{device.lastSeen}</div>
                                <div className="flex items-center space-x-2">
                                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(device)}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleDeleteDevice(device.id)}>
                                    <Trash2 className="w-4 h-4" />
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
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceManagement;
