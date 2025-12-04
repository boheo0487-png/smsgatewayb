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

  // Calculate Aggregated Stats
  const totalStats = ports.reduce((acc, port) => ({
      received: acc.received + port.smsStats.received,
      sent: acc.sent + port.smsStats.sent,
      sending: acc.sending + port.smsStats.sending,
      sentSuccess: acc.sentSuccess + port.smsStats.sentSuccess,
      sentFailed: acc.sentFailed + port.smsStats.sentFailed,
      consecFailed: acc.consecFailed + port.smsStats.consecFailed
  }), { received: 0, sent: 0, sending: 0, sentSuccess: 0, sentFailed: 0, consecFailed: 0 });

  const totalSuccessRate = totalStats.sent > 0 ? (totalStats.sentSuccess / totalStats.sent) * 100 : 0;

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
                  <div className="hidden sm:block h-4 w-px bg-slate-300"></div>
                  
                  {/* Aggregated SMS Stats Badge with Tooltip */}
                  <div className="relative group cursor-help z-20">
                      <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-primary-300 transition-colors">
                          <MessageSquare className="w-3.5 h-3.5 text-primary-500" />
                          <span className="text-xs text-slate-500 font-medium">短信总数</span>
                          <span className="text-sm font-bold text-slate-800 font-mono">{totalStats.sent.toLocaleString()}</span>
                      </div>

                      {/* Tooltip */}
                      <div className="absolute left-0 top-full mt-2 w-64 p-4 bg-slate-900/95 backdrop-blur-md rounded-xl shadow-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                           <div className="space-y-3">
                                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                        <MessageSquare className="w-3 h-3 text-slate-400" />
                                        全网短信统计
                                    </span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${totalSuccessRate >= 90 ? 'bg-emerald-500/20 text-emerald-400' : totalSuccessRate >= 50 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                        成功率 {totalSuccessRate.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                                    <div className="flex justify-between"><span className="text-slate-400">接收:</span><span className="font-mono text-white">{totalStats.received}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-400">发送:</span><span className="font-mono text-white">{totalStats.sent}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-400">正在发送:</span><span className="font-mono text-blue-400">{totalStats.sending}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-400">发送成功:</span><span className="font-mono text-emerald-400">{totalStats.sentSuccess}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-400">发送失败:</span><span className="font-mono text-rose-400">{totalStats.sentFailed}</span></div>
                                    <div className="flex justify-between col-span-2 border-t border-white/10 pt-2 mt-1">
                                        <span className="text-slate-400">连续发送失败:</span>
                                        <span className={`font-mono font-bold ${totalStats.consecFailed > 0 ? 'text-rose-500' : 'text-slate-500'}`}>{totalStats.consecFailed}</span>
                                    </div>
                                </div>
                           </div>
                      </div>
                  </div>
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
                        className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer transition-colors" 
                    />
                </div>
                <div className="flex-1 grid grid-cols-12 gap-4">
                    <div className="col-span-3">端口标识</div>
                    <div className="col-span-3">硬件信息</div>
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
                        <div className="col-span-3 flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all shadow-sm ${
                                port.status === 'enabled' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                                port.status === 'offline' ? 'bg-slate-50 border-slate-200 text-slate-400' :
                                'bg-amber-50 border-amber-100 text-amber-600'
                            }`}>
                                <Cable className="w-4 h-4" strokeWidth={1.5} />
                            </div>
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

                        {/* Hardware */}
                        <div className="col-span-3">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-bold text-slate-700 font-mono truncate" title={port.model}>{port.model}</span>
                                <span className="text-[10px] text-slate-400 font-medium bg-slate-100 border border-slate-200 w-fit px-1.5 rounded">V2.0</span>
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

        {/* Settings Modal */}
        {isSettingsOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)}></div>
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-white/60 animate-enter">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
                        <h3 className="font-bold text-slate-800">常规设置</h3>
                        <button onClick={() => setIsSettingsOpen(false)} className="p-1 rounded-lg hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-6 space-y-5">
                         <div className="space-y-4">
                            <div className="grid grid-cols-3 items-center gap-4">
                                <label className="text-sm font-medium text-slate-600 text-right">网络类型</label>
                                <div className="col-span-2 relative">
                                    <select className="w-full appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-shadow">
                                        <option>自动</option>
                                        <option>4G Only</option>
                                        <option>3G Only</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <label className="text-sm font-medium text-slate-600 text-right">注册类型</label>
                                <div className="col-span-2 relative">
                                    <select className="w-full appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-shadow">
                                        <option>数据网络</option>
                                        <option>语音网络</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <label className="text-sm font-medium text-slate-600 text-right">VOLTE配置</label>
                                <div className="col-span-2 relative">
                                    <select className="w-full appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-shadow">
                                        <option>自动</option>
                                        <option>开启</option>
                                        <option>关闭</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4 pt-2">
                                <label className="text-sm font-medium text-slate-600 text-right">重启保存当前卡</label>
                                <div className="col-span-2">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                    </label>
                                </div>
                            </div>
                         </div>
                    </div>
                    <div className="px-6 py-4 bg-slate-50/50 rounded-b-2xl border-t border-slate-100 flex justify-end">
                        <button className="btn-primary px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 w-full sm:w-auto">
                            保存当前设置
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default PortStatus;