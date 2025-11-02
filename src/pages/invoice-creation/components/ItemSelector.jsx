import { ChevronDown, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useItemService } from '../../../api/items';

const ItemSelector = ({ value, onChange, placeholder = "Search items..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const { getItems } = useItemService();

    // Load all items on component mount
    useEffect(() => {
        const fetchData = async () => {
            const allItems = await getItems();
            console.log("Fetched Items: ", allItems);
            setItems(allItems);
            setFilteredItems(allItems);
        };
        fetchData();
    }, []);

    // Filter items based on search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredItems(items);
        } else {
            const filtered = items.filter(item =>
                item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.hsnCode?.toString().includes(searchTerm)
            );
            setFilteredItems(filtered);
        }
    }, [searchTerm, items]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleItemSelect = (item) => {
        // Pass the selected item data to parent
        onChange({
            description: item.name,
            hsnCode: item.hsnCode,
            unit: item.unit,
            rate: item.sellingPrice || item.rate || 0,
            taxRate: item.igstRate || item.taxRate || 0
        });
        setSearchTerm('');
        setIsOpen(false);
    };

    const handleInputClick = () => {
        setIsOpen(true);
    };

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setSearchTerm(newValue);

        if (!isOpen) {
            setIsOpen(true);
        }
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter' && searchTerm && filteredItems.length === 0) {
            // Allow manual entry when no items match
            onChange({ description: searchTerm });
            setIsOpen(false);
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={isOpen ? searchTerm : value}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    onClick={handleInputClick}
                    placeholder={placeholder}
                    className="w-full px-2 py-1 text-sm border-0 focus:outline-none focus:ring-0 bg-transparent"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    {isOpen ? (
                        <Search className="h-4 w-4 text-gray-400" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                </div>
            </div>

            {isOpen && (
                <div className="relative z-[99999] w-96 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto left-0">
                    {filteredItems.length > 0 ? (
                        <>
                            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">
                                {filteredItems.length} item(s) found
                            </div>
                            {filteredItems.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleItemSelect(item)}
                                    className="px-3 py-2 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                                >
                                    <div className="font-medium text-sm text-gray-900">
                                        {item.name}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        HSN: {item.hsnCode} | Unit: {item.unit} | Rate: ₹{item.sellingPrice || item.rate || 0}
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="px-3 py-2">
                            <div className="text-sm text-gray-500 text-center mb-2">
                                {searchTerm ? `No items found for "${searchTerm}"` : 'No items available'}
                            </div>
                            {searchTerm && (
                                <button
                                    onClick={() => {
                                        onChange({ description: searchTerm });
                                        setSearchTerm('');
                                        setIsOpen(false);
                                    }}
                                    className="w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded border border-blue-200"
                                >
                                    Use "{searchTerm}" as custom description
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ItemSelector;