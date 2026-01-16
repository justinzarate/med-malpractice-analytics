import React from 'react';

interface ErrorMessageProps {
    message: string;
    failedFile?: string;
    onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, failedFile, onRetry }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-lg w-full">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-red-500/20 rounded-full p-2">
                        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-red-400">Error Loading Data</h3>
                </div>

                <p className="text-slate-300 mb-4">{message}</p>

                {failedFile && (
                    <div className="bg-slate-800/50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-slate-400 mb-1">Failed to load:</p>
                        <code className="text-sm text-red-400 font-mono">{failedFile}</code>
                    </div>
                )}

                <div className="bg-slate-800/30 rounded-lg p-4 mb-6">
                    <p className="text-sm text-slate-400 mb-2">Troubleshooting steps:</p>
                    <ul className="text-sm text-slate-500 space-y-1 list-disc list-inside">
                        <li>Check that the JSON file exists in <code className="text-slate-400">/public/data/</code></li>
                        <li>Verify the file contains valid JSON (array format)</li>
                        <li>Ensure the dev server is running</li>
                    </ul>
                </div>

                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Retry Loading
                    </button>
                )}
            </div>
        </div>
    );
};
