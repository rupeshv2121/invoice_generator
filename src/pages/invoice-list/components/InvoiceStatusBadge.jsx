import Icon from '../../../components/AppIcon';

const InvoiceStatusBadge = ({ status }) => {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'draft':
                return {
                    label: 'Draft',
                    className: 'bg-gray-100 text-gray-800 border-gray-200',
                    icon: 'FileEdit'
                };
            case 'sent':
                return {
                    label: 'Sent',
                    className: 'bg-blue-100 text-blue-800 border-blue-200',
                    icon: 'Send'
                };
            case 'paid':
                return {
                    label: 'Paid',
                    className: 'bg-green-100 text-green-800 border-green-200',
                    icon: 'CheckCircle'
                };
            case 'overdue':
                return {
                    label: 'Overdue',
                    className: 'bg-red-100 text-red-800 border-red-200',
                    icon: 'AlertCircle'
                };
            default:
                return {
                    label: 'Unknown',
                    className: 'bg-gray-100 text-gray-800 border-gray-200',
                    icon: 'HelpCircle'
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium border ${config?.className}`}>
            <Icon name={config?.icon} size={12} />
            <span>{config?.label}</span>
        </span>
    );
};

export default InvoiceStatusBadge;