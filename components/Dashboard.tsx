
import React from 'react';
import { Link } from 'react-router-dom';
import StatCard from './StatCard';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Cable,
  Server,
  Activity,
  Globe,
  Shield,
  MessageSquare,
  Cpu,
  LayoutGrid,
  Info
} from './Icons';

interface SmsStat {
  terminal: string;
  received: number;
  filtered: number;
  sent: number;
  sentSuccess: number;
  sentFailed: number;
  consecFailed: number;
  reportSuccess: number;
  sending: number;
  successRate: number;
}

const mockSmsStats: SmsStat[] = [
  { terminal: 'M1-A', received: 124, filtered: 2, sent: 1540, sentSuccess: 1538, sentFailed: 2, consecFailed: 0, reportSuccess: 1535, sending: 12, successRate: 99.8 },
  { terminal: 'M1-B', received: 89, filtered: 0, sent: 892, sentSuccess: 880, sentFailed: 12, consecFailed: 0, reportSuccess: 875, sending: 0, successRate: 98.6 },
  { terminal: 'M2-A', received: 256, filtered: 15, sent: 2301, sentSuccess: 2100, sentFailed: 201, consecFailed: 5, reportSuccess: 2050, sending: 45, successRate: 91.2 },
  { terminal: 'M2-B', received: 45, filtered: 1, sent: 320, sentSuccess: 318, sentFailed: 2, consecFailed: 0, reportSuccess: 318, sending: 0, successRate: 99.3 },
  { terminal: 'M3-A', received: 0, filtered: 0, sent: 0, sentSuccess: 0, sentFailed: 0, consecFailed: 0, reportSuccess: 0, sending: 0, successRate: 0 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 pb-10 max-w-[1600px] mx-auto animate-enter">
      {/* 头部欢迎区 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">系统概览</h1>
           <div className="flex items-center gap-3 mt-2 px-4 py-1.5 bg-emerald-50/80 text-emerald-700 rounded-full border border-emerald-100 w-fit">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
             </span>
             <p className="text-[10px] font-black uppercase tracking-[0.2em]">Telarvo 网关在线 - 运行中</p>
           </div>
        </div>
        <div className="flex gap-3">
           <Link to="/sms/send" className="btn-primary px-8 py-3 rounded-2xl text-sm font-black flex items-center gap-3 group shadow-xl shadow-primary-500/20">
             <Send className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
             立即发送短信
           </Link>
        </div>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="今日发送总量" value="12,450" trend="up" icon={Send} change={12} />
        <StatCard title="发送成功率" value="99.2%" trend="up" icon={CheckCircle2} change={0.5} />
        <StatCard title="发送失败/堵塞" value="84" trend="down" icon={AlertCircle} change={22} />
        <StatCard title="可用端口" value="12/16" trend="neutral" icon={Cable} />
      </div>

      {/* 设备信息概括 */}
      <div className="glass-card bg-white rounded-[2rem] border border-white/60 shadow-soft overflow-hidden">
        {/* 卡片头部 */}
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                 <LayoutGrid className="w-5 h-5" />
              </div>
              <div>
                 <h2 className="text-base font-black text-slate-800 tracking-tight">设备信息概括</h2>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">实时监控数据</p>
              </div>
           </div>
           <Link to="/device/status" className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 text-xs font-black rounded-xl hover:bg-indigo-100 transition-all group">
              查看设备详情 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>

        {/* 内容主体 - 四列布局 */}
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-50">
           
           {/* 第一列：设备视觉标识 */}
           <div className="p-10 flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                 <div className="w-28 h-28 bg-white rounded-3xl border-2 border-slate-50 shadow-soft flex items-center justify-center">
                    <Server className="w-12 h-12 text-indigo-500" strokeWidth={1.5} />
                 </div>
                 <div className="absolute -bottom-2 right-1/2 translate-x-1/2 px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-lg shadow-lg border-2 border-white uppercase tracking-tighter">
                    在线
                 </div>
              </div>
              <div className="text-center">
                 <h3 className="text-xl font-black text-slate-800 tracking-tight">演示设备</h3>
                 <div className="mt-2 px-3 py-1.5 bg-slate-50 text-slate-400 text-[10px] font-mono font-bold rounded-lg border border-slate-100 uppercase">
                    ID: DEV-2024-X88
                 </div>
              </div>
           </div>

           {/* 第二列：系统状态 */}
           <div className="p-10 space-y-8">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl">
                    <Activity className="w-4 h-4" />
                 </div>
                 <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">系统状态</h4>
              </div>
              
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-500">网关状态</span>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-500">文件系统</span>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-md border border-emerald-100 uppercase">已连接</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-500">运行时长</span>
                    <span className="text-sm font-mono font-black text-slate-800">15天 04时 22分</span>
                 </div>
              </div>
           </div>

           {/* 第三列：网络状态 */}
           <div className="p-10 space-y-8">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-cyan-50 text-cyan-500 rounded-xl">
                    <Globe className="w-4 h-4" />
                 </div>
                 <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">网络状态</h4>
              </div>

              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-500">WAN口速率</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-mono font-black rounded-md">1 Gbps</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-500">IP地址</span>
                    <span className="text-sm font-mono font-black text-slate-800">192.168.0.74</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-500">网关地址</span>
                    <span className="text-sm font-mono font-black text-slate-800">192.168.0.1</span>
                 </div>
              </div>
           </div>

           {/* 第四列：授权信息 */}
           <div className="p-10 space-y-8">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
                    <Shield className="w-4 h-4" />
                 </div>
                 <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">授权信息</h4>
              </div>

              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-500">版本</span>
                    <span className="text-sm font-black text-slate-800">PRO_V2</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-500">有效期</span>
                    <div className="flex items-baseline gap-1.5">
                       <span className="text-xl font-mono font-black text-amber-600">342</span>
                       <span className="text-[10px] font-black text-amber-500 uppercase tracking-tighter">天</span>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest">
                       <span>使用率</span>
                       <span className="text-slate-400">75%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner border border-slate-100">
                       <div className="h-full bg-amber-500 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                 </div>
              </div>
           </div>

        </div>
      </div>

      {/* 业务细节表格 */}
      <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-soft border border-white/60 bg-white/60">
         <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white/40">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">终端业务详情</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Terminal Performance Monitor</p>
                </div>
            </div>
            <Link to="/stats/sms" className="flex items-center gap-2 text-xs font-black text-primary-600 hover:text-primary-700 transition-colors uppercase tracking-widest">
                查看全量统计 <ChevronRight className="w-4 h-4" />
            </Link>
         </div>
         
         <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                 <thead>
                     <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                         <th className="px-8 py-5">物理终端</th>
                         <th className="px-8 py-5 text-right">接收</th>
                         <th className="px-8 py-5 text-right">已过滤</th>
                         <th className="px-8 py-5 text-right">发送量</th>
                         <th className="px-8 py-5 text-right">成功</th>
                         <th className="px-8 py-5 text-right">失败</th>
                         <th className="px-8 py-5 text-right">连败</th>
                         <th className="px-8 py-5 text-right">成功率</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                     {mockSmsStats.map((stat, idx) => (
                         <tr key={idx} className="hover:bg-white/80 transition-colors group">
                             <td className="px-8 py-4">
                                 <div className="flex items-center gap-3">
                                     <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-primary-500 group-hover:shadow-[0_0_8px_rgba(37,99,235,0.4)] transition-all"></div>
                                     <span className="text-sm font-black font-mono text-slate-700">{stat.terminal}</span>
                                 </div>
                             </td>
                             <td className="px-8 py-4 text-right font-mono text-xs font-bold text-slate-500">{stat.received}</td>
                             <td className="px-8 py-4 text-right font-mono text-xs font-bold text-slate-400">{stat.filtered}</td>
                             <td className="px-8 py-4 text-right font-mono text-sm font-black text-slate-800">{stat.sent}</td>
                             <td className="px-8 py-4 text-right font-mono text-sm font-black text-emerald-600">{stat.sentSuccess}</td>
                             <td className="px-8 py-4 text-right font-mono text-sm font-black text-rose-600">{stat.sentFailed}</td>
                             <td className="px-8 py-4 text-right">
                                 {stat.consecFailed > 0 ? (
                                     <span className="font-mono text-xs font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100">{stat.consecFailed}</span>
                                 ) : (
                                     <span className="font-mono text-xs text-slate-300">0</span>
                                 )}
                             </td>
                             <td className="px-8 py-4 text-right">
                                 <span className={`font-mono text-xs font-black px-3 py-1.5 rounded-xl border ${
                                     stat.successRate >= 98 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                     stat.successRate >= 90 ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                     'bg-rose-50 text-rose-600 border-rose-100'
                                 }`}>
                                     {stat.successRate.toFixed(1)}%
                                 </span>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
