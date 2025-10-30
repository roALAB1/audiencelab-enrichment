
import React from 'react';
import Card, { CardHeader, CardTitle } from './ui/Card';

export interface ProgressData {
    totalBatches: number;
    completedBatches: number;
    totalEmails: number;
    processedEmails: number;
    percentage: number;
    creditsUsed: number;
    startTime?: number;
}

export interface ProgressTrackerProps {
    progress: ProgressData;
    estimatedCredits?: number;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ progress, estimatedCredits }) => {
    // Calculate time remaining
    const getTimeRemaining = () => {
        if (!progress.startTime || progress.percentage === 0) {
            return 'Calculating...';
        }

        const elapsed = Date.now() - progress.startTime;
        const estimatedTotal = (elapsed / progress.percentage) * 100;
        const remaining = estimatedTotal - elapsed;

        if (remaining < 60000) {
            return `${Math.ceil(remaining / 1000)}s`;
        } else {
            return `${Math.ceil(remaining / 60000)}m ${Math.ceil((remaining % 60000) / 1000)}s`;
        }
    };

    // Calculate processing speed
    const getProcessingSpeed = () => {
        if (!progress.startTime || progress.processedEmails === 0) {
            return '0';
        }

        const elapsed = (Date.now() - progress.startTime) / 1000; // seconds
        const speed = progress.processedEmails / elapsed;
        return speed.toFixed(1);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>⚡ Enrichment in Progress</CardTitle>
            </CardHeader>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-700">Overall Progress</span>
                    <span className="text-sm font-bold text-blue-600">{progress.percentage}%</span>
                </div>
                <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
                        style={{ width: `${progress.percentage}%` }}
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Batches</p>
                    <p className="text-lg font-bold text-slate-800">
                        {progress.completedBatches} / {progress.totalBatches}
                    </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Emails</p>
                    <p className="text-lg font-bold text-slate-800">
                        {progress.processedEmails.toLocaleString()} / {progress.totalEmails.toLocaleString()}
                    </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Credits Used</p>
                    <p className="text-lg font-bold text-blue-600">
                        {progress.creditsUsed.toLocaleString()}
                        {estimatedCredits && ` / ${estimatedCredits.toLocaleString()}`}
                    </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Time Remaining</p>
                    <p className="text-lg font-bold text-slate-800">
                        {getTimeRemaining()}
                    </p>
                </div>
            </div>

            {/* Additional Info */}
            <div className="pt-4 border-t border-slate-200 space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-slate-600">Processing Speed:</span>
                    <span className="font-semibold text-slate-800">{getProcessingSpeed()} emails/sec</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-600">Current Batch:</span>
                    <span className="font-semibold text-slate-800">
                        {progress.completedBatches + 1} of {progress.totalBatches}
                    </span>
                </div>
            </div>

            {/* Status Message */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 flex items-center">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                    {progress.percentage === 100 
                        ? '✅ Enrichment complete!' 
                        : `Processing batch ${progress.completedBatches + 1} of ${progress.totalBatches}...`
                    }
                </p>
            </div>
        </Card>
    );
};

export default ProgressTracker;

