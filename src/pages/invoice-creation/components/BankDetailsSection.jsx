import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BankDetailsSection = ({ bankDetails, onBankDetailsChange, termsAndConditions, onTermsChange }) => {
    const bankTemplates = [
        {
            value: 'sbi',
            label: 'State Bank of India',
            accountName: 'ABC Company Pvt Ltd',
            accountNumber: '12345678901234',
            ifscCode: 'SBIN0001234',
            bankName: 'State Bank of India',
            branch: 'Main Branch'
        },
        {
            value: 'hdfc',
            label: 'HDFC Bank',
            accountName: 'ABC Company Pvt Ltd',
            accountNumber: '50100123456789',
            ifscCode: 'HDFC0001234',
            bankName: 'HDFC Bank Limited',
            branch: 'Corporate Branch'
        },
        {
            value: 'icici',
            label: 'ICICI Bank',
            accountName: 'ABC Company Pvt Ltd',
            accountNumber: '123456789012',
            ifscCode: 'ICIC0001234',
            bankName: 'ICICI Bank Limited',
            branch: 'Business Branch'
        },
        {
            value: 'custom',
            label: 'Custom Bank Details'
        }
    ];

    const termsTemplates = [
        {
            value: 'standard',
            label: 'Standard Terms',
            content: `1. Payment is due within the specified payment terms.\n2. Late payments may incur additional charges.\n3. All disputes must be resolved within 30 days of invoice date.\n4. Goods once sold will not be taken back.\n5. Subject to local jurisdiction only.\n6. All payments should be made in favor of the company.\n7. Any discrepancy in the invoice should be reported within 7 days.`
        },
        {
            value: 'service',
            label: 'Service Terms',
            content: `1. Payment terms as agreed in the service contract.\n2. Services are non-refundable once delivered.\n3. Any modifications to services will be charged separately.\n4. Client is responsible for providing necessary access and information.\n5. Confidentiality clause applies to all service deliverables.\n6. Force majeure events may affect service delivery timelines.\n7. Governing law: Indian Contract Act, 1872.`
        },
        {
            value: 'custom',
            label: 'Custom Terms'
        }
    ];

    const handleBankTemplateChange = (templateValue) => {
        const template = bankTemplates?.find(t => t?.value === templateValue);
        if (template && template?.value !== 'custom') {
            onBankDetailsChange('template', templateValue);
            onBankDetailsChange('accountName', template?.accountName);
            onBankDetailsChange('accountNumber', template?.accountNumber);
            onBankDetailsChange('ifscCode', template?.ifscCode);
            onBankDetailsChange('bankName', template?.bankName);
            onBankDetailsChange('branch', template?.branch);
        } else {
            onBankDetailsChange('template', 'custom');
        }
    };

    const handleTermsTemplateChange = (templateValue) => {
        const template = termsTemplates?.find(t => t?.value === templateValue);
        if (template && template?.value !== 'custom') {
            onTermsChange('template', templateValue);
            onTermsChange('content', template?.content);
        } else {
            onTermsChange('template', 'custom');
        }
    };

    return (
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Bank Details & Terms</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bank Details */}
                <div>
                    <h3 className="text-md font-medium text-foreground mb-3">Bank Details</h3>
                    <div className="space-y-3">
                        <Select
                            label="Bank Template"
                            options={bankTemplates}
                            value={bankDetails?.template}
                            onChange={handleBankTemplateChange}
                            placeholder="Select bank template"
                        />
                        <Input
                            label="Account Name"
                            type="text"
                            value={bankDetails?.accountName}
                            onChange={(e) => onBankDetailsChange('accountName', e?.target?.value)}
                            placeholder="Account holder name"
                            required
                        />
                        <Input
                            label="Account Number"
                            type="text"
                            value={bankDetails?.accountNumber}
                            onChange={(e) => onBankDetailsChange('accountNumber', e?.target?.value)}
                            placeholder="Bank account number"
                            required
                        />
                        <Input
                            label="IFSC Code"
                            type="text"
                            value={bankDetails?.ifscCode}
                            onChange={(e) => onBankDetailsChange('ifscCode', e?.target?.value)}
                            placeholder="IFSC code"
                            required
                        />
                        <Input
                            label="Bank Name"
                            type="text"
                            value={bankDetails?.bankName}
                            onChange={(e) => onBankDetailsChange('bankName', e?.target?.value)}
                            placeholder="Bank name"
                            required
                        />
                        <Input
                            label="Branch"
                            type="text"
                            value={bankDetails?.branch}
                            onChange={(e) => onBankDetailsChange('branch', e?.target?.value)}
                            placeholder="Branch name"
                        />
                    </div>
                </div>

                {/* Terms and Conditions */}
                <div>
                    <h3 className="text-md font-medium text-foreground mb-3">Terms & Conditions</h3>
                    <div className="space-y-3">
                        <Select
                            label="Terms Template"
                            options={termsTemplates}
                            value={termsAndConditions?.template}
                            onChange={handleTermsTemplateChange}
                            placeholder="Select terms template"
                        />
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Terms & Conditions
                            </label>
                            <textarea
                                value={termsAndConditions?.content}
                                onChange={(e) => onTermsChange('content', e?.target?.value)}
                                placeholder="Enter terms and conditions"
                                rows={8}
                                className="w-full px-3 py-2 border border-border rounded-md text-sm text-foreground bg-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BankDetailsSection;