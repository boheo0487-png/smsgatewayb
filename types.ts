import React from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  trend: 'up' | 'down' | 'neutral';
}

export interface SmsLog {
  id: string;
  recipient: string;
  status: 'delivered' | 'failed' | 'pending' | 'sent';
  timestamp: string;
  gateway: string;
  cost: number;
}

export interface DeviceStatus {
  name: string;
  status: 'online' | 'offline' | 'busy';
  signal: number; // 0-100
  battery: number; // 0-100
  uptime: string;
}

export interface ChartDataPoint {
  name: string;
  sent: number;
  failed: number;
}