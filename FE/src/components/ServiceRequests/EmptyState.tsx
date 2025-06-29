
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { User } from '../../types';

interface EmptyStateProps {
  user: User | null;
}

const EmptyState: React.FC<EmptyStateProps> = ({ user }) => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No service requests found</h3>
        <p className="text-gray-600">
          {user?.role === 'client' 
            ? "You haven't submitted any service requests yet."
            : "No requests match your current filters."
          }
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
