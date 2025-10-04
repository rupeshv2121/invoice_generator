import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CompanyTable = ({ companies, onEdit, onDelete, onView }) => {
    const getStatusBadge = (status) => {
        const badges = {
            'Active': 'bg-green-100 text-green-800',
            'Inactive': 'bg-gray-100 text-gray-800',
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Suspended': 'bg-red-100 text-red-800'
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[status] || badges['Active']}`}>
                {status}
            </span>
        );
    };

    const getCompanyTypeBadge = (type) => {
        const badges = {
            'Private Limited': 'bg-blue-100 text-blue-800',
            'Public Limited': 'bg-purple-100 text-purple-800',
            'Partnership': 'bg-orange-100 text-orange-800',
            'Sole Proprietorship': 'bg-indigo-100 text-indigo-800',
            'LLP': 'bg-teal-100 text-teal-800'
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[type] || badges['Private Limited']}`}>
                {type}
            </span>
        );
    };

    if (companies.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-12 text-center">
                    <Icon name="Building2" size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
                    <p className="text-gray-500 mb-6">
                        Get started by adding your first company.
                    </p>
                    <Button>
                        <Icon name="Plus" size={16} className="mr-2" />
                        Add Company
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Company
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contact Person
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                EXIM Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {companies.map((company) => (
                            <tr key={company.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                                <span className="text-white font-medium text-sm">
                                                    {company.companyName.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {company.companyName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {company.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{company.contactPerson}</div>
                                    <div className="text-sm text-gray-500">{company.phone}</div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded">
                                        {company.eximCode || 'N/A'}
                                    </div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getCompanyTypeBadge(company.companyType)}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {company.location}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(company.status)}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            iconName="Eye"
                                            onClick={() => onView(company)}
                                            title="View Details"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            iconName="Edit"
                                            onClick={() => onEdit(company)}
                                            title="Edit Company"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            iconName="Trash2"
                                            onClick={() => onDelete(company)}
                                            title="Delete Company"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CompanyTable;