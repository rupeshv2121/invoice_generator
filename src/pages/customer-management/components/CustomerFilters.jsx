import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CustomerFilters = ({
    searchTerm,
    onSearchChange,
    locationFilter,
    onLocationFilterChange,
    customerTypeFilter,
    onCustomerTypeFilterChange,
    statusFilter,
    onStatusFilterChange,
    onClearFilters
}) => {
    const locationOptions = [
        { value: '', label: 'All Locations' },
        { value: 'Mumbai', label: 'Mumbai' },
        { value: 'Delhi', label: 'Delhi' },
        { value: 'Bangalore', label: 'Bangalore' },
        { value: 'Chennai', label: 'Chennai' },
        { value: 'Hyderabad', label: 'Hyderabad' },
        { value: 'Pune', label: 'Pune' },
        { value: 'Kolkata', label: 'Kolkata' },
        { value: 'Ahmedabad', label: 'Ahmedabad' },
        { value: 'Jaipur', label: 'Jaipur' },
        { value: 'Surat', label: 'Surat' }
    ];

    const customerTypeOptions = [
        { value: '', label: 'All Types' },
        { value: 'Business', label: 'Business' },
        { value: 'Individual', label: 'Individual' },
        { value: 'Freelancer', label: 'Freelancer' },
        { value: 'Government', label: 'Government' },
        { value: 'Non-Profit', label: 'Non-Profit' }
    ];

    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' }
    ];

    const hasActiveFilters = searchTerm || locationFilter || customerTypeFilter || statusFilter;

    return (
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <Input
                    type="search"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e?.target?.value)}
                    className="w-full"
                />

                <Select
                    placeholder="Filter by location"
                    options={locationOptions}
                    value={locationFilter}
                    onChange={onLocationFilterChange}
                    searchable
                />

                <Select
                    placeholder="Filter by type"
                    options={customerTypeOptions}
                    value={customerTypeFilter}
                    onChange={onCustomerTypeFilterChange}
                />

                <Select
                    placeholder="Filter by status"
                    options={statusOptions}
                    value={statusFilter}
                    onChange={onStatusFilterChange}
                />
            </div>
            {hasActiveFilters && (
                <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-text-secondary">Active filters:</span>
                        {searchTerm && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                                Search: {searchTerm}
                            </span>
                        )}
                        {locationFilter && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                                Location: {locationFilter}
                            </span>
                        )}
                        {customerTypeFilter && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                                Type: {customerTypeFilter}
                            </span>
                        )}
                        {statusFilter && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                                Status: {statusFilter}
                            </span>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearFilters}
                        iconName="X"
                        iconSize={16}
                    >
                        Clear All
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CustomerFilters;