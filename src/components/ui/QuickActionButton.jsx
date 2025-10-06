import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

const QuickActionButton = () => {
    const navigate = useNavigate();

    const handleCreateInvoice = () => {
        navigate('/invoice-creation');
    };

    return (
        <div className="fixed bottom-6 right-6 z-40 lg:hidden">
            <Button
                size="lg"
                onClick={handleCreateInvoice}
                className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200"
                iconSize={16}
            >
                <span className="flex items-center justify-center"><Plus /> </span>
            </Button>
        </div>
    );
};

export default QuickActionButton;