
const ItemsStats = ({ stats }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount || 0);
    };

    const statsCards = [
        {
            title: 'Total Items',
            value: stats.totalItems || 0,
            icon: (
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-3.5a2 2 0 00-2 2v1a2 2 0 002 2H20m-16 0h3.5a2 2 0 002-2v-1a2 2 0 00-2-2H4m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v4" />
                </svg>
            ),
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            title: 'New Items This Month',
            value: stats.newItemsThisMonth || 0,
            icon: (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            ),
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        },
        {
            title: 'Average Selling Price',
            value: formatCurrency(stats.averageSellingPrice),
            icon: (
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600'
        },
        {
            title: 'Low Stock Items',
            value: stats.lowStockItems || 0,
            icon: (
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
            {statsCards.map((card, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
                    <div className="flex items-center">
                        <div className={`p-2 lg:p-3 rounded-lg ${card.bgColor} flex-shrink-0`}>
                            <div className="w-6 h-6 lg:w-8 lg:h-8 [&>svg]:w-full [&>svg]:h-full">
                                {card.icon}
                            </div>
                        </div>
                        <div className="ml-3 lg:ml-4 flex-1 min-w-0">
                            <h3 className="text-xs lg:text-sm font-medium text-gray-500 truncate">{card.title}</h3>
                            <p className={`text-lg lg:text-2xl font-bold ${card.textColor} truncate`}>
                                {card.value}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ItemsStats;