import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Trash2, Eye, EyeOff, Download } from 'lucide-react';

interface BulkOperationsProps {
  selectedItems: number[];
  totalItems: number;
  isProcessing: boolean;
  onSelectAll: () => void;
  onBulkAction: (action: 'publish' | 'unpublish' | 'delete' | 'export') => void;
  onClearSelection: () => void;
}

export function BulkOperations({
  selectedItems,
  totalItems,
  isProcessing,
  onSelectAll,
  onBulkAction,
  onClearSelection
}: BulkOperationsProps) {
  const hasSelected = selectedItems.length > 0;
  const allSelected = selectedItems.length === totalItems;

  if (!hasSelected) {
    return (
      <div className="flex items-center gap-3">
        <Checkbox
          checked={allSelected}
          onCheckedChange={onSelectAll}
          aria-label="Select all items"
        />
        <span className="text-sm text-muted-foreground">
          Select items for bulk operations
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <Checkbox
        checked={allSelected}
        onCheckedChange={onSelectAll}
        aria-label="Select all items"
      />
      
      <Badge variant="default" className="bg-blue-600">
        {selectedItems.length} selected
      </Badge>
      
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={isProcessing}
              className="flex items-center gap-2"
            >
              Bulk Actions
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem 
              onClick={() => onBulkAction('publish')}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Publish Selected
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onBulkAction('unpublish')}
              className="flex items-center gap-2"
            >
              <EyeOff className="h-4 w-4" />
              Unpublish Selected
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onBulkAction('export')}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Selected
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onBulkAction('delete')}
              className="flex items-center gap-2 text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearSelection}
          disabled={isProcessing}
        >
          Clear Selection
        </Button>
      </div>
      
      {isProcessing && (
        <div className="text-sm text-muted-foreground">
          Processing...
        </div>
      )}
    </div>
  );
}