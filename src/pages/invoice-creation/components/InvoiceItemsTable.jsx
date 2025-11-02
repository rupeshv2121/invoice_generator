import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import ItemSelector from './ItemSelector';


const InvoiceItemsTable = ({ items, onItemsChange, companyState, customerState }) => {
    const unitOptions = [
        { value: 'pcs', label: 'Pieces' },
        { value: 'kg', label: 'Kilograms' },
        { value: 'ltr', label: 'Liters' },
        { value: 'mtr', label: 'Meters' },
        { value: 'hrs', label: 'Hours' },
        { value: 'days', label: 'Days' },
        { value: 'box', label: 'Box' },
        { value: 'set', label: 'Set' }
    ];

    const calculateItemTotals = (item) => {
        const quantity = parseFloat(item?.quantity) || 0;
        const rate = parseFloat(item?.rate) || 0;
        const discountPercent = parseFloat(item?.discountPercent) || 0;

        const grossAmount = quantity * rate;
        const discountAmount = (grossAmount * discountPercent) / 100;
        const taxableAmount = grossAmount - discountAmount;

        // Determine if IGST or CGST+SGST applies
        const isInterState = companyState !== customerState;
        const taxRate = parseFloat(item?.taxRate) || 0;

        let cgstAmount = 0;
        let sgstAmount = 0;
        let igstAmount = 0;

        if (isInterState) {
            igstAmount = (taxableAmount * taxRate) / 100;
        } else {
            cgstAmount = (taxableAmount * (taxRate / 2)) / 100;
            sgstAmount = (taxableAmount * (taxRate / 2)) / 100;
        }

        const totalAmount = taxableAmount + cgstAmount + sgstAmount + igstAmount;

        return {
            grossAmount,
            taxableAmount,
            cgstAmount,
            sgstAmount,
            igstAmount,
            totalAmount
        };
    };

    const updateItem = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index] = { ...updatedItems?.[index], [field]: value };

        // Recalculate totals for this item
        const totals = calculateItemTotals(updatedItems?.[index]);
        updatedItems[index] = { ...updatedItems?.[index], ...totals };

        onItemsChange(updatedItems);
    };

    const addItem = () => {
        const newItem = {
            id: Date.now(),
            description: '',
            hsnCode: '',
            unit: '',
            quantity: '',
            rate: '',
            discountPercent: '',
            taxRate: '',
            grossAmount: '',
            taxableAmount: '',
            cgstAmount: '',
            sgstAmount: '',
            igstAmount: '',
            totalAmount: ''
        };
        onItemsChange([...items, newItem]);
    };

    const removeItem = (index) => {
        if (items?.length > 1) {
            const updatedItems = items?.filter((_, i) => i !== index);
            onItemsChange(updatedItems);
        }
    };

    const isInterState = companyState !== customerState;
    return (
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Invoice Items</h2>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={addItem}
                    iconName="Plus"
                    iconPosition="left"
                >
                    Add Item
                </Button>
            </div>
            <div className="overflow-x-auto overflow-y-visible">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-muted">
                            <th className="border border-border p-2 text-left text-sm font-medium text-foreground">Sr.</th>
                            <th className="border border-border p-2 text-left text-sm font-medium text-foreground min-w-[200px]">Description</th>
                            <th className="border border-border p-2 text-left text-sm font-medium text-foreground">HSN Code</th>
                            <th className="border border-border p-2 text-left text-sm font-medium text-foreground">Unit</th>
                            <th className="border border-border p-2 text-left text-sm font-medium text-foreground">Qty</th>
                            <th className="border border-border p-2 text-left text-sm font-medium text-foreground">Rate (₹)</th>
                            {isInterState ? (
                                <th className="border border-border p-2 text-left text-sm font-medium text-foreground">IGST (₹)</th>
                            ) : (
                                <>
                                    <th className="border border-border p-2 text-left text-sm font-medium text-foreground">CGST (₹)</th>
                                    <th className="border border-border p-2 text-left text-sm font-medium text-foreground">SGST (₹)</th>
                                </>
                            )}
                            <th className="border border-border p-2 text-left text-sm font-medium text-foreground">Total (₹)</th>
                            <th className="border border-border p-2 text-left text-sm font-medium text-foreground">Action</th>
                        </tr>
                    </thead>
                    <tbody className="relative">
                        {items?.map((item, index) => (
                            <tr key={item?.id} className={index % 2 === 0 ? 'bg-surface' : 'bg-surface-secondary'}>
                                <td className="border border-border p-2 text-center text-sm">
                                    {index + 1}
                                </td>
                                <td className="border border-border p-2 static">
                                    <div className="relative">
                                        <ItemSelector
                                            value={item?.description}
                                            onChange={(itemData) => {
                                                // Update multiple fields when an item is selected
                                                const updatedItem = { ...item, ...itemData };
                                                const totals = calculateItemTotals(updatedItem);
                                                const updatedItems = [...items];
                                                updatedItems[index] = { ...updatedItem, ...totals };
                                                onItemsChange(updatedItems);
                                            }}
                                            placeholder="Search and select item..."
                                        />
                                    </div>
                                </td>
                                <td className="border border-border p-2">
                                    <Input
                                        type="text"
                                        value={item?.hsnCode}
                                        onChange={(e) => updateItem(index, 'hsnCode', e?.target?.value)}
                                        placeholder="HSN Code"
                                        className="border-0 p-0 text-sm w-16"
                                        disabled={true}
                                        readOnly
                                    />
                                </td>
                                <td className="border border-border p-2">
                                    <Select
                                        options={unitOptions}
                                        value={item?.unit}
                                        onChange={(value) => updateItem(index, 'unit', value)}
                                        className="border-0 p-0 text-sm"
                                    />
                                </td>
                                <td className="border border-border p-2">
                                    <Input
                                        type="number"
                                        value={item?.quantity}
                                        onChange={(e) => updateItem(index, 'quantity', e?.target?.value)}
                                        min="0"
                                        step="0.01"
                                        className="border-0 p-0 text-sm w-16"
                                    />
                                </td>
                                <td className="border border-border p-2">
                                    <Input
                                        type="number"
                                        value={item?.rate}
                                        onChange={(e) => updateItem(index, 'rate', e?.target?.value)}
                                        min="0"
                                        step="0.01"
                                        className="border-0 p-0 text-sm w-20"
                                    />
                                </td>


                                {isInterState ? (
                                    <td className="border border-border p-2 text-right text-sm">
                                        ₹{item?.igstAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                ) : (
                                    <>
                                        <td className="border border-border p-2 text-right text-sm">
                                            ₹{item?.cgstAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="border border-border p-2 text-right text-sm">
                                            ₹{item?.sgstAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                    </>
                                )}
                                <td className="border border-border p-2 text-right text-sm font-medium">
                                    ₹{item?.totalAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="border border-border p-2 text-center">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeItem(index)}
                                        disabled={items?.length === 1}
                                        iconName="Trash2"
                                        className="text-destructive hover:text-destructive"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InvoiceItemsTable;