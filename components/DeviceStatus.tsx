
import React, { useState, useRef, useEffect } from 'react';
import { 
  Server, 
  Globe, 
  Shield, 
  CheckCircle2, 
  Activity, 
  Barcode, 
  Edit3,
  Check,
  X
} from './Icons';

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
  isLast?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, isLast = false }) => (
  <div className={`flex flex-col sm:flex-row sm:items-center justify-between py-3.5 ${!isLast ? 'border-b border-slate-100' : ''} group hover:bg-slate-50/50 px-2 -mx-2 rounded-lg transition-colors`}>
    <span className="text-xs font-bold text-slate-500 mb-1 sm:mb-0 uppercase tracking-wide group-hover:text-slate-600 transition-colors">{label}</span>
    <div className="text-sm font-medium text-slate-800 text-right font-mono flex items-center justify-end">{value}</div>
  </div>
);

const StatusBadge: React.FC<{ type: 'success' | 'info' | 'warning' | 'error'; text: string; icon?: boolean }> = ({ type, text, icon = true }) => {
  const styles = {
    success: 'text-emerald-700 border-emerald-200/60 bg-emerald-50/80',
    info: 'text-primary-700 border-primary-200/60 bg-primary-50/80',
    warning: 'text-amber-700 border-amber-200/60 bg-amber-50/80',
    error: 'text-rose-700 border-rose-200/60 bg-rose-50/80',
  };
  
  const icons = {
    success: CheckCircle2,
    info: Activity,
    warning: Activity,
    error: Activity
  }
  
  const Icon = icons[type];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide border shadow-sm ${styles[type]}`}>
      {icon && <Icon className="w-3 h-3" />}
      {text}
    </span>
  );
};

const SectionCard: React.FC<{ title: string; icon: React.ElementType; color: string; children: React.ReactNode }> = ({ title, icon: Icon, color, children }) => (
    <div className="glass-card rounded-xl overflow-hidden shadow-soft ring-1 ring-black/5 hover:shadow-glass-hover transition-all duration-300">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-3 bg-white/60 backdrop-blur-md">
          <div className={`p-1.5 rounded-md ${color.replace('text-', 'bg-').replace('600', '50')} ${color}`}>
             <Icon className="w-4 h-4" strokeWidth={2} />
          </div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">{title}</h2>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0 bg-white/40">
            {children}
        </div>
    </div>
);

const DeviceStatus: React.FC = () => {
  const [deviceName, setDeviceName] = useState('演示设备');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(deviceName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setDeviceName(tempName.trim());
    } else {
      setTempName(deviceName);
    }
    setIsEditingName(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveName();
    if (e.key === 'Escape') {
      setTempName(deviceName);
      setIsEditingName(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1200px] mx-auto">
      <div className="flex items-end justify-between mb-2">
        <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">设备状态</h1>
            <p className="text-sm text-slate-500 mt-1">查看详细的系统运行参数与配置信息</p>
        </div>
        <div className="hidden sm:block">
            <span className="text-xs text-slate-500 font-mono font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">ID: 0C5E1A82</span>
        </div>
      </div>

      <SectionCard title="系统状态" icon={Server} color="text-primary-600">
           <div className="flex flex-col">
              <InfoRow 
                label="设备名称" 
                value={
                  isEditingName ? (
                    <div className="flex items-center gap-1 w-full max-w-[200px]">
                      <input 
                        ref={inputRef}
                        type="text" 
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onBlur={handleSaveName}
                        onKeyDown={handleKeyDown}
                        className="w-full px-2 py-1 bg-white border border-primary-500 rounded text-sm font-bold text-slate-800 outline-none shadow-sm"
                      />
                    </div>
                  ) : (
                    <div 
                      onClick={() => setIsEditingName(true)}
                      className="group/name flex items-center gap-2 cursor-pointer hover:text-primary-600 transition-colors"
                    >
                      <span className="font-bold underline decoration-dotted decoration-slate-300 group-hover/name:decoration-primary-300 underline-offset-4">{deviceName}</span>
                      <Edit3 className="w-3.5 h-3.5 opacity-0 group-hover/name:opacity-100 transition-opacity text-slate-400" />
                    </div>
                  )
                } 
              />
              <InfoRow label="设备ID" value="0C5E1A82" />
              <InfoRow label="MAC地址" value="e2:08:0c:5e:1a:82" />
              <InfoRow label="固件版本" value="20251126" />
              <InfoRow label="网关状态" value={<StatusBadge type="success" text="已连接" />} />
              <InfoRow label="运行时长" value={<span className="text-primary-600 font-bold">1天 23小时 22分</span>} isLast={true} />
           </div>
           <div className="flex flex-col">
              <InfoRow 
                label="条形码" 
                value={
                  <div className="flex items-center justify-end gap-2 text-slate-800">
                     <Barcode className="w-4 h-4 text-slate-400" />
                     <span className="text-[10px] bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">||||||||||||</span>
                  </div>
                } 
              />
              <InfoRow label="设备型号" value="EG91NAXGA" />
              <InfoRow label="软件版本" value="1.34.26691" />
              <InfoRow label="文件系统" value={<StatusBadge type="success" text="已连接" />} />
              <InfoRow label="系统时间" value="2025-11-28 11:01:03" />
              <InfoRow label="时区" value="+08:00" isLast={true} />
           </div>
      </SectionCard>

      <SectionCard title="WAN口信息" icon={Globe} color="text-cyan-600">
           <div className="flex flex-col">
              <InfoRow label="连接状态" value={<StatusBadge type="success" text="在线" icon={true} />} />
              <InfoRow label="IP地址" value="192.168.0.74" />
              <InfoRow label="网关地址" value="192.168.0.1" />
              <InfoRow label="DNS 2" value="114.114.114.114" isLast={true} />
           </div>
           <div className="flex flex-col">
              <InfoRow label="协议类型" value={<span className="font-bold text-slate-700">静态IP</span>} />
              <InfoRow label="子网掩码" value="255.255.255.0" />
              <InfoRow label="DNS 1" value="192.168.0.1" isLast={true} />
           </div>
      </SectionCard>

      <SectionCard title="授权许可" icon={Shield} color="text-amber-600">
           <div className="flex flex-col">
              <InfoRow label="许可ID" value="111111111111111" />
              <InfoRow label="创建时间" value="2025-05-10" />
              <InfoRow label="剩余时间" value={<span className="text-emerald-600 font-bold">无限制</span>} />
              <InfoRow label="许可IMSI" value="460,461" />
              <InfoRow label="许可运营商" value="46001" isLast={true} />
           </div>
           <div className="flex flex-col">
              <InfoRow label="许可状态" value={<StatusBadge type="info" text="正常" />} />
              <InfoRow label="烧录时间" value="2025-05-10" />
              <InfoRow label="IMEI修改" value={<StatusBadge type="success" text="已启用" />} />
              <InfoRow label="黑名单IMSI" value="462" />
              <InfoRow label="黑名单运营商" value="46000" isLast={true} />
           </div>
      </SectionCard>
    </div>
  );
};

export default DeviceStatus;
