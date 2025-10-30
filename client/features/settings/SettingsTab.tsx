
import React, { useState } from 'react';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import useLocalStorage from '../../hooks/useLocalStorage';
import { Copy } from '../../components/ui/icons';

type Settings = {
    apiKey: string;
    parallelBatches: number;
    batchSize: number;
    autoRetry: boolean;
    skipDuplicates: boolean;
    notifications: {
        complete: boolean;
        failed: boolean;
        lowCredits: boolean;
    };
    theme: 'light' | 'dark' | 'auto';
};

const defaultSettings: Settings = {
    apiKey: 'sk_test_************************1234',
    parallelBatches: 5,
    batchSize: 1000,
    autoRetry: true,
    skipDuplicates: true,
    notifications: {
        complete: true,
        failed: true,
        lowCredits: true,
    },
    theme: 'light',
};

const SettingsTab = () => {
    const [settings, setSettings] = useLocalStorage<Settings>('appSettings', defaultSettings);
    const [showApiKey, setShowApiKey] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };
    
    const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setSettings(prev => ({ 
            ...prev, 
            notifications: { ...prev.notifications, [name]: checked }
        }));
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
            
            <Card>
                <CardHeader><CardTitle>API Configuration</CardTitle></CardHeader>
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-slate-700">API Key</label>
                    <div className="flex items-center gap-2">
                        <input 
                            type={showApiKey ? "text" : "password"} 
                            readOnly 
                            value={settings.apiKey} 
                            className="flex-1 bg-slate-100 border border-slate-300 rounded-lg p-2 font-mono" 
                        />
                        <button onClick={() => setShowApiKey(!showApiKey)} className="text-sm font-semibold text-blue-600">
                            {showApiKey ? 'Hide' : 'Show'}
                        </button>
                        <button onClick={() => navigator.clipboard.writeText(settings.apiKey)} className="p-2 rounded-lg hover:bg-slate-100">
                            <Copy size={18} />
                        </button>
                    </div>
                </div>
            </Card>

            <Card>
                <CardHeader><CardTitle>Enrichment Preferences</CardTitle></CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="parallelBatches" className="block text-sm font-medium text-slate-700">Parallel Batches: {settings.parallelBatches}</label>
                        <input 
                            id="parallelBatches"
                            name="parallelBatches"
                            type="range" min="1" max="20" 
                            value={settings.parallelBatches} 
                            onChange={handleInputChange} 
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                     <div>
                        <label htmlFor="batchSize" className="block text-sm font-medium text-slate-700">Batch Size: {settings.batchSize}</label>
                        <input 
                            id="batchSize"
                            name="batchSize"
                            type="range" min="100" max="1000" step="100"
                            value={settings.batchSize} 
                            onChange={handleInputChange} 
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="flex items-center"><input type="checkbox" name="autoRetry" checked={settings.autoRetry} onChange={handleInputChange} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /><span className="ml-2">Auto-retry failed enrichments</span></label>
                        <label className="flex items-center"><input type="checkbox" name="skipDuplicates" checked={settings.skipDuplicates} onChange={handleInputChange} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /><span className="ml-2">Skip duplicates automatically</span></label>
                    </div>
                </div>
            </Card>

            <Card>
                <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
                 <div className="space-y-2">
                    <label className="flex items-center"><input type="checkbox" name="complete" checked={settings.notifications.complete} onChange={handleNotificationChange} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /><span className="ml-2">Enrichment complete</span></label>
                    <label className="flex items-center"><input type="checkbox" name="failed" checked={settings.notifications.failed} onChange={handleNotificationChange} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /><span className="ml-2">Enrichment failed</span></label>
                    <label className="flex items-center"><input type="checkbox" name="lowCredits" checked={settings.notifications.lowCredits} onChange={handleNotificationChange} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /><span className="ml-2">Credits low (&lt; 20%)</span></label>
                </div>
            </Card>

            <div className="flex justify-end">
                <button className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors">Save Settings</button>
            </div>
        </div>
    );
};

export default SettingsTab;
