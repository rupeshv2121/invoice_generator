import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const InvoiceDetailsSection = ({ invoiceDetails, onInvoiceDetailsChange }) => {
    const paymentTermsOptions = [
        { value: '', label: 'Select Payment Terms' },
        { value: 'immediate', label: 'Immediate' },
        { value: 'net15', label: 'Net 15 days' },
        { value: 'net30', label: 'Net 30 days' },
        { value: 'net45', label: 'Net 45 days' },
        { value: 'net60', label: 'Net 60 days' },
        { value: 'custom', label: 'Custom' }
    ];

    const calculateDueDate = (invoiceDate, paymentTerms) => {
        if (!invoiceDate || paymentTerms === 'immediate') return invoiceDate;

        const date = new Date(invoiceDate);
        const daysToAdd = {
            'net15': 15,
            'net30': 30,
            'net45': 45,
            'net60': 60
        }?.[paymentTerms] || 0;

        date?.setDate(date?.getDate() + daysToAdd);
        return date?.toISOString()?.split('T')?.[0];
    };

    const handleInvoiceDateChange = (value) => {
        onInvoiceDetailsChange('invoiceDate', value);
        if (invoiceDetails?.paymentTerms !== 'custom') {
            const newDueDate = calculateDueDate(value, invoiceDetails?.paymentTerms);
            onInvoiceDetailsChange('dueDate', newDueDate);
        }
    };

    const handlePaymentTermsChange = (value) => {
        onInvoiceDetailsChange('paymentTerms', value);
        if (value !== 'custom') {
            const newDueDate = calculateDueDate(invoiceDetails?.invoiceDate, value);
            onInvoiceDetailsChange('dueDate', newDueDate);
        }
    };

    return (
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Invoice Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                    label="Invoice Number"
                    type="text"
                    value={invoiceDetails?.invoiceNumber}
                    onChange={(e) => onInvoiceDetailsChange('invoiceNumber', e?.target?.value)}
                    placeholder="1001"
                    required
                    readOnly
                    className="bg-muted"
                />
                <Input
                    label="Invoice Date"
                    type="date"
                    value={invoiceDetails?.invoiceDate}
                    onChange={(e) => handleInvoiceDateChange(e?.target?.value)}
                    required
                />
                <Input
                    label="Supply Date"
                    type="date"
                    value={invoiceDetails?.supplyDate}
                    onChange={(e) => onInvoiceDetailsChange('supplyDate', e?.target?.value)}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Input
                    label="MARKA"
                    type="text"
                    value={invoiceDetails?.marka}
                    onChange={(e) => onInvoiceDetailsChange('marka', e?.target?.value)}
                    placeholder="Product marking/branding"
                />
                <Input
                    label="Transport"
                    type="text"
                    value={invoiceDetails?.transport}
                    onChange={(e) => onInvoiceDetailsChange('transport', e?.target?.value)}
                    placeholder="Transportation method/company"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Select
                    label="Payment Terms (Optional)"
                    options={paymentTermsOptions}
                    value={invoiceDetails?.paymentTerms}
                    onChange={handlePaymentTermsChange}
                />
                <Input
                    label="Due Date (Optional)"
                    type="date"
                    value={invoiceDetails?.dueDate}
                    onChange={(e) => onInvoiceDetailsChange('dueDate', e?.target?.value)}
                    disabled={invoiceDetails?.paymentTerms !== 'custom' && invoiceDetails?.paymentTerms !== ''}
                />
            </div>
        </div>
    );
};

export default InvoiceDetailsSection;