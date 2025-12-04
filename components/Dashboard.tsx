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
  BarChart3,
  MessageSquare
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
      {/* Intro Section - Improved visual hierarchy */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-800 tracking-tight">系统概览</h1>
           <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-white/60 rounded-full border border-white/60 w-fit backdrop-blur-sm">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
             </span>
             <p className="text-xs text-slate-600 font-medium">系统运行正常</p>
           </div>
        </div>
        <div className="flex gap-3">
           <Link to="/sms/send" className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 group">
             <Send className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
             发送短信
           </Link>
        </div>
      </div>

      {/* Stats - Consistent Grid with better visual balance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="今日发送总量" value="12,450" trend="up" icon={Send} />
        <StatCard title="发送成功率" value="99.2%" trend="up" icon={CheckCircle2} />
        <StatCard title="发送失败/堵塞" value="84" trend="down" icon={AlertCircle} />
        <StatCard title="端口状态" value="12/16" trend="neutral" icon={Cable} />
      </div>

      {/* Device Information Summary */}
      <div className="glass-card rounded-2xl overflow-hidden flex flex-col shadow-soft ring-1 ring-black/5 bg-white/60">
          {/* Card Header - Minimal */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/40">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-indigo-50 to-white rounded-lg text-indigo-600 shadow-sm ring-1 ring-indigo-50">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-800">设备信息概括</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">实时监控数据</p>
                </div>
             </div>
             <Link 
               to="/device/status"
               className="text-xs text-indigo-600 hover:text-indigo-700 font-bold px-4 py-2 rounded-lg bg-indigo-50/50 hover:bg-indigo-50 transition-colors flex items-center group"
             >
                 查看设备详情 <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
             </Link>
          </div>

          <div className="flex flex-col lg:flex-row">
             {/* Identity Panel */}
             <div className="w-full lg:w-1/4 p-8 bg-gradient-to-b from-slate-50/50 to-white/20 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-row lg:flex-col items-center gap-5 lg:text-center">
                 <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-indigo-600 shadow-float">
                        <Server className="w-10 h-10" strokeWidth={1.5} />
                    </div>
                    <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full border-2 border-white shadow-sm">
                        在线
                    </div>
                 </div>
                 
                 <div className="flex flex-col lg:items-center">
                    <h4 className="text-lg font-bold text-slate-800">演示设备</h4>
                    <span className="text-slate-400 text-xs font-mono font-medium bg-slate-100 px-2 py-0.5 rounded-md mt-1 border border-slate-200">ID: DEV-2024-X88</span>
                 </div>
             </div>

             {/* Details Grid */}
             <div className="w-full lg:w-3/4 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100/80">
                 {/* System Status */}
                 <div className="p-8 space-y-6 hover:bg-white/40 transition-colors">
                     <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                            <Activity className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">系统状态</span>
                     </div>
                     <div className="space-y-4">
                         <div className="flex justify-between items-center group">
                             <span className="text-sm text-slate-500 font-medium">网关状态</span>
                             <span className="flex h-2.5 w-2.5 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                             </span>
                         </div>
                         <div className="flex justify-between items-center group">
                             <span className="text-sm text-slate-500 font-medium">文件系统</span>
                             <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/50">已连接</span>
                         </div>
                         <div className="flex justify-between items-center group">
                             <span className="text-sm text-slate-500 font-medium">运行时长</span>
                             <span className="text-sm text-slate-700 font-mono font-semibold">15天 04时 22分</span>
                         </div>
                     </div>
                 </div>

                 {/* Network */}
                 <div className="p-8 space-y-6 hover:bg-white/40 transition-colors">
                     <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-500">
                            <Globe className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">网络状态</span>
                     </div>
                     <div className="space-y-4">
                         <div className="flex justify-between items-center">
                             <span className="text-sm text-slate-500 font-medium">WAN口速率</span>
                             <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">1 Gbps</span>
                         </div>
                         <div className="flex justify-between items-center">
                             <span className="text-sm text-slate-500 font-medium">IP地址</span>
                             <span className="text-sm text-slate-700 font-mono font-medium">192.168.0.74</span>
                         </div>
                         <div className="flex justify-between items-center">
                             <span className="text-sm text-slate-500 font-medium">网关地址</span>
                             <span className="text-sm text-slate-600 font-mono">192.168.0.1</span>
                         </div>
                     </div>
                 </div>

                 {/* License */}
                 <div className="p-8 space-y-6 hover:bg-white/40 transition-colors">
                     <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
                            <Shield className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">授权信息</span>
                     </div>
                     <div className="space-y-4">
                         <div className="flex justify-between items-center">
                             <span className="text-sm text-slate-500 font-medium">版本</span>
                             <span className="text-sm text-slate-800 font-bold">PRO_V2</span>
                         </div>
                         <div className="flex justify-between items-center">
                             <span className="text-sm text-slate-500 font-medium">有效期</span>
                             <span className="text-sm text-amber-600 font-mono font-bold">342 天</span>
                         </div>
                         <div className="space-y-1.5">
                             <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                                <span>使用率</span>
                                <span>75%</span>
                             </div>
                             <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                                 <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full" style={{ width: '75%' }}></div>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
          </div>
      </div>

      {/* SMS Statistics Card */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-soft ring-1 ring-black/5 bg-white/60">
         <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-white/40">
            <div className="p-2 bg-gradient-to-br from-emerald-50 to-white rounded-lg text-emerald-600 shadow-sm ring-1 ring-emerald-50">
                <MessageSquare className="w-4 h-4" />
            </div>
            <div>
                <h3 className="text-sm font-bold text-slate-800">短信统计</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">短信业务概况</p>
            </div>
         </div>
         
         <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                 <thead>
                     <tr className="bg-slate-50/50 border-b border-slate-100">
                         <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">终端</th>
                         <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide text-right">接收数</th>
                         <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide text-right">过滤数</th>
                         <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide text-right">发送数</th>
                         <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide text-right">发送成功</th>
                         <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide text-right">发送失败</th>
                         <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide text-right">连续失败</th>
                         <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide text-right">送达报告</th>
                         <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide text-right">正在发送</th>
                         <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide text-right">成功率</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                     {mockSmsStats.map((stat, idx) => (
                         <tr key={idx} className="hover:bg-white/60 transition-colors group">
                             <td className="px-6 py-3.5">
                                 <div className="flex items-center gap-2">
                                     <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-primary-500 transition-colors"></div>
                                     <span className="text-xs font-bold font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{stat.terminal}</span>
                                 </div>
                             </td>
                             <td className="px-6 py-3.5 text-right font-mono text-sm text-slate-600">{stat.received}</td>
                             <td className="px-6 py-3.5 text-right font-mono text-sm text-slate-600">{stat.filtered}</td>
                             <td className="px-6 py-3.5 text-right font-mono text-sm font-bold text-slate-800">{stat.sent}</td>
                             <td className="px-6 py-3.5 text-right font-mono text-sm text-emerald-600">{stat.sentSuccess}</td>
                             <td className="px-6 py-3.5 text-right font-mono text-sm text-rose-600">{stat.sentFailed}</td>
                             <td className="px-6 py-3.5 text-right">
                                 {stat.consecFailed > 0 ? (
                                     <span className="font-mono text-sm font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">{stat.consecFailed}</span>
                                 ) : (
                                     <span className="font-mono text-sm text-slate-400">0</span>
                                 )}
                             </td>
                             <td className="px-6 py-3.5 text-right font-mono text-sm text-slate-600">{stat.reportSuccess}</td>
                             <td className="px-6 py-3.5 text-right font-mono text-sm text-primary-600">{stat.sending}</td>
                             <td className="px-6 py-3.5 text-right">
                                 <span className={`font-mono text-xs font-bold px-2 py-1 rounded-md border ${
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