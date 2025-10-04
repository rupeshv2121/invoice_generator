import { useEffect, useState } from 'react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import CompanyFilters from './components/CompanyFilters';
import CompanyModal from './components/CompanyModal';
import CompanyStats from './components/CompanyStats';
import CompanyTable from './components/CompanyTable';

const CompanyManagement = () => {
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [companyTypeFilter, setCompanyTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('companyName');
    const [sortOrder, setSortOrder] = useState('asc');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [modalMode, setModalMode] = useState('add');

    // Mock company data
    const mockCompanies = [
        {
            id: 1,
            companyName: "Acme Corporation Ltd",
            contactPerson: "John Smith",
            email: "john@acmecorp.com",
            phone: "+91 98765 43210",
            location: "Mumbai",
            companyType: "Private Limited",
            gstNumber: "27AAAAA0000A1Z5",
            panNumber: "AAAAA0000A",
            eximCode: "3030901234",
            cinNumber: "U12345MH2020PTC123456",
            gstStatus: "Registered",
            status: "Active",
            incorporationDate: "2020-01-15",
            website: "https://acmecorp.com",
            billingAddress: {
                street: "123 Business Complex, Andheri East",
                city: "Mumbai",
                state: "Maharashtra",
                pincode: "400069",
                country: "India"
            },
            registeredAddress: {
                street: "123 Business Complex, Andheri East",
                city: "Mumbai",
                state: "Maharashtra",
                pincode: "400069",
                country: "India",
                sameAsBilling: true
            },
            bankDetails: {
                accountName: "Acme Corporation Ltd",
                accountNumber: "1234567890123456",
                ifscCode: "HDFC0001234",
                bankName: "HDFC Bank",
                branchName: "Andheri East Branch"
            },
            authorizedSignatory: {
                name: "John Smith",
                designation: "Managing Director",
                email: "john@acmecorp.com",
                phone: "+91 98765 43210"
            },
            businessDetails: {
                industry: "Information Technology",
                businessNature: "Software Development",
                annualTurnover: "5000000",
                employeeCount: "25"
            },
            createdAt: "2024-01-15T10:30:00Z",
            updatedAt: "2024-10-01T14:20:00Z"
        },
        {
            id: 2,
            companyName: "Tech Innovations Pvt Ltd",
            contactPerson: "Priya Sharma",
            email: "priya@techinnovations.com",
            phone: "+91 87654 32109",
            location: "Bangalore",
            companyType: "Private Limited",
            gstNumber: "29BBBBB1111B2Y6",
            panNumber: "BBBBB1111B",
            eximCode: "3030901235",
            cinNumber: "U12345KA2021PTC234567",
            gstStatus: "Registered",
            status: "Active",
            incorporationDate: "2021-03-20",
            website: "https://techinnovations.com",
            billingAddress: {
                street: "456 Tech Park, Electronic City",
                city: "Bangalore",
                state: "Karnataka",
                pincode: "560100",
                country: "India"
            },
            registeredAddress: {
                street: "456 Tech Park, Electronic City",
                city: "Bangalore",
                state: "Karnataka",
                pincode: "560100",
                country: "India",
                sameAsBilling: true
            },
            bankDetails: {
                accountName: "Tech Innovations Pvt Ltd",
                accountNumber: "9876543210987654",
                ifscCode: "ICIC0001234",
                bankName: "ICICI Bank",
                branchName: "Electronic City Branch"
            },
            authorizedSignatory: {
                name: "Priya Sharma",
                designation: "CEO",
                email: "priya@techinnovations.com",
                phone: "+91 87654 32109"
            },
            businessDetails: {
                industry: "Information Technology",
                businessNature: "Mobile App Development",
                annualTurnover: "3000000",
                employeeCount: "15"
            },
            createdAt: "2024-02-10T09:15:00Z",
            updatedAt: "2024-09-25T16:45:00Z"
        }
    ];

    useEffect(() => {
        setCompanies(mockCompanies);
        setFilteredCompanies(mockCompanies);
    }, []);

    // Filter and search functionality
    useEffect(() => {
        let filtered = companies.filter(company => {
            const matchesSearch =
                company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                company.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                company.phone.includes(searchTerm) ||
                company.gstNumber.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesLocation = !locationFilter || company.location === locationFilter;
            const matchesType = !companyTypeFilter || company.companyType === companyTypeFilter;
            const matchesStatus = !statusFilter || company.status === statusFilter;

            return matchesSearch && matchesLocation && matchesType && matchesStatus;
        });

        // Apply sorting
        filtered.sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];

            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        setFilteredCompanies(filtered);
    }, [companies, searchTerm, locationFilter, companyTypeFilter, statusFilter, sortBy, sortOrder]);

    const handleAddCompany = () => {
        setSelectedCompany(null);
        setModalMode('add');
        setIsModalOpen(true);
    };

    const handleEditCompany = (company) => {
        setSelectedCompany(company);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleViewCompany = (company) => {
        setSelectedCompany(company);
        setModalMode('view');
        setIsModalOpen(true);
    };

    const handleDeleteCompany = (companyId) => {
        if (window.confirm('Are you sure you want to delete this company?')) {
            setCompanies(companies.filter(company => company.id !== companyId));
        }
    };

    const handleSaveCompany = (companyData) => {
        if (modalMode === 'add') {
            const newCompany = {
                ...companyData,
                id: companies.length + 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            setCompanies([...companies, newCompany]);
        } else if (modalMode === 'edit') {
            setCompanies(companies.map(company =>
                company.id === selectedCompany.id
                    ? { ...companyData, id: selectedCompany.id, updatedAt: new Date().toISOString() }
                    : company
            ));
        }
        setIsModalOpen(false);
        setSelectedCompany(null);
    };

    const breadcrumbItems = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Company Management', href: '/company-management' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
                <div className="mb-8">
                    <Breadcrumb items={breadcrumbItems} />

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Company Management</h1>
                            <p className="text-gray-600 mt-2">Manage your company profiles and details</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
                            <Button
                                variant="outline"
                                iconName="Download"
                                onClick={() => {/* Handle export */ }}
                            >
                                Export
                            </Button>
                            <Button
                                variant="default"
                                iconName="Plus"
                                onClick={handleAddCompany}
                            >
                                Add Company
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <CompanyStats companies={companies} />

                {/* Filters Section */}
                <CompanyFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    locationFilter={locationFilter}
                    setLocationFilter={setLocationFilter}
                    companyTypeFilter={companyTypeFilter}
                    setCompanyTypeFilter={setCompanyTypeFilter}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    companies={companies}
                />

                {/* Companies Table */}
                <CompanyTable
                    companies={filteredCompanies}
                    onEdit={handleEditCompany}
                    onView={handleViewCompany}
                    onDelete={handleDeleteCompany}
                />

                {/* Add/Edit Company Modal */}
                {isModalOpen && (
                    <CompanyModal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setSelectedCompany(null);
                        }}
                        company={selectedCompany}
                        onSave={handleSaveCompany}
                        mode={modalMode}
                    />
                )}
            </div>
        </div>
    );
};

export default CompanyManagement;