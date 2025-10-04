import { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CompanyFilters = ({
    searchTerm,
    setSearchTerm,
    locationFilter,
    setLocationFilter,
    companyTypeFilter,
    setCompanyTypeFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    companies
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Get unique values for filter options
    const locations = [...new Set(companies.map(company => company.location))];
    const companyTypes = [...new Set(companies.map(company => company.companyType))];
    const statuses = [...new Set(companies.map(company => company.status))];

    const clearFilters = () => {
        setSearchTerm('');
        setLocationFilter('');
        setCompanyTypeFilter('');
        setStatusFilter('');
        setSortBy('companyName');
        setSortOrder('asc');
    };

    const hasActiveFilters = searchTerm || locationFilter || companyTypeFilter || statusFilter;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                    <div className="relative">
                        <Icon
                            name="Search"
                            size={20}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <Input
                            type="text"
                            placeholder="Search companies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap gap-2">
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="min-w-[120px]"
                    >
                        <option value="">All Status</option>
                        {statuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </Select>

                    <Button
                        variant="outline"
                        iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
                        iconPosition="right"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        Filters
                    </Button>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            iconName="X"
                            onClick={clearFilters}
                        >
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            {/* Expanded Filters */}
            {isExpanded && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                            </label>
                            <Select
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                            >
                                <option value="">All Locations</option>
                                {locations.map(location => (
                                    <option key={location} value={location}>{location}</option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company Type
                            </label>
                            <Select
                                value={companyTypeFilter}
                                onChange={(e) => setCompanyTypeFilter(e.target.value)}
                            >
                                <option value="">All Types</option>
                                {companyTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sort By
                            </label>
                            <Select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="companyName">Company Name</option>
                                <option value="contactPerson">Contact Person</option>
                                <option value="location">Location</option>
                                <option value="createdAt">Date Added</option>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sort Order
                            </label>
                            <Select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </Select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyFilters;