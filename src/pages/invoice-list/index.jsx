import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import QuickActionButton from '../../components/ui/QuickActionButton';
import { SkeletonTable } from '../../components/ui/SkeletonLoader';
import { downloadInvoicePDF } from '../../services/pdfService';

import { useInvoiceService } from '../../api/invoice';
import InvoicePreviewModal from '../invoice-creation/components/InvoicePreviewModal';
import BulkActions from './components/BulkActions';
import InvoiceFilters from './components/InvoiceFilters';
import InvoicePagination from './components/InvoicePagination';
import InvoiceTable from './components/InvoiceTable';

const InvoiceList = () => {
    const navigate = useNavigate();
    const { getInvoices } = useInvoiceService();
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [selectedInvoiceForPreview, setSelectedInvoiceForPreview] = useState(null);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            try {
                const invoicesData = await getInvoices();
                console.log('Fetched invoices data:', invoicesData);
                console.log('Number of invoices:', invoicesData?.length);
                // Map backend invoices to flat structure for table
                const mapped = (invoicesData || []).map(inv => ({
                    id: inv.id,
                    invoiceNumber: inv.invoiceNumber,
                    customerName: inv.customer?.name || inv.customer?.companyName || '',
                    customerEmail: inv.customer?.email || '',
                    date: inv.invoiceDate || inv.date || '',
                    dueDate: inv.dueDate || '',
                    amount: inv.totalAmount || inv.amount || 0,
                    status: inv.status?.toLowerCase() || 'draft',
                    // Keep the complete raw invoice data with all nested relations
                    raw: inv
                }));
                console.log('Mapped invoices:', mapped);
                setInvoices(mapped);
            } catch (error) {
                console.error('Error fetching invoices:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [selectedInvoices, setSelectedInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        customer: '',
        dateFrom: '',
        dateTo: '',
        minAmount: '',
        maxAmount: ''
    });

    // Filter and sort invoices
    const filteredInvoices = useMemo(() => {
        return invoices?.filter(invoice => {
            // Search filter
            if (filters?.search) {
                const searchTerm = filters?.search?.toLowerCase();
                const matchesSearch =
                    invoice?.invoiceNumber?.toLowerCase()?.includes(searchTerm) ||
                    invoice?.customerName?.toLowerCase()?.includes(searchTerm) ||
                    invoice?.customerEmail?.toLowerCase()?.includes(searchTerm);
                if (!matchesSearch) return false;
            }

            // Status filter
            if (filters?.status && invoice?.status !== filters?.status) {
                return false;
            }

            // Customer filter
            if (filters?.customer) {
                const customerMap = {
                    'acme-corp': 'Acme Corporation',
                    'tech-solutions': 'Tech Solutions Ltd',
                    'global-imports': 'Global Imports Inc',
                    'retail-chain': 'Retail Chain Co',
                    'manufacturing': 'Manufacturing Hub'
                };
                if (invoice?.customerName !== customerMap?.[filters?.customer]) {
                    return false;
                }
            }

            // Date range filter
            if (filters?.dateFrom) {
                if (new Date(invoice.date) < new Date(filters.dateFrom)) {
                    return false;
                }
            }
            if (filters?.dateTo) {
                if (new Date(invoice.date) > new Date(filters.dateTo)) {
                    return false;
                }
            }

            // Amount range filter
            if (filters?.minAmount && invoice?.amount < parseFloat(filters?.minAmount)) {
                return false;
            }
            if (filters?.maxAmount && invoice?.amount > parseFloat(filters?.maxAmount)) {
                return false;
            }

            return true;
        });
    }, [invoices, filters]);

    // Pagination
    const totalPages = Math.ceil(filteredInvoices?.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedInvoices = filteredInvoices?.slice(startIndex, startIndex + itemsPerPage);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    // Clear selection when page changes
    useEffect(() => {
        setSelectedInvoices([]);
    }, [currentPage, filters]);

    // Event handlers
    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleClearFilters = () => {
        setFilters({
            search: '',
            status: '',
            customer: '',
            dateFrom: '',
            dateTo: '',
            minAmount: '',
            maxAmount: ''
        });
    };

    const handleSelectionChange = (selectedIds) => {
        setSelectedInvoices(selectedIds);
    };

    const handleClearSelection = () => {
        setSelectedInvoices([]);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const handleInvoiceAction = (action, invoice) => {
        switch (action) {
            case 'create': navigate('/invoice-creation');
                break;
            case 'view':
                setSelectedInvoiceForPreview(invoice);
                setPreviewModalOpen(true);
                break;
            case 'edit': console.log('Editing invoice:', invoice?.id);
                navigate('/invoice-creation', { state: { editInvoice: invoice } });
                break;
            case 'duplicate': console.log('Duplicating invoice:', invoice?.id);
                navigate('/invoice-creation', { state: { duplicateInvoice: invoice } });
                break;
            case 'download':
                const invoiceData = transformInvoiceForPreview(invoice);
                const result = downloadInvoicePDF(invoiceData);
                if (result.success) {
                    toast.success('PDF downloaded successfully!');
                } else {
                    toast.error('Error downloading PDF: ' + result.error);
                }
                break;
            case 'send': console.log('Sending invoice:', invoice?.id);
                // Implement email sending
                break;
            case 'print': console.log('Printing invoice:', invoice?.id);
                // Implement printing
                break;
            case 'markPaid': console.log('Marking as paid:', invoice?.id);
                // Update invoice status
                break;
            case 'delete':
                console.log('Deleting invoice:', invoice?.id);
                // Implement delete with confirmation
                break;
            default:
                console.log('Unknown action:', action);
        }
    };

    // Transform invoice data for preview modal
    const transformInvoiceForPreview = (invoice) => {
        console.log('Transforming invoice for preview:', invoice);

        // Get the raw invoice data
        const rawInvoice = invoice?.raw || invoice;

        return {
            companyData: {
                name: rawInvoice?.company?.companyName || 'Your Company Name',
                address: rawInvoice?.company?.address || '',
                phone: rawInvoice?.company?.phone || '',
                email: rawInvoice?.company?.email || '',
                gstin: rawInvoice?.company?.gstin || '',
                iecCode: rawInvoice?.company?.iecCode || '',
                arn: rawInvoice?.company?.arn || '',
                state: rawInvoice?.company?.state || '',
                stateCode: rawInvoice?.stateCode || '',
                city: rawInvoice?.company?.city || '',
                pincode: rawInvoice?.company?.pincode || '',
                bankName: rawInvoice?.company?.bankName || '',
                bankAccountNumber: rawInvoice?.company?.bankAccountNumber || '',
                bankIfscCode: rawInvoice?.company?.bankIfscCode || '',
                bankBranch: rawInvoice?.company?.bankBranch || ''
            },
            bankDetails: {
                bankName: rawInvoice?.company?.bankName || '',
                accountNumber: rawInvoice?.company?.bankAccountNumber || '',
                ifscCode: rawInvoice?.company?.bankIfscCode || '',
                branchName: rawInvoice?.company?.bankBranch || ''
            },
            customerData: {
                billingAddress: {
                    name: rawInvoice?.customer?.name || invoice?.customerName || 'Customer Name',
                    address: rawInvoice?.customer?.address || '',
                    eximCode: rawInvoice?.customer?.EximCode || '',
                    city: rawInvoice?.customer?.city || '',
                    country: rawInvoice?.customer?.country || 'Nepal'
                }
            },
            invoiceDetails: {
                invoiceNumber: rawInvoice?.invoiceNumber || invoice?.invoiceNumber || 'INV-001',
                invoiceDate: rawInvoice?.invoiceDate || invoice?.date || new Date().toISOString().split('T')[0],
                supplyDate: rawInvoice?.dateOfSupply || rawInvoice?.invoiceDate || invoice?.date || new Date().toISOString().split('T')[0],
                marka: rawInvoice?.marka || '',
                transport: rawInvoice?.transportation || ''
            },
            items: rawInvoice?.invoiceItems?.map(item => ({
                description: item?.description || '',
                hsnCode: item?.hsnCode || '',
                unit: item?.unit || 'PCS',
                quantity: item?.quantity || 0,
                rate: parseFloat(item?.rate) || 0,
                taxableAmount: parseFloat(item?.amount) || 0,
                cgstAmount: parseFloat(item?.cgstAmount) || 0,
                sgstAmount: parseFloat(item?.sgstAmount) || 0,
                igstAmount: parseFloat(item?.igstAmount) || 0,
                totalAmount: parseFloat(item?.totalAmount) || 0
            })) || [],
            additionalCharges: {
                shipping: 0,
                other: 0
            }
        };
    };

    const handleBulkAction = (action) => {
        console.log('Bulk action:', action, 'for invoices:', selectedInvoices);
        switch (action) {
            case 'export':
                // Implement bulk export
                break;
            case 'print':
                // Implement bulk print
                break;
            case 'sendEmails':
                // Implement bulk email sending
                break;
            case 'markPaid':
                // Implement bulk status update
                break;
            case 'delete':
                // Implement bulk delete with confirmation
                break;
            default:
                console.log('Unknown bulk action:', action);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Breadcrumb />

                    {/* Page Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">Invoice List</h1>
                            <p className="text-text-secondary">
                                Manage and track all your invoices in one place
                            </p>
                        </div>

                        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                            <Button
                                variant="outline"
                                iconName="Download"
                                iconPosition="left"
                                onClick={() => handleBulkAction('export')}
                            >
                                Export All
                            </Button>
                            <Button
                                variant="default"
                                iconName="Plus"
                                iconPosition="left"
                                onClick={() => navigate('/invoice-creation')}
                            >
                                Create Invoice
                            </Button>
                        </div>
                    </div>

                    {/* Filters */}
                    <InvoiceFilters
                        filters={filters}
                        onFiltersChange={handleFiltersChange}
                        onClearFilters={handleClearFilters}
                        totalCount={filteredInvoices?.length}
                    />

                    {/* Bulk Actions */}
                    <BulkActions
                        selectedCount={selectedInvoices?.length}
                        onBulkAction={handleBulkAction}
                        onClearSelection={handleClearSelection}
                    />

                    {/* Loading State */}
                    {loading ? (
                        <SkeletonTable rows={10} columns={6} />
                    ) : (
                        <>
                            {/* Invoice Table */}
                            <InvoiceTable
                                invoices={paginatedInvoices}
                                selectedInvoices={selectedInvoices}
                                onSelectionChange={handleSelectionChange}
                                onInvoiceAction={handleInvoiceAction}
                            />

                            {/* Pagination */}
                            <InvoicePagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={filteredInvoices?.length}
                                itemsPerPage={itemsPerPage}
                                onPageChange={handlePageChange}
                                onItemsPerPageChange={handleItemsPerPageChange}
                            />
                        </>
                    )}
                </div>
            </main>
            <QuickActionButton />

            {/* Invoice Preview Modal */}
            {selectedInvoiceForPreview && (
                <InvoicePreviewModal
                    isOpen={previewModalOpen}
                    onClose={() => {
                        setPreviewModalOpen(false);
                        setSelectedInvoiceForPreview(null);
                    }}
                    {...transformInvoiceForPreview(selectedInvoiceForPreview)}
                />
            )}
        </div>
    );
};

export default InvoiceList;