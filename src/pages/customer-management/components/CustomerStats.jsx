import Icon from '../../../components/AppIcon';

const CustomerStats = ({ stats }) => {
    const statItems = [
        {
            label: 'Total Customers',
            value: stats?.totalCustomers,
            icon: 'Users',
            color: 'text-primary',
            bgColor: 'bg-primary/10'
        },
        {
            label: 'Active Customers',
            value: stats?.activeCustomers,
            icon: 'UserCheck',
            color: 'text-success',
            bgColor: 'bg-success/10'
        },
        {
            label: 'GST Registered',
            value: stats?.gstRegistered,
            icon: 'FileText',
            color: 'text-secondary',
            bgColor: 'bg-secondary/10'
        },
        {
            label: 'Outstanding Amount',
            value: `₹${stats?.outstandingAmount?.toLocaleString('en-IN')}`,
            icon: 'IndianRupee',
            color: 'text-warning',
            bgColor: 'bg-warning/10'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statItems?.map((item, index) => (
                <div key={index} className="bg-card rounded-lg border border-border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-text-secondary mb-1">{item?.label}</p>
                            <p className="text-2xl font-bold text-foreground">{item?.value}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${item?.bgColor}`}>
                            <Icon name={item?.icon} size={24} className={item?.color} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CustomerStats;