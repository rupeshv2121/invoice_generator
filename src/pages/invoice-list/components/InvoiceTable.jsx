import { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import InvoiceActionMenu from './InvoiceActionMenu';
import InvoiceStatusBadge from './InvoiceStatusBadge';

const InvoiceTable = ({ invoices, selectedInvoices, onSelectionChange, onInvoiceAction }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            const allIds = invoices?.map(invoice => invoice?.id);
            onSelectionChange(allIds);
        } else {
            onSelectionChange([]);
        }
    };

    const handleSelectInvoice = (invoiceId, checked) => {
        if (checked) {
            onSelectionChange([...selectedInvoices, invoiceId]);
        } else {
            onSelectionChange(selectedInvoices?.filter(id => id !== invoiceId));
        }
    };

    const getSortIcon = (columnKey) => {
        if (sortConfig?.key !== columnKey) {
            return <Icon name="ArrowUpDown" size={14} className="text-text-secondary" />;
        }
        return sortConfig?.direction === 'asc'
            ? <Icon name="ArrowUp" size={14} className="text-primary" />
            : <Icon name="ArrowDown" size={14} className="text-primary" />;
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        })?.format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString)?.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const isAllSelected = selectedInvoices?.length === invoices?.length && invoices?.length > 0;
    const isIndeterminate = selectedInvoices?.length > 0 && selectedInvoices?.length < invoices?.length;

    return (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted border-b border-border">
                        <tr>
                            <th className="w-12 px-4 py-3 text-left">
                                <Checkbox
                                    checked={isAllSelected}
                                    indeterminate={isIndeterminate}
                                    onChange={(e) => handleSelectAll(e?.target?.checked)}
                                />
                            </th>
                            <th className="px-4 py-3 text-left">
                                <button
                                    onClick={() => handleSort('invoiceNumber')}
                                    className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                                >
                                    <span>Invoice #</span>
                                    {getSortIcon('invoiceNumber')}
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left">
                                <button
                                    onClick={() => handleSort('customerName')}
                                    className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                                >
                                    <span>Customer</span>
                                    {getSortIcon('customerName')}
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left">
                                <button
                                    onClick={() => handleSort('date')}
                                    className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                                >
                                    <span>Date</span>
                                    {getSortIcon('date')}
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left">
                                <button
                                    onClick={() => handleSort('dueDate')}
                                    className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                                >
                                    <span>Due Date</span>
                                    {getSortIcon('dueDate')}
                                </button>
                            </th>
                            <th className="px-4 py-3 text-right">
                                <button
                                    onClick={() => handleSort('amount')}
                                    className="flex items-center justify-end space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                                >
                                    <span>Amount</span>
                                    {getSortIcon('amount')}
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left">
                                <span className="text-sm font-medium text-foreground">Status</span>
                            </th>
                            <th className="w-16 px-4 py-3 text-center">
                                <span className="text-sm font-medium text-foreground">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {invoices?.map((invoice) => (
                            <tr key={invoice?.id} className="hover:bg-muted/50 transition-colors">
                                <td className="px-4 py-3">
                                    <Checkbox
                                        checked={selectedInvoices?.includes(invoice?.id)}
                                        onChange={(e) => handleSelectInvoice(invoice?.id, e?.target?.checked)}
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <span className="font-mono text-sm font-medium text-primary">
                                        {invoice?.invoiceNumber}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div>
                                        <div className="font-medium text-foreground">{invoice?.customerName}</div>
                                        <div className="text-sm text-text-secondary">{invoice?.customerEmail}</div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-foreground">
                                    {formatDate(invoice?.date)}
                                </td>
                                <td className="px-4 py-3 text-sm text-foreground">
                                    {formatDate(invoice?.dueDate)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <span className="font-medium text-foreground">
                                        {formatAmount(invoice?.amount)}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <InvoiceStatusBadge status={invoice?.status} />
                                </td>
                                <td className="px-4 py-3">
                                    <InvoiceActionMenu
                                        invoice={invoice}
                                        onAction={onInvoiceAction}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4 p-4">
                {invoices?.map((invoice) => (
                    <div key={invoice?.id} className="border border-border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    checked={selectedInvoices?.includes(invoice?.id)}
                                    onChange={(e) => handleSelectInvoice(invoice?.id, e?.target?.checked)}
                                />
                                <div>
                                    <div className="font-mono text-sm font-medium text-primary">
                                        {invoice?.invoiceNumber}
                                    </div>
                                    <div className="text-sm text-text-secondary">
                                        {formatDate(invoice?.date)}
                                    </div>
                                </div>
                            </div>
                            <InvoiceActionMenu
                                invoice={invoice}
                                onAction={onInvoiceAction}
                            />
                        </div>

                        <div className="space-y-2">
                            <div>
                                <div className="font-medium text-foreground">{invoice?.customerName}</div>
                                <div className="text-sm text-text-secondary">{invoice?.customerEmail}</div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-text-secondary">Amount</div>
                                    <div className="font-medium text-foreground">
                                        {formatAmount(invoice?.amount)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-text-secondary">Due Date</div>
                                    <div className="text-sm text-foreground">
                                        {formatDate(invoice?.dueDate)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <InvoiceStatusBadge status={invoice?.status} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Empty State */}
            {invoices?.length === 0 && (
                <div className="text-center py-12">
                    <Icon name="FileText" size={48} className="text-text-secondary mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No invoices found</h3>
                    <p className="text-text-secondary mb-4">
                        Try adjusting your filters or create your first invoice.
                    </p>
                    <Button
                        variant="default"
                        iconName="Plus"
                        iconPosition="left"
                        onClick={() => onInvoiceAction('create')}
                    >
                        Create Invoice
                    </Button>
                </div>
            )}
        </div>
    );
};

export default InvoiceTable;