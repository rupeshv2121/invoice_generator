import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CustomerTable = ({
    customers,
    onEditCustomer,
    onViewHistory,
    onDeleteCustomer,
    sortBy,
    sortOrder,
    onSort
}) => {
    const handleSort = (field) => {
        const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
        onSort(field, newOrder);
    };

    const getSortIcon = (field) => {
        if (sortBy !== field) return 'ArrowUpDown';
        return sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown';
    };

    return (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted border-b border-border">
                        <tr>
                            <th className="text-left p-4 font-medium text-foreground">
                                <button
                                    onClick={() => handleSort('businessName')}
                                    className="flex items-center space-x-1 hover:text-primary transition-colors"
                                >
                                    <span>Business Name</span>
                                    <Icon name={getSortIcon('businessName')} size={16} />
                                </button>
                            </th>
                            <th className="text-left p-4 font-medium text-foreground">
                                <button
                                    onClick={() => handleSort('contactPerson')}
                                    className="flex items-center space-x-1 hover:text-primary transition-colors"
                                >
                                    <span>Contact Person</span>
                                    <Icon name={getSortIcon('contactPerson')} size={16} />
                                </button>
                            </th>
                            <th className="text-left p-4 font-medium text-foreground">
                                <button
                                    onClick={() => handleSort('email')}
                                    className="flex items-center space-x-1 hover:text-primary transition-colors"
                                >
                                    <span>Email</span>
                                    <Icon name={getSortIcon('email')} size={16} />
                                </button>
                            </th>
                            <th className="text-left p-4 font-medium text-foreground">Phone</th>
                            <th className="text-left p-4 font-medium text-foreground">
                                <button
                                    onClick={() => handleSort('location')}
                                    className="flex items-center space-x-1 hover:text-primary transition-colors"
                                >
                                    <span>Location</span>
                                    <Icon name={getSortIcon('location')} size={16} />
                                </button>
                            </th>
                            <th className="text-left p-4 font-medium text-foreground">GST Status</th>
                            <th className="text-right p-4 font-medium text-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers?.map((customer, index) => (
                            <tr
                                key={customer?.id}
                                className={`border-b border-border hover:bg-muted/50 transition-colors ${index % 2 === 0 ? 'bg-surface' : 'bg-surface-secondary'
                                    }`}
                            >
                                <td className="p-4">
                                    <div className="font-medium text-foreground">{customer?.businessName}</div>
                                    <div className="text-sm text-text-secondary">{customer?.customerType}</div>
                                </td>
                                <td className="p-4">
                                    <div className="text-foreground">{customer?.contactPerson}</div>
                                </td>
                                <td className="p-4">
                                    <div className="text-foreground">{customer?.email}</div>
                                </td>
                                <td className="p-4">
                                    <div className="text-foreground">{customer?.phone}</div>
                                </td>
                                <td className="p-4">
                                    <div className="text-foreground">{customer?.location}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${customer?.gstStatus === 'Registered' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                                        }`}>
                                        {customer?.gstStatus}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEditCustomer(customer)}
                                            iconName="Edit"
                                            iconSize={16}
                                        >
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onViewHistory(customer)}
                                            iconName="History"
                                            iconSize={16}
                                        >
                                            <span className="sr-only">History</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDeleteCustomer(customer)}
                                            iconName="Trash2"
                                            iconSize={16}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4 p-4">
                {customers?.map((customer) => (
                    <div key={customer?.id} className="bg-surface border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-medium text-foreground">{customer?.businessName}</h3>
                                <p className="text-sm text-text-secondary">{customer?.customerType}</p>
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${customer?.gstStatus === 'Registered' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                                }`}>
                                {customer?.gstStatus}
                            </span>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center space-x-2">
                                <Icon name="User" size={16} className="text-text-secondary" />
                                <span className="text-sm text-foreground">{customer?.contactPerson}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Icon name="Mail" size={16} className="text-text-secondary" />
                                <span className="text-sm text-foreground">{customer?.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Icon name="Phone" size={16} className="text-text-secondary" />
                                <span className="text-sm text-foreground">{customer?.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Icon name="MapPin" size={16} className="text-text-secondary" />
                                <span className="text-sm text-foreground">{customer?.location}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-border">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEditCustomer(customer)}
                                iconName="Edit"
                                iconSize={16}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onViewHistory(customer)}
                                iconName="History"
                                iconSize={16}
                            >
                                History
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDeleteCustomer(customer)}
                                iconName="Trash2"
                                iconSize={16}
                                className="text-destructive hover:text-destructive"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            {customers?.length === 0 && (
                <div className="text-center py-12">
                    <Icon name="Users" size={48} className="mx-auto text-text-secondary mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No customers found</h3>
                    <p className="text-text-secondary">Add your first customer to get started with invoicing.</p>
                </div>
            )}
        </div>
    );
};

export default CustomerTable;