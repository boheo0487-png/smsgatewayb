
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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
  MessageSquare
} from './Icons';

interface SmsStats {
  received: number;
  sent: number;
  successRate: number;
  sending: number;
  sentSuccess: number;
  sentFailed: number;
  consecFailed: number;
}

interface PortData {
  id: string;
  portName: string;
  terminal: string;
  model: string;
  originalImei: string;
  currentImei: string;
  status: 'enabled' | 'offline' | 'disabled';
  smsStats: SmsStats;
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
    smsStats: {
        received: 124,
        sent: 1540,
        successRate: 99.8,
        sending: 12,
        sentSuccess: 1538,
        sentFailed: 2,
        consecFailed: 0
    }
  },
  {
    id: '2',
    portName: 'M2',
    terminal: 'MIT2',
    model: 'EG91NAXGAR07A03M1G',
    originalImei: '174955476637372',
    currentImei: '174955476637372',
    status: 'enabled',
    smsStats: {
        received: 89,
        sent: 892,
        successRate: 98.6,
        sending: 0,
        sentSuccess: 880,
        sentFailed: 12,
        consecFailed: 0
    }
  },
  {
    id: '3',
    portName: 'M3',
    terminal: 'MIT3',
    model: 'EG91NAXGAR07A03M1G',
    originalImei: '174955476637373',
    currentImei: '174955476637373',
    status: 'offline',
    smsStats: {
        received: 0,
        sent: 0,
        successRate: 0,
        sending: 0,
        sentSuccess: 0,
        sentFailed: 0,
        consecFailed: 0
    }
  },
  {
    id: '4',
    portName: 'M4',
    terminal: 'MIT4',
    model: 'EG91NAXGAR07A03M1G',
    originalImei: '174955476637374',
    currentImei: '174955476637374',
    status: 'enabled',
    smsStats: {
        received: 45,
        sent: 320,
        successRate: 99.3,
        sending: 5,
        sentSuccess: 318,
        sentFailed: 2,
        consecFailed: 0
    }
  },
   {
    id: '5',
    portName: 'M5',
    terminal: 'MIT5',
    model: 'EG91NAXGAR07A03M1G',
    originalImei: '174955476637375',
    currentImei: '174955476637375',
    status: 'disabled',
    smsStats: {
        received: 256,
        sent: 2301,
        successRate: 91.2,
        sending: 45,
        sentSuccess: 2100,
        sentFailed: 201,
        consecFailed: 5
    }
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
              <div className="flex items-center gap-4 mt-1">
                  <p className="text-sm text-slate-500 font-medium">管理蜂窝端口配置与实时状态</p>
              </div>
            </div>
            
            <button 
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 hover:border-primary-200 hover:text-primary-600 hover:shadow-md transition-all group"
            >
                <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
                常规设置
            </button>
          </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 min-h-0 glass-card rounded-2xl border border-white/60 shadow-soft flex flex-col relative overflow-hidden bg-white/60">
        {/* Sticky Header */}
        <div className="flex-none bg-slate-50/90 backdrop-blur-md border-b border-slate-200 z-10">
          <div className="flex items-center w-full px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest font-sans">
                <div className="w-14 text-center">
                    <input 
                        type="checkbox" 
                        checked={isAllSelected} 
                        onChange={toggleSelectAll} 
                        className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer transition-colors" 
                    />
                </div>
                <div className="flex-1 grid grid-cols-12 gap-4">
                    <div className="col-span-3">端口/当前终端</div>
                    <div className="col-span-3">模块型号</div>
                    <div className="col-span-4">IMEI 配置</div>
                    <div className="col-span-2 text-right">操作</div>
                </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto scroll-smooth pb-24">
          <div className="divide-y divide-slate-100">
            {ports.map((port) => {
            const isSelected = selectedIds.includes(port.id);
            return (
                <div key={port.id} className={`group flex items-center px-6 py-4 transition-all duration-200 border-l-2 ${isSelected ? 'bg-indigo-50/60 border-l-indigo-500' : 'border-l-transparent hover:bg-white/60 hover:border-l-slate-300'}`}>
                    {/* Checkbox */}
                    <div className="w-14 text-center flex-none">
                        <input type="checkbox" checked={isSelected} onChange={() => toggleSelectOne(port.id)} className="w-5 h-5 rounded-md border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer" />
                    </div>

                    {/* Content Grid */}
                    <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                        {/* Port Details */}
                        <div className="col-span-3">
                            <div className="flex items-center gap-3">
                                <div>
                                    <div className="font-bold text-slate-800 text-sm tracking-tight">{port.portName}</div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-1 rounded">{port.terminal}</span>
                                        <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide w-fit ${
                                            port.status === 'enabled' ? 'bg-emerald-50 text-emerald-600' : 
                                            port.status === 'offline' ? 'bg-slate-100 text-slate-500' :
                                            'bg-amber-50 text-amber-600'
                                        }`}>
                                            <span className={`w-1 h-1 rounded-full ${
                                                port.status === 'enabled' ? 'bg-emerald-500' : 
                                                port.status === 'offline' ? 'bg-slate-400' : 
                                                'bg-amber-500'
                                            }`}></span>
                                            {port.status === 'enabled' ? '已启用' : port.status === 'offline' ? '离线' : '禁用'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hardware / Module Model */}
                        <div className="col-span-3">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-700 font-mono truncate" title={port.model}>{port.model}</span>
                            </div>
                        </div>

                        {/* IMEI */}
                        <div className="col-span-4">
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono font-bold text-slate-700">{port.currentImei}</span>
                                    <span className="text-[10px] uppercase tracking-wide text-indigo-600 font-bold bg-indigo-50 px-1.5 py-px rounded border border-indigo-100">当前</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-slate-400">{port.originalImei}</span>
                                    <span className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">原始</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="col-span-2 flex justify-end gap-2">
                             <button onClick={() => handleAction(port.id, 'toggle')} className={`p-1.5 rounded-lg border transition-all ${port.status === 'enabled' ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50' : 'border-slate-200 text-slate-400 hover:bg-slate-50'}`} title={port.status === 'enabled' ? '禁用' : '启用'}>
                                {loadingAction === `${port.id}-toggle` ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Play className="w-3.5 h-3.5" />
                                )}
                             </button>
                             <button onClick={() => handleAction(port.id, 'offline')} className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all" title="下线">
                                {loadingAction === `${port.id}-offline` ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Power className="w-3.5 h-3.5" />
                                )}
                             </button>
                        </div>
                    </div>
                </div>
            );
            })}
          </div>
        </div>
        
        {/* Floating Bulk Actions Bar */}
        <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-800/90 backdrop-blur-xl text-white pl-4 pr-2 py-2 rounded-2xl shadow-float border border-white/10 transition-all duration-300 z-30 ${selectedIds.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
             <div className="flex items-center gap-3 mr-4 border-r border-white/10 pr-4">
                 <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-500 text-[10px] font-bold">{selectedIds.length}</span>
                 <span className="text-xs font-medium">个端口已选择</span>
             </div>
             
             <div className="flex items-center gap-1">
                 <button onClick={() => handleBulkAction('reboot')} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-xs font-bold text-indigo-300">
                     <RefreshCw className="w-3.5 h-3.5" />
                     重启
                 </button>
                 <button onClick={() => handleBulkAction('enable')} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-xs font-bold text-emerald-300">
                     <Play className="w-3.5 h-3.5" />
                     启用
                 </button>
                 <button onClick={() => handleBulkAction('offline')} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-xs font-bold text-rose-300">
                     <Power className="w-3.5 h-3.5" />
                     下线
                 </button>
                  <button onClick={() => setSelectedIds([])} className="p-1.5 hover:bg-white/10 rounded-lg ml-1 text-slate-400 hover:text-white transition-colors">
                     <X className="w-4 h-4" />
                 </button>
             </div>
        </div>

        {/* Settings Modal (using createPortal for global overlay) */}
        {isSettingsOpen && createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Overlay covering entire screen */}
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsSettingsOpen(false)}></div>
                
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-white/60 animate-enter overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h3 className="font-bold text-slate-800">常规设置</h3>
                        <button onClick={() => setIsSettingsOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-6 space-y-5">
                         <div className="space-y-4">
                            <div className="grid grid-cols-3 items-center gap-4">
                                <label className="text-sm font-medium text-slate-600 text-right">网络类型</label>
                                <div className="col-span-2 relative">
                                    <select 
                                      value={settings.networkType}
                                      onChange={(e) => setSettings({...settings, networkType: e.target.value})}
                                      className="w-full appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-shadow"
                                    >
                                        <option>自动</option>
                                        <option>2G</option>
                                        <option>3G</option>
                                        <option>4G</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <label className="text-sm font-medium text-slate-600 text-right">注册类型</label>
                                <div className="col-span-2 relative">
                                    <select 
                                      value={settings.regType}
                                      onChange={(e) => setSettings({...settings, regType: e.target.value})}
                                      className="w-full appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-shadow"
                                    >
                                        <option>数据网络</option>
                                        <option>语音网络</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <label className="text-sm font-medium text-slate-600 text-right">VOLTE配置</label>
                                <div className="col-span-2 relative">
                                    <select 
                                      value={settings.volte}
                                      onChange={(e) => setSettings({...settings, volte: e.target.value})}
                                      className="w-full appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-shadow"
                                    >
                                        <option>自动</option>
                                        <option>开启</option>
                                        <option>关闭</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4 pt-2">
                                <label className="text-sm font-medium text-slate-600 text-right">重启保存当前卡</label>
                                <div className="col-span-2 flex items-center">
                                    <input 
                                        type="checkbox" 
                                        checked={settings.rebootSave}
                                        onChange={(e) => setSettings({...settings, rebootSave: e.target.checked})}
                                        className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer transition-colors" 
                                    />
                                    <span className="ml-2 text-xs text-slate-400 font-medium">启用</span>
                                </div>
                            </div>
                         </div>
                    </div>
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                        <button 
                            onClick={() => setIsSettingsOpen(false)}
                            className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            取消
                        </button>
                        <button 
                            onClick={() => setIsSettingsOpen(false)}
                            className="btn-primary px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 transition-all"
                        >
                            保存更改
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        )}

      </div>
    </div>
  );
};

export default PortStatus;
