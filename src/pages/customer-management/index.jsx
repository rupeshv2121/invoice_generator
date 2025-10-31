import { useEffect, useState } from 'react';
import { useCustomersService } from '../../api/customers';
import Icon from '../../components/AppIcon';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import QuickActionButton from '../../components/ui/QuickActionButton';
import CustomerFilters from './components/CustomerFilters';
import CustomerHistoryModal from './components/CustomerHistoryModal';
import CustomerModal from './components/CustomerModal';
import CustomerStats from './components/CustomerStats';
import CustomerTable from './components/CustomerTable';

const CustomerManagement = () => {
    const { getCustomers, addCustomer, updateCustomer, deleteCustomer, getCustomerById, getCustomerStatistics } = useCustomersService();
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
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
        try {
            const response = await getCustomers();
            // console.log("Response Get Customer:", response);
            setCustomers(response?.customers || []);
            setFilteredCustomers(response?.customers || []);
        } catch (error) {
            console.error('Error loading customers:', error);
            setCustomers([]);
            setFilteredCustomers([]);
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

        // Search filter - use service for more comprehensive search
        if (searchTerm) {
            filtered = searchCustomers(searchTerm);
        }

        // Location filter
        if (locationFilter) {
            filtered = filtered?.filter(customer => customer?.location === locationFilter);
        }

        // Customer type filter
        if (customerTypeFilter) {
            filtered = filtered?.filter(customer => customer?.customerType === customerTypeFilter);
        }

        // Status filter
        if (statusFilter) {
            filtered = filtered?.filter(customer => customer?.status === statusFilter);
        }

        // Sort customers
        // filtered?.sort((a, b) => {
        //     let aValue = a?.[sortBy];
        //     let bValue = b?.[sortBy];

        //     if (typeof aValue === 'string') {
        //         aValue = aValue?.toLowerCase();
        //         bValue = bValue?.toLowerCase();
        //     }

        //     if (sortOrder === 'asc') {
        //         return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        //     } else {
        //         return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        //     }
        // });

        setFilteredCustomers(filtered);
    }, [customers, searchTerm, locationFilter, customerTypeFilter, statusFilter, sortBy, sortOrder]);

    // Calculate statistics
    const stats = {
        // totalCustomers: customers?.length,
        // activeCustomers: customers?.filter(c => c?.status === 'Active')?.length,
        // gstRegistered: customers?.filter(c => c?.gstStatus === 'Registered')?.length,
        // outstandingAmount: 485000 // Mock outstanding amount
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
                } else {
                    alert(result.error || 'Error deleting customer. Customer not found.');
                }
            } catch (error) {
                console.error('Error deleting customer:', error);
                alert('Error deleting customer. Please try again.');
            }
        }
    };

    const handleSaveCustomer = async (customerData) => {
        try {
            console.log("Saving customer data:", customerData);

            if (modalMode === 'add') {
                await addCustomer(customerData);
            } else {
                await updateCustomer(selectedCustomer.id, customerData);
            }

            await loadCustomers(); // Reload customers after save
            setIsModalOpen(false);
            setSelectedCustomer(null);
        } catch (error) {
            console.error('Error saving customer:', error);
            alert('Error saving customer. Please try again.');
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