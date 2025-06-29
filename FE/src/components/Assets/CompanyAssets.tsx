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
import { Folder, Plus, Search, Edit, Trash2, FileText, HardDrive } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  category: 'Hardware' | 'Software' | 'License' | 'Equipment' | 'Furniture';
  status: 'Available' | 'In Use' | 'Maintenance' | 'Retired' | 'Lost';
  assignedTo: string;
  location: string;
  deployedTo?: string;
  deploymentDuration?: string;
  purchaseDate: string;
  value: number;
  serialNumber: string;
  vendor: string;
  warranty: string;
  notes: string;
}

const CompanyAssets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: '1',
      name: 'Microsoft Office 365 License',
      category: 'License',
      status: 'In Use',
      assignedTo: 'John Smith',
      location: 'Digital',
      purchaseDate: '2024-01-01',
      value: 150,
      serialNumber: 'MS365-001',
      vendor: 'Microsoft',
      warranty: '2025-01-01',
      notes: 'Annual subscription'
    },
    {
      id: '2',
      name: 'Conference Room Projector',
      category: 'Equipment',
      status: 'Available',
      assignedTo: 'IT Department',
      location: 'Warehouse',
      purchaseDate: '2023-06-15',
      value: 1200,
      serialNumber: 'PROJ-001',
      vendor: 'Epson',
      warranty: '2026-06-15',
      notes: '4K resolution projector'
    },
    {
      id: '3',
      name: 'Standing Desk',
      category: 'Furniture',
      status: 'In Use',
      assignedTo: 'Sarah Johnson',
      location: 'Office B-201',
      deployedTo: 'Office B-201',
      deploymentDuration: '6 months',
      purchaseDate: '2023-03-20',
      value: 800,
      serialNumber: 'DESK-ST-001',
      vendor: 'Steelcase',
      warranty: '2028-03-20',
      notes: 'Height adjustable desk'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeployDialogOpen, setIsDeployDialogOpen] = useState(false);
  const [deployAsset, setDeployAsset] = useState<Asset | null>(null);
  const [deploymentLocation, setDeploymentLocation] = useState('');
  const [deploymentDuration, setDeploymentDuration] = useState('');

  const getStatusBadgeColor = (status: Asset['status']) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'In Use': return 'bg-blue-100 text-blue-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Retired': return 'bg-gray-100 text-gray-800';
      case 'Lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: Asset['category']) => {
    switch (category) {
      case 'Hardware': return <HardDrive className="w-4 h-4" />;
      case 'Software': return <FileText className="w-4 h-4" />;
      case 'License': return <FileText className="w-4 h-4" />;
      case 'Equipment': return <HardDrive className="w-4 h-4" />;
      case 'Furniture': return <Folder className="w-4 h-4" />;
      default: return <Folder className="w-4 h-4" />;
    }
  };

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  const handleDeploy = (asset: Asset) => {
    setDeployAsset(asset);
    setIsDeployDialogOpen(true);
  };

  const confirmDeploy = () => {
    if (deployAsset && deploymentLocation && deploymentDuration) {
      setAssets(assets.map(asset => 
        asset.id === deployAsset.id 
          ? { 
              ...asset, 
              status: 'In Use',
              deployedTo: deploymentLocation,
              deploymentDuration: deploymentDuration,
              location: deploymentLocation
            }
          : asset
      ));
      setIsDeployDialogOpen(false);
      setDeployAsset(null);
      setDeploymentLocation('');
      setDeploymentDuration('');
    }
  };

  const handleRetrieve = (asset: Asset) => {
    if (confirm(`Are you sure you want to retrieve ${asset.name}?`)) {
      setAssets(assets.map(a => 
        a.id === asset.id 
          ? { 
              ...a, 
              status: 'Available',
              deployedTo: undefined,
              deploymentDuration: undefined,
              location: 'Warehouse'
            }
          : a
      ));
    }
  };

  const getStatusDisplay = (asset: Asset) => {
    if (asset.deployedTo && asset.status === 'In Use') {
      return `Deployed to ${asset.deployedTo}`;
    }
    return asset.status;
  };

  const getLocationDisplay = (asset: Asset) => {
    if (asset.deployedTo) {
      return `${asset.deployedTo} (${asset.deploymentDuration})`;
    }
    return asset.location;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Company Assets</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Asset</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="asset-name">Asset Name</Label>
                <Input id="asset-name" placeholder="e.g., Office Chair" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="asset-category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hardware">Hardware</SelectItem>
                    <SelectItem value="Software">Software</SelectItem>
                    <SelectItem value="License">License</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="serial-number">Serial Number</Label>
                <Input id="serial-number" placeholder="Asset serial number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor</Label>
                <Input id="vendor" placeholder="Vendor/Supplier" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Value ($)</Label>
                <Input id="value" type="number" placeholder="Asset value" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assigned-to">Assigned To</Label>
                <Input id="assigned-to" placeholder="User or department" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Physical location" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Additional notes" />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>
                  Add Asset
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
                <p className="text-sm font-medium text-gray-600">Total Assets</p>
                <p className="text-2xl font-bold">{assets.length}</p>
              </div>
              <Folder className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">$</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Use</p>
                <p className="text-2xl font-bold">{assets.filter(a => a.status === 'In Use').length}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <HardDrive className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold">{assets.filter(a => a.status === 'Available').length}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deploy Dialog */}
      <Dialog open={isDeployDialogOpen} onOpenChange={setIsDeployDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Deploy Asset</DialogTitle>
          </DialogHeader>
          {deployAsset && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Asset: {deployAsset.name}</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deployment-location">Deployment Location</Label>
                <Select value={deploymentLocation} onValueChange={setDeploymentLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select deployment location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Office A-101">Office A-101</SelectItem>
                    <SelectItem value="Office B-201">Office B-201</SelectItem>
                    <SelectItem value="Conference Room A">Conference Room A</SelectItem>
                    <SelectItem value="Conference Room B">Conference Room B</SelectItem>
                    <SelectItem value="Remote Site">Remote Site</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deployment-duration">Deployment Duration</Label>
                <Select value={deploymentDuration} onValueChange={setDeploymentDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 week">1 week</SelectItem>
                    <SelectItem value="2 weeks">2 weeks</SelectItem>
                    <SelectItem value="1 month">1 month</SelectItem>
                    <SelectItem value="3 months">3 months</SelectItem>
                    <SelectItem value="6 months">6 months</SelectItem>
                    <SelectItem value="1 year">1 year</SelectItem>
                    <SelectItem value="Indefinite">Indefinite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDeployDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={confirmDeploy}>
                  Deploy Asset
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Asset Inventory</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search assets..."
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
                <TableHead>Asset</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(asset.category)}
                      <div>
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-sm text-gray-500">{asset.vendor}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{asset.category}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(asset.status)}>
                      {getStatusDisplay(asset)}
                    </Badge>
                  </TableCell>
                  <TableCell>{asset.assignedTo}</TableCell>
                  <TableCell>{getLocationDisplay(asset)}</TableCell>
                  <TableCell>${asset.value.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {asset.status === 'Available' && (
                        <Button variant="ghost" size="sm" onClick={() => handleDeploy(asset)} title="Deploy Asset">
                          <span className="text-xs">Deploy</span>
                        </Button>
                      )}
                      {asset.deployedTo && (
                        <Button variant="ghost" size="sm" onClick={() => handleRetrieve(asset)} title="Retrieve Asset">
                          <span className="text-xs">Retrieve</span>
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => setSelectedAsset(asset)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
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
    </div>
  );
};

export default CompanyAssets;
