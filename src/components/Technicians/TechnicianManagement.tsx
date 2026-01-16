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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Wrench, Plus, Search, Edit, Trash2, User, Phone, Mail } from 'lucide-react';

interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Senior Technician' | 'Junior Technician' | 'Specialist' | 'Team Lead';
  status: 'Available' | 'Busy' | 'On Leave' | 'Off Duty';
  skills: string[];
  location: string;
  activeTickets: number;
  totalTickets: number;
  rating: number;
  joinDate: string;
  avatar?: string;
  notes: string;
}

const TechnicianManagement: React.FC = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([
    {
      id: '1',
      name: 'Mike Johnson',
      email: 'mike.johnson@techsolutions.com',
      phone: '+1 (555) 123-4567',
      role: 'Senior Technician',
      status: 'Available',
      skills: ['Hardware Repair', 'Network Setup', 'Windows Server'],
      location: 'Main Office',
      activeTickets: 3,
      totalTickets: 127,
      rating: 4.8,
      joinDate: '2022-03-15',
      notes: 'Specializes in hardware diagnostics'
    },
    {
      id: '2',
      name: 'Lisa Chen',
      email: 'lisa.chen@techsolutions.com',
      phone: '+1 (555) 234-5678',
      role: 'Team Lead',
      status: 'Busy',
      skills: ['Project Management', 'Cloud Services', 'Security'],
      location: 'Main Office',
      activeTickets: 5,
      totalTickets: 89,
      rating: 4.9,
      joinDate: '2021-11-08',
      notes: 'Team lead for infrastructure projects'
    },
    {
      id: '3',
      name: 'David Rodriguez',
      email: 'david.rodriguez@techsolutions.com',
      phone: '+1 (555) 345-6789',
      role: 'Junior Technician',
      status: 'Available',
      skills: ['Help Desk', 'Basic Troubleshooting', 'Software Installation'],
      location: 'Remote',
      activeTickets: 2,
      totalTickets: 45,
      rating: 4.5,
      joinDate: '2023-07-22',
      notes: 'New team member, eager to learn'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Technician>>({});

  // Utility to get badge color class for role
  function getRoleBadgeColor(role: string) {
    switch (role) {
      case 'Senior Technician':
        return 'bg-blue-100 text-blue-800';
      case 'Junior Technician':
        return 'bg-green-100 text-green-800';
      case 'Specialist':
        return 'bg-purple-100 text-purple-800';
      case 'Team Lead':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Utility to get badge color class for status
  function getStatusBadgeColor(status: string) {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Busy':
        return 'bg-red-100 text-red-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'Off Duty':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Open Edit, populate form
  const handleEdit = (technician: Technician) => {
    setSelectedTechnician(technician);
    setEditForm({ ...technician });
    setEditDialogOpen(true);
  };

  // Save edits to technician
  const handleEditSave = () => {
    setTechnicians(prev =>
      prev.map(t =>
        t.id === editForm.id
          ? {
              ...t,
              name: editForm.name || '',
              email: editForm.email || '',
              phone: editForm.phone || '',
              role: editForm.role as Technician['role'] || 'Junior Technician',
              status: editForm.status as Technician['status'] || 'Available',
              skills: typeof editForm.skills === 'string'
                ? (editForm.skills as string).split(',').map(s => s.trim())
                : Array.isArray(editForm.skills)
                ? editForm.skills
                : [],
              location: editForm.location || '',
              notes: editForm.notes || '',
            }
          : t
      )
    );
    setEditDialogOpen(false);
    setSelectedTechnician(null);
    setEditForm({});
  };

  // Handle Delete
  const handleDelete = (technician: Technician) => {
    setSelectedTechnician(technician);
    setDeleteDialogOpen(true);
  };
  const confirmDelete = () => {
    setTechnicians(prev =>
      prev.filter(t => t.id !== selectedTechnician?.id)
    );
    setDeleteDialogOpen(false);
    setSelectedTechnician(null);
  };

  const filteredTechnicians = technicians.filter(tech =>
    tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const availableTechnicians = technicians.filter(t => t.status === 'Available').length;
  const busyTechnicians = technicians.filter(t => t.status === 'Busy').length;
  const totalActiveTickets = technicians.reduce((sum, tech) => sum + tech.activeTickets, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Technician Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Technician
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Technician</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tech-name">Full Name</Label>
                <Input id="tech-name" placeholder="e.g., John Smith" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tech-email">Email</Label>
                <Input id="tech-email" type="email" placeholder="john.smith@company.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tech-phone">Phone</Label>
                <Input id="tech-phone" placeholder="+1 (555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tech-role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Junior Technician">Junior Technician</SelectItem>
                    <SelectItem value="Senior Technician">Senior Technician</SelectItem>
                    <SelectItem value="Specialist">Specialist</SelectItem>
                    <SelectItem value="Team Lead">Team Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tech-location">Location</Label>
                <Input id="tech-location" placeholder="e.g., Main Office, Remote" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tech-skills">Skills (comma separated)</Label>
                <Textarea id="tech-skills" placeholder="e.g., Hardware Repair, Network Setup, Windows Server" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tech-notes">Notes</Label>
                <Textarea id="tech-notes" placeholder="Additional notes about the technician" />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>
                  Add Technician
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Technicians</p>
                <p className="text-2xl font-bold">{technicians.length}</p>
              </div>
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">{availableTechnicians}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Busy</p>
                <p className="text-2xl font-bold text-red-600">{busyTechnicians}</p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <Wrench className="w-4 h-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tickets</p>
                <p className="text-2xl font-bold">{totalActiveTickets}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">#</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Technician Directory</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search technicians..."
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
                <TableHead>Technician</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Active Tickets</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTechnicians.map((technician) => (
                <TableRow key={technician.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={technician.avatar} alt={technician.name} />
                        <AvatarFallback>
                          {technician.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{technician.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Mail className="w-3 h-3" />
                          <span>{technician.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Phone className="w-3 h-3" />
                          <span>{technician.phone}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(technician.role)}>
                      {technician.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(technician.status)}>
                      {technician.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{technician.location}</TableCell>
                  <TableCell>
                    <div className="text-center">
                      <span className="font-bold text-lg">{technician.activeTickets}</span>
                      <p className="text-xs text-gray-500">of {technician.totalTickets} total</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <span className="font-medium">{technician.rating}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(technician)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(technician)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* EDIT Technician Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Technician</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-tech-name">Full Name</Label>
              <Input
                id="edit-tech-name"
                value={editForm.name || ''}
                onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tech-email">Email</Label>
              <Input
                id="edit-tech-email"
                type="email"
                value={editForm.email || ''}
                onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tech-phone">Phone</Label>
              <Input
                id="edit-tech-phone"
                value={editForm.phone || ''}
                onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tech-role">Role</Label>
              <Select
                value={editForm.role || ''}
                onValueChange={val => setEditForm(f => ({ ...f, role: val as Technician['role'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Junior Technician">Junior Technician</SelectItem>
                  <SelectItem value="Senior Technician">Senior Technician</SelectItem>
                  <SelectItem value="Specialist">Specialist</SelectItem>
                  <SelectItem value="Team Lead">Team Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tech-status">Status</Label>
              <Select
                value={editForm.status || ''}
                onValueChange={val => setEditForm(f => ({ ...f, status: val as Technician['status'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Busy">Busy</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                  <SelectItem value="Off Duty">Off Duty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tech-location">Location</Label>
              <Input
                id="edit-tech-location"
                value={editForm.location || ''}
                onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tech-skills">Skills (comma separated)</Label>
              <Textarea
                id="edit-tech-skills"
                value={
                  Array.isArray(editForm.skills)
                    ? editForm.skills.join(', ')
                    : (editForm.skills as string) || ''
                }
                onChange={e =>
                  setEditForm(f => ({
                    ...f,
                    skills: e.target.value
                      .split(',')
                      .map(s => s.trim())
                      .filter(Boolean),
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tech-notes">Notes</Label>
              <Textarea
                id="edit-tech-notes"
                value={editForm.notes || ''}
                onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE Technician Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Technician</DialogTitle>
          </DialogHeader>
          <div className="my-4">
            <p>Are you sure you want to delete "<b>{selectedTechnician?.name}</b>"?</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TechnicianManagement;
