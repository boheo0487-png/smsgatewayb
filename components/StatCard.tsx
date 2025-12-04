import React from 'react';
import { StatCardProps } from '../types';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, trend }) => {
  // Softer border colors for professional look
  const borderColor = trend === 'up' ? 'border-t-emerald-500' : trend === 'down' ? 'border-t-rose-500' : 'border-t-primary-500';
  
  return (
    <div className={`glass-card relative group p-6 rounded-xl border-t-4 ${borderColor}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800 font-mono tracking-tight">{value}</h3>
        </div>
        
        {/* Icon Container - Clean & Minimal */}
        <div className={`p-2.5 rounded-lg shadow-sm transition-colors duration-300 ${
            trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 
            trend === 'down' ? 'bg-rose-50 text-rose-600' : 
            'bg-primary-50 text-primary-600'
        }`}>
          <Icon className="w-5 h-5" strokeWidth={2} />
        </div>
      </div>
      
      {change !== undefined && (
        <div className="flex items-center text-xs font-medium animate-enter">
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${
             trend === 'up' ? 'text-emerald-700 bg-emerald-50/50' : 
             trend === 'down' ? 'text-rose-700 bg-rose-50/50' : 
             'text-slate-600 bg-slate-50/50'
          }`}>
             {trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5" />}
             {trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5" />}
             {trend === 'neutral' && <Minus className="w-3.5 h-3.5" />}
             {Math.abs(change)}%
          </div>
          <span className="ml-2 text-slate-400">较昨日</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;