import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
    const navigate = useNavigate();

    const actions = [
        {
            title: 'Create New Invoice',
            description: 'Generate a new invoice for your customer',
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
            title: 'Generate Report',
            description: 'View detailed business reports',
            icon: 'BarChart3',
            color: 'outline',
            onClick: () => navigate('/reports')
        }
    ];

    return (
        <div className="bg-card border border-border rounded-lg p-6 invoice-shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {actions?.map((action, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg hover:bg-muted transition-colors duration-200">
                        <Button
                            variant={action?.color}
                            fullWidth
                            iconName={action?.icon}
                            iconPosition="left"
                            onClick={action?.onClick}
                            className="mb-2"
                        >
                            {action?.title}
                        </Button>
                        <p className="text-sm text-text-secondary text-center">{action?.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;