import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
    const navigate = useNavigate();

    const actions = [
        {
            title: 'Create New Invoice',
            description: 'Generate a new invoice',
            icon: 'FileText',
            color: 'default',
            onClick: () => navigate('/invoice-creation')
        },
        {
            title: 'Add Customer',
            description: 'Add a new customer to your database',
            icon: 'UserPlus',
            color: 'secondary',
            onClick: () => navigate('/customer-management')
        },
        {
            title: 'PDF Preview Test',
            description: 'Test PDF generation and preview',
            icon: 'Eye',
            color: 'warning',
            onClick: () => navigate('/pdf-preview')
        },
        {
            title: 'Generate Report',
            description: 'View detailed business reports',
            icon: 'BarChart3',
            color: 'outline',
            onClick: () => navigate('/reports')
        }
    ];

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {actions?.map((action, index) => (
                    <div key={index} className="p-4 flex flex-col justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <Button
                            variant={action?.color}
                            onClick={action?.onClick}
                            className="mb-2 flex items-center justify-center"
                        >
                            <Icon name={action?.icon} size={16} className="mr-2" />
                            {action?.title}
                        </Button>
                        <p className="text-sm text-gray-600 text-center">{action?.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;