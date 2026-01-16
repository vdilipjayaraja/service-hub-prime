import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash, Eye, Monitor, FileText, Users } from 'lucide-react';
import { Client } from '../../types';
import { useToast } from '@/components/ui/use-toast';
import ClientForm from './ClientForm';

const API_BASE = "http://127.0.0.1:8002";

const ClientList: React.FC = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>();
  const [loading, setLoading] = useState(true);

  // Move fetchClients outside useEffect
  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/clients/`);
      if (!res.ok) throw new Error('Failed to fetch clients');
      const data = await res.json();
      setClients(data);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to fetch clients",
        variant: "destructive"
      });
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
    // eslint-disable-next-line
  }, [toast]);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || client.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleAddClient = () => {
    setEditingClient(undefined);
    setShowForm(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      const res = await fetch(`${API_BASE}/clients/${clientId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete client');
      setClients(prev => prev.filter(c => c.id !== clientId));
      toast({
        title: "Success",
        description: "Client deleted successfully"
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete client",
        variant: "destructive"
      });
    }
  };

  const handleSaveClient = async (clientData: Omit<Client, 'id'>) => {
    try {
      await fetch('http://127.0.0.1:8002/clients/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: clientData.name,
          contact_person: clientData.contactPerson,
          email: clientData.email,
          phone: clientData.phone,
          address: clientData.address,
          type: clientData.type
        })
      });
      setShowForm(false);
      setEditingClient(undefined);
      toast({
        title: "Success",
        description: "Client saved successfully"
      });
      fetchClients(); // <-- Refresh the list after save
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save client",
        variant: "destructive"
      });
    }
  };

  const getTypeColor = (type: Client['type']) => {
    switch (type) {
      case 'managed_site': return 'bg-blue-100 text-blue-800';
      case 'individual': return 'bg-green-100 text-green-800';
      case 'walk_in': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: Client['type']) => {
    switch (type) {
      case 'managed_site': return 'Managed Site';
      case 'individual': return 'Individual';
      case 'walk_in': return 'Walk-in';
      default: return type;
    }
  };

  if (showForm) {
    return (
      <ClientForm
        client={editingClient}
        onSave={handleSaveClient}
        onCancel={() => {
          setShowForm(false);
          setEditingClient(undefined);
        }}
      />
    );
  }

  if (loading) {
    return <div>Loading clients...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
          <p className="text-gray-600">Manage your clients and customer relationships</p>
        </div>
        <Button onClick={handleAddClient}>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterType('all')}
                size="sm"
              >
                All ({clients.length})
              </Button>
              <Button
                variant={filterType === 'managed_site' ? 'default' : 'outline'}
                onClick={() => setFilterType('managed_site')}
                size="sm"
              >
                Managed Sites ({clients.filter(c => c.type === 'managed_site').length})
              </Button>
              <Button
                variant={filterType === 'individual' ? 'default' : 'outline'}
                onClick={() => setFilterType('individual')}
                size="sm"
              >
                Individual ({clients.filter(c => c.type === 'individual').length})
              </Button>
              <Button
                variant={filterType === 'walk_in' ? 'default' : 'outline'}
                onClick={() => setFilterType('walk_in')}
                size="sm"
              >
                Walk-in ({clients.filter(c => c.type === 'walk_in').length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                  <p className="text-sm text-gray-600">{client.contactPerson}</p>
                </div>
                <Badge className={getTypeColor(client.type)}>
                  {getTypeLabel(client.type)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> {client.email}</p>
                <p><strong>Phone:</strong> {client.phone}</p>
                {client.address !== 'N/A' && (
                  <p><strong>Address:</strong> {client.address}</p>
                )}
                <p><strong>Created:</strong> {new Date(client.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="flex justify-between items-center pt-2 border-t">
                <div className="flex space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Monitor className="h-4 w-4 text-gray-500" />
                    <span>{client.deviceCount} devices</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span>{client.activeRequests} active</span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" title="View Details">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEditClient(client)} title="Edit Client">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteClient(client.id)} title="Delete Client">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or add a new client.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientList;
