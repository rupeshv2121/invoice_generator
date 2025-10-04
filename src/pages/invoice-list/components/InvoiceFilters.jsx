import { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';


const InvoiceFilters = ({ filters, onFiltersChange, onClearFilters, totalCount }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: 'draft', label: 'Draft' },
        { value: 'sent', label: 'Sent' },
        { value: 'paid', label: 'Paid' },
        { value: 'overdue', label: 'Overdue' }
    ];

    const customerOptions = [
        { value: '', label: 'All Customers' },
        { value: 'acme-corp', label: 'Acme Corporation' },
        { value: 'tech-solutions', label: 'Tech Solutions Ltd' },
        { value: 'global-imports', label: 'Global Imports Inc' },
        { value: 'retail-chain', label: 'Retail Chain Co' },
        { value: 'manufacturing', label: 'Manufacturing Hub' }
    ];

    const handleFilterChange = (key, value) => {
        onFiltersChange({
            ...filters,
            [key]: value
        });
    };

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
                <Button
                    variant="outline"
                    onClick={toggleExpanded}
                    iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
                    iconPosition="right"
                    fullWidth
                >
                    Filters {totalCount > 0 && `(${totalCount} invoices)`}
                </Button>
            </div>
            {/* Filter Controls */}
            <div className={`space-y-4 ${!isExpanded ? 'hidden lg:block' : ''}`}>
                {/* Search and Quick Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Input
                        type="search"
                        placeholder="Search invoices..."
                        value={filters?.search}
                        onChange={(e) => handleFilterChange('search', e?.target?.value)}
                        className="w-full"
                    />

                    <Select
                        placeholder="Filter by status"
                        options={statusOptions}
                        value={filters?.status}
                        onChange={(value) => handleFilterChange('status', value)}
                    />

                    <Select
                        placeholder="Filter by customer"
                        options={customerOptions}
                        value={filters?.customer}
                        onChange={(value) => handleFilterChange('customer', value)}
                        searchable
                    />

                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            onClick={onClearFilters}
                            iconName="X"
                            iconPosition="left"
                            size="default"
                        >
                            Clear
                        </Button>
                    </div>
                </div>

                {/* Date Range and Amount Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Input
                        type="date"
                        label="From Date"
                        value={filters?.dateFrom}
                        onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
                    />

                    <Input
                        type="date"
                        label="To Date"
                        value={filters?.dateTo}
                        onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
                    />

                    <Input
                        type="number"
                        label="Min Amount (₹)"
                        placeholder="0"
                        value={filters?.minAmount}
                        onChange={(e) => handleFilterChange('minAmount', e?.target?.value)}
                    />

                    <Input
                        type="number"
                        label="Max Amount (₹)"
                        placeholder="100000"
                        value={filters?.maxAmount}
                        onChange={(e) => handleFilterChange('maxAmount', e?.target?.value)}
                    />
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="text-sm text-text-secondary">
                        {totalCount > 0 ? (
                            <>Showing {totalCount} invoice{totalCount !== 1 ? 's' : ''}</>
                        ) : (
                            'No invoices found'
                        )}
                    </div>

                    <div className="hidden lg:flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            iconName="Download"
                            iconPosition="left"
                        >
                            Export
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            iconName="Printer"
                            iconPosition="left"
                        >
                            Print
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceFilters;