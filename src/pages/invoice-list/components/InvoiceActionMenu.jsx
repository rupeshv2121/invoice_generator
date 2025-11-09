import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InvoiceActionMenu = ({ invoice, onAction }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    const handleAction = (actionType) => {
        onAction(actionType, invoice);
        closeMenu();
    };

    const actions = [
        {
            label: 'View',
            icon: 'Eye',
            action: 'view',
            className: 'text-foreground hover:bg-muted'
        },
        {
            label: 'Edit',
            icon: 'Edit',
            action: 'edit',
            className: 'text-foreground hover:bg-muted'
        },
        {
            label: 'Duplicate',
            icon: 'Copy',
            action: 'duplicate',
            className: 'text-foreground hover:bg-muted'
        },
        {
            label: 'Download PDF',
            icon: 'Download',
            action: 'download',
            className: 'text-foreground hover:bg-muted'
        },
        {
            label: 'Send Email',
            icon: 'Mail',
            action: 'send',
            className: 'text-foreground hover:bg-muted',
            disabled: invoice?.status === 'draft'
        },
        {
            label: 'Print',
            icon: 'Printer',
            action: 'print',
            className: 'text-foreground hover:bg-muted'
        },
        {
            label: 'Mark as Paid',
            icon: 'CheckCircle',
            action: 'markPaid',
            className: 'text-success hover:bg-success/10',
            show: invoice?.status !== 'paid'
        },
        {
            label: 'Delete',
            icon: 'Trash2',
            action: 'delete',
            className: 'text-destructive hover:bg-destructive/10'
        }
    ];

    const visibleActions = actions?.filter(action => action?.show !== false);

    return (
        <div className="relative inline-block">
            <Button
                variant="ghost"
                size="sm"
                onClick={toggleMenu}
                iconName="MoreVertical"
                className="h-8 w-8 p-0"
            />
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-[100]"
                        onClick={closeMenu}
                    />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-border rounded-md shadow-lg z-[101]">
                        <div className="py-1">
                            {visibleActions?.map((action, index) => (
                                <React.Fragment key={action?.action}>
                                    {index === 6 && <div className="border-t border-border my-1" />}
                                    <button
                                        onClick={() => handleAction(action?.action)}
                                        disabled={action?.disabled}
                                        className={`flex items-center w-full px-3 py-2 text-sm transition-colors duration-150 ${action?.disabled
                                            ? 'text-text-secondary cursor-not-allowed opacity-50'
                                            : action?.className
                                            }`}
                                    >
                                        <Icon name={action?.icon} size={16} className="mr-3" />
                                        {action?.label}
                                    </button>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default InvoiceActionMenu;