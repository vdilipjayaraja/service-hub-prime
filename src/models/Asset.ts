
export interface Asset {
  id: string;
  name: string;
  category: 'laptop' | 'desktop' | 'monitor' | 'printer' | 'network' | 'other';
  serial_number: string;
  status: 'available' | 'assigned' | 'maintenance' | 'retired';
  location: string;
  assigned_to?: string | null;
  purchase_date?: string;
  warranty_expiry?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
