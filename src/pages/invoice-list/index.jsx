import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import QuickActionButton from '../../components/ui/QuickActionButton';
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

    // State management
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        const fetchInvoices = async () => {
            const invoicesData = await getInvoices();
            // Map backend invoices to flat structure for table
            const mapped = (invoicesData || []).map(inv => ({
                id: inv.id,
                invoiceNumber: inv.invoiceNumber,
                customerName: inv.customer?.name || '',
                customerEmail: inv.customer?.email || '',
                date: inv.invoiceDate || inv.date || '',
                dueDate: inv.dueDate || '',
                amount: inv.totalAmount || inv.amount || 0,
                status: inv.status || 'sent',
                // ...add more fields as needed
                raw: inv // keep original for preview, etc.
            }));
            setInvoices(mapped);
        };
        fetchInvoices();
    }, [getInvoices]);
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
                    alert('PDF downloaded successfully!');
                } else {
                    alert('Error downloading PDF: ' + result.error);
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

    // Transform mock invoice data for preview modal
    const transformInvoiceForPreview = (invoice) => {
        return {
            companyData: {
                name: 'Your Company Name',
                address: '123 Business Street, City, State 12345',
                phone: '+1 (555) 123-4567',
                email: 'info@yourcompany.com',
                gstin: '27AAACI1681G1Z8',
                iecCode: 'IEC123456789',
                bondNumber: 'BOND12345',
                state: 'Maharashtra',
                stateCode: '27'
            },
            customerData: {
                billingAddress: {
                    name: invoice?.customerName || 'Customer Name',
                    address: '456 Customer Street, Customer City',
                    eximCode: 'EXIM123',
                    city: 'Customer City',
                    country: 'Nepal'
                }
            },
            invoiceDetails: {
                invoiceNumber: invoice?.invoiceNumber || 'INV-001',
                invoiceDate: invoice?.date || new Date().toISOString().split('T')[0],
                supplyDate: invoice?.date || new Date().toISOString().split('T')[0],
                marka: 'MARKA001',
                transport: 'By Road'
            },
            items: [
                {
                    description: 'Sample Product/Service',
                    hsnCode: '1001',
                    unit: 'PCS',
                    quantity: 1,
                    rate: invoice?.amount || 0,
                    grossAmount: invoice?.amount || 0,
                    cgstAmount: (invoice?.amount || 0) * 0.09,
                    sgstAmount: (invoice?.amount || 0) * 0.09,
                    igstAmount: 0
                }
            ],
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