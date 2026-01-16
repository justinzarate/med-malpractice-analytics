import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading data...' }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-accent-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
            </div>
            <p className="text-gray-400 text-sm font-medium">{message}</p>
        </div>
    );
};
