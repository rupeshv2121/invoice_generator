import { useRef, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const LogoUploadSection = ({ logoData, onUpdate }) => {
    const [currentLogo, setCurrentLogo] = useState(logoData);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (file) => {
        if (file && file?.type?.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newLogoData = {
                    url: e?.target?.result,
                    name: file?.name,
                    size: file?.size,
                    lastModified: Date.now()
                };
                setCurrentLogo(newLogoData);
                onUpdate(newLogoData);
            };
            reader?.readAsDataURL(file);
        }
    };

    const handleDrag = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        if (e?.type === "dragenter" || e?.type === "dragover") {
            setDragActive(true);
        } else if (e?.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        setDragActive(false);

        if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
            handleFileSelect(e?.dataTransfer?.files?.[0]);
        }
    };

    const handleFileInput = (e) => {
        if (e?.target?.files && e?.target?.files?.[0]) {
            handleFileSelect(e?.target?.files?.[0]);
        }
    };

    const handleRemoveLogo = () => {
        setCurrentLogo(null);
        onUpdate(null);
        if (fileInputRef?.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
    };

    return (
        <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Company Logo</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Section */}
                <div>
                    <h3 className="text-sm font-medium text-foreground mb-3">Upload Logo</h3>

                    {!currentLogo ? (
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${dragActive
                                    ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <Icon name="Upload" size={48} className="mx-auto text-text-secondary mb-4" />
                            <p className="text-text-secondary mb-2">
                                Drag and drop your logo here, or
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => fileInputRef?.current?.click()}
                                iconName="FolderOpen"
                                iconPosition="left"
                            >
                                Browse Files
                            </Button>
                            <p className="text-xs text-text-secondary mt-2">
                                Supports: PNG, JPG, SVG (Max: 5MB)
                            </p>
                        </div>
                    ) : (
                        <div className="border border-border rounded-lg p-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                                    <Image
                                        src={currentLogo?.url}
                                        alt="Company Logo"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">{currentLogo?.name}</p>
                                    <p className="text-xs text-text-secondary">
                                        {formatFileSize(currentLogo?.size)}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fileInputRef?.current?.click()}
                                        iconName="RefreshCw"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleRemoveLogo}
                                        iconName="Trash2"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                    />

                    <div className="mt-4 p-3 bg-muted rounded-lg">
                        <h4 className="text-sm font-medium text-foreground mb-2">Logo Guidelines</h4>
                        <ul className="text-xs text-text-secondary space-y-1">
                            <li>• Recommended size: 300x100 pixels</li>
                            <li>• Transparent background preferred</li>
                            <li>• High resolution for print quality</li>
                            <li>• Square logos work best for invoices</li>
                        </ul>
                    </div>
                </div>

                {/* Preview Section */}
                <div>
                    <h3 className="text-sm font-medium text-foreground mb-3">Invoice Preview</h3>

                    <div className="border border-border rounded-lg p-6 bg-white">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                {currentLogo ? (
                                    <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                                        <Image
                                            src={currentLogo?.url}
                                            alt="Company Logo Preview"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <Icon name="Image" size={24} className="text-gray-400" />
                                    </div>
                                )}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900">Your Company Name</h4>
                                    <p className="text-sm text-gray-600">123 Business Street</p>
                                    <p className="text-sm text-gray-600">City, State 123456</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <h3 className="text-2xl font-bold text-gray-900">TAX INVOICE</h3>
                                <p className="text-sm text-gray-600">Invoice #: INV-2024-001</p>
                                <p className="text-sm text-gray-600">Date: {new Date()?.toLocaleDateString('en-IN')}</p>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h5 className="text-sm font-medium text-gray-900 mb-2">Bill To:</h5>
                                    <p className="text-sm text-gray-600">Customer Name</p>
                                    <p className="text-sm text-gray-600">Customer Address</p>
                                </div>
                                <div>
                                    <h5 className="text-sm font-medium text-gray-900 mb-2">Ship To:</h5>
                                    <p className="text-sm text-gray-600">Shipping Address</p>
                                    <p className="text-sm text-gray-600">Same as billing</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            <p className="text-xs text-gray-500">Invoice preview with your logo</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoUploadSection;