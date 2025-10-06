import { useEffect, useState } from 'react';
import Icon from '../../components/AppIcon';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import QuickActionButton from '../../components/ui/QuickActionButton';
import { addCustomer, deleteCustomer, getAllCustomers, searchCustomers, updateCustomer } from '../../services/customerService';
import CustomerFilters from './components/CustomerFilters';
import CustomerHistoryModal from './components/CustomerHistoryModal';
import CustomerModal from './components/CustomerModal';
import CustomerStats from './components/CustomerStats';
import CustomerTable from './components/CustomerTable';

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [customerTypeFilter, setCustomerTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('businessName');
    const [sortOrder, setSortOrder] = useState('asc');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [modalMode, setModalMode] = useState('add');

    // Load customers from service on component mount
    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = () => {
        try {
            const customersList = getAllCustomers();
            setCustomers(customersList);
            setFilteredCustomers(customersList);
        } catch (error) {
            console.error('Error loading customers:', error);
            setCustomers([]);
            setFilteredCustomers([]);
        }
    };

    // Original mock customers for reference (will be removed)
    const originalMockCustomers = [
        {
            id: 1,
            businessName: "TechCorp Solutions Pvt Ltd",
            contactPerson: "Rajesh Kumar",
            email: "rajesh@techcorp.com",
            phone: "+91 98765 43210",
            location: "Mumbai",
            customerType: "Business",
            gstNumber: "27AAAAA0000A1Z5",
            gstStatus: "Registered",
            status: "Active",
            billingAddress: {
                street: "123 Business Park, Andheri East",
                city: "Mumbai",
                state: "Maharashtra",
                pincode: "400069",
                country: "India"
            },
            shippingAddress: {
                street: "123 Business Park, Andheri East",
                city: "Mumbai",
                state: "Maharashtra",
                pincode: "400069",
                country: "India",
                sameAsBilling: true
            },
            bankDetails: {
                accountName: "TechCorp Solutions Pvt Ltd",
                accountNumber: "1234567890",
                ifscCode: "HDFC0001234",
                bankName: "HDFC Bank"
            }
        },
        {
            id: 2,
            businessName: "Digital Marketing Hub",
            contactPerson: "Priya Sharma",
            email: "priya@digitalmarketing.com",
            phone: "+91 87654 32109",
            location: "Delhi",
            customerType: "Business",
            gstNumber: "07BBBBB1111B2Z6",
            gstStatus: "Registered",
            status: "Active",
            billingAddress: {
                street: "456 Connaught Place",
                city: "New Delhi",
                state: "Delhi",
                pincode: "110001",
                country: "India"
            },
            shippingAddress: {
                street: "456 Connaught Place",
                city: "New Delhi",
                state: "Delhi",
                pincode: "110001",
                country: "India",
                sameAsBilling: true
            },
            bankDetails: {
                accountName: "Digital Marketing Hub",
                accountNumber: "9876543210",
                ifscCode: "ICIC0001234",
                bankName: "ICICI Bank"
            }
        },
        {
            id: 3,
            businessName: "Creative Designs Studio",
            contactPerson: "Amit Patel",
            email: "amit@creativedesigns.com",
            phone: "+91 76543 21098",
            location: "Bangalore",
            customerType: "Freelancer",
            gstNumber: "",
            gstStatus: "Unregistered",
            status: "Active",
            billingAddress: {
                street: "789 MG Road",
                city: "Bangalore",
                state: "Karnataka",
                pincode: "560001",
                country: "India"
            },
            shippingAddress: {
                street: "789 MG Road",
                city: "Bangalore",
                state: "Karnataka",
                pincode: "560001",
                country: "India",
                sameAsBilling: true
            },
            bankDetails: {
                accountName: "Amit Patel",
                accountNumber: "5432109876",
                ifscCode: "SBIN0001234",
                bankName: "State Bank of India"
            }
        },
        {
            id: 4,
            businessName: "Global Exports Ltd",
            contactPerson: "Sunita Reddy",
            email: "sunita@globalexports.com",
            phone: "+91 65432 10987",
            location: "Chennai",
            customerType: "Business",
            gstNumber: "33CCCCC2222C3Z7",
            gstStatus: "Registered",
            status: "Inactive",
            billingAddress: {
                street: "321 Anna Salai",
                city: "Chennai",
                state: "Tamil Nadu",
                pincode: "600002",
                country: "India"
            },
            shippingAddress: {
                street: "321 Anna Salai",
                city: "Chennai",
                state: "Tamil Nadu",
                pincode: "600002",
                country: "India",
                sameAsBilling: true
            },
            bankDetails: {
                accountName: "Global Exports Ltd",
                accountNumber: "2109876543",
                ifscCode: "AXIS0001234",
                bankName: "Axis Bank"
            }
        },
        {
            id: 5,
            businessName: "Innovative Solutions",
            contactPerson: "Vikram Singh",
            email: "vikram@innovative.com",
            phone: "+91 54321 09876",
            location: "Hyderabad",
            customerType: "Business",
            gstNumber: "36DDDDD3333D4Z8",
            gstStatus: "Registered",
            status: "Active",
            billingAddress: {
                street: "654 HITEC City",
                city: "Hyderabad",
                state: "Telangana",
                pincode: "500081",
                country: "India"
            },
            shippingAddress: {
                street: "654 HITEC City",
                city: "Hyderabad",
                state: "Telangana",
                pincode: "500081",
                country: "India",
                sameAsBilling: true
            },
            bankDetails: {
                accountName: "Innovative Solutions",
                accountNumber: "6789012345",
                ifscCode: "KOTAK001234",
                bankName: "Kotak Mahindra Bank"
            }
        },
        {
            id: 6,
            businessName: "Retail Chain Stores",
            contactPerson: "Meera Joshi",
            email: "meera@retailchain.com",
            phone: "+91 43210 98765",
            location: "Pune",
            customerType: "Business",
            gstNumber: "27EEEEE4444E5Z9",
            gstStatus: "Registered",
            status: "Active",
            billingAddress: {
                street: "987 FC Road",
                city: "Pune",
                state: "Maharashtra",
                pincode: "411005",
                country: "India"
            },
            shippingAddress: {
                street: "987 FC Road",
                city: "Pune",
                state: "Maharashtra",
                pincode: "411005",
                country: "India",
                sameAsBilling: true
            },
            bankDetails: {
                accountName: "Retail Chain Stores",
                accountNumber: "3456789012",
                ifscCode: "PUNB0001234",
                bankName: "Punjab National Bank"
            }
        },
        {
            id: 7,
            businessName: "Consulting Services Inc",
            contactPerson: "Arjun Gupta",
            email: "arjun@consulting.com",
            phone: "+91 32109 87654",
            location: "Kolkata",
            customerType: "Individual",
            gstNumber: "",
            gstStatus: "Unregistered",
            status: "Active",
            billingAddress: {
                street: "147 Park Street",
                city: "Kolkata",
                state: "West Bengal",
                pincode: "700016",
                country: "India"
            },
            shippingAddress: {
                street: "147 Park Street",
                city: "Kolkata",
                state: "West Bengal",
                pincode: "700016",
                country: "India",
                sameAsBilling: true
            },
            bankDetails: {
                accountName: "Arjun Gupta",
                accountNumber: "7890123456",
                ifscCode: "IDIB0001234",
                bankName: "Indian Bank"
            }
        },
        {
            id: 8,
            businessName: "Manufacturing Co Ltd",
            contactPerson: "Kavya Nair",
            email: "kavya@manufacturing.com",
            phone: "+91 21098 76543",
            location: "Ahmedabad",
            customerType: "Business",
            gstNumber: "24FFFFF5555F6Z0",
            gstStatus: "Registered",
            status: "Active",
            billingAddress: {
                street: "258 Industrial Area",
                city: "Ahmedabad",
                state: "Gujarat",
                pincode: "380015",
                country: "India"
            },
            shippingAddress: {
                street: "258 Industrial Area",
                city: "Ahmedabad",
                state: "Gujarat",
                pincode: "380015",
                country: "India",
                sameAsBilling: true
            },
            bankDetails: {
                accountName: "Manufacturing Co Ltd",
                accountNumber: "4567890123",
                ifscCode: "VIJB0001234",
                bankName: "Vijaya Bank"
            }
        }
    ];

    // This useEffect is now replaced by the loadCustomers function called in the first useEffect

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
        filtered?.sort((a, b) => {
            let aValue = a?.[sortBy];
            let bValue = b?.[sortBy];

            if (typeof aValue === 'string') {
                aValue = aValue?.toLowerCase();
                bValue = bValue?.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

        setFilteredCustomers(filtered);
    }, [customers, searchTerm, locationFilter, customerTypeFilter, statusFilter, sortBy, sortOrder]);

    // Calculate statistics
    const stats = {
        totalCustomers: customers?.length,
        activeCustomers: customers?.filter(c => c?.status === 'Active')?.length,
        gstRegistered: customers?.filter(c => c?.gstStatus === 'Registered')?.length,
        outstandingAmount: 485000 // Mock outstanding amount
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

    const handleDeleteCustomer = (customer) => {
        if (window.confirm(`Are you sure you want to delete ${customer?.businessName}?`)) {
            try {
                const success = deleteCustomer(customer.id);
                if (success) {
                    loadCustomers(); // Reload customers after deletion
                } else {
                    alert('Error deleting customer. Customer not found.');
                }
            } catch (error) {
                console.error('Error deleting customer:', error);
                alert('Error deleting customer. Please try again.');
            }
        }
    };

    const handleSaveCustomer = (customerData) => {
        try {
            // Prepare customer data with additional fields
            const processedData = {
                ...customerData,
                status: customerData.status || 'Active',
                gstStatus: customerData?.gstNumber ? 'Registered' : 'Unregistered',
                location: customerData?.billingAddress?.city
            };

            if (modalMode === 'add') {
                addCustomer(processedData);
            } else {
                updateCustomer(selectedCustomer.id, processedData);
            }

            loadCustomers(); // Reload customers after save
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