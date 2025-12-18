
import React, { useState, useEffect } from 'react';
import { 
  Power, 
  RotateCcw, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  X,
  RefreshCw,
  Server,
  ChevronRight,
  Calendar,
  Save,
  Info,
  Settings2
} from './Icons';
import { createPortal } from 'react-dom';

const Toggle: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <button 
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50 ${checked ? 'bg-primary-600' : 'bg-slate-200'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const SystemReboot: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRebooting, setIsRebooting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // 重启配置状态 - 默认全部关闭
  const [autoReboot, setAutoReboot] = useState({
    enabled: false,
    days: 7,
  });
  const [scheduledReboot, setScheduledReboot] = useState({
    enabled: false,
    time: '04:00',
  });

  const handleStartReboot = () => {
    setIsModalOpen(false);
    setIsRebooting(true);
    setProgress(0);
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    // 模拟API保存
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  useEffect(() => {
    if (isRebooting) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsRebooting(false);
              setProgress(0);
            }, 1000);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isRebooting]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-enter pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-1 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">系统重启</h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">维护设备运行状态，应用底层系统更改</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-black rounded-2xl shadow-xl shadow-primary-500/20 transition-all disabled:opacity-50 active:scale-95"
          >
             {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
             {isSaving ? '正在保存...' : '保存策略配置'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Actions and Settings */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Settings Card */}
          <div className="glass-card bg-white rounded-[32px] border border-slate-200 shadow-soft overflow-hidden">
             <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/30">
                <Settings2 className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-black text-slate-800 tracking-tight">重启维护设置</h3>
             </div>

             <div className="p-8 space-y-12">
                {/* 自动重启 Section */}
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm border border-indigo-100">
                            <RotateCcw className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-base font-black text-slate-800 tracking-tight">自动重启</p>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Auto Optimization Cycle</p>
                         </div>
                      </div>
                      <Toggle 
                        checked={autoReboot.enabled} 
                        onChange={() => setAutoReboot(prev => ({ ...prev, enabled: !prev.enabled }))} 
                      />
                   </div>

                   {autoReboot.enabled && (
                     <div className="pl-16 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-4 p-5 bg-slate-50/80 border border-slate-200 rounded-[24px] w-fit shadow-inner">
                           <span className="text-sm font-bold text-slate-600">设备运行一段时间（天）后自动重启</span>
                           <div className="flex items-center gap-3 ml-2">
                              <input 
                                type="number" 
                                min="1" 
                                max="365"
                                value={autoReboot.days}
                                onChange={(e) => setAutoReboot(prev => ({ ...prev, days: parseInt(e.target.value) || 1 }))}
                                className="w-20 px-3 py-2 bg-white border-2 border-slate-100 rounded-xl text-center font-mono font-black text-primary-600 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                              />
                              <span className="text-sm font-black text-slate-400">天</span>
                           </div>
                        </div>
                     </div>
                   )}
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent"></div>

                {/* 定时重启 Section */}
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shadow-sm border border-emerald-100">
                            <Clock className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-base font-black text-slate-800 tracking-tight">定时重启</p>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Scheduled Daily Maintenance</p>
                         </div>
                      </div>
                      <Toggle 
                        checked={scheduledReboot.enabled} 
                        onChange={() => setScheduledReboot(prev => ({ ...prev, enabled: !prev.enabled }))} 
                      />
                   </div>

                   {scheduledReboot.enabled && (
                     <div className="pl-16 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
                        {/* Time Selection */}
                        <div className="space-y-4">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5" /> 选择当天的时间段执行 (每日循环)
                           </p>
                           <div className="flex items-center gap-5">
                              <div className="relative group">
                                 <input 
                                   type="time" 
                                   value={scheduledReboot.time}
                                   onChange={(e) => setScheduledReboot(prev => ({ ...prev, time: e.target.value }))}
                                   className="px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-base font-mono font-black text-slate-800 outline-none focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 transition-all shadow-inner"
                                 />
                                 <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent group-hover:border-slate-300 transition-all"></div>
                              </div>
                              <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                                 <span className="text-xs font-bold text-slate-500">
                                   将在每日的 <span className="text-slate-800 font-black">{scheduledReboot.time}</span> 自动重启
                                 </span>
                              </div>
                           </div>
                        </div>
                     </div>
                   )}
                </div>
             </div>
          </div>

          {/* Warning / Immediate Action Card */}
          <div className="glass-card bg-amber-50/30 p-8 rounded-[32px] border border-amber-200/50 shadow-sm flex flex-col md:flex-row items-center gap-8">
               <div className="flex items-start gap-5">
                  <div className="p-3.5 bg-white text-amber-500 rounded-2xl shadow-sm border border-amber-100 shrink-0">
                     <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                     <h3 className="text-lg font-black text-slate-800 tracking-tight leading-none">需要立即重启？</h3>
                     <p className="text-sm text-slate-500 leading-relaxed font-medium">
                       手动重启将立即断开所有服务并重置硬件状态。请确保当前没有紧急任务正在运行。
                     </p>
                  </div>
               </div>

               <button 
                 onClick={() => setIsModalOpen(true)}
                 className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 hover:bg-black text-white rounded-[22px] transition-all group shadow-xl hover:shadow-2xl active:scale-[0.98] shrink-0"
               >
                  <Power className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                  <span className="font-black text-sm tracking-wide">执行强制重启</span>
               </button>
          </div>
        </div>

        {/* Right Side: System Stats */}
        <div className="lg:col-span-5 space-y-6">
           {/* Current Node Status */}
           <div className="glass-card bg-slate-900 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden group h-fit">
              <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                 <Server className="w-32 h-32" />
              </div>
              
              <div className="relative z-10 space-y-8">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">当前节点状态</p>
                    <h4 className="text-2xl font-black tracking-tight flex items-center gap-3">
                       Telarvo-GW-01
                       <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]"></span>
                    </h4>
                 </div>

                 <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4 group/row">
                       <span className="text-sm font-bold text-slate-400 group-hover/row:text-slate-200 transition-colors">运行时间 (Uptime)</span>
                       <span className="text-sm font-mono font-black">24天 12小时 08分</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-4 group/row">
                       <span className="text-sm font-bold text-slate-400 group-hover/row:text-slate-200 transition-colors">端口负荷 (Load)</span>
                       <span className="text-sm font-mono font-black text-emerald-400">12 / 16 在线</span>
                    </div>
                    <div className="flex justify-between items-center group/row">
                       <span className="text-sm font-bold text-slate-400 group-hover/row:text-slate-200 transition-colors">内存压力 (Memory)</span>
                       <span className="text-sm font-mono font-black text-indigo-400">32% - 正常</span>
                    </div>
                 </div>

                 <div className="pt-2">
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
                       <p className="text-[12px] text-slate-300 font-medium leading-relaxed">
                         定期重启可以有效释放系统资源并重载硬件模块。建议业务低峰期执行每日维护操作。
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-md border border-white/60 animate-enter overflow-hidden z-10">
                <div className="p-10 text-center space-y-6">
                    <div className="mx-auto w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center shadow-inner border border-rose-100">
                        <RotateCcw className="w-10 h-10 animate-spin-slow text-rose-500/80" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">确认立即重启系统？</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                          当前所有短信发送端口和网络服务都将被中断。
                          此过程大约耗时 2 分钟，确认执行吗？
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="py-4 text-sm font-black text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all"
                        >
                            取消操作
                        </button>
                        <button 
                            onClick={handleStartReboot}
                            className="py-4 text-sm font-black text-white bg-rose-600 hover:bg-rose-700 rounded-2xl shadow-xl shadow-rose-500/20 active:scale-95 transition-all"
                        >
                            确认重启
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
      )}

      {/* Rebooting Status Overlay */}
      {isRebooting && createPortal(
        <div className="fixed inset-0 z-[110] bg-slate-900 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
               <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-[160px] animate-pulse"></div>
               <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-[160px] animate-pulse delay-700"></div>
            </div>

            <div className="relative z-10 space-y-12 max-w-sm w-full">
               <div className="relative mx-auto w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-white/10"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={377}
                      strokeDashoffset={377 - (377 * progress) / 100}
                      strokeLinecap="round"
                      className="text-primary-500 transition-all duration-300 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <RefreshCw className="w-10 h-10 text-white animate-spin" />
                  </div>
               </div>

               <div className="space-y-4">
                  <h2 className="text-3xl font-black text-white tracking-tight">正在重启网关系统</h2>
                  <div className="space-y-2">
                     <p className="text-slate-400 text-sm font-medium">正在安全断开硬件模块并同步存储数据...</p>
                     <p className="text-primary-400 text-xs font-mono font-bold tracking-widest uppercase">
                        INITIALIZING BOOT SEQUENCE: {progress}%
                     </p>
                  </div>
               </div>

               <div className="pt-8 flex justify-center">
                  <div className="flex gap-1.5">
                     {[0, 1, 2].map((i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce`} style={{ animationDelay: `${i * 0.15}s` }}></div>
                     ))}
                  </div>
               </div>
            </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default SystemReboot;
