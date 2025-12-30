
import React, { useState, useMemo } from 'react';
import { 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Smartphone,
  X,
  Check,
  Mail,
} from './Icons';

interface ReceivedSmsSummary {
  id: string;
  terminal: string; // 端口-卡槽 组合，如 M1T1
  port: string;     // 端口 M1, M2...
  slot: string;     // 卡槽 T1, T2...
  sender: string;
  recipient: string;
  receivedTime: string;
  content: string;
  totalCount: number;
}

const initialData: ReceivedSmsSummary[] = [
  { id: '1', terminal: 'M1T1', port: 'M1', slot: 'T1', sender: '-', recipient: '-', receivedTime: '-', content: '-', totalCount: 0 },
  { id: '2', terminal: 'M2T1', port: 'M2', slot: 'T1', sender: '-', recipient: '-', receivedTime: '-', content: '-', totalCount: 0 },
  { id: '3', terminal: 'M3T1', port: 'M3', slot: 'T1', sender: '-', recipient: '-', receivedTime: '-', content: '-', totalCount: 0 },
  { id: '4', terminal: 'M4T1', port: 'M4', slot: 'T1', sender: '-', recipient: '-', receivedTime: '-', content: '-', totalCount: 0 },
  { id: '5', terminal: 'M5T1', port: 'M5', slot: 'T1', sender: '-', recipient: '-', receivedTime: '-', content: '-', totalCount: 0 },
  { id: '6', terminal: 'M6T1', port: 'M6', slot: 'T1', sender: '-', recipient: '-', receivedTime: '-', content: '-', totalCount: 0 },
  { id: '7', terminal: 'M7T1', port: 'M7', slot: 'T1', sender: '-', recipient: '-', receivedTime: '-', content: '-', totalCount: 0 },
  { id: '8', terminal: 'M8T1', port: 'M8', slot: 'T1', sender: '-', recipient: '-', receivedTime: '-', content: '-', totalCount: 0 },
];

const SmsReceive: React.FC = () => {
  const [data, setData] = useState<ReceivedSmsSummary[]>(initialData);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // 筛选条件状态
  const [viewScope, setViewScope] = useState<'current' | 'all'>('current');
  const [filterPort, setFilterPort] = useState('all');
  const [filterSlot, setFilterSlot] = useState('all');

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map(m => m.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setData(prev => prev.map((item, idx) => idx < 3 ? {
        ...item,
        sender: `+86 1380000000${idx}`,
        recipient: `+86 10086`,
        receivedTime: new Date().toLocaleString(),
        content: idx === 0 ? '您的验证码是 1234，有效期5分钟。' : '尊敬的用户，您的流量套餐已使用 80%。',
        totalCount: item.totalCount + 1
      } : item));
    }, 1000);
  };

  const handleClearAll = () => {
    if (confirm('确定要清空所有接收到的短信记录和统计计数吗？')) {
      setData(initialData);
      setSelectedIds([]);
    }
  };

  // 纯精确筛选逻辑
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchPort = filterPort === 'all' || item.port === filterPort;
      const matchSlot = filterSlot === 'all' || item.slot === filterSlot;
      return matchPort && matchSlot;
    });
  }, [data, filterPort, filterSlot]);

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 animate-enter pb-20">
      
      {/* 头部标题区 */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-1">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">接收短信</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">查看物理终端接收到的短信明细及累计汇总统计</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 text-xs font-bold rounded-xl border border-slate-200 hover:border-rose-200 hover:text-rose-600 transition-all shadow-sm active:scale-95 group"
          >
            <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition-colors" /> 清空记录
          </button>
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 text-xs font-bold rounded-xl border border-slate-200 hover:border-primary-200 hover:text-primary-600 transition-all shadow-sm active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} /> 刷新数据
          </button>
        </div>
      </div>

      {/* 综合参数筛选工具栏 */}
      <div className="glass-card bg-white/70 rounded-[2rem] border border-white/60 shadow-soft p-5 flex items-center gap-6">
        {/* 状态切换 */}
        <div className="flex items-center gap-3 bg-slate-100/50 p-1 rounded-xl border border-slate-200 shadow-inner">
           {[
             { id: 'current', label: '当前状态' },
             { id: 'all', label: '全部状态' }
           ].map(scope => (
             <button
               key={scope.id}
               onClick={() => setViewScope(scope.id as any)}
               className={`px-5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                 viewScope === scope.id 
                  ? 'bg-white text-primary-600 shadow-sm ring-1 ring-black/5' 
                  : 'text-slate-500 hover:text-slate-700'
               }`}
             >
               {scope.label}
             </button>
           ))}
        </div>

        <div className="h-6 w-px bg-slate-200"></div>

        {/* 端口 & 卡槽 精确选择 */}
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
      </div>

      {/* 表格容器 */}
      <div className="flex flex-col glass-card rounded-[2.5rem] border border-white/60 shadow-soft overflow-hidden bg-white/60">
        
        {/* 数据表格 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-5 w-16 text-center">
                  <div 
                    onClick={toggleSelectAll}
                    className={`w-5 h-5 mx-auto rounded border-2 flex items-center justify-center cursor-pointer transition-all ${selectedIds.length === filteredData.length && filteredData.length > 0 ? 'bg-primary-600 border-primary-600' : 'bg-white border-slate-300'}`}
                  >
                    {selectedIds.length === filteredData.length && filteredData.length > 0 && <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
                  </div>
                </th>
                <th className="px-4 py-5 w-48">终端(端口-卡槽号)</th>
                <th className="px-4 py-5">发送者</th>
                <th className="px-4 py-5">收件人</th>
                <th className="px-4 py-5">接收时间</th>
                <th className="px-4 py-5 w-1/3">短信内容</th>
                <th className="px-8 py-5 text-right whitespace-nowrap">总接收短信数</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length > 0 ? filteredData.map((row) => {
                const isSelected = selectedIds.includes(row.id);
                return (
                  <tr key={row.id} className={`group hover:bg-white transition-all ${isSelected ? 'bg-indigo-50/40' : ''}`}>
                    <td className="px-6 py-5 text-center">
                       <div 
                        onClick={() => toggleSelectOne(row.id)}
                        className={`w-5 h-5 mx-auto rounded border-2 flex items-center justify-center cursor-pointer transition-all ${isSelected ? 'bg-primary-600 border-primary-600' : 'bg-white border-slate-300'}`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
                      </div>
                    </td>
                    <td className="px-4 py-5">
                       <span className="text-sm font-bold text-primary-600 font-mono tracking-tight">{row.terminal}</span>
                    </td>
                    <td className="px-4 py-5">
                       <span className="text-sm text-slate-700 font-mono font-bold">{row.sender}</span>
                    </td>
                    <td className="px-4 py-5">
                       <span className="text-sm text-slate-500 font-mono">{row.recipient}</span>
                    </td>
                    <td className="px-4 py-5">
                       <span className="text-xs text-slate-500 font-mono font-medium">{row.receivedTime}</span>
                    </td>
                    <td className="px-4 py-5">
                       <p className="text-sm text-slate-600 line-clamp-1 group-hover:line-clamp-none transition-all duration-300">{row.content}</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <span className={`inline-flex px-3 py-1 rounded-full text-xs font-black font-mono border ${row.totalCount > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                         {row.totalCount}
                       </span>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={7} className="py-32">
                    <div className="flex flex-col items-center justify-center text-slate-300">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
                        <Mail className="w-10 h-10 opacity-20" />
                      </div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">未找到符合当前参数的记录</p>
                      <button onClick={() => { setFilterPort('all'); setFilterSlot('all'); }} className="mt-4 text-xs font-black text-primary-500 hover:text-primary-600 uppercase tracking-widest underline decoration-2 underline-offset-4 transition-all">重置参数筛选</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 底部汇总 */}
        <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
               活跃监控: <span className="text-slate-800">{filteredData.length}</span> 终端
             </p>
             <div className="h-3 w-px bg-slate-200"></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
               模式: <span className="text-primary-600 font-black">{viewScope === 'current' ? '实时快照' : '历史存档'}</span>
             </p>
           </div>
           <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Service Online</span>
           </div>
        </div>
      </div>

      {/* 底部业务说明 */}
      <div className="flex items-center justify-center gap-10 text-[10px] font-black text-slate-300 uppercase tracking-widest pt-4">
         <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-slate-200" />
            <span>网段全兼容</span>
         </div>
         <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-200" />
            <span>实时入库</span>
         </div>
         <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-slate-200" />
            <span>多重校验</span>
         </div>
      </div>

      {/* 悬浮操作栏 */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/90 backdrop-blur-xl text-white pl-5 pr-2 py-2.5 rounded-2xl shadow-float border border-white/10 transition-all duration-300 z-50 ${selectedIds.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
           <div className="flex items-center gap-3 mr-4 border-r border-white/10 pr-5">
               <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-500 text-[10px] font-black shadow-lg shadow-primary-500/20">{selectedIds.length}</div>
               <span className="text-xs font-bold tracking-tight">已选定项</span>
           </div>
           
           <div className="flex items-center gap-1.5">
               <button className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-xs font-black text-white active:scale-95">
                   重置所选计数
               </button>
               <button className="flex items-center gap-2 px-6 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 transition-colors text-xs font-black text-white shadow-lg shadow-primary-500/20 active:scale-95">
                   导出所选数据
               </button>
               <button 
                  onClick={() => setSelectedIds([])}
                  className="p-1.5 hover:bg-white/10 rounded-xl ml-2 text-slate-400 hover:text-white transition-colors"
               >
                   <X className="w-4 h-4" />
               </button>
           </div>
      </div>
    </div>
  );
};

export default SmsReceive;
