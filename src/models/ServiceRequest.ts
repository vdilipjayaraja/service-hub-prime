
export interface ServiceRequest {
  id: string;
  ticket_id: string;
  client_id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  category: 'hardware' | 'software' | 'network' | 'other';
  assigned_to?: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}
