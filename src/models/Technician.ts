
export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: 'Hardware' | 'Software' | 'Network' | 'General';
  status: 'active' | 'inactive';
  hire_date: string;
  certifications: string[];
  created_at: string;
  updated_at: string;
}
