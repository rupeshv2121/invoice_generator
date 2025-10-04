import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentReminders = ({ reminders }) => {
    const navigate = useNavigate();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        })?.format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString)?.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getDaysOverdue = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = today - due;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <div className="bg-card border border-border rounded-lg invoice-shadow-sm">
            <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Payment Reminders</h3>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/invoice-list?filter=overdue')}
                    iconName="Clock"
                    iconPosition="left"
                >
                    View All
                </Button>
            </div>
            <div className="p-6">
                {reminders?.length === 0 ? (
                    <div className="text-center py-8">
                        <Icon name="CheckCircle" size={48} className="mx-auto text-success mb-4" />
                        <p className="text-text-secondary">No overdue payments!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reminders?.map((reminder) => {
                            const daysOverdue = getDaysOverdue(reminder?.dueDate);
                            return (
                                <div key={reminder?.id} className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg border border-border">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-error rounded-full flex items-center justify-center">
                                            <Icon name="AlertTriangle" size={20} color="white" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{reminder?.customerName}</p>
                                            <p className="text-sm text-text-secondary">
                                                Invoice #{reminder?.invoiceNumber} • Due: {formatDate(reminder?.dueDate)}
                                            </p>
                                            <p className="text-xs text-error font-medium">
                                                {daysOverdue > 0 ? `${daysOverdue} days overdue` : 'Due today'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-foreground">{formatCurrency(reminder?.amount)}</p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            iconName="Send"
                                            onClick={() => {/* Handle send reminder */ }}
                                            className="mt-1"
                                        >
                                            Remind
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentReminders;