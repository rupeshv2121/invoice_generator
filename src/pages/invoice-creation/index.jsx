import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import QuickActionButton from '../../components/ui/QuickActionButton';
import BankDetailsSection from './components/BankDetailsSection';
import CompanyDetailsSection from './components/CompanyDetailsSection';
import CustomerDetailsSection from './components/CustomerDetailsSection';
import InvoiceDetailsSection from './components/InvoiceDetailsSection';
import InvoiceItemsTable from './components/InvoiceItemsTable';
import InvoicePreviewModal from './components/InvoicePreviewModal';
import InvoiceTotalsSection from './components/InvoiceTotalsSection';

const InvoiceCreation = () => {
    const navigate = useNavigate();
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [sameAsShipping, setSameAsShipping] = useState(true);

    // Mock data
    const mockCustomers = [
        {
            id: 1,
            name: "Rajesh Kumar Enterprises",
            email: "rajesh@rke.com",
            address: "123 Business Park, Sector 18",
            city: "Gurgaon",
            state: "Haryana",
            pincode: "122001",
            gstin: "06ABCDE1234F1Z5"
        },
        {
            id: 2,
            name: "Mumbai Trading Co.",
            email: "info@mumbaitrading.com",
            address: "456 Commercial Street, Andheri East",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400069",
            gstin: "27FGHIJ5678K2L9"
        },
        {
            id: 3,
            name: "Chennai Software Solutions",
            email: "contact@chennaisoftware.com",
            address: "789 IT Park, OMR",
            city: "Chennai",
            state: "Tamil Nadu",
            pincode: "600096",
            gstin: "33MNOPQ9012R3S4"
        }
    ];

    // Company data state
    const [companyData, setCompanyData] = useState({
        name: "ABC Company Pvt Ltd",
        gstin: "07ABCDE1234F1Z5",
        address: "Plot No. 123, Industrial Area, Phase-1, Gurgaon, Haryana - 122016",
        phone: "+91 9876543210",
        email: "info@abccompany.com",
        state: "Haryana"
    });

    // Customer data state
    const [customerData, setCustomerData] = useState({
        selectedCustomer: null,
        billingAddress: {
            name: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            gstin: ''
        },
        shippingAddress: {
            name: '',
            address: '',
            city: '',
            state: '',
            pincode: ''
        }
    });

    // Invoice details state
    const [invoiceDetails, setInvoiceDetails] = useState({
        invoiceNumber: `INV-${new Date()?.getFullYear()}-${String(Date.now())?.slice(-6)}`,
        invoiceDate: new Date()?.toISOString()?.split('T')?.[0],
        paymentTerms: 'net30',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)?.toISOString()?.split('T')?.[0]
    });

    // Invoice items state
    const [items, setItems] = useState([
        {
            id: Date.now(),
            description: '',
            hsnCode: '',
            unit: 'pcs',
            quantity: 1,
            rate: 0,
            discountPercent: 0,
            taxRate: 18,
            grossAmount: 0,
            discountAmount: 0,
            taxableAmount: 0,
            cgstAmount: 0,
            sgstAmount: 0,
            igstAmount: 0,
            totalAmount: 0
        }
    ]);

    // Additional charges state
    const [additionalCharges, setAdditionalCharges] = useState({
        shipping: 0,
        other: 0
    });

    // Bank details state
    const [bankDetails, setBankDetails] = useState({
        template: 'sbi',
        accountName: 'ABC Company Pvt Ltd',
        accountNumber: '12345678901234',
        ifscCode: 'SBIN0001234',
        bankName: 'State Bank of India',
        branch: 'Main Branch'
    });

    // Terms and conditions state
    const [termsAndConditions, setTermsAndConditions] = useState({
        template: 'standard',
        content: `1. Payment is due within the specified payment terms.\n2. Late payments may incur additional charges.\n3. All disputes must be resolved within 30 days of invoice date.\n4. Goods once sold will not be taken back.\n5. Subject to local jurisdiction only.\n6. All payments should be made in favor of the company.\n7. Any discrepancy in the invoice should be reported within 7 days.`
    });

    // Handle same as shipping checkbox
    useEffect(() => {
        if (sameAsShipping && customerData?.billingAddress?.name) {
            setCustomerData(prev => ({
                ...prev,
                shippingAddress: {
                    name: prev?.billingAddress?.name,
                    address: prev?.billingAddress?.address,
                    city: prev?.billingAddress?.city,
                    state: prev?.billingAddress?.state,
                    pincode: prev?.billingAddress?.pincode
                }
            }));
        }
    }, [sameAsShipping, customerData?.billingAddress]);

    // Handler functions
    const handleCompanyDataChange = (field, value) => {
        setCompanyData(prev => ({ ...prev, [field]: value }));
    };

    const handleCustomerDataChange = (field, value) => {
        setCustomerData(prev => ({ ...prev, [field]: value }));
    };

    const handleInvoiceDetailsChange = (field, value) => {
        setInvoiceDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleAdditionalChargesChange = (field, value) => {
        setAdditionalCharges(prev => ({ ...prev, [field]: value }));
    };

    const handleBankDetailsChange = (field, value) => {
        setBankDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleTermsChange = (field, value) => {
        setTermsAndConditions(prev => ({ ...prev, [field]: value }));
    };

    const handleSameAsShippingChange = (checked) => {
        setSameAsShipping(checked);
        if (checked) {
            setCustomerData(prev => ({
                ...prev,
                shippingAddress: {
                    name: prev?.billingAddress?.name,
                    address: prev?.billingAddress?.address,
                    city: prev?.billingAddress?.city,
                    state: prev?.billingAddress?.state,
                    pincode: prev?.billingAddress?.pincode
                }
            }));
        }
    };

    const handlePreview = () => {
        setIsPreviewOpen(true);
    };

    const handleSaveDraft = () => {
        alert('Invoice saved as draft successfully!');
        navigate('/invoice-list');
    };

    const handleGenerateInvoice = () => {
        alert('Invoice generated successfully!');
        navigate('/invoice-list');
    };

    const validateForm = () => {
        if (!customerData?.selectedCustomer) {
            alert('Please select a customer');
            return false;
        }
        if (items?.some(item => !item?.description || item?.quantity <= 0 || item?.rate <= 0)) {
            alert('Please fill all item details correctly');
            return false;
        }
        return true;
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Breadcrumb />

                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Create Invoice</h1>
                            <p className="text-text-secondary mt-1">Generate professional GST-compliant invoices</p>
                        </div>
                        <div className="hidden lg:flex items-center space-x-3">
                            <Button
                                variant="outline"
                                onClick={handleSaveDraft}
                                iconName="Save"
                                iconPosition="left"
                            >
                                Save Draft
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={handlePreview}
                                iconName="Eye"
                                iconPosition="left"
                            >
                                Preview
                            </Button>
                            <Button
                                variant="default"
                                onClick={() => {
                                    if (validateForm()) {
                                        handleGenerateInvoice();
                                    }
                                }}
                                iconName="FileText"
                                iconPosition="left"
                            >
                                Generate Invoice
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <CompanyDetailsSection
                            companyData={companyData}
                            onCompanyDataChange={handleCompanyDataChange}
                        />

                        <CustomerDetailsSection
                            customerData={customerData}
                            onCustomerDataChange={handleCustomerDataChange}
                            customers={mockCustomers}
                            sameAsShipping={sameAsShipping}
                            onSameAsShippingChange={handleSameAsShippingChange}
                        />

                        <InvoiceDetailsSection
                            invoiceDetails={invoiceDetails}
                            onInvoiceDetailsChange={handleInvoiceDetailsChange}
                        />

                        <InvoiceItemsTable
                            items={items}
                            onItemsChange={setItems}
                            companyState={companyData?.state}
                            customerState={customerData?.billingAddress?.state}
                        />

                        <InvoiceTotalsSection
                            items={items}
                            additionalCharges={additionalCharges}
                            onAdditionalChargesChange={handleAdditionalChargesChange}
                        />

                        <BankDetailsSection
                            bankDetails={bankDetails}
                            onBankDetailsChange={handleBankDetailsChange}
                            termsAndConditions={termsAndConditions}
                            onTermsChange={handleTermsChange}
                        />

                        {/* Mobile Action Buttons */}
                        <div className="lg:hidden flex flex-col space-y-3">
                            <Button
                                variant="outline"
                                onClick={handleSaveDraft}
                                iconName="Save"
                                iconPosition="left"
                                fullWidth
                            >
                                Save Draft
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={handlePreview}
                                iconName="Eye"
                                iconPosition="left"
                                fullWidth
                            >
                                Preview Invoice
                            </Button>
                            <Button
                                variant="default"
                                onClick={() => {
                                    if (validateForm()) {
                                        handleGenerateInvoice();
                                    }
                                }}
                                iconName="FileText"
                                iconPosition="left"
                                fullWidth
                            >
                                Generate Invoice
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <QuickActionButton />
            <InvoicePreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                companyData={companyData}
                customerData={customerData}
                invoiceDetails={invoiceDetails}
                items={items}
                additionalCharges={additionalCharges}
                bankDetails={bankDetails}
                termsAndConditions={termsAndConditions}
            />
        </div>
    );
};

export default InvoiceCreation;