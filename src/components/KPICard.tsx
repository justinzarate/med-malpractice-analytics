import React from 'react';

interface KPICardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    description?: string;
    gradient?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
    title,
    value,
    icon,
    description,
    gradient = 'from-blue-500 to-blue-600'
}) => {
    return (
        <div className="group relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 sm:p-6 hover:border-slate-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/50">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-400 mb-1 truncate">{title}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-white truncate">{value}</p>
                    {description && (
                        <p className="text-xs text-slate-500 mt-2 truncate">{description}</p>
                    )}
                </div>
                <div className={`flex-shrink-0 p-3 bg-gradient-to-br ${gradient} rounded-xl shadow-lg`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};
