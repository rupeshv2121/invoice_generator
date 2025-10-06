import Button from '../../../components/ui/Button';

const ItemsTable = ({
    items,
    loading,
    selectedItems,
    onSelectAll,
    onSelectItem,
    onEditItem,
    onDeleteItem,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    onPageChange,
    onItemsPerPageChange
}) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    const calculateMargin = (purchasePrice, sellingPrice) => {
        const purchase = parseFloat(purchasePrice) || 0;
        const selling = parseFloat(sellingPrice) || 0;

        if (purchase === 0) return 0;

        const margin = ((selling - purchase) / purchase) * 100;
        return Math.round(margin * 100) / 100;
    };

    const calculateProfit = (purchasePrice, sellingPrice) => {
        const purchase = parseFloat(purchasePrice) || 0;
        const selling = parseFloat(sellingPrice) || 0;
        return selling - purchase;
    };

    const isAllCurrentPageSelected = () => {
        return items.length > 0 && items.every(item => selectedItems.includes(item.id));
    };

    const isSomeCurrentPageSelected = () => {
        return items.some(item => selectedItems.includes(item.id));
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-4 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Table Header */}
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Items List</h3>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <input
                                    type="checkbox"
                                    checked={isAllCurrentPageSelected()}
                                    ref={input => {
                                        if (input) {
                                            input.indeterminate = isSomeCurrentPageSelected() && !isAllCurrentPageSelected();
                                        }
                                    }}
                                    onChange={(e) => onSelectAll(e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Item Details
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                HSN Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Purchase Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Selling Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Profit/Margin
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center">
                                    <div className="text-gray-500">
                                        <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-3.5a2 2 0 00-2 2v1a2 2 0 002 2H20m-16 0h3.5a2 2 0 002-2v-1a2 2 0 00-2-2H4m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v4" />
                                        </svg>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                                        <p className="text-gray-600">Get started by adding your first item.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item.id)}
                                            onChange={(e) => onSelectItem(item.id, e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {item.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Added: {new Date(item.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                                            {item.hsnCode}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatCurrency(item.purchasePrice)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatCurrency(item.sellingPrice)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm">
                                            <div className={`font-medium ${calculateProfit(item.purchasePrice, item.sellingPrice) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {formatCurrency(calculateProfit(item.purchasePrice, item.sellingPrice))}
                                            </div>
                                            <div className={`text-xs ${calculateMargin(item.purchasePrice, item.sellingPrice) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {calculateMargin(item.purchasePrice, item.sellingPrice)}% margin
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onEditItem(item)}
                                                iconName="Edit"
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onDeleteItem(item.id)}
                                                iconName="Trash2"
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden p-4 space-y-4">
                {items.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No items found</p>
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item.id)}
                                        onChange={(e) => onSelectItem(item.id, e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <div>
                                        <div className="font-medium text-gray-900">{item.name}</div>
                                        {item.description && (
                                            <div className="text-sm text-gray-500">{item.description}</div>
                                        )}
                                        <div className="text-xs text-gray-400 mt-1">HSN: {item.hsnCode}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium text-gray-900">
                                        {formatCurrency(item.sellingPrice)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Cost: {formatCurrency(item.purchasePrice)}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                <div className="text-sm">
                                    <span className={`font-medium ${calculateProfit(item.purchasePrice, item.sellingPrice) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(calculateProfit(item.purchasePrice, item.sellingPrice))}
                                    </span>
                                    <span className={`text-xs ml-2 ${calculateMargin(item.purchasePrice, item.sellingPrice) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        ({calculateMargin(item.purchasePrice, item.sellingPrice)}%)
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onEditItem(item)}
                                        iconName="Edit"
                                        className="text-blue-600"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onDeleteItem(item.id)}
                                        iconName="Trash2"
                                        className="text-red-600"
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Responsive Pagination */}
            {items.length > 0 && (
                <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
                    {/* Mobile pagination */}
                    <div className="lg:hidden space-y-4">
                        <div className="flex items-center justify-center space-x-2">
                            <span className="text-sm text-gray-700">Show</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                                className="border border-gray-300 rounded px-2 py-1 text-sm"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                            </select>
                            <span className="text-sm text-gray-700">per page</span>
                        </div>
                        
                        <div className="text-center">
                            <span className="text-sm text-gray-700">
                                Page {currentPage} of {totalPages} ({totalItems} items)
                            </span>
                        </div>
                        
                        <div className="flex justify-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                iconName="ChevronLeft"
                                className="flex-1 max-w-24"
                            >
                                Prev
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                iconName="ChevronRight"
                                className="flex-1 max-w-24"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                    
                    {/* Desktop pagination */}
                    <div className="hidden lg:flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-700">Show</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                                className="border border-gray-300 rounded px-2 py-1 text-sm"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                            <span className="text-sm text-gray-700">per page</span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-700">
                                Page {currentPage} of {totalPages} ({totalItems} total items)
                            </span>
                            <div className="flex space-x-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onPageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    iconName="ChevronLeft"
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onPageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    iconName="ChevronRight"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemsTable;