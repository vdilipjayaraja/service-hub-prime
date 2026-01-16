
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import PasswordAssignmentTab from '../Auth/PasswordAssignmentTab';

interface TechnicianFormData {
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  status: 'available' | 'busy' | 'offline';
}

interface TechnicianFormProps {
  technician?: any;
  onSave: (technician: TechnicianFormData) => void;
  onCancel: () => void;
}

const specializations = [
  'Hardware Repair',
  'Software Installation',
  'Network Configuration',
  'Security Systems',
  'Database Management',
  'Mobile Device Support',
  'Server Maintenance',
  'Help Desk Support'
];

const TechnicianForm: React.FC<TechnicianFormProps> = ({ technician, onSave, onCancel }) => {
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState<TechnicianFormData>({
    name: technician?.name || '',
    email: technician?.email || '',
    phone: technician?.phone || '',
    specialization: technician?.specialization || [],
    status: technician?.status || 'available'
  });

  const handleSpecializationChange = (spec: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      specialization: checked 
        ? [...prev.specialization, spec]
        : prev.specialization.filter(s => s !== spec)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!technician && !password) {
      toast({
        title: "Error",
        description: "Please assign a password for the new technician",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);

    toast({
      title: "Success",
      description: `Technician ${technician ? 'updated' : 'created'} successfully`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          {technician ? 'Edit Technician' : 'Add New Technician'}
        </h1>
      </div>

      <Tabs defaultValue="technician-info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="technician-info">Technician Information</TabsTrigger>
          <TabsTrigger value="password" disabled={!!technician}>Password Assignment</TabsTrigger>
        </TabsList>

        <TabsContent value="technician-info">
          <Card>
            <CardHeader>
              <CardTitle>Technician Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="busy">Busy</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Specializations</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {specializations.map((spec) => (
                      <div key={spec} className="flex items-center space-x-2">
                        <Checkbox
                          id={spec}
                          checked={formData.specialization.includes(spec)}
                          onCheckedChange={(checked) => handleSpecializationChange(spec, !!checked)}
                        />
                        <Label htmlFor={spec} className="text-sm">{spec}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    {technician ? 'Update Technician' : 'Create Technician'}
                  </Button>
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <PasswordAssignmentTab 
            onPasswordChange={setPassword}
            userType="technician"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TechnicianForm;
