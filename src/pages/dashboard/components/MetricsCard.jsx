import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, icon, trend, trendValue, color = 'primary' }) => {
    const colorClasses = {
        primary: 'bg-blue-600 text-white',
        success: 'bg-green-600 text-white',
        warning: 'bg-yellow-500 text-white',
        error: 'bg-red-600 text-white'
    };

    const trendColorClasses = {
        up: 'text-green-600',
        down: 'text-red-600',
        neutral: 'text-gray-500'
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <div className="flex items-center mt-2">
                            <Icon
                                name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'}
                                size={16}
                                className={`mr-1 ${trendColorClasses?.[trend]}`}
                            />
                            <span className={`text-sm font-medium ${trendColorClasses?.[trend]}`}>
                                {trendValue}
                            </span>
                        </div>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses?.[color]}`}>
                    <Icon name={icon} size={24} color='white' />
                </div>
            </div>
        </div>
    );
};

export default MetricsCard;