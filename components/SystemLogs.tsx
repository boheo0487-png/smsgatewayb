
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Activity, 
  AlertTriangle, 
  FileText, 
  Trash2, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  Settings2,
  Cpu,
  Layers,
  ChevronDown,
  Check,
  Search,
  Filter,
  Save,
  AlertCircle,
  ChevronRight,
  Sliders,
  Clock,
  Server,
  Database,
  ShieldCheck,
  Zap,
  X,
  Info,
  Lock,
  BarChart3,
  Terminal
} from './Icons';

// --- Shared UI Components ---

const Toggle: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <button 
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50 ${checked ? 'bg-primary-600' : 'bg-slate-200'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const ContentGroup: React.FC<{ 
  title: string; 
  children: React.ReactNode; 
  className?: string;
  action?: React.ReactNode;
}> = ({ title, children, className = "", action }) => (
  <div className={`space-y-3 ${className}`}>
    <div className="flex items-center justify-between px-1">
      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">{title}</h3>
      {action}
    </div>
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {children}
    </div>
  </div>
);

const SystemLogs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'files' | 'monitor'>('alerts');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // States for Monitor
  const [monitoringEnabled, setMonitoringEnabled] = useState(false);
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memUsage, setMemUsage] = useState(0);
  const [availableMemMB, setAvailableMemMB] = useState(128); 

  // Mock Process Data
  const [processes, setProcesses] = useState([
    { pid: '1201', name: 'sms-gateway-srv', mem: '12.4', cpu: '8.2' },
    { pid: '844', name: 'network-mgr', mem: '4.1', cpu: '1.5' },
    { pid: '102', name: 'system-watchdog', mem: '1.2', cpu: '0.5' },
    { pid: '2455', name: 'at-cmd-handler', mem: '18.5', cpu: '12.1' },
    { pid: '411', name: 'web-api-server', mem: '9.2', cpu: '2.4' },
  ]);

  // States for Log Settings
  const [logSettings, setLogSettings] = useState({
    maxFiles: 10,
    level: 'INFO',
    remoteEnabled: false,
    remoteServer: '10.0.0.50'
  });

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'critical', msg: '端口 M2 短信发送连续失败', time: '14:22:01', handled: false },
    { id: 2, type: 'warning', msg: 'CPU 占用率超过 85%', time: '14:15:33', handled: false },
    { id: 3, type: 'info', msg: '系统成功备份至云端', time: '12:00:12', handled: true },
    { id: 4, type: 'critical', msg: '检测到未经授权的后台尝试登录 (IP: 192.168.1.105)', time: '10:05:44', handled: false },
  ]);

  const [logFiles, setLogFiles] = useState([
    { name: 'sys_auth_20250520.log', size: '2.4 MB', date: '2025-05-20 10:00' },
    { name: 'gateway_traffic.log', size: '4.8 MB', date: '2025-05-20 09:30' },
    { name: 'debug_dump_01.tar.gz', size: '45.1 MB', date: '2025-05-19 23:15' },
    { name: 'at_commands_audit.log', size: '1.2 MB', date: '2025-05-19 21:05' },
    { name: 'sms_history_backup.log', size: '12.4 MB', date: '2025-05-18 15:40' },
  ]);

  useEffect(() => {
    if (!monitoringEnabled) {
      setCpuUsage(0);
      setMemUsage(0);
      return;
    }
    
    setCpuUsage(38);
    setMemUsage(55);

    const interval = setInterval(() => {
      setCpuUsage(p => Math.min(100, Math.max(0, p + (Math.random() * 6 - 3))));
      setMemUsage(p => Math.min(100, Math.max(0, p + (Math.random() * 2 - 1))));
      
      setProcesses(prev => prev.map(proc => ({
        ...proc,
        cpu: (parseFloat(proc.cpu) + (Math.random() * 2 - 1)).toFixed(1),
        mem: (parseFloat(proc.mem) + (Math.random() * 0.4 - 0.2)).toFixed(1)
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, [monitoringEnabled]);

  const resolveAlert = (id: number) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, handled: true } : a));
  };

  const handleRefreshLogs = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const activeAlertsCount = alerts.filter(a => !a.handled).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-enter pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">系统日志</h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">实时运行监控与业务审计日志</p>
        </div>
        <div className="flex gap-2 p-1.5 bg-slate-200/40 rounded-2xl w-fit border border-slate-200/60 backdrop-blur-sm">
          {[
            { id: 'alerts', label: '活动告警', icon: AlertTriangle, count: activeAlertsCount },
            { id: 'files', label: '日志文件', icon: FileText },
            { id: 'monitor', label: 'CPU & 内存', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative flex items-center gap-2.5 px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-white text-primary-600 shadow-md ring-1 ring-black/5' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/40'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center bg-rose-500 text-[10px] font-bold text-white rounded-full border-2 border-white shadow-sm animate-pulse">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content: Alerts */}
      {activeTab === 'alerts' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col lg:flex-row items-center gap-8 shadow-soft">
             <div className="flex items-center gap-4 shrink-0">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shadow-inner border border-emerald-100">
                   <Activity className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1">系统健康度</p>
                   <p className="text-xl font-black text-slate-800 tracking-tight">运行正常</p>
                </div>
             </div>

             <div className="h-12 w-px bg-slate-100 hidden lg:block"></div>

             <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                   <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-slate-500">处理器负载 (CPU)</span>
                      <span className="text-sm font-mono font-black text-slate-800">{monitoringEnabled ? `${cpuUsage.toFixed(0)}%` : '--'}</span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${cpuUsage}%` }} />
                   </div>
                </div>
                <div className="space-y-3">
                   <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-slate-500">物理内存使用 (MEM)</span>
                      <span className="text-sm font-mono font-black text-slate-800">{monitoringEnabled ? `${memUsage.toFixed(0)}%` : '--'}</span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full transition-all duration-1000 bg-emerald-500" style={{ width: `${memUsage}%` }} />
                   </div>
                </div>
             </div>
          </div>

          <ContentGroup title="未处理告警流水" action={<button className="text-xs font-bold text-primary-600 hover:underline">全部标记已读</button>}>
             <div className="divide-y divide-slate-100 min-h-[400px]">
                {alerts.filter(a => !a.handled).length === 0 ? (
                  <div className="py-24 flex flex-col items-center justify-center text-slate-400">
                     <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                        <CheckCircle2 className="w-10 h-10 text-emerald-200" />
                     </div>
                     <p className="text-sm font-bold text-slate-500">暂无活动告警消息</p>
                  </div>
                ) : (
                  alerts.filter(a => !a.handled).map(alert => (
                    <div key={alert.id} className="flex items-center justify-between p-8 hover:bg-slate-50/40 transition-colors group">
                       <div className="flex items-start gap-6">
                          <div className={`mt-1 p-3 rounded-2xl shrink-0 ${alert.type === 'critical' ? 'bg-rose-50 text-rose-500 shadow-sm shadow-rose-100' : 'bg-amber-50 text-amber-500 shadow-sm shadow-amber-100'}`}>
                            <AlertCircle className="w-6 h-6" />
                          </div>
                          <div className="space-y-2">
                             <div className="flex items-center gap-4">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${alert.type === 'critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                                  {alert.type === 'critical' ? 'CRITICAL' : 'WARNING'}
                                </span>
                                <span className="text-xs text-slate-400 font-mono font-medium flex items-center gap-2">
                                   <Clock className="w-3.5 h-3.5" /> {alert.time}
                                </span>
                             </div>
                             <p className="text-base font-bold text-slate-800 tracking-tight">{alert.msg}</p>
                          </div>
                       </div>
                       <button onClick={() => resolveAlert(alert.id)} className="opacity-0 group-hover:opacity-100 px-6 py-2.5 text-xs font-bold text-primary-600 bg-white border border-primary-200 rounded-xl hover:bg-primary-50 transition-all shadow-sm">
                         立即标记处理
                       </button>
                    </div>
                  ))
                )}
             </div>
          </ContentGroup>
        </div>
      )}

      {/* Tab Content: Monitor (CPU & Memory) */}
      {activeTab === 'monitor' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <ContentGroup title="监控引擎配置">
                <div className="p-8 space-y-8">
                  <div className="flex items-center justify-between bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <div className="space-y-1">
                      <label className="text-sm font-black text-slate-800">监控状态</label>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">启用后系统将实时采集资源数据</p>
                    </div>
                    <Toggle checked={monitoringEnabled} onChange={() => setMonitoringEnabled(!monitoringEnabled)} />
                  </div>

                  {monitoringEnabled ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <label className="text-sm font-black text-slate-800">内存预警值 (MB)</label>
                            <p className="text-[11px] text-slate-400 font-medium">当可用内存低于此阈值时触发上报</p>
                          </div>
                          <div className="flex items-center gap-2">
                             <input 
                                type="number" 
                                value={availableMemMB}
                                onChange={(e) => setAvailableMemMB(Number(e.target.value))}
                                className="w-24 px-3 py-2 bg-white border-2 border-slate-100 rounded-xl text-sm font-mono font-black text-primary-600 text-center focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                             />
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MB</span>
                          </div>
                        </div>
                        <input 
                           type="range" 
                           min="32" 
                           max="512" 
                           step="16"
                           value={availableMemMB} 
                           onChange={(e) => setAvailableMemMB(Number(e.target.value))}
                           className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary-600 shadow-inner"
                        />
                      </div>

                      <div className="p-5 bg-indigo-50/60 border border-indigo-100 rounded-2xl flex gap-4 items-start shadow-sm">
                         <div className="p-1.5 bg-white rounded-lg text-indigo-500 shadow-sm shrink-0">
                            <Zap className="w-4 h-4" />
                         </div>
                         <p className="text-[11px] text-indigo-700 leading-relaxed font-bold">
                           系统将自动捕获性能快照，并在触发阈值后的 <span className="underline">500ms</span> 内将数据包同步至远程服务器。
                         </p>
                      </div>

                      <button className="w-full btn-primary py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-3 shadow-xl shadow-primary-500/20 active:scale-[0.98] transition-all">
                        <Save className="w-5 h-5" /> 应用当前策略
                      </button>
                    </div>
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                       <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                          <Settings2 className="w-8 h-8" />
                       </div>
                       <p className="text-xs font-bold text-slate-400 max-w-[200px] leading-relaxed">
                         请先启用监控状态以解锁性能上报配置
                       </p>
                    </div>
                  )}
                </div>
              </ContentGroup>
            </div>

            <div className="lg:col-span-7">
               <ContentGroup title="资源实时指标流水">
                  <div className="p-8 h-full flex flex-col justify-between">
                     {monitoringEnabled ? (
                       <div className="space-y-12 animate-in fade-in duration-700">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                             <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                   <div className="flex items-center gap-4">
                                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm border border-indigo-100">
                                         <Cpu className="w-5 h-5" />
                                      </div>
                                      <span className="text-sm font-black text-slate-700">CPU 使用率</span>
                                   </div>
                                   <span className="text-2xl font-mono font-black text-indigo-600 tracking-tighter">{cpuUsage.toFixed(1)}%</span>
                                </div>
                                <div className="h-5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                                   <div className="h-full bg-indigo-500 transition-all duration-1000 ease-out" style={{ width: `${cpuUsage}%` }} />
                                </div>
                             </div>

                             <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                   <div className="flex items-center gap-4">
                                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shadow-sm border border-emerald-100">
                                         <Layers className="w-5 h-5" />
                                      </div>
                                      <span className="text-sm font-black text-slate-700">内存占用</span>
                                   </div>
                                   <span className="text-2xl font-mono font-black text-emerald-600 tracking-tighter">{memUsage.toFixed(1)}%</span>
                                </div>
                                <div className="h-5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                                   <div className="h-full bg-emerald-500 transition-all duration-1000 ease-out" style={{ width: `${memUsage}%` }} />
                                </div>
                             </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                             {[
                               { label: '已使用', value: `${(memUsage * 10.24).toFixed(1)} MB`, color: 'text-slate-800' },
                               { label: '空闲', value: `${((100 - memUsage) * 10.24).toFixed(1)} MB`, color: 'text-emerald-600' },
                               { label: '总量', value: '1,024 MB', color: 'text-slate-500' },
                               { label: '状态', value: 'ACTIVE', color: 'text-emerald-500', pulse: true }
                             ].map((item, idx) => (
                               <div key={idx} className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 space-y-2 shadow-sm">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                                  <div className="flex items-center gap-2">
                                     {item.pulse && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                                     <span className={`text-base font-black font-mono ${item.color}`}>{item.value}</span>
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                     ) : (
                       <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 animate-in fade-in duration-300">
                          <div className="p-8 bg-slate-50 rounded-full text-slate-200">
                             <Activity className="w-16 h-16" />
                          </div>
                          <div>
                             <h4 className="text-lg font-black text-slate-400">实时监控未启动</h4>
                             <p className="text-sm text-slate-300 font-medium mt-1">请从左侧面板开启监控以获取实时性能快照</p>
                          </div>
                       </div>
                     )}
                  </div>
               </ContentGroup>
            </div>
          </div>

          <ContentGroup title="核心系统进程流水 (Processes Monitoring)">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="bg-slate-50/50 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-100">
                         <th className="px-8 py-5">PID</th>
                         <th className="px-8 py-5">进程名称</th>
                         <th className="px-8 py-5 text-right">内存占有量 (%Mem)</th>
                         <th className="px-8 py-5 text-right">CPU 负载 (%CPU)</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 font-mono">
                      {processes.sort((a,b) => parseFloat(b.cpu) - parseFloat(a.cpu)).map((proc, i) => (
                        <tr key={proc.pid} className="hover:bg-slate-50/50 transition-colors duration-200">
                           <td className="px-8 py-5 text-xs text-slate-400 font-bold">{proc.pid}</td>
                           <td className="px-8 py-5 text-sm font-black text-slate-800">
                              <div className="flex items-center gap-3">
                                 <Terminal className="w-4 h-4 text-slate-300" />
                                 <span className="tracking-tight">{proc.name}</span>
                              </div>
                           </td>
                           <td className="px-8 py-5 text-sm text-right text-slate-600 font-black">{monitoringEnabled ? `${proc.mem}%` : '--'}</td>
                           <td className="px-8 py-5 text-sm text-right">
                              {monitoringEnabled ? (
                                 <span className={`px-3 py-1 rounded-xl font-black ${parseFloat(proc.cpu) > 10 ? 'bg-amber-100 text-amber-700 shadow-sm' : 'text-slate-600 bg-slate-100/50'}`}>
                                    {proc.cpu}%
                                 </span>
                              ) : <span className="text-slate-300">--</span>}
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </ContentGroup>
        </div>
      )}

      {/* Tab Content: Files */}
      {activeTab === 'files' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <ContentGroup 
            title="持久化业务与运行日志清单" 
            action={
              <div className="flex items-center gap-3">
                 <button 
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 text-[11px] font-black rounded-xl border border-primary-100 hover:bg-primary-100 transition-all shadow-sm"
                 >
                    <Settings2 className="w-4 h-4" />
                    日志设置
                 </button>
                 <div className="w-px h-4 bg-slate-200 mx-1"></div>
                 <button onClick={handleRefreshLogs} disabled={isRefreshing} className="p-2 text-slate-400 hover:text-primary-600 disabled:opacity-50">
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                 </button>
              </div>
            }
          >
             <div className="overflow-x-auto min-h-[500px]">
                <table className="w-full text-left">
                   <thead>
                      <tr className="bg-slate-50/50 text-[11px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">
                         <th className="px-8 py-5">日志文件名</th>
                         <th className="px-8 py-5">容量大小</th>
                         <th className="px-8 py-5">最后更新日期</th>
                         <th className="px-8 py-5 text-right">操作</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {logFiles.map((file, i) => (
                        <tr key={i} className="hover:bg-slate-50/40 transition-colors group">
                           <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                 <div className="p-2.5 bg-slate-100 text-slate-400 rounded-xl group-hover:text-primary-500 group-hover:bg-primary-50 transition-all">
                                    <FileText className="w-5 h-5" />
                                 </div>
                                 <span className="text-sm font-bold text-slate-800 tracking-tight">{file.name}</span>
                              </div>
                           </td>
                           <td className="px-8 py-5 text-xs font-mono font-bold text-slate-500">{file.size}</td>
                           <td className="px-8 py-5 text-xs text-slate-400 font-medium">{file.date}</td>
                           <td className="px-8 py-5 text-right">
                              <div className="flex justify-end gap-2">
                                 <button title="下载日志" className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100"><Download className="w-4 h-4" /></button>
                                 <button title="删除日志" className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100"><Trash2 className="w-4 h-4" /></button>
                              </div>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
             <div className="px-8 py-4 bg-slate-50/40 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">总计 {logFiles.length} 个文件 / 已占用约 65 MB</p>
                <div className="flex gap-2">
                   <button className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors">清空全部日志</button>
                </div>
             </div>
          </ContentGroup>
        </div>
      )}

      {/* Settings Modal - OPTIMIZED */}
      {isSettingsModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsSettingsModalOpen(false)}></div>
            <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg border border-white/60 animate-enter overflow-hidden flex flex-col">
                <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-4">
                         <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl shadow-sm border border-primary-100">
                            <Settings2 className="w-6 h-6" />
                         </div>
                         <div>
                             <h3 className="text-lg font-black text-slate-800 tracking-tight">日志设置</h3>
                             <p className="text-xs text-slate-500 font-medium">配置系统日志记录与远程转发参数</p>
                         </div>
                    </div>
                    <button onClick={() => setIsSettingsModalOpen(false)} className="p-2.5 rounded-2xl hover:bg-slate-200/50 text-slate-400 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-10 space-y-10 overflow-y-auto max-h-[70vh]">
                    <div className="space-y-8">
                       <div className="flex items-center gap-3">
                          <Database className="w-4 h-4 text-slate-400" />
                          <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">本地存储配置</h4>
                       </div>
                       
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          <div className="space-y-3">
                             <div className="flex justify-between items-center">
                                <label className="text-sm font-black text-slate-700">日志个数</label>
                             </div>
                             <div className="relative">
                                <input 
                                  type="number" 
                                  value={logSettings.maxFiles} 
                                  onChange={(e) => setLogSettings({...logSettings, maxFiles: parseInt(e.target.value)})} 
                                  className="w-full pl-5 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-black text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-inner" 
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest">PCS</div>
                             </div>
                             <p className="text-[10px] text-slate-400 font-bold italic px-1 flex items-center gap-1">
                                <Info className="w-3 h-3" /> 单个日志文件大小为 5MB
                             </p>
                          </div>
                          <div className="space-y-3">
                             <label className="text-sm font-black text-slate-700">日志等级</label>
                             <div className="relative">
                                <select 
                                  value={logSettings.level} 
                                  onChange={(e) => setLogSettings({...logSettings, level: e.target.value})} 
                                  className="w-full appearance-none pl-5 pr-10 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-black text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-inner"
                                >
                                   <option value="INFO">INFO (信息)</option>
                                   <option value="WARN">WARN (警告)</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 space-y-8">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <Server className="w-4 h-4 text-slate-400" />
                             <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">发送日志到服务</h4>
                          </div>
                          <Toggle checked={logSettings.remoteEnabled} onChange={() => setLogSettings({...logSettings, remoteEnabled: !logSettings.remoteEnabled})} />
                       </div>

                       {logSettings.remoteEnabled && (
                         <div className="space-y-3 animate-in slide-in-from-top-4 duration-400">
                            <label className="text-sm font-black text-slate-700">日志服务器地址</label>
                            <div className="relative group">
                               <input 
                                 type="text" 
                                 value={logSettings.remoteServer} 
                                 onChange={(e) => setLogSettings({...logSettings, remoteServer: e.target.value})} 
                                 placeholder="e.g. 192.168.1.100"
                                 className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-mono font-black text-slate-700 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all shadow-inner" 
                               />
                               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                 <Zap className="w-5 h-5" />
                               </div>
                            </div>
                         </div>
                       )}
                    </div>
                </div>

                <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4">
                    <button onClick={() => setIsSettingsModalOpen(false)} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">取消</button>
                    <button onClick={() => setIsSettingsModalOpen(false)} className="btn-primary px-10 py-3 rounded-2xl text-sm font-black shadow-xl shadow-primary-500/20 active:scale-95">保存设置</button>
                </div>
            </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default SystemLogs;
