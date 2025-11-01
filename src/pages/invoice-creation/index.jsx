import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomersService } from '../../api/customers';
import { useMyCompanyService } from '../../api/myCompany';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import QuickActionButton from '../../components/ui/QuickActionButton';
import { downloadInvoicePDF } from '../../services/pdfService';
import { getDefaultInvoiceValues, getNextInvoiceNumber } from '../../services/settingsService';
// import { downloadSimpleInvoicePDF } from '../../services/simplePdfService';
import { useInvoiceService } from '../../api/invoice';
import { useItemService } from '../../api/items';
import CompanyCustomerSelector from './components/CompanyCustomerSelector';
import InvoiceDetailsSection from './components/InvoiceDetailsSection';
import InvoiceItemsTable from './components/InvoiceItemsTable';
import InvoicePreviewModal from './components/InvoicePreviewModal';
import InvoiceTotalsSection from './components/InvoiceTotalsSection';

const InvoiceCreation = () => {
    const navigate = useNavigate();
    const { getItems } = useItemService();
    const { getCustomers } = useCustomersService();
    const { createInvoice } = useInvoiceService();
    const { getMyCompany } = useMyCompanyService();
    // Master list of all items (from backend)
    const [allItems, setAllItems] = useState([]);
    // Invoice line items (rows in the invoice)
    const [invoiceItems, setInvoiceItems] = useState([
        {
            id: Date.now(),
            description: '',
            hsnCode: '',
            unit: '',
            quantity: '',
            rate: '',
            discountPercent: '',
            taxRate: '',
            grossAmount: '',
            taxableAmount: '',
            cgstAmount: '',
            sgstAmount: '',
            igstAmount: '',
            totalAmount: ''
        }
    ]);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [sameAsShipping, setSameAsShipping] = useState(true);

    // Your business profile (logged-in user's company) - fetched from service
    const [myCompanyProfile, setMyCompanyProfile] = useState(null);
    const [loadingCompany, setLoadingCompany] = useState(true);

    // Customers state - loaded from customer service
    const [customers, setCustomers] = useState([]);
    const [customersLoading, setCustomersLoading] = useState(true);

    // Items state
    const [itemsLoading, setItemsLoading] = useState(true);

    // Invoice submission state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Selected customer ID
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);

    // Derived data based on selections
    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

    useEffect(() => {
        const loadItems = async () => {
            setItemsLoading(true);
            try {
                const itemsData = await getItems();
                setAllItems(itemsData || []);
            } catch (error) {
                console.error('Error loading items:', error);
                setAllItems([]);
            } finally {
                setItemsLoading(false);
            }
        };
        loadItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Load company profile on mount (async)
    // useEffect(() => {
    //     async function fetchProfile() {
    //         const profile = await getMyCompanyProfile();
    //         setMyCompanyProfile(profile);
    //     }
    //     fetchProfile();
    // }, []);

    // Load company profile and customers on component mount
    useEffect(() => {
        async function fetchData() {
            try {
                setLoadingCompany(true);
                // Load company profile
                const profile = await getMyCompany();
                console.log('Loaded company profile:', profile);
                setMyCompanyProfile(profile);
                setLoadingCompany(false);

                // Load customers
                const customersResponse = await getCustomers();
                console.log('Loaded customers:', customersResponse);

                // Your API returns { customers, pagination }, so extract the array
                setCustomers(customersResponse.customers || []);
            } catch (error) {
                console.error('Error loading data:', error);
                setCustomers([]);
                setLoadingCompany(false);
            } finally {
                setCustomersLoading(false);
            }
        }

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                bankName: myCompanyProfile.bankName,
                accountNumber: myCompanyProfile.bankAccountNumber,
                ifscCode: myCompanyProfile.bankIfscCode,
                branchName: myCompanyProfile.bankBranch
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
                    address: selectedCustomer.address,
                    city: selectedCustomer.city,
                    state: selectedCustomer.state,
                    pincode: selectedCustomer.pincode,
                    gstin: selectedCustomer.gstNumber,
                    eximCode: selectedCustomer.eximCode,
                    country: selectedCustomer.country
                },
                shippingAddress: {
                    name: selectedCustomer.businessName,
                    address: selectedCustomer.street,
                    city: selectedCustomer.city,
                    state: selectedCustomer.state,
                    pincode: selectedCustomer.pincode,
                    country: selectedCustomer.country
                }
            });
        }
    }, [selectedCustomer]);

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
            items: invoiceItems,
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

    const handleGenerateInvoice = async () => {
        if (!validateForm()) {
            return;
        }

        // Check if company profile exists
        if (!myCompanyProfile?.id) {
            alert('Please create a company profile first before creating an invoice.');
            return;
        }

        setIsSubmitting(true);

        // Build payload for backend
        const payload = {
            companyProfileId: myCompanyProfile.id,
            customerId: selectedCustomerId,
            invoiceNumber: invoiceDetails.invoiceNumber,
            invoiceDate: invoiceDetails.invoiceDate ? new Date(invoiceDetails.invoiceDate).toISOString() : null,
            dueDate: invoiceDetails.dueDate ? new Date(invoiceDetails.dueDate).toISOString() : null,
            marka: invoiceDetails.marka,
            dateOfSupply: invoiceDetails.supplyDate ? new Date(invoiceDetails.supplyDate).toISOString() : null,
            stateCode: companyData?.stateCode,
            transportation: invoiceDetails.transport,
            notes: '',
            status: 'SENT',
            invoiceItems: invoiceItems.map(item => ({
                description: item.description,
                hsnCode: String(item.hsnCode),
                unit: item.unit || 'pcs',
                quantity: Number(item.quantity) || 1,
                rate: Number(item.rate) || 0,
                cgstRate: Number(item.cgstRate) || 0,
                sgstRate: Number(item.sgstRate) || 0,
                igstRate: Number(item.igstRate) || 0
            }))
        };

        console.log("Invoice Payload to be sent : ", payload);

        try {
            const result = await createInvoice(payload);
            console.log("Create Invoice Result : ", result);
            if (result && !result.error) {
                alert('Invoice generated successfully!');
                navigate('/invoice-list');
            } else {
                throw new Error(result.error || 'Unknown error');
            }
        } catch (error) {
            alert('Error generating invoice: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateForm = () => {
        if (!customerData?.selectedCustomer) {
            alert('Please select a customer');
            return false;
        }
        if (invoiceItems?.some(item => !item?.description || item?.quantity <= 0 || item?.rate <= 0)) {
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

                    {/* Loading State */}
                    {(loadingCompany || customersLoading || itemsLoading) ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                <p className="text-text-secondary">Loading invoice form...</p>
                            </div>
                        </div>
                    ) : (
                        <>
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
                                    items={invoiceItems}
                                    onItemsChange={setInvoiceItems}
                                    companyState={companyData?.state}
                                    customerState={customerData?.billingAddress?.state}
                                    allItems={allItems}
                                />

                                <InvoiceTotalsSection
                                    items={invoiceItems}
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
                                        onClick={handleGenerateInvoice}
                                        iconName="FileText"
                                        iconPosition="left"
                                        fullWidth
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Generating...' : 'Generate Invoice'}
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <QuickActionButton />
            <InvoicePreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                companyData={companyData}
                customerData={customerData}
                invoiceDetails={invoiceDetails}
                items={invoiceItems}
                additionalCharges={additionalCharges}
            />
        </div >
    );
};

export default InvoiceCreation;