import React, { useState } from 'react';
import { 
  Cable, 
  RefreshCw, 
  Power, 
  Play, 
  Settings,
  X,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Trash2
} from './Icons';

interface PortData {
  id: string;
  portName: string;
  terminal: string;
  model: string;
  originalImei: string;
  currentImei: string;
  status: 'enabled' | 'offline' | 'disabled';
}

const mockPorts: PortData[] = [
  {
    id: '1',
    portName: 'M1',
    terminal: 'MIT1',
    model: 'EG91NAXGAR07A03M1G',
    originalImei: '174955476637371',
    currentImei: '174955476637371',
    status: 'enabled',
  },
  {
    id: '2',
    portName: 'M2',
    terminal: 'MIT2',
    model: 'EG91NAXGAR07A03M1G',
    originalImei: '174955476637372',
    currentImei: '174955476637372',
    status: 'enabled',
  },
  {
    id: '3',
    portName: 'M3',
    terminal: 'MIT3',
    model: 'EG91NAXGAR07A03M1G',
    originalImei: '174955476637373',
    currentImei: '174955476637373',
    status: 'offline',
  },
  {
    id: '4',
    portName: 'M4',
    terminal: 'MIT4',
    model: 'EG91NAXGAR07A03M1G',
    originalImei: '174955476637374',
    currentImei: '174955476637374',
    status: 'enabled',
  },
   {
    id: '5',
    portName: 'M5',
    terminal: 'MIT5',
    model: 'EG91NAXGAR07A03M1G',
    originalImei: '174955476637375',
    currentImei: '174955476637375',
    status: 'disabled',
  },
];

const PortStatus: React.FC = () => {
  const [ports, setPorts] = useState<PortData[]>(mockPorts);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
      networkType: '自动',
      regType: '数据网络',
      volte: '自动',
      rebootSave: false
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === ports.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(ports.map(p => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleAction = (id: string, action: string) => {
    setLoadingAction(`${id}-${action}`);
    setTimeout(() => {
      setLoadingAction(null);
      if (action === 'toggle') {
        setPorts(prev => prev.map(p => 
            p.id === id ? { ...p, status: p.status === 'enabled' ? 'disabled' : 'enabled' } : p
        ));
      } else if (action === 'offline') {
         setPorts(prev => prev.map(p => 
            p.id === id ? { ...p, status: 'offline' } : p
        ));
      }
    }, 600);
  };

  const handleBulkAction = (action: string) => {
      setLoadingAction(`bulk-${action}`);
      setTimeout(() => {
          setLoadingAction(null);
          if (action === 'enable') {
              setPorts(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, status: 'enabled' } : p));
          } else if (action === 'offline') {
              setPorts(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, status: 'offline' } : p));
          } else if (action === 'disable') {
              setPorts(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, status: 'disabled' } : p));
          } else if (action === 'reboot') {
              // Simulate reboot
          }
          setSelectedIds([]);
      }, 800);
  }

  const isAllSelected = ports.length > 0 && selectedIds.length === ports.length;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-enter max-w-[1600px] mx-auto relative">
      
      {/* Header Section */}
      <div className="flex-none mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">端口状态</h1>
              <p className="text-sm text-slate-500 font-medium">管理蜂窝端口配置与实时状态</p>
            </div>
            
            <button 
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-2 px-5 py-2 bg-white text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 hover:border-primary-200 hover:text-primary-600 hover:shadow-md transition-all group"
            >
                <Settings className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-500" />
                常规设置
            </button>
          </div>
      </div>

      {/* Main Table - Optimized for clarity */}
      <div className="flex-1 min-h-0 glass-card rounded-2xl border border-white/80 shadow-soft flex flex-col relative overflow-hidden bg-white/50">
        {/* Sticky Header */}
        <div className="flex-none bg-slate-50/95 backdrop-blur-md border-b border-slate-200 z-10">
          <div className="flex items-center w-full px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest font-sans">
                <div className="w-14 text-center">
                    <input 
                        type="checkbox" 
                        checked={isAllSelected} 
                        onChange={toggleSelectAll} 
                        className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer transition-colors" 
                    />
                </div>
                <div className="flex-1 grid grid-cols-12 gap-4">
                    <div className="col-span-3">端口标识</div>
                    <div className="col-span-3">硬件信息</div>
                    <div className="col-span-3">IMEI 配置</div>
                    <div className="col-span-2">状态</div>
                    <div className="col-span-1 text-right">操作</div>
                </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto scroll-smooth pb-24">
          <div className="divide-y divide-slate-100">
            {ports.map((port) => {
            const isSelected = selectedIds.includes(port.id);
            return (
                <div key={port.id} className={`group flex items-center px-6 py-4 transition-all duration-200 hover:-translate-y-[1px] ${isSelected ? 'bg-indigo-50/60' : 'hover:bg-white/80 hover:shadow-sm'}`}>
                    {/* Checkbox */}
                    <div className="w-14 text-center flex-none">
                        <input type="checkbox" checked={isSelected} onChange={() => toggleSelectOne(port.id)} className="w-5 h-5 rounded-md border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer" />
                    </div>

                    {/* Content Grid */}
                    <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                        {/* Port Details */}
                        <div className="col-span-3 flex items-center gap-4">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all shadow-sm ${
                                port.status === 'enabled' ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-100 text-emerald-600' : 
                                port.status === 'offline' ? 'bg-slate-50 border-slate-200 text-slate-400' :
                                'bg-amber-50 border-amber-100 text-amber-600'
                            }`}>
                                <Cable className="w-4 h-4" strokeWidth={1.5} />
                            </div>
                            <div>
                                <div className="font-bold text-slate-800 text-sm tracking-tight">{port.portName}</div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${port.status === 'enabled' ? 'bg-emerald-400' : 'bg-slate-300'}`}></span>
                                    <span className="text-xs text-slate-500 font-mono">{port.terminal}</span>
                                </div>
                            </div>
                        </div>

                        {/* Hardware */}
                        <div className="col-span-3">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-bold text-slate-700 font-mono">{port.model}</span>
                                <span className="text-[10px] text-slate-400 font-medium bg-slate-100 w-fit px-1.5 rounded">MOD V2.0</span>
                            </div>
                        </div>

                        {/* IMEI */}
                        <div className="col-span-3">
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono font-bold text-slate-700">{port.currentImei}</span>
                                    <span className="text-[10px] uppercase tracking-wide text-indigo-600 font-bold bg-indigo-50 px-1.5 py-px rounded border border-indigo-100">Current</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-slate-400">{port.originalImei}</span>
                                    <span className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">Orig</span>
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-2">
                            {port.status === 'enabled' ? (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm">
                                <CheckCircle2 className="w-3 h-3" />
                                Active
                            </div>
                            ) : port.status === 'offline' ? (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border bg-slate-100 text-slate-500 border-slate-200">
                                <Power className="w-3 h-3" />
                                Offline
                            </div>
                            ) : (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border bg-amber-50 text-amber-700 border-amber-100">
                                <AlertCircle className="w-3 h-3" />
                                Disabled
                            </div>
                            )}
                        </div>

                        {/* Actions - Always Visible for Clarity */}
                        <div className="col-span-1 text-right">
                            <div className="flex items-center justify-end gap-1">
                                <button 
                                    onClick={() => handleAction(port.id, 'toggle')} 
                                    className={`p-1.5 rounded-lg transition-all border border-transparent hover:border-slate-200 ${port.status === 'enabled' ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                                    title={port.status === 'enabled' ? 'Disable' : 'Enable'}
                                >
                                    <Power className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                    title="Reboot" 
                                    onClick={() => handleAction(port.id, 'reboot')} 
                                    className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all border border-transparent hover:border-primary-100"
                                >
                                    <RefreshCw className={`w-3.5 h-3.5 ${loadingAction === `${port.id}-reboot` ? 'animate-spin text-primary-600' : ''}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
            })}
          </div>
        </div>
        
        {/* Footer Summary */}
        <div className="flex-none px-6 py-3 bg-white/60 border-t border-slate-100 text-xs text-slate-500 font-medium flex justify-between items-center backdrop-blur-md">
            <span>总计 {ports.length} 个端口</span>
            <div className="flex gap-4">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span> 在线: {ports.filter(p => p.status === 'enabled').length}</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400"></span> 离线: {ports.filter(p => p.status === 'offline').length}</span>
            </div>
        </div>
      </div>

      {/* Floating Bulk Action Bar - Usability Improvement */}
      {selectedIds.length > 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md text-white px-2 py-2 rounded-2xl shadow-2xl animate-enter z-20 border border-slate-700/50">
            <span className="text-xs font-bold px-3 border-r border-slate-700/50">{selectedIds.length} 已选择</span>
            
            <div className="flex gap-1 pl-1">
                <button 
                    onClick={() => handleBulkAction('enable')} 
                    className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-emerald-600/30 text-emerald-400 hover:text-emerald-300 transition-colors group"
                >
                    <Play className="w-4 h-4" />
                    <span className="text-[10px] font-bold">启用</span>
                </button>
                <button 
                    onClick={() => handleBulkAction('disable')} 
                    className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-amber-600/30 text-amber-400 hover:text-amber-300 transition-colors group"
                >
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-[10px] font-bold">禁用</span>
                </button>
                <button 
                    onClick={() => handleBulkAction('reboot')} 
                    className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-primary-600/30 text-primary-400 hover:text-primary-300 transition-colors group"
                >
                    <RefreshCw className={`w-4 h-4 ${loadingAction === 'bulk-reboot' ? 'animate-spin' : ''}`} />
                    <span className="text-[10px] font-bold">重启</span>
                </button>
                <div className="w-px bg-slate-700 mx-1"></div>
                <button 
                    onClick={() => handleBulkAction('offline')} 
                    className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-rose-600/30 text-rose-400 hover:text-rose-300 transition-colors group"
                >
                    <Power className="w-4 h-4" />
                    <span className="text-[10px] font-bold">下线</span>
                </button>
            </div>
            
            <button onClick={() => setSelectedIds([])} className="ml-2 p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
            </button>
        </div>
      )}

       {/* Settings Modal - Better Layout */}
       {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md animate-enter">
          <div className="bg-white/95 backdrop-blur-xl w-full max-w-lg overflow-hidden ring-1 ring-black/5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
            <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
               <div>
                   <h3 className="text-lg font-bold text-slate-800">常规设置</h3>
                   <p className="text-xs text-slate-500 mt-0.5">配置全局端口默认行为</p>
               </div>
               <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors p-2 rounded-full hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-8 space-y-8">
                {/* Group 1: Network */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">网络配置</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                        { label: '网络类型', key: 'networkType', options: ['自动', '4G Only', '3G Only'] },
                        { label: '注册类型', key: 'regType', options: ['数据网络', '语音网络', '短信网络'] },
                        ].map((field) => (
                        <div key={field.key} className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">{field.label}</label>
                            <div className="relative">
                                <select 
                                    className="w-full appearance-none bg-slate-50 border border-slate-200 hover:border-primary-300 text-slate-700 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm cursor-pointer font-medium"
                                    value={(settings as any)[field.key]}
                                    onChange={(e) => setSettings({...settings, [field.key]: e.target.value})}
                                >
                                    {field.options.map(opt => <option key={opt}>{opt}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                        ))}
                    </div>
                </div>

                {/* Group 2: Advanced */}
                <div className="space-y-4">
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">高级选项</h4>
                     <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">VOLTE 配置</label>
                        <div className="relative">
                            <select 
                                className="w-full appearance-none bg-slate-50 border border-slate-200 hover:border-primary-300 text-slate-700 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm cursor-pointer font-medium"
                                value={settings.volte}
                                onChange={(e) => setSettings({...settings, volte: e.target.value})}
                            >
                                <option>自动</option>
                                <option>启用</option>
                                <option>禁用</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors mt-2">
                        <input 
                            type="checkbox" 
                            className="w-5 h-5 border-slate-300 rounded text-primary-600 focus:ring-primary-500 shadow-sm cursor-pointer"
                            checked={settings.rebootSave}
                            onChange={(e) => setSettings({...settings, rebootSave: e.target.checked})}
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-700">重启保存当前卡</span>
                            <span className="text-xs text-slate-400">设备重启后保持当前使用的 SIM 卡槽位</span>
                        </div>
                    </label>
                </div>
            </div>

            <div className="px-8 py-5 bg-slate-50/80 border-t border-slate-100 flex justify-end gap-3 backdrop-blur-sm">
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-5 py-2.5 text-slate-600 font-semibold text-sm rounded-xl hover:bg-slate-200/50 transition-colors"
                >
                    取消
                </button>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="btn-primary px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all"
                >
                    保存设置
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortStatus;