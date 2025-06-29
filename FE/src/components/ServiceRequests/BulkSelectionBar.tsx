
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { UserCheck } from 'lucide-react';

interface BulkSelectionBarProps {
  selectedCount: number;
  totalCount: number;
  allSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  onBulkAssign: () => void;
}

const BulkSelectionBar: React.FC<BulkSelectionBarProps> = ({
  selectedCount,
  totalCount,
  allSelected,
  onSelectAll,
  onBulkAssign
}) => {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={allSelected && totalCount > 0}
              onCheckedChange={onSelectAll}
            />
            <span className="text-sm text-gray-600">
              Select all ({totalCount} requests)
            </span>
          </div>
          {selectedCount > 0 && (
            <Button onClick={onBulkAssign}>
              <UserCheck className="mr-2 h-4 w-4" />
              Assign Selected ({selectedCount})
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkSelectionBar;
