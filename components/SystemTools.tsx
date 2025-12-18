
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Terminal, 
  Search, 
  Play, 
  Pause, 
  RefreshCw, 
  Download, 
  ShieldCheck, 
  Activity, 
  Zap, 
  Settings2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  ChevronDown,
  Info,
  X,
  PlayCircle,
  Save,
  Check,
  RotateCcw,
  AlertTriangle,
  Cpu,
  Layers,
  Smartphone,
  Server
} from './Icons';

// --- Shared UI Components ---

const StatusBadge: React.FC<{ type: 'success' | 'warning' | 'error' | 'neutral'; text: string }> = ({ type, text }) => {
  const styles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    error: 'bg-rose-50 text-rose-700 border-rose-100',
    neutral: 'bg-slate-50 text-slate-600 border-slate-100',
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-black uppercase tracking-wider ${styles[type]}`}>
      {text}
    </span>
  );
};

const Checkbox: React.FC<{ checked: boolean; onChange: () => void; label: string; sublabel?: string }> = ({ checked, onChange, label, sublabel }) => (
  <label className="flex items-center justify-between p-5 bg-slate-50/50 rounded-[20px] border border-slate-100 shadow-inner cursor-pointer hover:bg-slate-100/50 transition-colors">
    <div className="space-y-1">
      <span className="text-sm font-black text-slate-800">{label}</span>
      {sublabel && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">{sublabel}</p>}
    </div>
    <div className="relative">
      <input 
        type="checkbox" 
        className="sr-only" 
        checked={checked} 
        onChange={onChange} 
      />
      <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${checked ? 'bg-primary-600 border-primary-600 shadow-lg shadow-primary-500/20' : 'bg-white border-slate-300'}`}>
        {checked && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
      </div>
    </div>
  </label>
);

const ContentGroup: React.FC<{ 
  title: string; 
  children: React.ReactNode; 
  className?: string;
  action?: React.ReactNode;
}> = ({ title, children, className = "", action }) => (
  <div className={`space-y-4 ${className}`}>
    <div className="flex items-center justify-between px-1">
      <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">{title}</h3>
      {action}
    </div>
    <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
      {children}
    </div>
  </div>
);

const TerminalOutput: React.FC<{ lines: string[] }> = ({ lines }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div 
      ref={scrollRef}
      className="bg-slate-900 rounded-2xl p-6 font-mono text-sm text-emerald-400 h-[520px] overflow-y-auto shadow-inner border border-slate-800 scroll-smooth"
    >
      {lines.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2">
          <Terminal className="w-8 h-8 opacity-20" />
          <p className="text-xs font-bold uppercase tracking-widest">等待命令执行...</p>
        </div>
      ) : (
        lines.map((line, i) => (
          <div key={i} className="mb-1 leading-relaxed whitespace-pre-wrap">
            <span className="text-slate-500 mr-2">$</span>{line}
          </div>
        ))
      )}
    </div>
  );
};

// --- Main Tool Component ---

const SystemTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ping' | 'capture' | 'check'>('check');
  const [showAgingModal, setShowAgingModal] = useState(false);
  const [showResetImeiModal, setShowResetImeiModal] = useState(false);

  // Ping States
  const [pingConfig, setPingConfig] = useState({
    autoPing: false, host: '8.8.8.8', size: 56, count: 4, saveResult: false
  });
  const [isPingRunning, setIsPingRunning] = useState(false);
  const [pingLines, setPingLines] = useState<string[]>([]);
  const pingInterval = useRef<any>(null);

  // Capture States
  const [captureConfig, setCaptureConfig] = useState({
    autoCapture: false, host: '', port: 0, fileSize: 10
  });
  const [isCaptureRunning, setIsCaptureRunning] = useState(false);
  const [captureLines, setCaptureLines] = useState<string[]>([]);
  const captureInterval = useRef<any>(null);

  // Simulation Logic
  const startPing = () => {
    if (isPingRunning) return;
    setIsPingRunning(true);
    setPingLines([`PING ${pingConfig.host} (${pingConfig.size} data bytes)...`]);
    let currentCount = 0;
    pingInterval.current = setInterval(() => {
      currentCount++;
      const time = (Math.random() * 20 + 30).toFixed(2);
      setPingLines(prev => [...prev, `${pingConfig.size + 8} bytes from ${pingConfig.host}: icmp_seq=${currentCount} ttl=118 time=${time} ms`]);
      if (currentCount >= pingConfig.count && pingConfig.count !== 0) {
        clearInterval(pingInterval.current);
        setIsPingRunning(false);
      }
    }, 1000);
  };

  const startCapture = () => {
    setIsCaptureRunning(true);
    setCaptureLines(["tcpdump: listening on eth0, capture size 262144 bytes"]);
    captureInterval.current = setInterval(() => {
      const line = `${new Date().toLocaleTimeString()} IP 192.168.0.74.5521 > 10.0.0.1.80: Flags [S], seq ${Math.floor(Math.random() * 65535)}, win 65535`;
      setCaptureLines(prev => [...prev.slice(-100), line]);
    }, 400);
  };

  const handleConfirmAging = () => {
    setShowAgingModal(false);
    alert("老化测试已开始，设备即将重启。");
  };

  const handleConfirmResetImei = () => {
    setShowResetImeiModal(false);
    alert("IMEI重置指令已发送，设备即将自动重启。");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-enter pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-1">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">系统工具</h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">网络调试、协议抓包与系统全量自检中心</p>
        </div>
        <div className="flex gap-2 p-1.5 bg-slate-200/50 rounded-[20px] w-fit border border-white/50 shadow-inner backdrop-blur-sm">
          {[
            { id: 'ping', label: '网络拨测 (Ping)', icon: Activity },
            { id: 'capture', label: '网络抓包 (Dump)', icon: Zap },
            { id: 'check', label: '系统自检', icon: ShieldCheck }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative flex items-center gap-2.5 px-5 py-2.5 text-sm font-black rounded-[14px] transition-all duration-300 ${
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

      {activeTab === 'check' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
          
          {/* Action Bar - Top Level Progressive Disclosure */}
          <div className="flex items-center justify-between bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl text-sm font-black shadow-lg shadow-primary-500/20 active:scale-95 transition-all">
                   <ShieldCheck className="w-4 h-4" /> 开始自检
                </button>
                <button 
                  onClick={() => setShowAgingModal(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-black hover:bg-slate-200 active:scale-95 transition-all"
                >
                   <Clock className="w-4 h-4" /> 老化测试
                </button>
                <button 
                  onClick={() => setShowResetImeiModal(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-black hover:bg-slate-200 active:scale-95 transition-all"
                >
                   <RotateCcw className="w-4 h-4" /> 重置IMEI
                </button>
             </div>
             <div className="text-right">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">上次检查时间</span>
                <p className="text-xs font-bold text-slate-800">2025-12-15 14:30:22</p>
             </div>
          </div>

          {/* Group 1: Hardware Identity & Core Status */}
          <ContentGroup title="核心硬件状态 (System Status)">
             <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-8">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">设备ID</label>
                   <p className="text-sm font-mono font-black text-slate-800">0C5E1A82</p>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">模块型号</label>
                   <p className="text-sm font-mono font-black text-slate-800">EG91</p>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">固件版本</label>
                   <p className="text-sm font-mono font-black text-slate-800">20251215</p>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">软件版本</label>
                   <p className="text-sm font-mono font-black text-slate-800">1.37.27125</p>
                </div>
                
                <div className="space-y-1 flex items-center justify-between border-t border-slate-50 pt-4 lg:pt-0 lg:border-t-0">
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">老化状态</label>
                      <div className="mt-1"><StatusBadge type="neutral" text="未启用" /></div>
                   </div>
                </div>
                <div className="space-y-1 flex items-center justify-between border-t border-slate-50 pt-4 lg:pt-0 lg:border-t-0">
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">网管状态</label>
                      <div className="mt-1"><StatusBadge type="success" text="已连接" /></div>
                   </div>
                </div>
                <div className="space-y-1 border-t border-slate-50 pt-4 lg:pt-0 lg:border-t-0">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">最大端口/正常</label>
                   <p className="text-sm font-mono font-black text-rose-500">8 (7)</p>
                </div>
                <div className="space-y-1 border-t border-slate-50 pt-4 lg:pt-0 lg:border-t-0">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">最大卡槽/正常</label>
                   <p className="text-sm font-mono font-black text-rose-500">8 (3)</p>
                </div>

                {/* Secondary Info Grid */}
                <div className="col-span-full grid grid-cols-4 gap-8 pt-6 border-t border-slate-100">
                    {['XF1', 'XF3', 'XF4a', 'XF4b'].map((key, i) => (
                      <div key={key} className="space-y-1">
                        <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{key}</label>
                        <p className="text-xs font-mono font-bold text-slate-500">{i === 0 ? '25022301' : i === 1 ? '05032701' : '-'}</p>
                      </div>
                    ))}
                </div>
             </div>
          </ContentGroup>

          {/* Group 2: Tables for Detail Inspection */}
          <div className="grid grid-cols-1 gap-8">
             
             {/* Normal Insertion Board */}
             <ContentGroup title="正常插板列表 (Insertion Boards)">
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                            <th className="px-8 py-4">端口</th>
                            <th className="px-8 py-4">类型</th>
                            <th className="px-8 py-4">UID</th>
                            <th className="px-8 py-4 text-right">芯片版本号</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-mono">
                         {[
                           { port: '7', type: 'XP3M', uid: '82198C2A', ver: '05032701' },
                           { port: '16', type: 'XP1A', uid: '0C5E1A82', ver: '25022301' }
                         ].map((row, i) => (
                           <tr key={i} className="hover:bg-slate-50 transition-colors">
                              <td className="px-8 py-4 text-sm font-black text-slate-800">{row.port}</td>
                              <td className="px-8 py-4 text-xs font-bold text-primary-600 bg-primary-50/50 w-fit rounded-lg px-2 my-2 inline-block ml-8">{row.type}</td>
                              <td className="px-8 py-4 text-xs text-slate-500 font-bold">{row.uid}</td>
                              <td className="px-8 py-4 text-xs text-slate-500 text-right">{row.ver}</td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </ContentGroup>

             {/* Abnormal Port */}
             <ContentGroup title="异常端口状态监控 (Abnormal Ports)" action={<span className="text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100 uppercase tracking-widest">检测到 1 个异常</span>}>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                            <th className="px-8 py-4">端口</th>
                            <th className="px-8 py-4">当前终端</th>
                            <th className="px-8 py-4">模块型号</th>
                            <th className="px-8 py-4">状态</th>
                            <th className="px-8 py-4">描述</th>
                            <th className="px-8 py-4 text-right">信号值</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-mono">
                         <tr className="bg-rose-50/30 hover:bg-rose-50 transition-colors">
                            <td className="px-8 py-5 text-sm font-black text-rose-600">M2</td>
                            <td className="px-8 py-5 text-xs text-slate-500 font-bold">M2T1</td>
                            <td className="px-8 py-5 text-xs text-slate-400">EG91NAXGAR07A03M1G</td>
                            <td className="px-8 py-5"><PlayCircle className="w-4 h-4 text-primary-500" /></td>
                            <td className="px-8 py-5 text-xs font-bold text-slate-700">模块启用</td>
                            <td className="px-8 py-5 text-sm font-black text-rose-500 text-right">-112</td>
                         </tr>
                      </tbody>
                   </table>
                </div>
             </ContentGroup>

             {/* Abnormal Card */}
             <ContentGroup title="异常 SIM 卡监控 (Abnormal SIM Cards)" action={<span className="text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100 uppercase tracking-widest">检测到 1 个故障</span>}>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                            <th className="px-8 py-4">终端 (端口-卡槽号)</th>
                            <th className="px-8 py-4">状态</th>
                            <th className="px-8 py-4 text-right">状态描述</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-mono">
                         <tr className="bg-rose-50/30 hover:bg-rose-50 transition-colors">
                            <td className="px-8 py-5 text-sm font-black text-slate-800">M1T1</td>
                            <td className="px-8 py-5"><AlertTriangle className="w-4 h-4 text-rose-500" /></td>
                            <td className="px-8 py-5 text-xs font-bold text-rose-600 text-right uppercase tracking-widest">SIM 故障</td>
                         </tr>
                         {['M3T1', 'M5T1', 'M6T1', 'M7T1'].map(id => (
                           <tr key={id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-8 py-4 text-sm font-bold text-slate-400">{id}</td>
                              <td className="px-8 py-4 text-slate-200">--</td>
                              <td className="px-8 py-4 text-right text-slate-200">--</td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </ContentGroup>
          </div>
        </div>
      )}

      {/* Ping Tab */}
      {activeTab === 'ping' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-2 duration-400">
          <div className="lg:col-span-5 space-y-6">
            <ContentGroup title="Ping 拨测引擎配置">
              <div className="p-8 space-y-8">
                <Checkbox 
                  label="自动 Ping"
                  sublabel="设备开机后自动开始Ping"
                  checked={pingConfig.autoPing}
                  onChange={() => setPingConfig({...pingConfig, autoPing: !pingConfig.autoPing})}
                />
                <div className="space-y-6">
                  <div className="space-y-2.5 px-1">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">IP 地址</label>
                    <input 
                      type="text" 
                      value={pingConfig.host}
                      onChange={(e) => setPingConfig({...pingConfig, host: e.target.value})}
                      className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-[18px] text-base font-mono font-black text-slate-800 outline-none focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 transition-all shadow-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2.5 px-1">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">包大小</label>
                      <input type="number" value={pingConfig.size} className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-[18px] text-base font-mono font-black text-slate-800" />
                    </div>
                    <div className="space-y-2.5 px-1">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">包数量</label>
                      <input type="number" value={pingConfig.count} className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-[18px] text-base font-mono font-black text-slate-800" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => alert('已保存')} className="flex-1 py-4 bg-white border-2 border-slate-200 rounded-[18px] text-sm font-black text-slate-700 hover:bg-slate-50 active:scale-95 transition-all">保存配置</button>
                  <button 
                    onClick={isPingRunning ? () => setIsPingRunning(false) : startPing}
                    className={`flex-[2] py-4 rounded-[18px] text-sm font-black flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 ${isPingRunning ? 'bg-rose-500 text-white' : 'bg-primary-600 text-white'}`}
                  >
                    {isPingRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isPingRunning ? '停止 PING' : '开始 PING'}
                  </button>
                </div>
              </div>
            </ContentGroup>
          </div>
          <div className="lg:col-span-7">
            <ContentGroup title="ping结果输出" action={<button onClick={() => setPingLines([])} className="text-[11px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> 清空</button>}>
              <div className="p-4"><TerminalOutput lines={pingLines} /></div>
            </ContentGroup>
          </div>
        </div>
      )}

      {/* Capture Tab */}
      {activeTab === 'capture' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-2 duration-400">
           <div className="lg:col-span-5 space-y-6">
            <ContentGroup title="抓包引擎参数 (Tcpdump)">
              <div className="p-8 space-y-8">
                <Checkbox 
                  label="自动抓包"
                  sublabel="设备开机后自动开始抓包"
                  checked={captureConfig.autoCapture}
                  onChange={() => setCaptureConfig({...captureConfig, autoCapture: !captureConfig.autoCapture})}
                />
                <div className="space-y-6">
                  <div className="space-y-2.5 px-1">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">IP 地址</label>
                    <input type="text" placeholder="不限制抓包地址" className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-[18px] text-base font-mono font-black" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2.5 px-1">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">端口</label>
                      <input type="number" placeholder="0 表示所有" className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-[18px] text-base font-mono font-black" />
                    </div>
                    <div className="space-y-2.5 px-1">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">文件大小 (MB)</label>
                      <input type="number" defaultValue={10} className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-[18px] text-base font-mono font-black" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button className="flex-1 py-4 bg-white border-2 border-slate-200 rounded-[18px] text-sm font-black">保存</button>
                  <button 
                    onClick={isCaptureRunning ? () => setIsCaptureRunning(false) : startCapture}
                    className={`flex-[2] py-4 rounded-[18px] text-sm font-black flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 ${isCaptureRunning ? 'bg-rose-500 text-white' : 'bg-primary-600 text-white'}`}
                  >
                    {isCaptureRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isCaptureRunning ? '停止抓包' : '开始抓包'}
                  </button>
                </div>
              </div>
            </ContentGroup>
          </div>
          <div className="lg:col-span-7">
            <ContentGroup title="实时报文流" action={<button onClick={() => setCaptureLines([])} className="text-[11px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> 清空</button>}>
              <div className="p-4"><TerminalOutput lines={captureLines} /></div>
            </ContentGroup>
          </div>
        </div>
      )}

      {/* Aging Modal */}
      {showAgingModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setShowAgingModal(false)}></div>
            <div className="relative bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-full max-w-lg border border-slate-200/60 animate-enter overflow-hidden flex flex-col z-10 p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-8">
                    <div className="w-10 h-10 rounded-full bg-[#FFCC00] flex items-center justify-center shrink-0">
                        <span className="text-white text-2xl font-black">!</span>
                    </div>
                    <div className="flex-1 pt-1.5">
                        <p className="text-[15px] text-slate-700 font-medium leading-[1.6]">
                          老化是针对全部模块进行压测，以及修改网络模式为DHCP，设备稍后会重启一次
                        </p>
                    </div>
                </div>
                
                <div className="flex justify-end items-center gap-3 mt-2">
                    <button 
                        onClick={() => setShowAgingModal(false)}
                        className="px-6 py-2 rounded-lg bg-[#F0F0F0] text-[#7F8C8D] text-[15px] font-bold hover:bg-slate-200 transition-colors"
                    >
                        取消
                    </button>
                    <button 
                        onClick={handleConfirmAging}
                        className="px-6 py-2 rounded-lg bg-[#007AFF] text-white text-[15px] font-bold hover:bg-blue-600 transition-colors shadow-sm"
                    >
                        确定
                    </button>
                </div>
            </div>
        </div>,
        document.body
      )}

      {/* Reset IMEI Modal */}
      {showResetImeiModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setShowResetImeiModal(false)}></div>
            <div className="relative bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-full max-w-lg border border-slate-200/60 animate-enter overflow-hidden flex flex-col z-10 p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-8">
                    <div className="w-10 h-10 rounded-full bg-[#FFCC00] flex items-center justify-center shrink-0">
                        <span className="text-white text-2xl font-black">!</span>
                    </div>
                    <div className="flex-1 pt-1.5">
                        <p className="text-[15px] text-slate-700 font-medium leading-[1.6]">
                          全部模块的原始IMEI将被重置,重置完成后将会自动重启
                        </p>
                    </div>
                </div>
                
                <div className="flex justify-end items-center gap-3 mt-2">
                    <button 
                        onClick={() => setShowResetImeiModal(false)}
                        className="px-6 py-2 rounded-lg bg-[#F0F0F0] text-[#7F8C8D] text-[15px] font-bold hover:bg-slate-200 transition-colors"
                    >
                        取消
                    </button>
                    <button 
                        onClick={handleConfirmResetImei}
                        className="px-6 py-2 rounded-lg bg-[#007AFF] text-white text-[15px] font-bold hover:bg-blue-600 transition-colors shadow-sm"
                    >
                        确定
                    </button>
                </div>
            </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default SystemTools;
