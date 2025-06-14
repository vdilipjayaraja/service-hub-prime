
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash, Eye, Monitor, FileText, Users } from 'lucide-react';
import { Client } from '../../types';

// Mock data for demonstration
const mockClients: Client[] = [
  {
    id: '1',
    name: 'ABC Corporation',
    contactPerson: 'John Smith',
    email: 'john@abccorp.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Ave, Suite 100, City, State 12345',
    type: 'managed_site',
    createdAt: '2024-01-15',
    deviceCount: 25,
    activeRequests: 2
  },
  {
    id: '2',
    name: 'Jane Doe',
    contactPerson: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+1 (555) 987-6543',
    address: '456 Home St, City, State 12345',
    type: 'individual',
    createdAt: '2024-02-20',
    deviceCount: 3,
    activeRequests: 0
  },
  {
    id: '3',
    name: 'Walk-in Customer #001',
    contactPerson: 'Michael Johnson',
    email: 'mjohnson@email.com',
    phone: '+1 (555) 456-7890',
    address: 'N/A',
    type: 'walk_in',
    createdAt: '2024-06-14',
    deviceCount: 1,
    activeRequests: 1
  }
];

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || client.type === filterType;
    return matchesSearch && matchesFilter;
  });

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
          <p className="text-gray-600">Manage your clients and customer relationships</p>
        </div>
        <Button>
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
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
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
