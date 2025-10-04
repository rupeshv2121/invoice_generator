import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActions = ({ selectedCount, onBulkAction, onClearSelection }) => {
    if (selectedCount === 0) return null;

    const bulkActions = [
        {
            label: 'Export Selected',
            icon: 'Download',
            action: 'export',
            variant: 'outline'
        },
        {
            label: 'Print Selected',
            icon: 'Printer',
            action: 'print',
            variant: 'outline'
        },
        {
            label: 'Send Emails',
            icon: 'Mail',
            action: 'sendEmails',
            variant: 'outline'
        },
        {
            label: 'Mark as Paid',
            icon: 'CheckCircle',
            action: 'markPaid',
            variant: 'outline'
        },
        {
            label: 'Delete Selected',
            icon: 'Trash2',
            action: 'delete',
            variant: 'destructive'
        }
    ];

    return (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-3">
                    <Icon name="CheckSquare" size={20} className="text-primary" />
                    <span className="text-sm font-medium text-foreground">
                        {selectedCount} invoice{selectedCount !== 1 ? 's' : ''} selected
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearSelection}
                        iconName="X"
                        className="text-text-secondary hover:text-foreground"
                    >
                        Clear
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {bulkActions?.map((action) => (
                        <Button
                            key={action?.action}
                            variant={action?.variant}
                            size="sm"
                            onClick={() => onBulkAction(action?.action)}
                            iconName={action?.icon}
                            iconPosition="left"
                            className="text-xs"
                        >
                            {action?.label}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BulkActions;