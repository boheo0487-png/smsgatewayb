
import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Trash2, 
  RefreshCw, 
  Download, 
  Activity, 
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Smartphone,
  ChevronDown
} from './Icons';

interface SmsStatRow {
  id: string;
  terminal: string;
  received: number;
  filtered: number;
  sent: number;
  sentSuccess: number;
  sentFailed: number;
  consecFailed: number;
  reportSuccess: number;
  sending: number;
}

const initialStats: SmsStatRow[] = [
  { id: '1', terminal: 'M1T1', received: 0, filtered: 0, sent: 0, sentSuccess: 0, sentFailed: 0, consecFailed: 0, reportSuccess: 0, sending: 0 },
  { id: '2', terminal: 'M2T1', received: 0, filtered: 0, sent: 0, sentSuccess: 0, sentFailed: 0, consecFailed: 0, reportSuccess: 0, sending: 0 },
  { id: '3', terminal: 'M3T1', received: 0, filtered: 0, sent: 0, sentSuccess: 0, sentFailed: 0, consecFailed: 0, reportSuccess: 0, sending: 0 },
  { id: '4', terminal: 'M4T1', received: 0, filtered: 0, sent: 0, sentSuccess: 0, sentFailed: 0, consecFailed: 0, reportSuccess: 0, sending: 0 },
  { id: '5', terminal: 'M5T1', received: 0, filtered: 0, sent: 0, sentSuccess: 0, sentFailed: 0, consecFailed: 0, reportSuccess: 0, sending: 0 },
  { id: '6', terminal: 'M6T1', received: 0, filtered: 0, sent: 0, sentSuccess: 0, sentFailed: 0, consecFailed: 0, reportSuccess: 0, sending: 0 },
  { id: '7', terminal: 'M7T1', received: 0, filtered: 0, sent: 0, sentSuccess: 0, sentFailed: 0, consecFailed: 0, reportSuccess: 0, sending: 0 },
  { id: '8', terminal: 'M8T1', received: 0, filtered: 0, sent: 0, sentSuccess: 0, sentFailed: 0, consecFailed: 0, reportSuccess: 0, sending: 0 },
];

const SmsStatistics: React.FC = () => {
  const [stats, setStats] = useState<SmsStatRow[]>(initialStats);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // 筛选器状态
  const [filters, setFilters] = useState({
    type: '短信',
    timeRange: '最近一小时',
    viewScope: '显示当前'
  });

  // 计算总计行
  const totals = useMemo(() => {
    return stats.reduce((acc, curr) => ({
      received: acc.received + curr.received,
      filtered: acc.filtered + curr.filtered,
      sent: acc.sent + curr.sent,
      sentSuccess: acc.sentSuccess + curr.sentSuccess,
      sentFailed: acc.sentFailed + curr.sentFailed,
      consecFailed: acc.consecFailed + curr.consecFailed,
      reportSuccess: acc.reportSuccess + curr.reportSuccess,
      sending: acc.sending + curr.sending,
    }), { received: 0, filtered: 0, sent: 0, sentSuccess: 0, sentFailed: 0, consecFailed: 0, reportSuccess: 0, sending: 0 });
  }, [stats]);

  const calculateRate = (success: number, total: number) => {
    if (total === 0) return "0%";
    return ((success / total) * 100).toFixed(1) + "%";
  };

  const handleClear = () => {
    if (confirm('确定要重置所有终端的统计数据吗？此操作不可撤销。')) {
      setStats(initialStats);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 animate-enter pb-20">
      
      {/* 顶部标题与全局操作 */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-1">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">短信统计</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">全局物理终端的实时业务吞吐量与质量分析报表</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleClear}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-rose-500 text-sm font-bold rounded-xl border border-rose-100 hover:bg-rose-50 hover:border-rose-200 transition-all shadow-sm active:scale-95 group"
          >
            <Trash2 className="w-4 h-4 text-rose-400 group-hover:text-rose-600" /> 清空统计
          </button>
        </div>
      </div>

      {/* 综合筛选工具栏 */}
      <div className="glass-card bg-white/70 p-4 rounded-[2rem] border border-white/60 shadow-soft flex items-center gap-4">
        <div className="relative group min-w-[140px]">
          <select 
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
            className="w-full appearance-none pl-5 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all cursor-pointer shadow-sm"
          >
            <option>短信</option>
            <option>彩信</option>
            <option>USSD</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within:text-primary-500 transition-colors" />
        </div>

        <div className="relative group min-w-[200px]">
          <select 
            value={filters.timeRange}
            onChange={(e) => setFilters({...filters, timeRange: e.target.value})}
            className="w-full appearance-none pl-5 pr-10 py-3 bg-white border-2 border-primary-500/80 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all cursor-pointer shadow-[0_0_12px_rgba(59,130,246,0.1)]"
          >
            <option>最近一小时</option>
            <option>今日 (Today)</option>
            <option>最近24小时</option>
            <option>最近7天</option>
            <option>自定义范围</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500 pointer-events-none" />
        </div>

        <div className="relative group min-w-[180px]">
          <select 
            value={filters.viewScope}
            onChange={(e) => setFilters({...filters, viewScope: e.target.value})}
            className="w-full appearance-none pl-5 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all cursor-pointer shadow-sm"
          >
            <option>显示当前</option>
            <option>显示历史汇总</option>
            <option>按天合并显示</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none transition-colors" />
        </div>
      </div>

      {/* 数据表格区域 - 核心业务数据看板 */}
      <div className="flex flex-col glass-card rounded-[2.5rem] border border-white/60 shadow-soft overflow-hidden bg-white/60 min-h-[500px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">
                <th className="px-8 py-5 whitespace-nowrap">终端(端口-卡槽号)</th>
                <th className="px-4 py-5 text-center whitespace-nowrap">接收数</th>
                <th className="px-4 py-5 text-center whitespace-nowrap">过滤数</th>
                <th className="px-4 py-5 text-center whitespace-nowrap">发送数</th>
                <th className="px-4 py-5 text-center whitespace-nowrap">发送成功数</th>
                <th className="px-4 py-5 text-center whitespace-nowrap">发送失败数</th>
                <th className="px-4 py-5 text-center whitespace-nowrap">连续发送失败数</th>
                <th className="px-4 py-5 text-center whitespace-nowrap">送达报告成功数</th>
                <th className="px-4 py-5 text-center whitespace-nowrap">正在发送数</th>
                <th className="px-8 py-5 text-right whitespace-nowrap">成功率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {/* 总数行 */}
              <tr className="bg-slate-100/30 font-black text-slate-900 border-b border-slate-200 group">
                <td className="px-8 py-5 flex items-center gap-3">
                   <div className="w-2.5 h-2.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(37,99,235,0.4)]"></div>
                   <span className="text-sm">总数</span>
                </td>
                <td className="px-4 py-5 text-center text-sm">{totals.received}</td>
                <td className="px-4 py-5 text-center text-sm text-slate-400">{totals.filtered}</td>
                <td className="px-4 py-5 text-center text-sm">{totals.sent}</td>
                <td className="px-4 py-5 text-center text-sm text-emerald-600">{totals.sentSuccess}</td>
                <td className="px-4 py-5 text-center text-sm text-rose-500">{totals.sentFailed}</td>
                <td className="px-4 py-5 text-center text-sm text-rose-700">{totals.consecFailed}</td>
                <td className="px-4 py-5 text-center text-sm text-indigo-600">{totals.reportSuccess}</td>
                <td className="px-4 py-5 text-center text-sm text-primary-600">{totals.sending}</td>
                <td className="px-8 py-5 text-right text-sm">
                   <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-black">
                     {calculateRate(totals.sentSuccess, totals.sent)}
                   </span>
                </td>
              </tr>
              {/* 各终端数据行 */}
              {stats.map((row) => (
                <tr key={row.id} className="hover:bg-white transition-colors group">
                  <td className="px-8 py-4">
                     <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-primary-400 transition-colors"></div>
                        <span className="text-sm font-bold text-slate-700">{row.terminal}</span>
                     </div>
                  </td>
                  <td className="px-4 py-4 text-center text-xs font-bold text-slate-500">{row.received}</td>
                  <td className="px-4 py-4 text-center text-xs text-slate-300">{row.filtered}</td>
                  <td className="px-4 py-4 text-center text-xs font-bold text-slate-600">{row.sent}</td>
                  <td className="px-4 py-4 text-center text-xs font-black text-emerald-600">{row.sentSuccess}</td>
                  <td className="px-4 py-4 text-center text-xs font-black text-rose-500">{row.sentFailed}</td>
                  <td className="px-4 py-4 text-center">
                     {row.consecFailed > 0 ? (
                       <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100 font-black text-[10px]">
                         {row.consecFailed}
                       </span>
                     ) : <span className="text-slate-200">-</span>}
                  </td>
                  <td className="px-4 py-4 text-center text-xs font-bold text-indigo-500">{row.reportSuccess}</td>
                  <td className="px-4 py-4 text-center">
                     {row.sending > 0 ? (
                       <div className="flex items-center justify-center gap-1.5 text-primary-600">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span className="text-xs font-black">{row.sending}</span>
                       </div>
                     ) : <span className="text-slate-200">0</span>}
                  </td>
                  <td className="px-8 py-4 text-right">
                    <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg border ${
                      parseFloat(calculateRate(row.sentSuccess, row.sent)) >= 95 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      parseFloat(calculateRate(row.sentSuccess, row.sent)) >= 80 ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-slate-50 text-slate-400 border-slate-200'
                    }`}>
                      {calculateRate(row.sentSuccess, row.sent)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 底部信息条 */}
        <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                当前活跃统计终端: <span className="text-slate-800">{stats.length}</span>
              </p>
              <div className="h-3 w-px bg-slate-200"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                最后更新: <span className="text-slate-800">{new Date().toLocaleTimeString()}</span>
              </p>
           </div>
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">在线统计中</span>
              </div>
           </div>
        </div>
      </div>

      {/* 底部引导图标组 */}
      <div className="flex items-center justify-center gap-12 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] pt-4">
         <div className="flex items-center gap-2.5 group cursor-help">
            <Smartphone className="w-4 h-4 text-slate-200 group-hover:text-primary-400 transition-colors" />
            <span>按端口维度穿透</span>
         </div>
         <div className="flex items-center gap-2.5 group cursor-help">
            <Clock className="w-4 h-4 text-slate-200 group-hover:text-primary-400 transition-colors" />
            <span>实时数据流采集</span>
         </div>
         <div className="flex items-center gap-2.5 group cursor-help">
            <CheckCircle2 className="w-4 h-4 text-slate-200 group-hover:text-primary-400 transition-colors" />
            <span>离线自动补算</span>
         </div>
      </div>

    </div>
  );
};

export default SmsStatistics;
