import Input from '../../../components/ui/Input';

const CompanyDetailsSection = ({ companyData, onCompanyDataChange }) => {
    return (
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Company Details</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Input
                    label="Company Name"
                    type="text"
                    value={companyData?.name}
                    onChange={(e) => onCompanyDataChange('name', e?.target?.value)}
                    placeholder="Enter company name"
                    required
                />
                <Input
                    label="GSTIN"
                    type="text"
                    value={companyData?.gstin}
                    onChange={(e) => onCompanyDataChange('gstin', e?.target?.value)}
                    placeholder="Enter GSTIN number"
                    required
                />
                <div className="lg:col-span-2">
                    <Input
                        label="Address"
                        type="text"
                        value={companyData?.address}
                        onChange={(e) => onCompanyDataChange('address', e?.target?.value)}
                        placeholder="Enter company address"
                        required
                    />
                </div>
                <Input
                    label="Phone"
                    type="tel"
                    value={companyData?.phone}
                    onChange={(e) => onCompanyDataChange('phone', e?.target?.value)}
                    placeholder="Enter phone number"
                />
                <Input
                    label="Email"
                    type="email"
                    value={companyData?.email}
                    onChange={(e) => onCompanyDataChange('email', e?.target?.value)}
                    placeholder="Enter email address"
                />
            </div>
        </div>
    );
};

export default CompanyDetailsSection;