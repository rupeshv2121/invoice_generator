import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useCustomersService } from '../../api/customers';
import Icon from '../../components/AppIcon';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import QuickActionButton from '../../components/ui/QuickActionButton';
import { SkeletonCustomerTable } from '../../components/ui/SkeletonLoader';
import CustomerFilters from './components/CustomerFilters';
import CustomerHistoryModal from './components/CustomerHistoryModal';
import CustomerModal from './components/CustomerModal';
import CustomerStats from './components/CustomerStats';
import CustomerTable from './components/CustomerTable';

const CustomerManagement = () => {
    const { getCustomers, addCustomer, updateCustomer, deleteCustomer, getCustomerById, getCustomerStatistics } = useCustomersService();
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [customerTypeFilter, setCustomerTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('companyName');
    const [sortOrder, setSortOrder] = useState('asc');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [modalMode, setModalMode] = useState('add');
    const [customerStats, setCustomerStats] = useState(null);

    // Load customers from service on component mount
    useEffect(() => {
        loadCustomers();
        loadCustomerStatistics();
    }, []);

    const loadCustomers = async () => {
        setLoading(true);
        try {
            const response = await getCustomers();
            // console.log("Response Get Customer:", response);
            setCustomers(response?.customers || []);
            setFilteredCustomers(response?.customers || []);
        } catch (error) {
            console.error('Error loading customers:', error);
            setCustomers([]);
            setFilteredCustomers([]);
        } finally {
            setLoading(false);
        }
    };

    const loadCustomerStatistics = async () => {
        try {
            const stats = await getCustomerStatistics();
            setCustomerStats(stats);
        } catch (error) {
            console.error('Error loading customer statistics:', error);
            setCustomerStats(null);
        }
    }


    // Filter and search customers
    useEffect(() => {
        let filtered = customers;

        // Search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = customers.filter(customer =>
                customer?.name?.toLowerCase().includes(searchLower) ||
                customer?.companyName?.toLowerCase().includes(searchLower) ||
                customer?.email?.toLowerCase().includes(searchLower) ||
                customer?.phone?.includes(searchTerm) ||
                customer?.gstin?.toLowerCase().includes(searchLower)
            );
        }

        // Location filter
        if (locationFilter) {
            filtered = filtered?.filter(customer => customer?.city === locationFilter);
        }

        // Customer type filter
        if (customerTypeFilter) {
            filtered = filtered?.filter(customer => customer?.customerType === customerTypeFilter);
        }

        // Status filter
        if (statusFilter) {
            filtered = filtered?.filter(customer => customer?.isActive === (statusFilter === 'active'));
        }

        setFilteredCustomers(filtered);
    }, [customers, searchTerm, locationFilter, customerTypeFilter, statusFilter]);

    // Use stats from API
    const stats = customerStats || {
        totalCustomers: 0,
        newCustomersThisMonth: 0,
        customersWithInvoices: 0,
        customersWithoutInvoices: 0,
        gstRegisteredCount: 0
    };

    const handleAddCustomer = () => {
        setSelectedCustomer(null);
        setModalMode('add');
        setIsModalOpen(true);
    };

    const handleEditCustomer = (customer) => {
        setSelectedCustomer(customer);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleViewHistory = (customer) => {
        setSelectedCustomer(customer);
        setIsHistoryModalOpen(true);
    };

    const handleDeleteCustomer = async (customer) => {
        if (window.confirm(`Are you sure you want to delete ${customer?.companyName}?`)) {
            try {
                const result = await deleteCustomer(customer.id);
                if (result.success) {
                    loadCustomers(); // Reload customers after deletion
                    toast.success('Customer deleted successfully!');
                } else {
                    toast.error(result.error || 'Error deleting customer. Customer not found.');
                }
            } catch (error) {
                console.error('Error deleting customer:', error);
                toast.error('Error deleting customer. Please try again.');
            }
        }
    };

    const handleSaveCustomer = async (customerData) => {
        try {
            console.log("Saving customer data:", customerData);

            if (modalMode === 'add') {
                const result = await addCustomer(customerData);
                console.log("Customer created successfully:", result);
            } else {
                const result = await updateCustomer(selectedCustomer.id, customerData);
                console.log("Customer updated successfully:", result);
            }

            // Reload customers after save
            await loadCustomers();

            // Close modal and reset
            setIsModalOpen(false);
            setSelectedCustomer(null);

            // Show success message
            toast.success(`Customer ${modalMode === 'add' ? 'added' : 'updated'} successfully!`);
        } catch (error) {
            console.error('Error saving customer:', error);
            console.error('Error response:', error?.response?.data);

            // Show specific error message
            const errorMessage = error?.response?.data?.error ||
                error?.response?.data?.message ||
                'Error saving customer. Please try again.';
            toast.error(errorMessage);
        }
    };

    const handleSort = (field, order) => {
        setSortBy(field);
        setSortOrder(order);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setLocationFilter('');
        setCustomerTypeFilter('');
        setStatusFilter('');
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Breadcrumb />

                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Customer Management</h1>
                            <p className="mt-2 text-text-secondary">
                                Manage your customer database with comprehensive contact and billing information
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <Button
                                variant="default"
                                onClick={handleAddCustomer}
                                iconName="Plus"
                                iconSize={20}
                                className="w-full sm:w-auto"
                            >
                                Add New Customer
                            </Button>
                        </div>
                    </div>

                    {/* Statistics */}
                    <CustomerStats stats={stats} />

                    {/* Filters */}
                    <CustomerFilters
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        locationFilter={locationFilter}
                        onLocationFilterChange={setLocationFilter}
                        customerTypeFilter={customerTypeFilter}
                        onCustomerTypeFilterChange={setCustomerTypeFilter}
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        onClearFilters={handleClearFilters}
                    />

                    {/* Loading State */}
                    {loading ? (
                        <SkeletonCustomerTable />
                    ) : (
                        <>
                            {/* Results Summary */}
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm text-text-secondary">
                                    Showing {filteredCustomers?.length} of {customers?.length} customers
                                </p>
                                <div className="flex items-center space-x-2">
                                    <Icon name="Filter" size={16} className="text-text-secondary" />
                                    <span className="text-sm text-text-secondary">
                                        Sorted by {sortBy} ({sortOrder})
                                    </span>
                                </div>
                            </div>

                            {/* Customer Table */}
                            <CustomerTable
                                customers={filteredCustomers}
                                onEditCustomer={handleEditCustomer}
                                onViewHistory={handleViewHistory}
                                onDeleteCustomer={handleDeleteCustomer}
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                            />
                        </>
                    )}

                    {/* Modals */}
                    <CustomerModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        customer={selectedCustomer}
                        onSave={handleSaveCustomer}
                        mode={modalMode}
                    />

                    <CustomerHistoryModal
                        isOpen={isHistoryModalOpen}
                        onClose={() => setIsHistoryModalOpen(false)}
                        customer={selectedCustomer}
                    />
                </div>
            </main>
            <QuickActionButton />
        </div>
    );
};

export default CustomerManagement;