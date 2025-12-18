
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Terminal, 
  Send, 
  Trash2, 
  RefreshCw, 
  Settings2, 
  X, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  Play, 
  Zap,
  MessageSquare,
  Check,
  Info,
  AlertTriangle,
  Calendar
} from './Icons';
import { UssdData } from '../types';

const mockUssdData: UssdData[] = [
  { id: '1', portName: 'M1', terminal: 'MIT1', command: '*100#', lastResponse: 'Your balance is $24.50. Expires 2025-12-01.', status: 'success', timestamp: '2024-05-20 14:30' },
  { id: '2', portName: 'M2', terminal: 'MIT2', command: '*121#', lastResponse: 'Service unavailable, please try again later.', status: 'failed', timestamp: '2024-05-20 14:28' },
  { id: '3', portName: 'M3', terminal: 'MIT3', command: '*101#', lastResponse: '', status: 'pending', timestamp: '2024-05-20 14:35' },
  { id: '4', portName: 'M4', terminal: 'MIT4', command: '*888#', lastResponse: 'Main: 50.00MB. Bonus: 10.00MB.', status: 'success', timestamp: '2024-05-20 12:15' },
  { id: '5', portName: 'M5', terminal: 'MIT5', command: '*100#', lastResponse: 'Current plan: SuperData 5G.', status: 'idle', timestamp: '2024-05-19 18:00' },
  { id: '6', portName: 'M6', terminal: 'MIT6', command: '*#06#', lastResponse: 'IMEI: 864955476637376', status: 'success', timestamp: '2024-05-20 10:45' },
];

const UssdManagement: React.FC = () => {
  const [data, setData] = useState<UssdData[]>(mockUssdData);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState('all');
  const [isAutoSendModalOpen, setIsAutoSendModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // 初始化所有开关为关闭状态
  const [autoSendConfig, setAutoSendConfig] = useState({
    cyclic: { enabled: false, minMin: 0, maxMin: 0, command: '' },
    scheduled1: { enabled: false, startTime: '', endTime: '', command: '', forceHangup: false },
    scheduled2: { enabled: false, startTime: '', endTime: '', command: '', forceHangup: false },
    scheduled3: { enabled: false, startTime: '', endTime: '', command: '', forceHangup: false },
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
    return item.status === 'pending' || item.status === 'success';
  });

  const handleBatchSend = () => {
    setLoadingAction('sending');
    setTimeout(() => {
      setLoadingAction(null);
      setIsSendModalOpen(false);
      setSelectedIds([]);
    }, 1200);
  };

  const handleClear = () => {
    setData(data.filter(item => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    setIsClearConfirmOpen(false);
  };

  const selectedTerminalsText = data
    .filter(item => selectedIds.includes(item.id))
    .map(item => `${item.portName}-${item.terminal}`)
    .join(', ');

  const CustomSwitch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <div 
      onClick={onChange}
      className={`relative w-10 h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${checked ? 'bg-primary-600' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-0'} shadow-sm`} />
    </div>
  );

  // 勾选组件 (Checkbox)
  const CustomCheckbox = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <div 
      onClick={onChange}
      className={`w-5 h-5 rounded-md border-2 cursor-pointer transition-all flex items-center justify-center ${checked ? 'bg-primary-600 border-primary-600' : 'bg-white border-slate-300'}`}
    >
      {checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-enter max-w-[1600px] mx-auto relative">
      
      {/* Header */}
      <div className="flex-none mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">USSD 指令</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">通过非结构化补充服务数据查询余额、流量及业务状态</p>
          </div>
          
          <button 
            onClick={() => setIsAutoSendModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-primary-600 text-sm font-bold rounded-xl border border-primary-100 hover:bg-primary-50 transition-all shadow-sm group"
          >
            <Settings2 className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            自动发送设置
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 min-h-0 flex flex-col glass-card rounded-2xl border border-white/60 shadow-soft overflow-hidden bg-white/60">
        
        {/* Toolbar */}
        <div className="flex-none p-4 bg-slate-50/50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">显示范围</span>
              <select 
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value)}
                className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer min-w-[100px]"
              >
                <option value="all">显示所有</option>
                <option value="current">显示当前</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 text-sm font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
              <RefreshCw className="w-4 h-4" />
              刷新状态
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className="flex-none bg-slate-50/90 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            <div className="w-14 text-center">
              <input 
                type="checkbox" 
                checked={selectedIds.length === filteredData.length && filteredData.length > 0} 
                onChange={toggleSelectAll} 
                className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer transition-colors" 
              />
            </div>
            <div className="flex-1 grid grid-cols-12 gap-4">
              <div className="col-span-2">端口/终端</div>
              <div className="col-span-2">发送指令</div>
              <div className="col-span-4">最新返回结果</div>
              <div className="col-span-2">执行状态</div>
              <div className="col-span-2 text-right">执行时间</div>
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto scroll-smooth pb-24">
          <div className="divide-y divide-slate-100">
            {filteredData.length > 0 ? filteredData.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <div key={item.id} className={`group flex items-center px-6 py-4 transition-all border-l-2 ${isSelected ? 'bg-indigo-50/60 border-l-indigo-500' : 'border-l-transparent hover:bg-white/60 hover:border-l-slate-300'}`}>
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
                       <div className="font-bold text-slate-800 text-sm">{item.portName}</div>
                       <div className="text-[10px] text-slate-400 font-bold font-mono tracking-tight">{item.terminal}</div>
                    </div>
                    <div className="col-span-2">
                       <div className="inline-flex px-2 py-1 bg-slate-100 rounded-lg text-xs font-mono font-black text-slate-600 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                         {item.command}
                       </div>
                    </div>
                    <div className="col-span-4">
                       <p className="text-xs text-slate-600 font-medium truncate" title={item.lastResponse}>
                         {item.lastResponse || <span className="text-slate-300 italic">等待返回...</span>}
                       </p>
                    </div>
                    <div className="col-span-2">
                       <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                         item.status === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                         item.status === 'failed' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                         item.status === 'pending' ? 'bg-primary-50 text-primary-600 border-primary-100 animate-pulse' :
                         'bg-slate-50 text-slate-400 border-slate-200'
                       }`}>
                         {item.status === 'success' ? '执行成功' : 
                          item.status === 'failed' ? '执行失败' : 
                          item.status === 'pending' ? '正在执行' : '未发送'}
                       </span>
                    </div>
                    <div className="col-span-2 text-right">
                       <div className="text-[11px] font-mono text-slate-400">{item.timestamp}</div>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="py-24 flex flex-col items-center justify-center text-slate-400">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <Terminal className="w-10 h-10 opacity-20" />
                </div>
                <p className="text-sm font-bold text-slate-500">暂无指令执行记录</p>
                <p className="text-xs text-slate-400 mt-1">选择端口并发送指令以查看结果</p>
              </div>
            )}
          </div>
        </div>

        {/* Floating Actions */}
        <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/90 backdrop-blur-xl text-white pl-5 pr-2 py-2.5 rounded-2xl shadow-float border border-white/10 transition-all duration-300 z-30 ${selectedIds.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
             <div className="flex items-center gap-3 mr-4 border-r border-white/10 pr-5">
                 <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-500 text-[10px] font-black">{selectedIds.length}</div>
                 <span className="text-xs font-bold tracking-tight">已选定项</span>
             </div>
             
             <div className="flex items-center gap-1.5">
                 <button 
                    onClick={() => setIsSendModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 transition-colors text-xs font-black text-white shadow-lg shadow-primary-500/20"
                 >
                     <Send className="w-3.5 h-3.5" />
                     发送
                 </button>
                 <button 
                    onClick={() => setIsClearConfirmOpen(true)}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white/10 hover:bg-rose-500 transition-colors text-xs font-black text-white"
                 >
                     <Trash2 className="w-3.5 h-3.5" />
                     清空
                 </button>
                  <button onClick={() => setSelectedIds([])} className="p-1.5 hover:bg-white/10 rounded-xl ml-2 text-slate-400 hover:text-white transition-colors">
                     <X className="w-4 h-4" />
                 </button>
             </div>
        </div>
      </div>

      {/* Auto Send Settings Modal */}
      {isAutoSendModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsAutoSendModalOpen(false)}></div>
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl border border-white/60 animate-enter overflow-hidden flex flex-col max-h-[85vh]">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-none">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl shadow-sm border border-primary-100">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 tracking-tight text-lg">自动发送设置</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Automated USSD Query Management</p>
                        </div>
                    </div>
                    <button onClick={() => setIsAutoSendModalOpen(false)} className="p-2 rounded-xl hover:bg-slate-200/50 text-slate-400 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    
                    {/* Section: 周期发送 */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                <RefreshCw className="w-4 h-4 text-primary-500" />
                                周期发送
                            </h4>
                            <CustomSwitch 
                                checked={autoSendConfig.cyclic.enabled} 
                                onChange={() => setAutoSendConfig({...autoSendConfig, cyclic: {...autoSendConfig.cyclic, enabled: !autoSendConfig.cyclic.enabled}})} 
                            />
                        </div>
                        {autoSendConfig.cyclic.enabled && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                              <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-500 pl-1">最小分钟</label>
                                  <input 
                                      type="number" 
                                      value={autoSendConfig.cyclic.minMin}
                                      onChange={(e) => setAutoSendConfig({...autoSendConfig, cyclic: {...autoSendConfig.cyclic, minMin: parseInt(e.target.value) || 0}})}
                                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all" 
                                  />
                              </div>
                              <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-500 pl-1">最大分钟</label>
                                  <input 
                                      type="number" 
                                      value={autoSendConfig.cyclic.maxMin}
                                      onChange={(e) => setAutoSendConfig({...autoSendConfig, cyclic: {...autoSendConfig.cyclic, maxMin: parseInt(e.target.value) || 0}})}
                                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all" 
                                  />
                              </div>
                              <div className="col-span-full space-y-1.5">
                                  <label className="text-xs font-bold text-slate-500 pl-1">USSD 指令</label>
                                  <input 
                                      type="text" 
                                      value={autoSendConfig.cyclic.command}
                                      onChange={(e) => setAutoSendConfig({...autoSendConfig, cyclic: {...autoSendConfig.cyclic, command: e.target.value}})}
                                      placeholder="请输入 USSD 代码..."
                                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all" 
                                  />
                              </div>
                          </div>
                        )}
                    </div>

                    <div className="border-t border-dashed border-slate-200"></div>

                    {/* Template for 定时发送 */}
                    {[1, 2, 3].map((index) => {
                        const key = `scheduled${index}` as 'scheduled1' | 'scheduled2' | 'scheduled3';
                        const task = autoSendConfig[key];
                        return (
                            <div key={key} className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-indigo-500" />
                                        定时发送 {index}
                                    </h4>
                                    <CustomSwitch 
                                        checked={task.enabled} 
                                        onChange={() => setAutoSendConfig({...autoSendConfig, [key]: {...task, enabled: !task.enabled}})} 
                                    />
                                </div>
                                {task.enabled && (
                                  <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                                          <div className="space-y-1.5">
                                              <label className="text-xs font-bold text-slate-500 pl-1">开始时间</label>
                                              <input 
                                                  type="time" 
                                                  value={task.startTime}
                                                  onChange={(e) => setAutoSendConfig({...autoSendConfig, [key]: {...task, startTime: e.target.value}})}
                                                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all" 
                                              />
                                          </div>
                                          <div className="space-y-1.5">
                                              <label className="text-xs font-bold text-slate-500 pl-1">结束时间</label>
                                              <input 
                                                  type="time" 
                                                  value={task.endTime}
                                                  onChange={(e) => setAutoSendConfig({...autoSendConfig, [key]: {...task, endTime: e.target.value}})}
                                                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all" 
                                              />
                                          </div>
                                          <div className="col-span-full space-y-1.5">
                                              <label className="text-xs font-bold text-slate-500 pl-1">USSD 指令</label>
                                              <input 
                                                  type="text" 
                                                  value={task.command}
                                                  onChange={(e) => setAutoSendConfig({...autoSendConfig, [key]: {...task, command: e.target.value}})}
                                                  placeholder="请输入 USSD 代码..."
                                                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all" 
                                              />
                                          </div>
                                      </div>
                                      <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 shadow-inner">
                                          <div className="space-y-0.5">
                                              <span className="text-xs font-bold text-slate-700">强制挂机</span>
                                              <p className="text-[10px] text-slate-400 font-medium leading-none mt-1">执行指令前强制挂断所有通话</p>
                                          </div>
                                          <CustomCheckbox 
                                              checked={task.forceHangup} 
                                              onChange={() => setAutoSendConfig({...autoSendConfig, [key]: {...task, forceHangup: !task.forceHangup}})} 
                                          />
                                      </div>
                                  </div>
                                )}
                                {index < 3 && <div className="border-t border-dashed border-slate-200 mt-6"></div>}
                            </div>
                        );
                    })}

                </div>

                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 flex-none">
                    <button onClick={() => setIsAutoSendModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">取消</button>
                    <button onClick={() => setIsAutoSendModalOpen(false)} className="btn-primary px-10 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-primary-500/20 active:scale-95 transition-all">保存全部配置</button>
                </div>
            </div>
        </div>,
        document.body
      )}

      {/* Send Modal */}
      {isSendModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsSendModalOpen(false)}></div>
            <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg border border-white/60 animate-enter overflow-hidden flex flex-col">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-4">
                         <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl shadow-sm border border-primary-100">
                            <Send className="w-6 h-6" />
                         </div>
                         <div>
                            <h3 className="font-black text-slate-800 tracking-tight">发送指令</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Execute USSD Task</p>
                         </div>
                    </div>
                    <button onClick={() => setIsSendModalOpen(false)} className="p-2 rounded-xl hover:bg-slate-200/50 text-slate-400 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-10 space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">终端 (端口-卡槽号)</label>
                            <div className="relative">
                                <textarea 
                                    readOnly
                                    value={selectedTerminalsText}
                                    rows={2}
                                    className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-500 shadow-inner focus:outline-none resize-none"
                                />
                                <div className="absolute right-4 bottom-3 text-[9px] font-black text-slate-300 uppercase tracking-widest">Read Only</div>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">指令内容</label>
                            <input 
                                type="text"
                                defaultValue="*100#"
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-lg font-mono font-black text-slate-700 shadow-inner focus:outline-none focus:border-primary-500 transition-all"
                                placeholder="输入 USSD 代码..."
                            />
                        </div>
                    </div>
                </div>

                <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                    <button onClick={() => setIsSendModalOpen(false)} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">取消</button>
                    <button 
                        onClick={handleBatchSend}
                        disabled={loadingAction === 'sending'}
                        className="btn-primary px-10 py-3 rounded-2xl text-sm font-black shadow-xl shadow-primary-500/20 active:scale-95 transition-all flex items-center gap-3 min-w-[140px] justify-center"
                    >
                        {loadingAction === 'sending' ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Zap className="w-4 h-4" />
                        )}
                        {loadingAction === 'sending' ? '正在执行...' : '立即发送'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
      )}

      {/* Clear Confirmation Modal */}
      {isClearConfirmOpen && createPortal(
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsClearConfirmOpen(false)}></div>
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm border border-white/60 animate-enter overflow-hidden flex flex-col z-10">
                <div className="p-10 text-center space-y-6">
                    <div className="mx-auto w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center shadow-inner border border-rose-100">
                        <AlertTriangle className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">确认清空记录？</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                          您将删除已选中的 {selectedIds.length} 条 USSD 指令记录。此操作不可撤销，确认执行吗？
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <button 
                            onClick={() => setIsClearConfirmOpen(false)}
                            className="py-4 text-sm font-black text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all"
                        >
                            取消操作
                        </button>
                        <button 
                            onClick={handleClear}
                            className="py-4 text-sm font-black text-white bg-rose-600 hover:bg-rose-700 rounded-2xl shadow-xl shadow-rose-500/20 active:scale-95 transition-all"
                        >
                            确认删除
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default UssdManagement;
