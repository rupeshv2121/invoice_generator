import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import QuickActionButton from '../../components/ui/QuickActionButton';

import BulkActions from './components/BulkActions';
import InvoiceFilters from './components/InvoiceFilters';
import InvoicePagination from './components/InvoicePagination';
import InvoiceTable from './components/InvoiceTable';

const InvoiceList = () => {
    const navigate = useNavigate();

    // Mock invoice data
    const mockInvoices = [
        {
            id: 'INV-001',
            invoiceNumber: 'INV-2024-001',
            customerName: 'Acme Corporation',
            customerEmail: 'contact@acmecorp.com',
            date: '2024-09-25',
            dueDate: '2024-10-25',
            amount: 125000.00,
            status: 'sent'
        },
        {
            id: 'INV-002',
            invoiceNumber: 'INV-2024-002',
            customerName: 'Tech Solutions Ltd',
            customerEmail: 'billing@techsolutions.com',
            date: '2024-09-28',
            dueDate: '2024-10-28',
            amount: 87500.50,
            status: 'paid'
        },
        {
            id: 'INV-003',
            invoiceNumber: 'INV-2024-003',
            customerName: 'Global Imports Inc',
            customerEmail: 'accounts@globalimports.com',
            date: '2024-09-20',
            dueDate: '2024-10-20',
            amount: 245000.75,
            status: 'overdue'
        },
        {
            id: 'INV-004',
            invoiceNumber: 'INV-2024-004',
            customerName: 'Retail Chain Co',
            customerEmail: 'finance@retailchain.com',
            date: '2024-09-30',
            dueDate: '2024-10-30',
            amount: 156000.00,
            status: 'draft'
        },
        {
            id: 'INV-005',
            invoiceNumber: 'INV-2024-005',
            customerName: 'Manufacturing Hub',
            customerEmail: 'payments@mfghub.com',
            date: '2024-09-22',
            dueDate: '2024-10-22',
            amount: 98750.25,
            status: 'sent'
        },
        {
            id: 'INV-006',
            invoiceNumber: 'INV-2024-006',
            customerName: 'Digital Services Pro',
            customerEmail: 'billing@digitalservices.com',
            date: '2024-09-26',
            dueDate: '2024-10-26',
            amount: 67500.00,
            status: 'paid'
        },
        {
            id: 'INV-007',
            invoiceNumber: 'INV-2024-007',
            customerName: 'Construction Partners',
            customerEmail: 'accounts@constructionpartners.com',
            date: '2024-09-18',
            dueDate: '2024-10-18',
            amount: 312000.50,
            status: 'overdue'
        },
        {
            id: 'INV-008',
            invoiceNumber: 'INV-2024-008',
            customerName: 'Healthcare Systems',
            customerEmail: 'finance@healthcaresys.com',
            date: '2024-09-29',
            dueDate: '2024-10-29',
            amount: 189000.75,
            status: 'sent'
        }
    ];

    // State management
    const [invoices] = useState(mockInvoices);
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
            case 'view': console.log('Viewing invoice:', invoice?.id);
                // Navigate to invoice view page
                break;
            case 'edit': console.log('Editing invoice:', invoice?.id);
                navigate('/invoice-creation', { state: { editInvoice: invoice } });
                break;
            case 'duplicate': console.log('Duplicating invoice:', invoice?.id);
                navigate('/invoice-creation', { state: { duplicateInvoice: invoice } });
                break;
            case 'download':
                console.log('Downloading invoice:', invoice?.id);
                // Implement PDF download
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
        </div>
    );
};

export default InvoiceList;