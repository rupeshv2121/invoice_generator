import Icon from '../../../components/AppIcon';

const CompanyStats = ({ companies }) => {
    const stats = {
        total: companies.length,
        active: companies.filter(company => company.status === 'Active').length,
        inactive: companies.filter(company => company.status === 'Inactive').length,
        gstRegistered: companies.filter(company => company.gstStatus === 'Registered').length
    };

    const statsData = [
        {
            title: 'Total Companies',
            value: stats.total,
            icon: 'Building2',
            color: 'bg-blue-500',
            textColor: 'text-blue-600'
        },
        {
            title: 'Active Companies',
            value: stats.active,
            icon: 'CheckCircle',
            color: 'bg-green-500',
            textColor: 'text-green-600'
        },
        {
            title: 'Inactive Companies',
            value: stats.inactive,
            icon: 'XCircle',
            color: 'bg-red-500',
            textColor: 'text-red-600'
        },
        {
            title: 'GST Registered',
            value: stats.gstRegistered,
            icon: 'FileText',
            color: 'bg-purple-500',
            textColor: 'text-purple-600'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                            <Icon name={stat.icon} size={24} color="white" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CompanyStats;