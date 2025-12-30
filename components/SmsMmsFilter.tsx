
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  ShieldCheck, 
  Activity, 
  Trash2, 
  Settings2, 
  Check, 
  X, 
  RefreshCw, 
  Save, 
  Smartphone, 
  Zap, 
  MessageSquare, 
  Filter,
  Search,
  ChevronDown,
  Info,
  RotateCcw,
  Clock,
  Globe,
  FileText,
  AlertTriangle,
  Mail
} from './Icons';

type TabType = 'general' | 'status' | 'trash';

interface MmsFilterLog {
  id: string;
  terminal: string;
  port: string;
  slot: string;
  sender: string;
  recipient: string;
  time: string;
  content: string;
  reason?: string;
  totalCount?: number;
}

// 内部使用的开关组件
const Toggle: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <button 
    onClick={onChange}
    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 shadow-inner ${checked ? 'bg-primary-600' : 'bg-slate-200'}`}
  >
    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-md ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const SmsMmsFilter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // 筛选状态
  const [filterPort, setFilterPort] = useState('all');
  const [filterSlot, setFilterSlot] = useState('all');

  // 1. 常规设置状态
  const [filterConfig, setFilterConfig] = useState({
    enabled: false,
    prefixBlacklist: '',
    sensitiveKeywords: ''
  });

  // 2. 接收状态数据
  const [logs, setLogs] = useState<MmsFilterLog[]>([
    { id: '1', terminal: 'M1T1', port: 'M1', slot: 'T1', sender: '-', recipient: '-', time: '-', content: '-', totalCount: 0 },
    { id: '2', terminal: 'M2T1', port: 'M2', slot: 'T1', sender: '-', recipient: '-', time: '-', content: '-', totalCount: 0 },
    { id: '3', terminal: 'M3T1', port: 'M3', slot: 'T1', sender: '-', recipient: '-', time: '-', content: '-', totalCount: 0 },
    { id: '4', terminal: 'M4T1', port: 'M4', slot: 'T1', sender: '-', recipient: '-', time: '-', content: '-', totalCount: 0 },
  ]);

  // 3. 垃圾箱数据
  const [trashItems, setTrashItems] = useState<MmsFilterLog[]>([
    { id: 't1', terminal: 'M1T1', port: 'M1', slot: 'T1', sender: '+861065008888', recipient: '+8613800000001', time: '2024-05-20 22:10:00', content: '博彩优惠信息...', reason: '黑名单命中' },
    { id: 't2', terminal: 'M2T1', port: 'M2', slot: 'T1', sender: '+861065009999', recipient: '+8613800000002', time: '2024-05-20 22:15:00', content: '贷款申请点击...', reason: '敏感词命中' },
  ]);

  const [selectedLogIds, setSelectedLogIds] = useState<string[]>([]);
  const [selectedTrashIds, setSelectedTrashIds] = useState<string[]>([]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleSaveConfig = () => {
    alert("过滤策略已同步至物理终端");
  };

  const handleDeleteSelectedTrash = () => {
    if (selectedTrashIds.length === 0) return;
    if (confirm(`确定要彻底删除选中的 ${selectedTrashIds.length} 条记录吗？`)) {
      setTrashItems(prev => prev.filter(item => !selectedTrashIds.includes(item.id)));
      setSelectedTrashIds([]);
    }
  };

  // 筛选逻辑
  const filteredTrashData = useMemo(() => {
    return trashItems.filter(item => {
      const matchPort = filterPort === 'all' || item.port === filterPort;
      const matchSlot = filterSlot === 'all' || item.slot === filterSlot;
      return matchPort && matchSlot;
    });
  }, [trashItems, filterPort, filterSlot]);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-enter pb-20">
      
      {/* 顶部标题与 Tab 导航 */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-1">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">短信过滤</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">管理短信入库规则，通过黑名单及敏感词自动隔离骚扰信息</p>
        </div>
        
        <div className="flex p-1 bg-slate-200/40 rounded-2xl w-fit border border-slate-200/60 backdrop-blur-sm shadow-inner">
          {[
            { id: 'general', label: '常规设置', icon: Settings2 },
            { id: 'status', label: '接收状态', icon: Activity },
            { id: 'trash', label: '垃圾箱', icon: Trash2 },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2.5 px-6 py-2 text-sm font-bold rounded-xl transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-white text-primary-600 shadow-md ring-1 ring-black/5' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col glass-card rounded-[2.5rem] border border-white/60 shadow-soft overflow-hidden bg-white/60 min-h-[600px]">
        
        {/* --- 1. 常规设置 --- */}
        {activeTab === 'general' && (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="p-12 sm:p-16 flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto space-y-12">
                   <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      <div className="md:col-span-4 text-right pr-8">
                        <label className="text-base font-black text-slate-700 tracking-tight">垃圾短信过滤</label>
                      </div>
                      <div className="md:col-span-8 flex items-center">
                        <Toggle 
                          checked={filterConfig.enabled} 
                          onChange={() => setFilterConfig({...filterConfig, enabled: !filterConfig.enabled})} 
                        />
                        <span className={`ml-4 text-sm font-bold transition-colors ${filterConfig.enabled ? 'text-primary-600' : 'text-slate-400'}`}>
                           {filterConfig.enabled ? '已开启实时过滤' : '过滤功能已关闭'}
                        </span>
                      </div>
                   </div>

                   {filterConfig.enabled ? (
                     <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500 slide-in-from-top-4">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                          <div className="md:col-span-4 text-right pr-8 pt-3">
                            <label className="text-base font-black text-slate-700 tracking-tight">号码前缀黑名单</label>
                          </div>
                          <div className="md:col-span-8 space-y-3">
                             <div className="relative group">
                                <textarea 
                                  value={filterConfig.prefixBlacklist}
                                  onChange={(e) => setFilterConfig({...filterConfig, prefixBlacklist: e.target.value})}
                                  rows={4}
                                  placeholder="【提示】最大长度1024（包括分号）！"
                                  className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-sm font-mono font-bold text-slate-700 focus:border-primary-500 focus:ring-8 focus:ring-primary-500/5 outline-none transition-all shadow-inner placeholder:text-slate-300 placeholder:font-sans"
                                />
                             </div>
                             <p className="text-xs font-black text-slate-400 tracking-tight pl-1">多个以英文分号隔开</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                          <div className="md:col-span-4 text-right pr-8 pt-3">
                            <label className="text-base font-black text-slate-700 tracking-tight">敏感词</label>
                          </div>
                          <div className="md:col-span-8 space-y-3">
                             <div className="relative group">
                                <textarea 
                                  value={filterConfig.sensitiveKeywords}
                                  onChange={(e) => setFilterConfig({...filterConfig, sensitiveKeywords: e.target.value})}
                                  rows={4}
                                  placeholder="【提示】最大长度1024（包括分号）！"
                                  className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:border-primary-500 focus:ring-8 focus:ring-primary-500/5 outline-none transition-all shadow-inner placeholder:text-slate-300"
                                />
                             </div>
                             <p className="text-xs font-black text-slate-400 tracking-tight pl-1">多个以英文分号隔开</p>
                          </div>
                        </div>
                     </div>
                   ) : (
                     <div className="py-20 flex flex-col items-center justify-center text-slate-300 opacity-40 select-none animate-in fade-in duration-700">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-inner border border-slate-100">
                           <ShieldCheck className="w-12 h-12" />
                        </div>
                        <h4 className="text-lg font-black uppercase tracking-[0.2em]">待命中</h4>
                        <p className="text-sm font-bold mt-2">请开启上方开关以配置详细过滤逻辑</p>
                     </div>
                   )}
                </div>
             </div>

             <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 italic">
                   <Info className="w-4 h-4 text-primary-400" />
                   * 保存后过滤策略将实时应用于所有入站短信扫描流程
                </div>
                <button 
                  onClick={handleSaveConfig}
                  className="btn-primary px-12 py-4 rounded-[1.5rem] text-sm font-black flex items-center gap-3 shadow-xl shadow-primary-500/20 active:scale-95 transition-all"
                >
                   <Save className="w-5 h-5" />
                   保存过滤配置
                </button>
            </div>
          </div>
        )}

        {/* --- 2. 接收状态 --- */}
        {activeTab === 'status' && (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-2">
                   <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                      <Filter className="w-3.5 h-3.5 text-slate-400" />
                      <select className="bg-transparent border-none text-xs font-black text-slate-700 focus:ring-0 cursor-pointer min-w-[100px]">
                         <option>全部状态</option>
                         <option>正常接收</option>
                         <option>已拦截</option>
                      </select>
                   </div>
                   <button 
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 transition-all shadow-sm"
                   >
                      <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                   </button>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white text-rose-500 text-xs font-bold rounded-xl border border-rose-100 hover:bg-rose-50 transition-all shadow-sm group">
                   <Trash2 className="w-4 h-4 text-rose-400 group-hover:text-rose-600" /> 清空日志
                </button>
             </div>

             <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                   <thead className="bg-slate-50/50 sticky top-0 z-10">
                      <tr className="border-b border-slate-100">
                         <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">终端(端口-卡槽号)</th>
                         <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">发送者</th>
                         <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">收件人</th>
                         <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">接收时间</th>
                         <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">短信内容</th>
                         <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">总接收短信数</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {logs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                           <td className="px-8 py-5 text-sm font-bold text-primary-600 font-mono">{log.terminal}</td>
                           <td className="px-4 py-5 text-sm font-mono text-slate-600">{log.sender}</td>
                           <td className="px-4 py-5 text-sm font-mono text-slate-600">{log.recipient}</td>
                           <td className="px-4 py-5 text-xs text-slate-400 font-mono">{log.time}</td>
                           <td className="px-4 py-5 text-sm text-slate-600">{log.content}</td>
                           <td className="px-8 py-5 text-right text-sm font-mono font-bold text-primary-600">
                              {log.totalCount}
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {/* --- 3. 垃圾箱 --- */}
        {activeTab === 'trash' && (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
             {/* 筛选工具栏 */}
             <div className="p-5 border-b border-slate-100 bg-slate-50/30 flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm group focus-within:border-primary-300 transition-all">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 border-r border-slate-100 pr-3">端口</span>
                    <select 
                      value={filterPort}
                      onChange={(e) => setFilterPort(e.target.value)}
                      className="bg-transparent border-none text-xs font-black text-slate-700 focus:ring-0 cursor-pointer min-w-[80px] outline-none"
                    >
                      <option value="all">全部端口</option>
                      {['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8'].map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm group focus-within:border-primary-300 transition-all">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 border-r border-slate-100 pr-3">卡槽号</span>
                    <select 
                      value={filterSlot}
                      onChange={(e) => setFilterSlot(e.target.value)}
                      className="bg-transparent border-none text-xs font-black text-slate-700 focus:ring-0 cursor-pointer min-w-[80px] outline-none"
                    >
                      <option value="all">全部卡槽</option>
                      {['T1', 'T2', 'T3', 'T4'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="h-8 w-px bg-slate-200"></div>

                <div className="flex items-center gap-3">
                   <button 
                    onClick={() => setTrashItems([])}
                    className="flex items-center gap-2 px-6 py-2 bg-rose-600 text-white text-xs font-black rounded-xl shadow-lg shadow-rose-500/20 hover:bg-rose-700 active:scale-95 transition-all"
                   >
                      <Trash2 className="w-4 h-4" /> 永久清空垃圾箱
                   </button>
                   <button 
                    onClick={handleDeleteSelectedTrash}
                    disabled={selectedTrashIds.length === 0}
                    className="flex items-center gap-2 px-6 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 transition-all shadow-sm group"
                   >
                      <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-rose-600" /> 删除所选
                   </button>
                </div>
             </div>

             <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                   <thead className="bg-slate-50/50 sticky top-0 z-10">
                      <tr className="border-b border-slate-100">
                         <th className="px-6 py-5 w-12 text-center">
                            <input 
                              type="checkbox" 
                              checked={selectedTrashIds.length === filteredTrashData.length && filteredTrashData.length > 0} 
                              onChange={() => setSelectedTrashIds(selectedTrashIds.length === filteredTrashData.length ? [] : filteredTrashData.map(d => d.id))} 
                              className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer" 
                            />
                         </th>
                         <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">终端(端口-卡槽号)</th>
                         <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">发送者</th>
                         <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">收件人</th>
                         <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">接收时间</th>
                         <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">短信内容</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {filteredTrashData.length > 0 ? filteredTrashData.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                           <td className="px-6 py-5 text-center">
                              <input 
                                type="checkbox" 
                                checked={selectedTrashIds.includes(item.id)} 
                                onChange={() => setSelectedTrashIds(prev => prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id])} 
                                className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer" 
                              />
                           </td>
                           <td className="px-4 py-5 text-sm font-bold text-rose-600 font-mono">{item.terminal}</td>
                           <td className="px-4 py-5 text-sm font-mono text-slate-600">{item.sender}</td>
                           <td className="px-4 py-5 text-sm font-mono text-slate-600">{item.recipient}</td>
                           <td className="px-4 py-5 text-xs text-slate-400 font-mono">{item.time}</td>
                           <td className="px-8 py-5 text-right">
                              <p className="text-sm text-slate-500 line-clamp-1 group-hover:line-clamp-none transition-all">{item.content}</p>
                           </td>
                        </tr>
                      )) : (
                        <tr>
                           <td colSpan={6} className="py-32">
                              <div className="flex flex-col items-center justify-center text-slate-300">
                                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
                                    <Trash2 className="w-10 h-10 opacity-20" />
                                 </div>
                                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">垃圾箱是空的</p>
                              </div>
                           </td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        )}

      </div>

      {/* 底部功能条图例 */}
      <div className="flex items-center justify-center gap-10 text-[10px] font-black text-slate-300 uppercase tracking-widest pt-4">
         <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-slate-200" />
            <span>实时报文检测</span>
         </div>
         <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-200" />
            <span>多层指纹过滤</span>
         </div>
         <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-slate-200" />
            <span>拦截规则自动学习</span>
         </div>
      </div>

    </div>
  );
};

export default SmsMmsFilter;
