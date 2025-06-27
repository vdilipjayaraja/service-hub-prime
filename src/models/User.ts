
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'technician' | 'client';
  avatar?: string;
  created_at: string;
  updated_at: string;
}
