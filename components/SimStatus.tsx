
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  List, 
  Zap, 
  RotateCcw, 
  Download, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  MinusCircle, 
  UserMinus, 
  PhoneCall, 
  ArrowLeftRight, 
  User, 
  Signal, 
  Wifi, 
  PlusCircle, 
  Circle,
  Smartphone,
  Check,
  Power,
  RefreshCw
} from './Icons';

type ViewMode = 'panel' | 'list' | 'led';

interface SimCardData {
  id: string;
  port: string;
  slot: string;
  duration: string;
  status: string;
  statusDesc: string;
  number: string;
  balance: string;
  balanceTime: string;
  operatorId: string;
  operatorName: string;
  networkType: string;
  signal: number;
}

const statusLegend = [
  { icon: Circle, color: 'text-slate-600', fill: 'bg-slate-600', label: '卡已插入' },
  { icon: PlusCircle, color: 'text-yellow-400', label: '卡注册中' },
  { icon: CheckCircle2, color: 'text-emerald-500', label: '卡已注册' },
  { icon: Circle, color: 'text-emerald-400', label: '正在呼叫', hollow: true },
  { icon: ArrowLeftRight, color: 'text-emerald-500', label: '互打设置' },
  { icon: User, color: 'text-yellow-400', label: '互打等待' },
  { icon: Signal, color: 'text-emerald-500', label: '访问数据流量' },
  { icon: Circle, color: 'text-yellow-400', fill: 'bg-yellow-400', label: '余额不足' },
  { icon: XCircle, color: 'text-rose-500', label: '注册失败' },
  { icon: MinusCircle, color: 'text-rose-500', label: '卡被锁定' },
  { icon: MinusCircle, color: 'text-slate-800', label: '用户锁卡' },
  { icon: XCircle, color: 'text-rose-400', label: '运营商锁卡', hollow: true },
  { icon: AlertCircle, color: 'text-rose-500', label: 'SIM故障' },
];

const mockSimData: SimCardData[] = [
  { id: '1', port: 'M1', slot: 'T1', duration: '120:03:19', status: 'failure', statusDesc: 'SIM故障', number: '-', balance: '0.00', balanceTime: '-', operatorId: '0', operatorName: '-', networkType: '未知', signal: 0 },
  { id: '2', port: 'M2', slot: 'T1', duration: '41:45:32', status: 'reg_fail', statusDesc: '注册失败', number: '12300010097', balance: '0.00', balanceTime: '-', operatorId: '101', operatorName: 'Weiron Network', networkType: '4G', signal: 99 },
  { id: '3', port: 'M3', slot: 'T1', duration: '-', status: 'idle', statusDesc: '-', number: '-', balance: '0.00', balanceTime: '-', operatorId: '0', operatorName: '-', networkType: '未知', signal: 0 },
  { id: '4', port: 'M4', slot: 'T1', duration: '41:45:47', status: 'reg_fail', statusDesc: '注册失败', number: '12300010006', balance: '0.00', balanceTime: '-', operatorId: '101', operatorName: 'Weiron Network', networkType: '4G', signal: 24 },
  { id: '5', port: 'M5', slot: 'T1', duration: '-', status: 'idle', statusDesc: '-', number: '-', balance: '0.00', balanceTime: '-', operatorId: '0', operatorName: '-', networkType: '未知', signal: 0 },
  { id: '6', port: 'M6', slot: 'T1', duration: '-', status: 'idle', statusDesc: '-', number: '-', balance: '0.00', balanceTime: '-', operatorId: '0', operatorName: '-', networkType: '未知', signal: 0 },
  { id: '7', port: 'M7', slot: 'T1', duration: '-', status: 'idle', statusDesc: '-', number: '-', balance: '0.00', balanceTime: '-', operatorId: '0', operatorName: '-', networkType: '未知', signal: 0 },
  { id: '8', port: 'M8', slot: 'T1', duration: '41:45:40', status: 'reg_fail', statusDesc: '注册失败', number: '12300010098', balance: '0.00', balanceTime: '-', operatorId: '101', operatorName: 'Weiron Network', networkType: '4G', signal: 99 },
];

const SimStatus: React.FC = () => {
  const [activeMode, setActiveMode] = useState<ViewMode>('panel');
  const [showBalance, setShowBalance] = useState(false);
  const [selectAllLocked, setSelectAllLocked] = useState(false);

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'failure': return <AlertCircle className="w-5 h-5 text-rose-500" />;
      case 'reg_fail': return <XCircle className="w-5 h-5 text-rose-500" />;
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'calling': return <Circle className="w-5 h-5 text-emerald-400" />;
      default: return <span className="text-slate-300">-</span>;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-enter max-w-[1600px] mx-auto">
      
      {/* 顶部标题与切换模式 */}
      <div className="flex-none mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">SIM 卡状态</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">监控全局插槽状态、网络注册质量及卡片业务数据</p>
          </div>
          
          <div className="flex p-1 bg-slate-200/50 rounded-xl border border-slate-200/60 backdrop-blur-sm shadow-inner">
             {[
               { id: 'panel', label: '面板模式', icon: LayoutDashboard },
               { id: 'list', label: '列表模式', icon: List },
               { id: 'led', label: 'LED控制面板', icon: Zap },
             ].map(mode => (
               <button
                 key={mode.id}
                 onClick={() => setActiveMode(mode.id as ViewMode)}
                 className={`flex items-center gap-2 px-6 py-2 text-xs font-black rounded-lg transition-all duration-300 ${
                   activeMode === mode.id 
                    ? 'bg-white text-primary-600 shadow-md ring-1 ring-black/5' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                 }`}
               >
                 <mode.icon className="w-3.5 h-3.5" />
                 {mode.label}
               </button>
             ))}
          </div>
        </div>
      </div>

      {/* 主体卡片容器 */}
      <div className="flex-1 flex flex-col glass-card rounded-2xl border border-white/60 shadow-soft overflow-hidden bg-white/60 relative">
        
        {/* 工具栏 */}
        <div className="flex-none px-6 py-4 bg-slate-50/50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             {activeMode === 'panel' && (
               <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-xs font-bold rounded-lg border border-slate-200 hover:border-primary-200 transition-all shadow-sm">
                 <RefreshCw className="w-3.5 h-3.5" /> 批量复位锁定的SIM
               </button>
             )}
             {activeMode === 'led' && (
               <div className="flex items-center gap-2">
                 <button className="flex items-center gap-2 px-4 py-2 bg-white text-emerald-600 text-xs font-bold rounded-lg border border-emerald-100 hover:bg-emerald-50 transition-all shadow-sm">
                   <Power className="w-3.5 h-3.5" /> 打开所有灯
                 </button>
                 <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-400 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
                   <Power className="w-3.5 h-3.5" /> 关闭所有灯
                 </button>
               </div>
             )}
             {activeMode === 'list' && (
               <div className="flex items-center gap-3">
                  <select className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-primary-500/20">
                    <option>显示当前</option>
                    <option>显示所有</option>
                  </select>
                  {/* 查询按钮已按要求移除，使用 select 自动触发或通过全局刷新 */}
                  <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 shadow-sm transition-all">
                    <Download className="w-3.5 h-3.5" /> 导出
                  </button>
               </div>
             )}
          </div>

          <div className="flex items-center gap-6">
             {activeMode === 'panel' && (
               <>
                <label className="flex items-center gap-2 cursor-pointer group">
                    <div 
                      onClick={() => setShowBalance(!showBalance)}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${showBalance ? 'bg-primary-600 border-primary-600' : 'bg-white border-slate-300'}`}
                    >
                      {showBalance && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                    </div>
                    <span className="text-xs font-bold text-slate-600">显示余额</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                    <div 
                      onClick={() => setSelectAllLocked(!selectAllLocked)}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${selectAllLocked ? 'bg-primary-600 border-primary-600' : 'bg-white border-slate-300'}`}
                    >
                      {selectAllLocked && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                    </div>
                    <span className="text-xs font-bold text-slate-600">全选锁定的SIM</span>
                </label>
               </>
             )}
          </div>
        </div>

        {/* 内容滚动区 */}
        <div className="flex-1 overflow-auto scroll-smooth">
          
          {/* 面板模式 & LED 面板的网格视图 */}
          {(activeMode === 'panel' || activeMode === 'led') && (
            <div className="p-8">
              <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                      <th className="w-24 py-3 px-4"></th>
                      {['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8'].map(m => (
                        <th key={m} className="py-3 px-4 text-xs font-black text-slate-500 uppercase tracking-widest border-l border-slate-100">{m}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-6 px-4 text-xs font-black text-slate-400">T1</td>
                      {mockSimData.map((sim) => (
                        <td key={sim.id} className="py-6 px-4 border-l border-slate-100">
                           <div className="flex flex-col items-center justify-center gap-2">
                              {activeMode === 'led' ? (
                                <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                                   <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                                </div>
                              ) : (
                                renderStatusIcon(sim.status)
                              )}
                              {showBalance && sim.balance !== '-' && (
                                <span className="text-[10px] font-mono font-bold text-emerald-600">${sim.balance}</span>
                              )}
                           </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 列表模式 */}
          {activeMode === 'list' && (
            <div className="overflow-x-auto min-w-[1200px]">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200">
                    <th className="px-6 py-4 w-12 text-center">
                       <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">终端(端口-卡槽号)</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">持续时间</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">状态</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">状态描述</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">号码</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">余额</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">运营商ID</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">运营商名</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">网络类型</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">信号值</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockSimData.map(sim => (
                    <tr key={sim.id} className="hover:bg-white/80 transition-all group">
                       <td className="px-6 py-4 text-center">
                         <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                       </td>
                       <td className="px-6 py-4 text-xs font-bold text-slate-700 font-mono">{sim.port}{sim.slot}</td>
                       <td className="px-6 py-4 text-xs font-mono text-slate-500">{sim.duration}</td>
                       <td className="px-6 py-4 flex justify-center">{renderStatusIcon(sim.status)}</td>
                       <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sim.statusDesc === 'SIM故障' || sim.statusDesc === '注册失败' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'text-slate-500'}`}>
                            {sim.statusDesc}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-xs font-mono font-medium text-slate-600">{sim.number}</td>
                       <td className="px-6 py-4 text-xs font-mono font-black text-emerald-600">{sim.balance}</td>
                       <td className="px-6 py-4 text-xs font-mono text-slate-400">{sim.operatorId}</td>
                       <td className="px-6 py-4 text-xs font-bold text-slate-700">{sim.operatorName}</td>
                       <td className="px-6 py-4 text-xs font-bold text-slate-500">{sim.networkType}</td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                             <div className="w-8 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full ${sim.signal > 50 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${sim.signal}%` }}></div>
                             </div>
                             <span className="text-xs font-mono font-bold text-slate-400">{sim.signal}</span>
                          </div>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 底部状态灯图例 */}
        <div className="flex-none p-6 bg-slate-50/80 border-t border-slate-100 backdrop-blur-md">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-4 bg-primary-500 rounded-full"></div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">状态灯图例</h3>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-y-4 gap-x-2">
              {statusLegend.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 group">
                   <div className={`p-1.5 rounded-lg bg-white shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow ${item.color}`}>
                      <item.icon className={`w-3.5 h-3.5 ${item.fill || ''} ${item.hollow ? 'stroke-[3px]' : 'fill-current'}`} />
                   </div>
                   <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">{item.label}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default SimStatus;
