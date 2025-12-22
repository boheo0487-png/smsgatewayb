
import React from 'react';
import { Link } from 'react-router-dom';
import StatCard from './StatCard';
import { VolumeChart } from './Charts';
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
  MessageSquare,
  Zap,
  Clock,
  Cpu
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
           <div className="flex items-center gap-3 mt-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 w-fit">
             <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
             </span>
             <p className="text-xs font-bold uppercase tracking-wider">Telarvo 网关在线 - 运行中</p>
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

      {/* 实时趋势与资源监控 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* 发送趋势图 */}
          <div className="xl:col-span-2 glass-card rounded-[2rem] p-8 border border-white/60 shadow-soft bg-white/40">
              <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl">
                          <BarChart3 className="w-6 h-6" />
                      </div>
                      <div>
                          <h3 className="text-lg font-black text-slate-800 tracking-tight">流量实时监控</h3>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">SMS Traffic Analysis</p>
                      </div>
                  </div>
                  <div className="flex gap-2">
                      <span className="px-3 py-1 bg-primary-50 text-primary-700 text-[10px] font-black rounded-lg">LIVE</span>
                  </div>
              </div>
              <VolumeChart />
          </div>

          {/* 设备关键状态 */}
          <div className="glass-card rounded-[2rem] p-8 border border-white/60 shadow-soft bg-slate-900 text-white relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                  <Cpu className="w-48 h-48" />
              </div>
              <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
                          <Server className="w-6 h-6 text-primary-400" />
                      </div>
                      <h3 className="text-lg font-black tracking-tight">硬件健康度</h3>
                  </div>

                  <div className="space-y-6">
                      <div className="space-y-2">
                          <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                              <span>CPU 负载</span>
                              <span className="text-indigo-400">32%</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden shadow-inner">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: '32%' }}></div>
                          </div>
                      </div>
                      <div className="space-y-2">
                          <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                              <span>内存占用</span>
                              <span className="text-emerald-400">48%</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden shadow-inner">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '48%' }}></div>
                          </div>
                      </div>
                      <div className="space-y-2">
                          <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                              <span>存储空间</span>
                              <span className="text-amber-400">75%</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden shadow-inner">
                              <div className="h-full bg-amber-500 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                      </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between text-sm font-bold">
                          <span className="text-slate-400">运行时长</span>
                          <span className="font-mono">15d 04h 22m</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* 业务细节表格 */}
      <div className="glass-card rounded-[2rem] overflow-hidden shadow-soft border border-white/60 bg-white/60">
         <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white/40">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">终端业务详情</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Terminal SMS Performance</p>
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
