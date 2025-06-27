
export interface Client {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  type: 'managed_site' | 'walk_in';
  created_at: string;
  updated_at: string;
}

export interface ClientCreate {
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  type: Client['type'];
}
