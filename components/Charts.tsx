import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const data = [
  { name: '00:00', sent: 400, failed: 24 },
  { name: '04:00', sent: 300, failed: 13 },
  { name: '08:00', sent: 2000, failed: 98 },
  { name: '12:00', sent: 2780, failed: 39 },
  { name: '16:00', sent: 1890, failed: 48 },
  { name: '20:00', sent: 2390, failed: 38 },
  { name: '24:00', sent: 3490, failed: 43 },
];

export const VolumeChart = () => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            {/* Updated to use Brand Blue #0566FC */}
            <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0566FC" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#0566FC" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            cursor={{ stroke: '#0566FC', strokeWidth: 1 }}
          />
          <Area 
            type="monotone" 
            dataKey="sent" 
            stroke="#0566FC" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorSent)" 
            name="发送成功"
          />
          <Area 
            type="monotone" 
            dataKey="failed" 
            stroke="#ef4444" 
            strokeWidth={2}
            fillOpacity={0} 
            fill="transparent" 
            name="发送失败"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const deviceData = [
  { name: '在线', value: 45, color: '#10b981' },
  { name: '忙碌', value: 12, color: '#f59e0b' },
  { name: '离线', value: 3, color: '#ef4444' },
];

export const DeviceHealthChart = () => {
    return (
        <div className="h-[300px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deviceData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={60} tick={{fontSize: 12, fill: '#64748b'}} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none'}} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}