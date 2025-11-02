import Icon from '../../../components/AppIcon';

const CustomerStats = ({ stats }) => {

    const statItems = [
        {
            label: 'Total Customers',
            value: stats?.totalCustomers || 0,
            icon: 'Users',
            bgColor: 'bg-blue-50',
            color: 'text-blue-600'
        },
        {
            label: 'New This Month',
            value: stats?.newCustomersThisMonth || 0,
            icon: 'UserPlus',
            bgColor: 'bg-green-50',
            color: 'text-green-600'
        },
        {
            label: 'GST Registered',
            value: stats?.gstRegisteredCount || 0,
            icon: 'FileText',
            bgColor: 'bg-indigo-50',
            color: 'text-indigo-600'
        },
        {
            label: 'With Invoices',
            value: stats?.customersWithInvoices || 0,
            icon: 'Receipt',
            bgColor: 'bg-purple-50',
            color: 'text-purple-600'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statItems.map((item, index) => (
                <div key={index} className="bg-card rounded-lg border border-border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-text-secondary mb-1">{item.label}</p>
                            <p className="text-2xl font-bold text-foreground">{item.value}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${item.bgColor}`}>
                            <Icon name={item.icon} size={24} className={item.color} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CustomerStats;
