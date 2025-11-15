// Reusable Shimmer/Skeleton Loader Components

export const SkeletonBox = ({ width = 'w-full', height = 'h-4', className = '' }) => (
    <div className={`${width} ${height} bg-gray-200 rounded animate-pulse ${className}`}></div>
);

export const SkeletonCircle = ({ size = 'w-12 h-12', className = '' }) => (
    <div className={`${size} bg-gray-200 rounded-full animate-pulse ${className}`}></div>
);

export const SkeletonCard = ({ children, className = '' }) => (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        {children}
    </div>
);

export const SkeletonTable = ({ rows = 5, columns = 6 }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="border-b border-gray-200 bg-gray-50 p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {[...Array(columns)].map((_, i) => (
                    <SkeletonBox key={i} width="w-full" height="h-4" />
                ))}
            </div>
        </div>
        {/* Table Rows */}
        <div className="divide-y divide-gray-200">
            {[...Array(rows)].map((_, rowIndex) => (
                <div key={rowIndex} className="p-4">
                    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                        {[...Array(columns)].map((_, colIndex) => (
                            <SkeletonBox key={colIndex} width="w-full" height="h-4" />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const SkeletonMetricsCard = () => (
    <SkeletonCard className="space-y-3">
        <div className="flex items-center justify-between">
            <SkeletonBox width="w-24" height="h-4" />
            <SkeletonCircle size="w-8 h-8" />
        </div>
        <SkeletonBox width="w-32" height="h-8" />
        <SkeletonBox width="w-20" height="h-3" />
    </SkeletonCard>
);

export const SkeletonInvoiceForm = () => (
    <div className="space-y-6">
        {/* Company and Customer Selection */}
        <SkeletonCard className="space-y-4">
            <SkeletonBox width="w-48" height="h-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <SkeletonBox width="w-24" height="h-4" />
                    <SkeletonBox width="w-full" height="h-10" />
                </div>
                <div className="space-y-2">
                    <SkeletonBox width="w-24" height="h-4" />
                    <SkeletonBox width="w-full" height="h-10" />
                </div>
            </div>
        </SkeletonCard>

        {/* Invoice Details */}
        <SkeletonCard className="space-y-4">
            <SkeletonBox width="w-48" height="h-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <SkeletonBox width="w-24" height="h-4" />
                        <SkeletonBox width="w-full" height="h-10" />
                    </div>
                ))}
            </div>
        </SkeletonCard>

        {/* Items Table */}
        <SkeletonCard className="space-y-4">
            <div className="flex items-center justify-between">
                <SkeletonBox width="w-32" height="h-6" />
                <SkeletonBox width="w-24" height="h-10" />
            </div>
            <SkeletonTable rows={3} columns={7} />
        </SkeletonCard>

        {/* Totals Section */}
        <SkeletonCard className="space-y-3">
            <div className="flex justify-end">
                <div className="w-64 space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex justify-between items-center">
                            <SkeletonBox width="w-24" height="h-4" />
                            <SkeletonBox width="w-20" height="h-4" />
                        </div>
                    ))}
                </div>
            </div>
        </SkeletonCard>
    </div>
);

export const SkeletonCustomerTable = () => (
    <div className="space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
                <SkeletonMetricsCard key={i} />
            ))}
        </div>

        {/* Filters */}
        <SkeletonCard className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <SkeletonBox key={i} width="w-full" height="h-10" />
                ))}
            </div>
        </SkeletonCard>

        {/* Table */}
        <SkeletonTable rows={8} columns={6} />
    </div>
);

export const SkeletonDashboard = () => (
    <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
            <SkeletonBox width="w-64" height="h-8" />
            <SkeletonBox width="w-96" height="h-4" />
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                <SkeletonMetricsCard key={i} />
            ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonCard className="space-y-4">
                <SkeletonBox width="w-48" height="h-6" />
                <SkeletonBox width="w-full" height="h-64" />
            </SkeletonCard>
            <SkeletonCard className="space-y-4">
                <SkeletonBox width="w-48" height="h-6" />
                <SkeletonBox width="w-full" height="h-64" />
            </SkeletonCard>
        </div>

        {/* GST Summary */}
        <SkeletonCard className="space-y-4">
            <SkeletonBox width="w-48" height="h-6" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <SkeletonBox width="w-20" height="h-4" />
                        <SkeletonBox width="w-32" height="h-8" />
                    </div>
                ))}
            </div>
        </SkeletonCard>

        {/* Recent Invoices */}
        <SkeletonCard className="space-y-4">
            <div className="flex items-center justify-between">
                <SkeletonBox width="w-48" height="h-6" />
                <SkeletonBox width="w-24" height="h-8" />
            </div>
            <SkeletonTable rows={5} columns={5} />
        </SkeletonCard>

        {/* Payment Reminders */}
        <SkeletonCard className="space-y-4">
            <SkeletonBox width="w-48" height="h-6" />
            <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                        <div className="space-y-2 flex-1">
                            <SkeletonBox width="w-48" height="h-4" />
                            <SkeletonBox width="w-32" height="h-3" />
                        </div>
                        <SkeletonBox width="w-24" height="h-6" />
                    </div>
                ))}
            </div>
        </SkeletonCard>
    </div>
);

export default {
    SkeletonBox,
    SkeletonCircle,
    SkeletonCard,
    SkeletonTable,
    SkeletonMetricsCard,
    SkeletonInvoiceForm,
    SkeletonCustomerTable,
    SkeletonDashboard
};
