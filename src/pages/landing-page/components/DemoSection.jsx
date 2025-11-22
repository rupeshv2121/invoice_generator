import { ExternalLink, Pause, Play, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const DemoSection = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const demoSteps = [
        {
            title: 'Select Customer & Company',
            description: 'Choose from existing customers or add new ones with GSTIN validation',
            preview: {
                title: 'Customer Selection',
                fields: ['Company: TechCorp Pvt Ltd', 'GSTIN: 27AABCT1234L1ZM', 'State: Maharashtra (27)']
            }
        },
        {
            title: 'Add Invoice Items',
            description: 'Select from inventory or add new items with HSN codes and rates',
            preview: {
                title: 'Invoice Items',
                fields: ['Item: Web Development', 'HSN: 998314', 'Qty: 1', 'Rate: ₹50,000']
            }
        },
        {
            title: 'Automatic GST Calculation',
            description: 'CGST/SGST or IGST automatically calculated based on customer state',
            preview: {
                title: 'Tax Breakdown',
                fields: ['Subtotal: ₹50,000', 'CGST (9%): ₹4,500', 'SGST (9%): ₹4,500', 'Total: ₹59,000']
            }
        },
        {
            title: 'Generate PDF Invoice',
            description: 'Download professional GST-compliant PDF with all details',
            preview: {
                title: 'Invoice Generated',
                fields: ['Status: Paid/Pending/Overdue', 'Format: A4 PDF', 'Export: Download/Preview']
            }
        }
    ];

    const handlePlayDemo = () => {
        setIsPlaying(true);
        const interval = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev >= demoSteps?.length - 1) {
                    setIsPlaying(false);
                    clearInterval(interval);
                    return 0;
                }
                return prev + 1;
            });
        }, 2000);
    };

    const handleRestart = () => {
        setIsPlaying(false);
        setCurrentStep(0);
    };

    return (
        <section id="demo" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        See InvoicePro in Action
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Experience how easy it is to create GST-compliant invoices.
                        Watch our interactive demo or try it yourself.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Demo Controls */}
                    <div className="space-y-8">
                        <div className="space-y-6">
                            {demoSteps?.map((step, index) => (
                                <div
                                    key={index}
                                    className={`p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${currentStep === index
                                        ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'
                                        }`}
                                    onClick={() => setCurrentStep(index)}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div
                                            className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${currentStep === index
                                                ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                                                }`}
                                        >
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {step?.title}
                                            </h3>
                                            <p className="text-gray-600">
                                                {step?.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Demo Controls */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:space-x-4">
                            <Button
                                onClick={isPlaying ? () => setIsPlaying(false) : handlePlayDemo}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2"
                            >
                                {isPlaying ? (
                                    <Pause className="h-5 w-5" />
                                ) : (
                                    <Play className="h-5 w-5" />
                                )}
                                <span>{isPlaying ? 'Pause' : 'Play Demo'}</span>
                            </Button>

                            <Button
                                onClick={handleRestart}
                                className="border border-gray-300 text-white hover:border-blue-600 hover:text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2"
                            >
                                <RotateCcw className="h-5 w-5" />
                                <span>Restart</span>
                            </Button>
                        </div>

                        {/* Try Now CTA */}
                        <div className="p-4 sm:p-6 bg-white rounded-xl border border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">
                                Ready to try it yourself?
                            </h4>
                            <p className="text-gray-600 mb-4 text-sm sm:text-base">
                                Create your first invoice in minutes with our free trial.
                            </p>
                            <Button
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center justify-center space-x-2 w-full sm:w-auto"
                            >
                                <ExternalLink className="h-4 w-4" />
                                <Link to="/dashboard">Start Free Trial</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Demo Preview */}
                    <div className="relative">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 min-h-[400px]">
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {demoSteps?.[currentStep]?.preview?.title}
                                    </h3>
                                    <div className="flex space-x-1">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="h-px bg-gray-200"></div>
                            </div>

                            <div className="space-y-4">
                                {demoSteps?.[currentStep]?.preview?.fields?.map((field, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-fadeIn"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <span className="text-gray-700">{field}</span>
                                        {currentStep === 2 && index > 0 && (
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {currentStep === 3 && (
                                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-green-800 font-medium">
                                            Invoice generated successfully!
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Floating indicators */}
                        <div className="absolute -top-4 -right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Step {currentStep + 1}/4
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DemoSection;