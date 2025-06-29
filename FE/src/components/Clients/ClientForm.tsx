import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save } from 'lucide-react';
import { Client } from '../../types';
import { useToast } from '@/components/ui/use-toast';
import PasswordAssignmentTab from '../Auth/PasswordAssignmentTab';

interface ClientFormProps {
  client?: Client;
  onSave: (client: Omit<Client, 'id'>) => void;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onSave, onCancel }) => {
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({
    name: client?.name || '',
    contactPerson: client?.contactPerson || '',
    email: client?.email || '',
    phone: client?.phone || '',
    address: client?.address || '',
    type: client?.type || 'individual' as Client['type']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contactPerson || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!client && !password) {
      toast({
        title: "Error",
        description: "Please assign a password for the new client",
        variant: "destructive"
      });
      return;
    }

    try {
      let userId = client?.userId;
      // 1. Create user if adding new client
      if (!client) {
        const userRes = await fetch("http://127.0.0.1:8002/users/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: password,
            role: "client"
          })
        });
        if (!userRes.ok) {
          const err = await userRes.json();
          throw new Error(err.detail || "Failed to create user");
        }
        const userData = await userRes.json();
        userId = userData.id;
      }

      // 2. Create or update client
      const clientPayload = {
        name: formData.name,
        contact_person: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        type: formData.type,
        // id and created_at are only needed for PUT (update), not POST (create)
        ...(client && { id: client.id }),
        created_at: client?.createdAt || new Date().toISOString(),
      };

      const clientRes = await fetch("http://127.0.0.1:8002/clients/", {
        method: client ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientPayload)
      });
      if (!clientRes.ok) {
        const err = await clientRes.json();
        throw new Error(err.detail || "Failed to save client");
      }
      const clientData = await clientRes.json();

      toast({
        title: "Success",
        description: `Client ${client ? 'updated' : 'created'} successfully`
      });
      // Optionally, call onSave(clientData) or onCancel() here if you want to close the form or update parent state
      if (onSave) onSave(clientData);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save client",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          {client ? 'Edit Client' : 'Add New Client'}
        </h1>
      </div>

      <Tabs defaultValue="client-info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="client-info">Client Information</TabsTrigger>
          <TabsTrigger value="password" disabled={!!client}>Password Assignment</TabsTrigger>
        </TabsList>

        <TabsContent value="client-info">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Client Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter client name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="Enter contact person"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="type">Client Type</Label>
                  <Select value={formData.type} onValueChange={(value: Client['type']) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="managed_site">Managed Site</SelectItem>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="walk_in">Walk-in</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter full address"
                    rows={3}
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    {client ? 'Update Client' : 'Create Client'}
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
            userType="client"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientForm;
