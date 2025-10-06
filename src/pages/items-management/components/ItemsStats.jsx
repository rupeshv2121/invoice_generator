
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
            title: 'Total Purchase Value',
            value: formatCurrency(stats.totalPurchaseValue),
            icon: (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
            ),
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        },
        {
            title: 'Total Selling Value',
            value: formatCurrency(stats.totalSellingValue),
            icon: (
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600'
        },
        {
            title: 'Average Margin',
            value: `${stats.averageMargin || 0}%`,
            icon: (
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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