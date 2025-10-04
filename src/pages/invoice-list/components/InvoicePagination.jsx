import React from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';


const InvoicePagination = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange
}) => {
    const itemsPerPageOptions = [
        { value: '10', label: '10 per page' },
        { value: '25', label: '25 per page' },
        { value: '50', label: '50 per page' },
        { value: '100', label: '100 per page' }
    ];

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++) {
            range?.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots?.push(1, '...');
        } else {
            rangeWithDots?.push(1);
        }

        rangeWithDots?.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots?.push('...', totalPages);
        } else {
            rangeWithDots?.push(totalPages);
        }

        return rangeWithDots;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="bg-card border border-border rounded-lg p-4 mt-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Items per page selector */}
                <div className="flex items-center space-x-4">
                    <Select
                        options={itemsPerPageOptions}
                        value={itemsPerPage?.toString()}
                        onChange={(value) => onItemsPerPageChange(parseInt(value))}
                        className="w-40"
                    />
                    <span className="text-sm text-text-secondary">
                        Showing {startItem}-{endItem} of {totalItems} invoices
                    </span>
                </div>

                {/* Pagination controls */}
                <div className="flex items-center space-x-2">
                    {/* Previous button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        iconName="ChevronLeft"
                        className="h-8 w-8 p-0"
                    >
                        <span className="sr-only">Previous page</span>
                    </Button>

                    {/* Page numbers */}
                    <div className="hidden sm:flex items-center space-x-1">
                        {getVisiblePages()?.map((page, index) => (
                            <React.Fragment key={index}>
                                {page === '...' ? (
                                    <span className="px-2 py-1 text-text-secondary">...</span>
                                ) : (
                                    <Button
                                        variant={currentPage === page ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => onPageChange(page)}
                                        className="h-8 w-8 p-0 text-sm"
                                    >
                                        {page}
                                    </Button>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Mobile page indicator */}
                    <div className="sm:hidden flex items-center space-x-2">
                        <span className="text-sm text-text-secondary">
                            Page {currentPage} of {totalPages}
                        </span>
                    </div>

                    {/* Next button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        iconName="ChevronRight"
                        className="h-8 w-8 p-0"
                    >
                        <span className="sr-only">Next page</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InvoicePagination;