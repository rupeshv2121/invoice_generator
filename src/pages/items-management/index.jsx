import { useEffect, useState } from 'react';
import {
    createItem,
    deleteItem,
    getItems,
    updateItem
} from '../../api/items';

import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Input from '../../components/ui/Input';
import {
    exportItems,
    importItems,
    searchItems,
    validateItemData
} from '../../services/itemService';
import ItemFormModal from './components/ItemFormModal';
import ItemsStats from './components/ItemsStats';
import ItemsTable from './components/ItemsTable';

const ItemsManagement = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [stats, setStats] = useState({});


    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Load items on component mount
    useEffect(() => {
        loadItems();
    }, []);

    // Filter items when search term changes
    useEffect(() => {
        handleSearch();
    }, [searchTerm, items]);

    const loadItems = async () => {
        setLoading(true);
        try {
            const itemsList = await getItems();
            setItems(itemsList);
            setFilteredItems(itemsList.data.items);
            // setStats(getItemsStats());
        } catch (error) {
            console.error('Error loading items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        const filtered = searchItems(searchTerm);
        setFilteredItems(filtered);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleAddItem = () => {
        setEditingItem(null);
        setShowFormModal(true);
    };

    const handleEditItem = (item) => {
        setEditingItem(item);
        setShowFormModal(true);
    };

    const handleDeleteItem = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            const result = await deleteItem(itemId);
            if (result.success) {
                loadItems();
                // Remove from selected items if it was selected
                setSelectedItems(selectedItems.filter(id => id !== itemId));
            } else {
                alert('Error deleting item: ' + result.error);
            }
        }
    };

    const handleSaveItem = async (itemData) => {
        const validation = validateItemData(itemData);
        if (!validation.isValid) {
            return { success: false, errors: validation.errors };
        }

        let result;
        if (editingItem) {
            result = await updateItem({ ...editingItem, ...itemData });
        } else {
            result = await createItem(itemData);
        }

        if (result.success) {
            setShowFormModal(false);
            setEditingItem(null);
            loadItems();
        }

        return result;
    };

    const handleBulkDelete = async () => {
        if (selectedItems.length === 0) {
            alert('Please select items to delete');
            return;
        }

        if (window.confirm(`Are you sure you want to delete ${selectedItems.length} selected items?`)) {
            let successCount = 0;
            for (const itemId of selectedItems) {
                const result = await deleteItem(itemId);
                if (result.success) successCount++;
            }

            setSelectedItems([]);
            loadItems();
            alert(`${successCount} items deleted successfully`);
        }
    };

    const handleExport = () => {
        const result = exportItems();
        if (result.success) {
            alert('Items exported successfully');
        } else {
            alert('Error exporting items: ' + result.error);
        }
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const result = importItems(e.target.result);
                if (result.success) {
                    loadItems();
                    alert(`${result.itemsCount} items imported successfully`);
                } else {
                    alert('Error importing items: ' + result.error);
                }
            } catch (error) {
                alert('Error reading file: ' + error.message);
            }
        };
        reader.readAsText(file);

        // Reset the input
        event.target.value = '';
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            const pageItems = getCurrentPageItems();
            const pageItemIds = pageItems.map(item => item.id);
            setSelectedItems([...new Set([...selectedItems, ...pageItemIds])]);
        } else {
            const pageItems = getCurrentPageItems();
            const pageItemIds = pageItems.map(item => item.id);
            setSelectedItems(selectedItems.filter(id => !pageItemIds.includes(id)));
        }
    };

    const handleSelectItem = (itemId, checked) => {
        if (checked) {
            setSelectedItems([...selectedItems, itemId]);
        } else {
            setSelectedItems(selectedItems.filter(id => id !== itemId));
        }
    };

    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredItems.slice(startIndex, endIndex);
    };

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const breadcrumbItems = [
        { label: 'Dashboard', href: '/' },
        { label: 'Items Management', href: '/items-management' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-[90%] mt-16 mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                <div className="mb-6">
                    <Breadcrumb items={breadcrumbItems} />
                    <div className="mt-4 flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Items Management</h1>
                            <p className="text-gray-600 text-sm sm:text-base">Manage your products and services</p>
                        </div>

                        {/* Desktop buttons */}
                        <div className="hidden lg:flex items-center space-x-3">
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                className="hidden"
                                id="import-items"
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById('import-items').click()}
                                iconName="Upload"
                            >
                                Import
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleExport}
                                iconName="Download"
                            >
                                Export
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                onClick={handleAddItem}
                                iconName="Plus"
                            >
                                Add Item
                            </Button>
                        </div>

                        {/* Mobile buttons */}
                        <div className="lg:hidden grid grid-cols-2 gap-2 w-full">
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                className="hidden"
                                id="import-items-mobile"
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById('import-items-mobile').click()}
                                iconName="Upload"
                                className="w-full justify-center"
                            >
                                Import
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleExport}
                                iconName="Download"
                                className="w-full justify-center"
                            >
                                Export
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                onClick={handleAddItem}
                                iconName="Plus"
                                className="col-span-2 w-full justify-center"
                            >
                                Add Item
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <ItemsStats stats={stats} />

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Search & Filter</h2>
                        {selectedItems.length > 0 && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleBulkDelete}
                                iconName="Trash2"
                                className="w-full sm:w-auto"
                            >
                                Delete Selected ({selectedItems.length})
                            </Button>
                        )}
                    </div>

                    <div className="flex flex-col space-y-4">
                        <div className="w-full">
                            <Input
                                type="text"
                                placeholder="Search by item name or HSN code..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div className="flex items-center justify-center sm:justify-end">
                            <span className="text-sm text-gray-600">
                                Showing {filteredItems.length} of {items.length} items
                            </span>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <ItemsTable
                    items={getCurrentPageItems()}
                    loading={loading}
                    selectedItems={selectedItems}
                    onSelectAll={handleSelectAll}
                    onSelectItem={handleSelectItem}
                    onEditItem={handleEditItem}
                    onDeleteItem={handleDeleteItem}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredItems.length}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />

                {/* Item Form Modal */}
                <ItemFormModal
                    isOpen={showFormModal}
                    onClose={() => {
                        setShowFormModal(false);
                        setEditingItem(null);
                    }}
                    onSave={handleSaveItem}
                    editingItem={editingItem}
                />
            </main>
        </div>
    );
};

export default ItemsManagement;