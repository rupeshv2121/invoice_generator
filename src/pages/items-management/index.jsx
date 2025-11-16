import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useItemService } from '../../api/items.js';

import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Input from '../../components/ui/Input';

import ItemFormModal from './components/ItemFormModal';
import ItemsStats from './components/ItemsStats';
import ItemsTable from './components/ItemsTable';

const ItemsManagement = () => {
    const { getItems, createItem, updateItem, deleteItem, itemsStats } = useItemService();
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchItems, setSearchItems] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [stats, setStats] = useState({});


    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);


    // Load items on component mount
    useEffect(() => {
        loadItems();
        loadStats();
    }, []);
    const loadStats = async () => {
        try {
            const data = await itemsStats(); // Call your API
            console.log("📊 Stats data:", data);
            setStats(data);
        } catch (error) {
            console.error("Error loading stats:", error);
        }
    };
    // Filter items when search term changes
    useEffect(() => {
        handleSearch();
    }, [searchItems, items]);

    const loadItems = async () => {
        setLoading(true);
        try {
            const itemsList = await getItems();
            console.log("Item List : ", itemsList)
            setItems(itemsList);
            setFilteredItems(Array.isArray(itemsList) ? itemsList : []);
            // setStats(getItemsStats());
        } catch (error) {
            console.error('Error loading items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        const filtered = items.filter(item => {
            const searchLower = searchItems.toLowerCase();
            return (
                item.name?.toLowerCase().includes(searchLower) ||
                item.description?.toLowerCase().includes(searchLower) ||
                item.hsnCode?.toString().includes(searchItems)
            );
        });
        setFilteredItems(Array.isArray(filtered) ? filtered : []);
        setCurrentPage(1);
    };


    const handleAddItem = () => {
        setEditingItem(null);
        setModalOpen(true);
    };

    const handleEditItem = (item) => {
        setEditingItem(item);
        setModalOpen(true);
    };

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            const result = await deleteItem(itemId);

            if (result?.success) {
                // optional: show toast or soft message instead of alert
                console.log('✅ Item deleted successfully');
                setSelectedItems(prev => prev.filter(id => id !== itemId));
                await loadItems();
            } else {
                console.error('❌ Delete failed:', result?.error || 'Unknown error');
                toast.error('Error deleting item: ' + (result?.error || 'Something went wrong'));
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error('Failed to delete item.');
        }
    };

    const handleSave = async (item) => {
        try {
            const payload = {
                ...item,
                purchasePrice: parseFloat(item.purchasePrice),
                sellingPrice: parseFloat(item.sellingPrice),
                cgstRate: item.cgstRate,
                sgstRate: item.sgstRate,
                igstRate: item.igstRate
            };

            let response;
            if (editingItem) {
                response = await updateItem({ ...editingItem, ...payload });
                console.log("Response HandleSave : ", response)
            } else {
                console.log("Response : ", payload)
                response = await createItem(payload);
            }

            if (response?.success !== false) {
                toast.success(editingItem ? 'Item updated!' : 'Item added!');
                await loadItems();
                return { success: true };
            } else {
                return { success: false, error: response.error };
            }
        } catch (error) {
            console.error('Error creating/updating item:', error);
            return { success: false, error: error.message };
        }
    };


    const handleBulkDelete = async () => {
        if (selectedItems.length === 0) {
            toast.warning('Please select items to delete');
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
            toast.success(`${successCount} items deleted successfully`);
        }
    };

    const handleExport = () => {
        const result = exportItems();
        if (result.success) {
            toast.success('Items exported successfully');
        } else {
            toast.error('Error exporting items: ' + result.error);
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
                    toast.success(`${result.itemsCount} items imported successfully`);
                } else {
                    toast.error('Error importing items: ' + result.error);
                }
            } catch (error) {
                toast.error('Error reading file: ' + error.message);
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
        if (!Array.isArray(filteredItems)) return [];
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
                                value={searchItems}
                                onChange={(e) => setSearchItems(e.target.value)}
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
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSave={handleSave}
                    editingItem={editingItem}
                />
            </main>
        </div>
    );
};

export default ItemsManagement;