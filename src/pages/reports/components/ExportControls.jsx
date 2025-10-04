import { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ExportControls = ({ selectedReportType, dateRange }) => {
    const [exportFormat, setExportFormat] = useState('pdf');
    const [isExporting, setIsExporting] = useState(false);

    const exportFormats = [
        { value: 'pdf', label: 'PDF Document' },
        { value: 'excel', label: 'Excel Spreadsheet' },
        { value: 'csv', label: 'CSV File' }
    ];

    const savedTemplates = [
        { value: 'monthly-summary', label: 'Monthly Summary Report' },
        { value: 'quarterly-gst', label: 'Quarterly GST Report' },
        { value: 'customer-analysis', label: 'Customer Analysis Report' },
        { value: 'tax-summary', label: 'Tax Summary Report' }
    ];

    const handleExport = async () => {
        setIsExporting(true);

        // Simulate export process
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock download trigger
        const fileName = `${selectedReportType}-report-${Date.now()}.${exportFormat}`;
        console.log(`Exporting ${fileName}`);

        setIsExporting(false);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleSaveTemplate = () => {
        console.log('Saving report template...');
    };

    return (
        <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Export & Print</h2>
            <div className="space-y-6">
                {/* Export Format Selection */}
                <div>
                    <Select
                        label="Export Format"
                        options={exportFormats}
                        value={exportFormat}
                        onChange={setExportFormat}
                        className="w-full md:w-64"
                    />
                </div>

                {/* Export Actions */}
                <div className="flex flex-wrap gap-3">
                    <Button
                        variant="default"
                        onClick={handleExport}
                        loading={isExporting}
                        iconName="Download"
                        iconPosition="left"
                    >
                        {isExporting ? 'Exporting...' : 'Export Report'}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={handlePrint}
                        iconName="Printer"
                        iconPosition="left"
                    >
                        Print Report
                    </Button>

                    <Button
                        variant="outline"
                        onClick={handleSaveTemplate}
                        iconName="Save"
                        iconPosition="left"
                    >
                        Save Template
                    </Button>
                </div>

                {/* Saved Templates */}
                <div className="border-t border-border pt-6">
                    <h3 className="text-lg font-medium text-foreground mb-4">Saved Templates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {savedTemplates?.map((template) => (
                            <div
                                key={template?.value}
                                className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg hover:bg-muted/50 transition-colors duration-150"
                            >
                                <div className="flex items-center space-x-3">
                                    <Icon name="FileText" size={16} className="text-text-secondary" />
                                    <span className="text-sm font-medium text-foreground">{template?.label}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="sm" iconName="Download">
                                        <span className="sr-only">Download template</span>
                                    </Button>
                                    <Button variant="ghost" size="sm" iconName="Trash2">
                                        <span className="sr-only">Delete template</span>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Export Summary */}
                <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2">Export Summary</h4>
                    <div className="text-sm text-text-secondary space-y-1">
                        <p>Report Type: <span className="font-medium text-foreground capitalize">{selectedReportType?.replace('-', ' ')}</span></p>
                        <p>Date Range: <span className="font-medium text-foreground">{dateRange?.start} to {dateRange?.end}</span></p>
                        <p>Format: <span className="font-medium text-foreground uppercase">{exportFormat}</span></p>
                        <p>Generated: <span className="font-medium text-foreground">{new Date()?.toLocaleString('en-IN')}</span></p>
                    </div>
                </div>

                {/* Quick Export Options */}
                <div className="border-t border-border pt-6">
                    <h4 className="font-medium text-foreground mb-3">Quick Export</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        <Button variant="outline" size="sm" className="text-xs">
                            <Icon name="FileText" size={14} className="mr-1" />
                            PDF Summary
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                            <Icon name="FileSpreadsheet" size={14} className="mr-1" />
                            Excel Data
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                            <Icon name="Database" size={14} className="mr-1" />
                            CSV Export
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExportControls;