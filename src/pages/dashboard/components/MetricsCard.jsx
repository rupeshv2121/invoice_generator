import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, icon, trend, trendValue, color = 'primary' }) => {
    const colorClasses = {
        primary: 'bg-primary text-primary-foreground',
        success: 'bg-success text-success-foreground',
        warning: 'bg-warning text-warning-foreground',
        error: 'bg-error text-error-foreground'
    };

    const trendColorClasses = {
        up: 'text-success',
        down: 'text-error',
        neutral: 'text-text-secondary'
    };

    return (
        <div className="bg-card border border-border rounded-lg p-6 invoice-shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
                    <p className="text-2xl font-bold text-foreground">{value}</p>
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
                    <Icon name={icon} size={24} />
                </div>
            </div>
        </div>
    );
};

export default MetricsCard;