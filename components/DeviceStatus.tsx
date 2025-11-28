import React from 'react';
import { 
  Server, 
  Globe, 
  Shield, 
  CheckCircle2, 
  Activity, 
  Barcode, 
} from './Icons';

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
  isLast?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, isLast = false }) => (
  <div className={`flex flex-col sm:flex-row sm:items-center justify-between py-3.5 ${!isLast ? 'border-b border-white/50' : ''}`}>
    <span className="text-xs font-bold text-slate-500 mb-1 sm:mb-0 uppercase tracking-wide">{label}</span>
    <div className="text-sm font-medium text-slate-800 text-right font-mono">{value}</div>
  </div>
);

const StatusBadge: React.FC<{ type: 'success' | 'info' | 'warning' | 'error'; text: string; icon?: boolean }> = ({ type, text, icon = true }) => {
  const styles = {
    success: 'text-emerald-700 border-emerald-200/50 bg-emerald-50/80',
    info: 'text-primary-700 border-primary-200/50 bg-primary-50/80',
    warning: 'text-amber-700 border-amber-200/50 bg-amber-50/80',
    error: 'text-rose-700 border-rose-200/50 bg-rose-50/80',
  };
  
  const icons = {
    success: CheckCircle2,
    info: Activity,
    warning: Activity,
    error: Activity
  }
  
  const Icon = icons[type];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border backdrop-blur-sm shadow-sm ${styles[type]}`}>
      {icon && <Icon className="w-3.5 h-3.5" />}
      {text}
    </span>
  );
};

const SectionCard: React.FC<{ title: string; icon: React.ElementType; color: string; children: React.ReactNode }> = ({ title, icon: Icon, color, children }) => (
    <div className="glass-card rounded-xl overflow-hidden hover:shadow-glass-hover transition-all duration-300">
        <div className="px-5 py-3 border-b border-white/50 flex items-center gap-2 bg-white/40 backdrop-blur-md">
          <Icon className={`w-4 h-4 ${color}`} strokeWidth={2} />
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">{title}</h2>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0 bg-white/30 backdrop-blur-sm">
            {children}
        </div>
    </div>
);

const DeviceStatus: React.FC = () => {
  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">设备状态</h1>
        <p className="text-xs text-slate-500 font-mono font-bold bg-white/50 border border-white/50 backdrop-blur-sm inline-block px-2 py-1 rounded shadow-sm">ID: 0C5E1A82</p>
      </div>

      <SectionCard title="System Status" icon={Server} color="text-primary-600">
           <div className="flex flex-col">
              <InfoRow label="Device ID" value="0C5E1A82" />
              <InfoRow label="MAC Addr" value="e2:08:0c:5e:1a:82" />
              <InfoRow label="Firmware" value="20251126" />
              <InfoRow label="Gateway" value={<StatusBadge type="success" text="CONNECTED" />} />
              <InfoRow label="Time" value="2025-11-28 11:01:03" />
              <InfoRow label="Uptime" value={<span className="text-primary-600 font-bold">1D 23h 22m</span>} isLast={true} />
           </div>
           <div className="flex flex-col">
              <InfoRow 
                label="Barcode" 
                value={
                  <div className="flex items-center justify-end gap-2 text-slate-800">
                     <Barcode className="w-4 h-4 text-slate-400" />
                     <span className="text-[10px] bg-white/50 border border-white/50 px-1 py-0.5 rounded opacity-80 backdrop-blur-sm">||||||||||||</span>
                  </div>
                } 
              />
              <InfoRow label="Model" value="EG91NAXGA" />
              <InfoRow label="Software" value="1.34.26691" />
              <InfoRow label="IMFS" value={<StatusBadge type="success" text="CONNECTED" />} />
              <InfoRow label="Timezone" value="+08:00" isLast={true} />
           </div>
      </SectionCard>

      <SectionCard title="WAN Interface" icon={Globe} color="text-cyan-600">
           <div className="flex flex-col">
              <InfoRow label="Status" value={<StatusBadge type="success" text="ONLINE" icon={true} />} />
              <InfoRow label="IP Addr" value="192.168.0.74" />
              <InfoRow label="Gateway" value="192.168.0.1" />
              <InfoRow label="DNS 2" value="114.114.114.114" isLast={true} />
           </div>
           <div className="flex flex-col">
              <InfoRow label="Protocol" value={<span className="font-bold">STATIC</span>} />
              <InfoRow label="Subnet" value="255.255.255.0" />
              <InfoRow label="DNS 1" value="192.168.0.1" isLast={true} />
           </div>
      </SectionCard>

      <SectionCard title="License Info" icon={Shield} color="text-amber-600">
           <div className="flex flex-col">
              <InfoRow label="License ID" value="111111111111111" />
              <InfoRow label="Created" value="2025-05-10" />
              <InfoRow label="Remaining" value={<span className="text-emerald-600 font-bold">UNLIMITED</span>} />
              <InfoRow label="Allow IMSI" value="460,461" />
              <InfoRow label="Allow Carrier" value="46001" isLast={true} />
           </div>
           <div className="flex flex-col">
              <InfoRow label="Status" value={<StatusBadge type="info" text="NORMAL" />} />
              <InfoRow label="Burned" value="2025-05-10" />
              <InfoRow label="IMEI Mod" value={<StatusBadge type="success" text="ENABLED" />} />
              <InfoRow label="Block IMSI" value="462" />
              <InfoRow label="Block Carrier" value="46000" isLast={true} />
           </div>
      </SectionCard>
    </div>
  );
};

export default DeviceStatus;