
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Barcode, 
  RotateCcw, 
  FileUp, 
  FileDown, 
  Trash2, 
  Edit3, 
  Settings2,
  X,
  ChevronDown,
  RefreshCw,
  AlertCircle,
  Zap,
  Filter,
  Cpu,
  Smartphone,
  Clock,
  RefreshCw as RefreshIcon,
  Check
} from './Icons';

interface ImeiData {
  id: string;
  portName: string;
  terminal: string;
  originalImei: string;
  currentImei: string;
  mode: 'prefix' | 'range';
  lastChanged: string;
}

const mockImeiData: ImeiData[] = [
  { id: '1', portName: 'M1', terminal: 'MIT1', originalImei: '864955476637371', currentImei: '864955476637371', mode: 'prefix', lastChanged: '2023-11-20' },
  { id: '2', portName: 'M2', terminal: 'MIT2', originalImei: '864955476637372', currentImei: '354211098827312', mode: 'range', lastChanged: '2024-01-15' },
  { id: '3', portName: 'M3', terminal: 'MIT3', originalImei: '864955476637373', currentImei: '864955476637373', mode: 'prefix', lastChanged: '2023-12-05' },
  { id: '4', portName: 'M4', terminal: 'MIT4', originalImei: '864955476637374', currentImei: '359122047716254', mode: 'range', lastChanged: '2024-02-10' },
  { id: '5', portName: 'M5', terminal: 'MIT5', originalImei: '864955476637375', currentImei: '864955476637375', mode: 'prefix', lastChanged: '2023-10-25' },
  { id: '6', portName: 'M6', terminal: 'MIT6', originalImei: '864955476637376', currentImei: '864955476637376', mode: 'range', lastChanged: '2024-03-01' },
];

const ImeiSettings: React.FC = () => {
  const [data, setData] = useState<ImeiData[]>(mockImeiData);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState('all');
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const [policy, setPolicy] = useState({
    switchWithSim: true,
    onlineDuration: 60
  });

  const [bulkEditParams, setBulkEditParams] = useState({
    t1Value: ''
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map(p => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredData = data.filter(item => {
    if (filterMode === 'all') return true;
    return item.mode === filterMode;
  });

  const selectedPortNames = data
    .filter(item => selectedIds.includes(item.id))
    .map(item => item.portName)
    .join(', ');

  const handleBulkApply = () => {
    setLoadingAction('applying');
    setTimeout(() => {
      setLoadingAction(null);
      setIsBulkEditModalOpen(false);
      setSelectedIds([]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-enter max-w-[1600px] mx-auto relative">
      
      {/* Page Header */}
      <div className="flex-none mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">IMEI 设置</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">管理蜂窝端口的物理识别码及自动生成策略</p>
          </div>
          
          <button 
            onClick={() => setIsPolicyModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-primary-600 text-sm font-bold rounded-xl border border-primary-100 hover:bg-primary-50 transition-all shadow-sm group"
          >
            <Settings2 className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            IMEI 切换设置
          </button>
        </div>
      </div>

      {/* Integrated Data Toolbar & Table Container */}
      <div className="flex-1 min-h-0 flex flex-col glass-card rounded-2xl border border-white/60 shadow-soft overflow-hidden bg-white/60">
        
        {/* Unified Action Bar */}
        <div className="flex-none p-4 bg-slate-50/50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          
          {/* Left: Filters */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                模式
              </span>
              <select 
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value)}
                className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer min-w-[120px]"
              >
                <option value="all">全部</option>
                <option value="prefix">指定IMEI前缀</option>
                <option value="range">自定义范围</option>
              </select>
            </div>
          </div>

          {/* Right: Data Actions */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 text-sm font-bold rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              <FileDown className="w-4 h-4" />
              导出数据
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 text-sm font-bold rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              <FileUp className="w-4 h-4" />
              批量导入
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <button 
              onClick={() => setData([])}
              className="flex items-center gap-2 px-4 py-2 bg-white text-rose-500 text-sm font-bold rounded-xl border border-rose-100 hover:bg-rose-50 hover:border-rose-200 transition-all shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              清空数据
            </button>
          </div>
        </div>

        {/* Sticky Table Header */}
        <div className="flex-none bg-slate-50/90 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] font-sans">
            <div className="w-14 text-center">
              <input 
                type="checkbox" 
                checked={selectedIds.length === filteredData.length && filteredData.length > 0} 
                onChange={toggleSelectAll} 
                className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer transition-colors" 
              />
            </div>
            <div className="flex-1 grid grid-cols-12 gap-4">
              <div className="col-span-2">模块</div>
              <div className="col-span-1">T1</div>
              <div className="col-span-3">原始 IMEI (Factory)</div>
              <div className="col-span-2">当前 IMEI (Active)</div>
              <div className="col-span-2">生成模式</div>
              <div className="col-span-2 text-right">操作控制</div>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto scroll-smooth pb-24">
          <div className="divide-y divide-slate-100">
            {filteredData.length > 0 ? filteredData.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              const isModified = item.originalImei !== item.currentImei;
              return (
                <div key={item.id} className={`group flex items-center px-6 py-4 transition-all duration-200 border-l-2 ${isSelected ? 'bg-indigo-50/60 border-l-indigo-500' : 'border-l-transparent hover:bg-white/60 hover:border-l-slate-300'}`}>
                  <div className="w-14 text-center flex-none">
                    <input 
                      type="checkbox" 
                      checked={isSelected} 
                      onChange={() => toggleSelectOne(item.id)} 
                      className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer" 
                    />
                  </div>
                  <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-2">
                       <div className="font-bold text-slate-800 text-sm font-mono tracking-tight">{item.portName}</div>
                    </div>
                    <div className="col-span-1">
                       <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.terminal}</div>
                    </div>
                    <div className="col-span-3">
                       <div className="text-xs font-mono text-slate-400 group-hover:text-slate-500 transition-colors">{item.originalImei}</div>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                       <span className={`text-xs font-mono font-bold ${isModified ? 'text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded' : 'text-slate-700'}`}>
                         {item.currentImei}
                       </span>
                       {isModified && (
                         <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                       )}
                    </div>
                    <div className="col-span-2">
                       <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide border transition-all ${
                         item.mode === 'prefix' ? 'bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-100' :
                         'bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-100'
                       }`}>
                         {item.mode === 'prefix' ? '指定前缀' : '自定义范围'}
                       </span>
                    </div>
                    <div className="col-span-2 flex justify-end gap-1.5">
                       <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100" title="编辑详情">
                         <Edit3 className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => {
                            setData(prev => prev.map(d => d.id === item.id ? { ...d, currentImei: d.originalImei } : d));
                         }}
                         className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100" 
                         title="重置为原始"
                       >
                         <RotateCcw className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="py-24 flex flex-col items-center justify-center text-slate-400">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <Barcode className="w-10 h-10 opacity-20" />
                </div>
                <p className="text-sm font-bold text-slate-500">暂无数据记录</p>
                <p className="text-xs text-slate-400 mt-1">请尝试导入数据或检查筛选条件</p>
              </div>
            )}
          </div>
        </div>

        {/* Floating Bulk Actions */}
        <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/90 backdrop-blur-xl text-white pl-5 pr-2 py-2.5 rounded-2xl shadow-float border border-white/10 transition-all duration-300 z-30 ${selectedIds.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
             <div className="flex items-center gap-3 mr-4 border-r border-white/10 pr-5">
                 <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-500 text-[10px] font-black">{selectedIds.length}</div>
                 <span className="text-xs font-bold tracking-tight">已选定项</span>
             </div>
             
             <div className="flex items-center gap-1.5">
                 <button 
                    onClick={() => setIsBulkEditModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 transition-colors text-xs font-black text-white active:scale-95 shadow-lg shadow-primary-500/20"
                 >
                     <Edit3 className="w-3.5 h-3.5" />
                     批量编辑
                 </button>
                  <button onClick={() => setSelectedIds([])} className="p-1.5 hover:bg-white/10 rounded-xl ml-2 text-slate-400 hover:text-white transition-colors">
                     <X className="w-4 h-4" />
                 </button>
             </div>
        </div>
      </div>

      {/* Bulk Edit Modal */}
      {isBulkEditModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsBulkEditModalOpen(false)}></div>
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-md border border-white/60 animate-enter overflow-hidden flex flex-col">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl shadow-sm border border-primary-100">
                            <Edit3 className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 tracking-tight">批量编辑</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Bulk Modify Active IMEI</p>
                        </div>
                    </div>
                    <button onClick={() => setIsBulkEditModalOpen(false)} className="p-2 rounded-xl hover:bg-slate-200/50 text-slate-400 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-10 space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1 flex items-center gap-2">
                              模块 (Module)
                            </label>
                            <div className="relative">
                                <input 
                                    type="text"
                                    readOnly
                                    value={selectedPortNames}
                                    className="w-full px-5 py-4 bg-slate-100 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-500 shadow-inner focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1 flex items-center gap-2">
                               T1
                            </label>
                            <div className="relative">
                                <input 
                                    type="text"
                                    value={bulkEditParams.t1Value}
                                    onChange={(e) => setBulkEditParams({...bulkEditParams, t1Value: e.target.value})}
                                    placeholder="输入 T1 终端 IMEI 模板..."
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-mono font-black text-slate-700 shadow-inner focus:outline-none focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 transition-all"
                                />
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase tracking-widest">Optional</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                    <button 
                        onClick={() => setIsBulkEditModalOpen(false)}
                        className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        放弃
                    </button>
                    <button 
                        onClick={handleBulkApply}
                        disabled={loadingAction === 'applying'}
                        className="btn-primary px-10 py-3 rounded-2xl text-sm font-black shadow-xl shadow-primary-500/20 active:scale-95 transition-all flex items-center gap-3 min-w-[140px] justify-center"
                    >
                        {loadingAction === 'applying' ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Zap className="w-4 h-4" />
                        )}
                        {loadingAction === 'applying' ? '正在应用...' : '确认修改'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
      )}

      {/* Policy Settings Modal - REFINED VERSION */}
      {isPolicyModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsPolicyModalOpen(false)}></div>
            <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-sm border border-white/60 animate-enter overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary-50 text-primary-600 rounded-xl shadow-sm border border-primary-100">
                            <RefreshIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 tracking-tight">IMEI 切换设置</h3>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">IMEI Switch Policy</p>
                        </div>
                    </div>
                    <button onClick={() => setIsPolicyModalOpen(false)} className="p-2 rounded-xl hover:bg-slate-200/50 text-slate-400 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-8 space-y-6">
                    <div className="space-y-6">
                        {/* 切换SIM卡同时切换IMEI - Updated to Checkbox style */}
                        <label className="flex items-center justify-between bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-inner cursor-pointer hover:bg-slate-100/50 transition-colors">
                            <div className="space-y-0.5">
                                <span className="text-sm font-black text-slate-700">切换SIM卡同时切换IMEI</span>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Sync Switch</p>
                            </div>
                            <div className="relative">
                                <input 
                                    type="checkbox" 
                                    className="sr-only" 
                                    checked={policy.switchWithSim}
                                    onChange={() => setPolicy({...policy, switchWithSim: !policy.switchWithSim})}
                                />
                                <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${policy.switchWithSim ? 'bg-primary-600 border-primary-600 shadow-lg shadow-primary-500/20' : 'bg-white border-slate-300'}`}>
                                    {policy.switchWithSim && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
                                </div>
                            </div>
                        </label>

                        {/* 在线时长(分) */}
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1 flex items-center gap-2">
                                <Clock className="w-3 h-3" /> 在线时长 (分)
                            </label>
                            <div className="relative">
                                <input 
                                    type="number"
                                    value={policy.onlineDuration}
                                    onChange={(e) => setPolicy({...policy, onlineDuration: Number(e.target.value)})}
                                    placeholder="e.g. 60"
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-mono font-black text-primary-600 shadow-inner focus:outline-none focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 transition-all"
                                />
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase tracking-widest">MINS</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button 
                        onClick={() => setIsPolicyModalOpen(false)}
                        className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        放弃
                    </button>
                    <button 
                        onClick={() => setIsPolicyModalOpen(false)}
                        className="btn-primary px-8 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-primary-500/20 active:scale-95 transition-all"
                    >
                        保存配置
                    </button>
                </div>
            </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default ImeiSettings;
