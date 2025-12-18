
import React, { useState } from 'react';
import { 
  Terminal, 
  Send, 
  Trash2, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Search,
  Zap,
  Cpu,
  Smartphone,
  Check,
  X,
  Plus
} from './Icons';

interface AtResult {
  id: string;
  terminal: string;
  status: 'success' | 'failed' | 'pending' | 'idle';
  content: string;
  timestamp: string;
}

const AtCommandManagement: React.FC = () => {
  const ports = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8'];
  const [selectedPorts, setSelectedPorts] = useState<string[]>([]);
  const [command, setCommand] = useState('');
  const [results, setResults] = useState<AtResult[]>([
    { id: '1', terminal: 'M1T1', status: 'failed', content: 'ERROR: Timeout', timestamp: '14:30:05' },
    { id: '2', terminal: 'M2T1', status: 'success', content: 'OK', timestamp: '14:30:04' },
    { id: '3', terminal: 'M3T1', status: 'idle', content: '-', timestamp: '-' },
    { id: '4', terminal: 'M4T1', status: 'success', content: '+CPIN: READY', timestamp: '14:29:55' },
    { id: '5', terminal: 'M5T1', status: 'idle', content: '-', timestamp: '-' },
    { id: '6', terminal: 'M6T1', status: 'idle', content: '-', timestamp: '-' },
    { id: '7', terminal: 'M7T1', status: 'idle', content: '-', timestamp: '-' },
    { id: '8', terminal: 'M8T1', status: 'success', content: 'OK', timestamp: '14:28:10' },
  ]);
  const [isSending, setIsSending] = useState(false);

  const toggleAll = () => {
    if (selectedPorts.length === ports.length) {
      setSelectedPorts([]);
    } else {
      setSelectedPorts([...ports]);
    }
  };

  const togglePort = (port: string) => {
    setSelectedPorts(prev => 
      prev.includes(port) ? prev.filter(p => p !== port) : [...prev, port]
    );
  };

  const handleSend = () => {
    if (!command || selectedPorts.length === 0) return;
    setIsSending(true);
    // 模拟发送过程
    setTimeout(() => {
      setIsSending(false);
      setResults(prev => prev.map(res => {
          const port = res.terminal.substring(0, 2);
          if (selectedPorts.includes(port)) {
              return { ...res, status: 'success', content: 'OK', timestamp: new Date().toLocaleTimeString() };
          }
          return res;
      }));
    }, 1500);
  };

  const clearResults = () => {
    setResults(results.map(r => ({ ...r, status: 'idle', content: '-', timestamp: '-' })));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-enter max-w-[1600px] mx-auto relative pb-8">
      
      {/* 页头标题区 (与其他页面保持一致) */}
      <div className="flex-none mb-6 px-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">AT 指令</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">直接向蜂窝模块发送标准化指令以执行底层操作或诊断硬件状态</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-1">
        {/* 顶部指令编辑区 */}
        <div className="glass-card rounded-[24px] p-8 border border-white/60 shadow-soft bg-white/40 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary-50 text-primary-600 rounded-xl">
                  <Terminal className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">指令编辑器</h2>
          </div>

          <div className="space-y-8 max-w-4xl">
              {/* 端口选择 */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                  <div className="sm:col-span-2 pt-1">
                      <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">选择端口</span>
                  </div>
                  <div className="sm:col-span-10">
                      <div className="flex flex-wrap gap-x-6 gap-y-4">
                          <label className="flex items-center gap-3 cursor-pointer group">
                              <div 
                                  onClick={toggleAll}
                                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedPorts.length === ports.length ? 'bg-primary-600 border-primary-600' : 'bg-white border-slate-300 group-hover:border-primary-400'}`}
                              >
                                  {selectedPorts.length === ports.length && <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
                              </div>
                              <span className="text-sm font-black text-slate-700">All</span>
                          </label>
                          
                          <div className="w-px h-5 bg-slate-200 hidden sm:block"></div>

                          {ports.map(port => (
                              <label key={port} className="flex items-center gap-3 cursor-pointer group">
                                  <div 
                                      onClick={() => togglePort(port)}
                                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedPorts.includes(port) ? 'bg-primary-600 border-primary-600' : 'bg-white border-slate-300 group-hover:border-primary-400'}`}
                                  >
                                      {selectedPorts.includes(port) && <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
                                  </div>
                                  <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">{port}</span>
                              </label>
                          ))}
                      </div>
                  </div>
              </div>

              {/* 指令输入 */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-2">
                      <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">AT指令内容</span>
                  </div>
                  <div className="sm:col-span-8">
                      <div className="relative group">
                          <input 
                              type="text" 
                              value={command}
                              onChange={(e) => setCommand(e.target.value)}
                              placeholder="请输入 AT 指令，例如: AT+CPIN?"
                              className="w-full px-5 py-4 bg-white/50 border-2 border-slate-100 rounded-2xl text-base font-mono font-bold text-slate-700 focus:outline-none focus:border-primary-500 focus:bg-white transition-all shadow-inner group-hover:border-slate-200"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest pointer-events-none group-focus-within:opacity-0">Standard Format</div>
                      </div>
                  </div>
              </div>

              {/* 发送按钮 */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-start-3 sm:col-span-10">
                      <button 
                          onClick={handleSend}
                          disabled={isSending || !command || selectedPorts.length === 0}
                          className="btn-primary flex items-center gap-3 px-10 py-4 rounded-2xl text-sm font-black shadow-xl shadow-primary-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                      >
                          {isSending ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                          {isSending ? '正在发送指令...' : '立即发送指令'}
                      </button>
                  </div>
              </div>
          </div>
        </div>

        {/* 底部结果列表 */}
        <div className="glass-card rounded-[24px] overflow-hidden border border-white/60 shadow-soft bg-white/60 flex flex-col">
            {/* 工具栏 */}
            <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white/40 backdrop-blur-sm">
               <div className="flex items-center gap-3">
                   <div className="p-2 bg-slate-100 text-slate-500 rounded-xl">
                      <Zap className="w-4 h-4" />
                   </div>
                   <span className="text-sm font-black text-slate-700 uppercase tracking-wider">指令执行监控</span>
               </div>
               <div className="flex items-center gap-2">
                  <button 
                    onClick={clearResults}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm"
                  >
                      <Trash2 className="w-3.5 h-3.5" />
                      清空记录
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
                      <Download className="w-3.5 h-3.5" />
                      导出审计
                  </button>
               </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                   <thead>
                       <tr className="bg-slate-50/50 border-b border-slate-100">
                           <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">终端 (端口-卡槽号)</th>
                           <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">执行状态</th>
                           <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">响应内容</th>
                           <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">时间戳</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                       {results.map((res) => (
                           <tr key={res.id} className="hover:bg-white/80 transition-colors group">
                               <td className="px-8 py-4">
                                   <div className="flex items-center gap-3">
                                       <div className={`w-2 h-2 rounded-full ${res.status === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : res.status === 'failed' ? 'bg-rose-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                       <span className="text-sm font-bold text-slate-700 font-mono tracking-tight">{res.terminal}</span>
                                   </div>
                               </td>
                               <td className="px-8 py-4">
                                   <div className="flex justify-center">
                                       {res.status === 'success' ? (
                                           <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                       ) : res.status === 'failed' ? (
                                           <AlertCircle className="w-5 h-5 text-rose-500" />
                                       ) : res.status === 'pending' ? (
                                           <RefreshCw className="w-5 h-5 text-primary-500 animate-spin" />
                                       ) : (
                                           <div className="w-5 h-5 rounded-full border-2 border-slate-200 border-dashed"></div>
                                       )}
                                   </div>
                               </td>
                               <td className="px-8 py-4">
                                   <div className="flex items-center gap-2">
                                       <span className={`text-xs font-mono font-medium px-2 py-1 rounded border ${
                                           res.status === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                           res.status === 'failed' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                           'bg-slate-50 text-slate-400 border-slate-100'
                                       }`}>
                                           {res.content}
                                       </span>
                                   </div>
                               </td>
                               <td className="px-8 py-4 text-right">
                                   <span className="text-xs font-mono text-slate-400 font-medium">{res.timestamp}</span>
                                finish
                               </td>
                           </tr>
                       ))}
                   </tbody>
               </table>
            </div>
            
            <div className="px-8 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    实时监控处于活跃状态 - 总计 {results.length} 个终端
                </p>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Service Online</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AtCommandManagement;
