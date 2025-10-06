import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import QuickActionButton from '../../components/ui/QuickActionButton';
import { getMyCompanyProfile } from '../../services/companyProfileService';
import { getAllCustomers } from '../../services/customerService';
import { downloadInvoicePDF } from '../../services/pdfService';
import { getDefaultInvoiceValues, getNextInvoiceNumber } from '../../services/settingsService';
import { downloadSimpleInvoicePDF } from '../../services/simplePdfService';
import CompanyCustomerSelector from './components/CompanyCustomerSelector';
import InvoiceDetailsSection from './components/InvoiceDetailsSection';
import InvoiceItemsTable from './components/InvoiceItemsTable';
import InvoicePreviewModal from './components/InvoicePreviewModal';
import InvoiceTotalsSection from './components/InvoiceTotalsSection';

const InvoiceCreation = () => {
    const navigate = useNavigate();
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [sameAsShipping, setSameAsShipping] = useState(true);

    // Mock data - in real app, these would come from API calls

    // Your business profile (logged-in user's company) - fetched from service
    const [myCompanyProfile, setMyCompanyProfile] = useState(null);

    // Customers state - loaded from customer service
    const [customers, setCustomers] = useState([]);
    const [customersLoading, setCustomersLoading] = useState(true);

    // Selected customer ID
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);

    // Derived data based on selections
    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

    // Load company profile and customers on component mount
    useEffect(() => {
        const profile = getMyCompanyProfile();
        setMyCompanyProfile(profile);

        // Load customers from service
        try {
            const customersList = getAllCustomers();
            console.log('Loaded customers:', customersList);
            setCustomers(customersList);
        } catch (error) {
            console.error('Error loading customers:', error);
            setCustomers([]);
        } finally {
            setCustomersLoading(false);
        }
    }, []);

    // Company data state - auto-populated from selected company
    const [companyData, setCompanyData] = useState({});

    // Customer data state - auto-populated from selected customer
    const [customerData, setCustomerData] = useState({
        selectedCustomer: null,
        billingAddress: {
            name: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            gstin: '',
            eximCode: '',
            country: ''
        },
        shippingAddress: {
            name: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            country: ''
        }
    });

    // Bank details - auto-populated from selected company
    const [autoPopulatedBankDetails, setAutoPopulatedBankDetails] = useState({});

    // Load default values from settings
    const defaultValues = getDefaultInvoiceValues();

    // Invoice details state
    const [invoiceDetails, setInvoiceDetails] = useState({
        invoiceNumber: getNextInvoiceNumber(),
        invoiceDate: new Date()?.toISOString()?.split('T')?.[0],
        paymentTerms: defaultValues.paymentTerms || '',
        dueDate: '',
        marka: defaultValues.marka || '',
        transport: defaultValues.transport || '',
        supplyDate: new Date()?.toISOString()?.split('T')?.[0]
    });

    // Auto-populate company data from logged-in user's profile
    useEffect(() => {
        if (myCompanyProfile) {
            // Use the loaded company profile data
            const fullAddress = `${myCompanyProfile.addressLine1}${myCompanyProfile.addressLine2 ? ', ' + myCompanyProfile.addressLine2 : ''}`;

            setCompanyData({
                name: myCompanyProfile.companyName,
                companyName: myCompanyProfile.companyName,
                gstin: myCompanyProfile.gstNumber,
                iecCode: myCompanyProfile.iecCode,
                arn: myCompanyProfile.arn,
                address: fullAddress,
                phone: myCompanyProfile.phone,
                email: myCompanyProfile.email,
                state: myCompanyProfile.state,
                stateCode: myCompanyProfile.stateCode,
                city: myCompanyProfile.city,
                pincode: myCompanyProfile.postalCode
            });

            setAutoPopulatedBankDetails({
                bankName: myCompanyProfile.bankDetails.bankName,
                accountNumber: myCompanyProfile.bankDetails.accountNumber,
                ifscCode: myCompanyProfile.bankDetails.ifscCode,
                accountName: myCompanyProfile.bankDetails.accountName,
                accountType: myCompanyProfile.bankDetails.accountType,
                branchName: myCompanyProfile.bankDetails.branchName
            });
        }
    }, [myCompanyProfile]); // Run when company profile is loaded

    // Auto-populate customer data when customer selection changes
    useEffect(() => {
        if (selectedCustomer) {
            setCustomerData({
                selectedCustomer: selectedCustomer,
                billingAddress: {
                    name: selectedCustomer.businessName,
                    address: selectedCustomer.billingAddress.street,
                    city: selectedCustomer.billingAddress.city,
                    state: selectedCustomer.billingAddress.state,
                    pincode: selectedCustomer.billingAddress.pincode,
                    gstin: selectedCustomer.gstNumber,
                    eximCode: selectedCustomer.eximCode,
                    country: selectedCustomer.billingAddress.country
                },
                shippingAddress: {
                    name: selectedCustomer.businessName,
                    address: selectedCustomer.shippingAddress.street,
                    city: selectedCustomer.shippingAddress.city,
                    state: selectedCustomer.shippingAddress.state,
                    pincode: selectedCustomer.shippingAddress.pincode,
                    country: selectedCustomer.shippingAddress.country
                }
            });
        }
    }, [selectedCustomer]);

    // Invoice items state
    const [items, setItems] = useState([
        {
            id: Date.now(),
            description: 'Safty 1.5" (Door King Brand)',
            hsnCode: '83024110',
            unit: 'gz',
            quantity: 5,
            rate: 320,
            discountPercent: 0,
            taxRate: 0, // Export items typically have 0% tax
            grossAmount: 1600,
            discountAmount: 0,
            taxableAmount: 1600,
            cgstAmount: 0,
            sgstAmount: 0,
            igstAmount: 0,
            totalAmount: 1600
        },
        {
            id: Date.now() + 1,
            description: 'Safty 2" (Door King Brand)',
            hsnCode: '83024110',
            unit: 'gz',
            quantity: 10,
            rate: 360,
            discountPercent: 0,
            taxRate: 0,
            grossAmount: 3600,
            discountAmount: 0,
            taxableAmount: 3600,
            cgstAmount: 0,
            sgstAmount: 0,
            igstAmount: 0,
            totalAmount: 3600
        },
        {
            id: Date.now() + 2,
            description: 'Safty 4" (Door King Brand)',
            hsnCode: '83024110',
            unit: 'gz',
            quantity: 5,
            rate: 500,
            discountPercent: 0,
            taxRate: 0,
            grossAmount: 2500,
            discountAmount: 0,
            taxableAmount: 2500,
            cgstAmount: 0,
            sgstAmount: 0,
            igstAmount: 0,
            totalAmount: 2500
        },
        {
            id: Date.now() + 3,
            description: 'Tower Bolt 4" (Anti Brand)',
            hsnCode: '83024110',
            unit: 'doz',
            quantity: 200,
            rate: 174,
            discountPercent: 0,
            taxRate: 0,
            grossAmount: 34800,
            discountAmount: 0,
            taxableAmount: 34800,
            cgstAmount: 0,
            sgstAmount: 0,
            igstAmount: 0,
            totalAmount: 34800
        }
    ]);

    // Additional charges state
    const [additionalCharges, setAdditionalCharges] = useState({
        shipping: 0,
        other: 0
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

    const handleDownloadPDF = () => {
        if (!validateForm()) {
            return;
        }

        const invoiceData = {
            companyData,
            customerData,
            invoiceDetails,
            items,
            additionalCharges
        };

        try {
            // Try the main PDF service first
            const result = downloadInvoicePDF(invoiceData);
            if (result.success) {
                alert('PDF downloaded successfully!');
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.warn('Main PDF service failed, trying simple PDF service:', error);
            // Fallback to simple PDF service
            try {
                const fallbackResult = downloadSimpleInvoicePDF(invoiceData);
                if (fallbackResult.success) {
                    alert('PDF downloaded successfully! (using simplified format)');
                } else {
                    alert('Error downloading PDF: ' + fallbackResult.error);
                }
            } catch (fallbackError) {
                alert('Error downloading PDF: ' + fallbackError.message);
            }
        }
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
                                variant="outline"
                                onClick={handleDownloadPDF}
                                iconName="Download"
                                iconPosition="left"
                            >
                                Download PDF
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
                        <CompanyCustomerSelector
                            customers={customers}
                            selectedCustomerId={selectedCustomerId}
                            onCustomerChange={setSelectedCustomerId}
                            myCompanyProfile={myCompanyProfile}
                            loading={customersLoading}
                        />

                        {/* <CompanyDetailsSection
                            companyData={companyData}
                            onCompanyDataChange={handleCompanyDataChange}
                        /> */}
                        {/* 
                        <CustomerDetailsSection
                            customerData={customerData}
                            onCustomerDataChange={handleCustomerDataChange}
                            customers={mockCustomers}
                            sameAsShipping={sameAsShipping}
                            onSameAsShippingChange={handleSameAsShippingChange}
                        /> */}

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
                                variant="outline"
                                onClick={handleDownloadPDF}
                                iconName="Download"
                                iconPosition="left"
                                fullWidth
                            >
                                Download PDF
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
            />
        </div>
    );
};

export default InvoiceCreation;