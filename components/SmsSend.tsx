
import React, { useState } from 'react';
import { 
  Send, 
  Users, 
  FileText, 
  CheckCircle2, 
  RefreshCw, 
  Trash2,
  LayoutGrid,
  Activity,
  Clock,
  Zap,
  Download,
  XCircle,
  Smartphone,
  ChevronRight,
  Filter
} from './Icons';

type TabType = 'send' | 'test';

interface PortStatus {
  id: string;
  name: string;
  terminal: string;
  status: 'online' | 'busy' | 'offline';
}

interface TestRow {
  terminal: string;
  sentCount: number;
  successCount: number;
  deliveredCount: number;
  timeoutCount: number;
  senderNum: string;
  receiverNum: string;
  deliveredTime: string;
}

const SmsSend: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('send');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // --- 发送短信状态 ---
  const [selectedPorts, setSelectedPorts] = useState<string[]>(['M1']);
  const [recipients, setRecipients] = useState('');
  const [content, setContent] = useState('');
  const [autoSendEnabled, setAutoSendEnabled] = useState(false);
  const [minMinutes, setMinMinutes] = useState('1');
  const [maxMinutes, setMaxMinutes] = useState('5');
  
  // --- 端口测试状态 ---
  const [testSendPorts, setTestSendPorts] = useState<string[]>(['M1']);
  const [testRecvPorts, setTestRecvPorts] = useState<string[]>(['M2']);
  const [testContent, setTestContent] = useState('Port Connectivity Test');
  const [testTimeout, setTestTimeout] = useState('30');
  const [testCount, setTestCount] = useState('1');
  
  const availablePorts: PortStatus[] = [
    { id: 'M1', name: 'M1', terminal: 'T1', status: 'online' },
    { id: 'M2', name: 'M2', terminal: 'T1', status: 'online' },
    { id: 'M3', name: 'M3', terminal: 'T1', status: 'busy' },
    { id: 'M4', name: 'M4', terminal: 'T1', status: 'online' },
    { id: 'M5', name: 'M5', terminal: 'T1', status: 'offline' },
    { id: 'M6', name: 'M6', terminal: 'T1', status: 'online' },
    { id: 'M7', name: 'M7', terminal: 'T1', status: 'online' },
    { id: 'M8', name: 'M8', terminal: 'T1', status: 'online' },
  ];

  // 模拟测试结果数据
  const [testData, setTestData] = useState<TestRow[]>([
    { terminal: 'M1T1', sentCount: 0, successCount: 0, deliveredCount: 0, timeoutCount: 0, senderNum: '', receiverNum: '', deliveredTime: '' },
    { terminal: 'M2T1', sentCount: 0, successCount: 0, deliveredCount: 0, timeoutCount: 0, senderNum: '', receiverNum: '', deliveredTime: '' },
    { terminal: 'M3T1', sentCount: 0, successCount: 0, deliveredCount: 0, timeoutCount: 0, senderNum: '', receiverNum: '', deliveredTime: '' },
    { terminal: 'M4T1', sentCount: 0, successCount: 0, deliveredCount: 0, timeoutCount: 0, senderNum: '', receiverNum: '', deliveredTime: '' },
    { terminal: 'M5T1', sentCount: 0, successCount: 0, deliveredCount: 0, timeoutCount: 0, senderNum: '', receiverNum: '', deliveredTime: '' },
    { terminal: 'M6T1', sentCount: 0, successCount: 0, deliveredCount: 0, timeoutCount: 0, senderNum: '', receiverNum: '', deliveredTime: '' },
    { terminal: 'M7T1', sentCount: 0, successCount: 0, deliveredCount: 0, timeoutCount: 0, senderNum: '', receiverNum: '', deliveredTime: '' },
    { terminal: 'M8T1', sentCount: 0, successCount: 0, deliveredCount: 0, timeoutCount: 0, senderNum: '', receiverNum: '', deliveredTime: '' },
  ]);

  const handleAction = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (activeTab === 'send') {
        alert(autoSendEnabled ? "自动发送策略已激活" : "任务已加入队列");
      } else {
        setTestData(prev => prev.map((row, i) => i < 3 ? {
          ...row,
          sentCount: 1,
          successCount: 1,
          deliveredCount: 1,
          timeoutCount: 0,
          senderNum: '1380013800'+i,
          receiverNum: '1390013900'+i,
          deliveredTime: new Date().toLocaleTimeString()
        } : row));
        alert("端口拨测已完成");
      }
    }, 1500);
  };

  const totals = testData.reduce((acc, row) => ({
    sent: acc.sent + row.sentCount,
    success: acc.success + row.successCount,
    delivered: acc.delivered + row.deliveredCount,
    timeout: acc.timeout + row.timeoutCount,
  }), { sent: 0, success: 0, delivered: 0, timeout: 0 });

  const PortPicker = ({ 
    selected, 
    onToggle, 
    onSelectAll, 
    label 
  }: { 
    selected: string[], 
    onToggle: (id: string) => void, 
    onSelectAll: (all: boolean) => void,
    label: string 
  }) => {
    const onlinePorts = availablePorts.filter(p => p.status !== 'offline');
    const isAllSelected = onlinePorts.every(p => selected.includes(p.id));

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
          <button 
            onClick={() => onSelectAll(!isAllSelected)}
            className="text-[10px] font-black text-primary-600 hover:text-primary-700 transition-colors uppercase tracking-widest"
          >
            {isAllSelected ? '取消全选' : '全选端口'}
          </button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {availablePorts.map(port => (
            <button
              key={port.id}
              disabled={port.status === 'offline'}
              onClick={() => onToggle(port.id)}
              className={`flex flex-col p-2 rounded-xl border-2 transition-all text-center relative overflow-hidden ${
                selected.includes(port.id) 
                  ? 'border-primary-500 bg-primary-50/50' 
                  : 'border-slate-100 bg-white hover:border-slate-200'
              } ${port.status === 'offline' ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
            >
              <span className="text-xs font-black text-slate-700">{port.name}</span>
              {selected.includes(port.id) && (
                <div className="absolute right-0 top-0 bg-primary-500 text-white p-0.5 rounded-bl-md">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const handleToggleAll = (setFn: React.Dispatch<React.SetStateAction<string[]>>, select: boolean) => {
    if (select) {
      setFn(availablePorts.filter(p => p.status !== 'offline').map(p => p.id));
    } else {
      setFn([]);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-enter pb-20">
      
      {/* 头部导航 */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-1">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">短信业务</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            {activeTab === 'send' ? '配置短信分发任务' : '执行端口间的链路通畅性测试与统计'}
          </p>
        </div>
        
        <div className="flex p-1 bg-slate-200/40 rounded-2xl border border-slate-200/60 backdrop-blur-sm shadow-inner">
          {[
            { id: 'send', label: '发送短信', icon: Send },
            { id: 'test', label: '端口测试', icon: Activity },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2.5 px-6 py-2 text-sm font-bold rounded-xl transition-all duration-300 ${
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

      <div className="space-y-6">
        {/* 主要配置卡片 */}
        <div className="glass-card bg-white rounded-[2.5rem] border border-white/60 shadow-soft overflow-hidden">
          {activeTab === 'send' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 sm:p-10">
               <div className="lg:col-span-8 space-y-8">
                  <PortPicker 
                    label="发送端口" 
                    selected={selectedPorts} 
                    onToggle={(id) => setSelectedPorts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])} 
                    onSelectAll={(all) => handleToggleAll(setSelectedPorts, all)}
                  />
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">收件人</label>
                    <textarea value={recipients} onChange={(e) => setRecipients(e.target.value)} rows={3} placeholder="输入手机号，多个号码换行分隔..." className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-3xl text-sm font-mono focus:bg-white focus:border-primary-500 outline-none transition-all shadow-inner" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">短信内容</label>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} placeholder="请输入短信内容..." className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-3xl text-sm focus:bg-white focus:border-primary-500 outline-none transition-all shadow-inner" />
                  </div>
               </div>
               <div className="lg:col-span-4 space-y-8">
                  <label className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[2rem] border-2 border-slate-100 cursor-pointer hover:bg-slate-100/50 transition-all group">
                    <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-2xl transition-all ${autoSendEnabled ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'bg-white text-slate-400 border border-slate-200'}`}>
                          <RefreshCw className={`w-5 h-5 ${autoSendEnabled ? 'animate-spin-slow' : ''}`} />
                        </div>
                        <p className="text-sm font-black text-slate-800 uppercase tracking-tight">自动发送</p>
                    </div>
                    <button onClick={(e) => { e.preventDefault(); setAutoSendEnabled(!autoSendEnabled); }} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${autoSendEnabled ? 'bg-primary-600' : 'bg-slate-200'}`}>
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${autoSendEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </label>
                  {autoSendEnabled && (
                    <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-top-2">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-3">最小分钟</label>
                        <input type="number" value={minMinutes} onChange={(e) => setMinMinutes(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-mono font-black text-slate-700 focus:border-primary-500 outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-3">最大分钟</label>
                        <input type="number" value={maxMinutes} onChange={(e) => setMaxMinutes(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-mono font-black text-slate-700 focus:border-primary-500 outline-none transition-all" />
                      </div>
                    </div>
                  )}
                  <button onClick={handleAction} disabled={isProcessing} className="w-full btn-primary py-5 rounded-[2rem] text-base font-black flex items-center justify-center gap-3 shadow-2xl shadow-primary-500/30 active:scale-[0.98] transition-all disabled:opacity-50 mt-auto">
                    {isProcessing ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                    {isProcessing ? '处理中...' : '提交发送任务'}
                  </button>
               </div>
            </div>
          ) : (
            /* --- 端口测试配置区 --- */
            <div className="p-8 sm:p-10 space-y-10">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                 <div className="space-y-8">
                    <PortPicker 
                      label="发送端口" 
                      selected={testSendPorts} 
                      onToggle={(id) => setTestSendPorts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])} 
                      onSelectAll={(all) => handleToggleAll(setTestSendPorts, all)}
                    />
                    <PortPicker 
                      label="接收端口" 
                      selected={testRecvPorts} 
                      onToggle={(id) => setTestRecvPorts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])} 
                      onSelectAll={(all) => handleToggleAll(setTestRecvPorts, all)}
                    />
                 </div>
                 <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">测试内容</label>
                      <input type="text" value={testContent} onChange={(e) => setTestContent(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-primary-500 outline-none transition-all shadow-inner" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-3">超时时间 (秒)</label>
                        <input type="number" value={testTimeout} onChange={(e) => setTestTimeout(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-mono font-black text-slate-700 focus:border-primary-500 outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-3">发送次数 (次)</label>
                        <input type="number" value={testCount} onChange={(e) => setTestCount(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-mono font-black text-slate-700 focus:border-primary-500 outline-none transition-all" />
                      </div>
                    </div>
                    <button onClick={handleAction} disabled={isProcessing} className="w-full btn-primary py-5 rounded-[2rem] text-base font-black flex items-center justify-center gap-3 shadow-2xl shadow-primary-500/30 active:scale-[0.98] transition-all disabled:opacity-50">
                      {isProcessing ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6" />}
                      {isProcessing ? '测试正在执行...' : '立即开始端口拨测'}
                    </button>
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* 端口测试数据统计表格 */}
        {activeTab === 'test' && (
          <div className="glass-card bg-white rounded-[2.5rem] border border-white/60 shadow-soft overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl">
                     <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">测试数据统计</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Port Performance Statistics</p>
                  </div>
               </div>
               <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm group">
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-colors" />
                  导出测试报告
               </button>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50/50 text-[11px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">
                        <th className="px-8 py-5">终端(端口-卡槽号)</th>
                        <th className="px-8 py-5 text-center">发送数</th>
                        <th className="px-8 py-5 text-center">发送成功数</th>
                        <th className="px-8 py-5 text-center">送达数</th>
                        <th className="px-8 py-5 text-center">超时数</th>
                        <th className="px-8 py-5">发送号码</th>
                        <th className="px-8 py-5">接收号码</th>
                        <th className="px-8 py-5 text-right">送达时间</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     <tr className="bg-white hover:bg-slate-50 transition-colors group">
                        <td className="px-8 py-5 font-black text-slate-800 text-sm">总数</td>
                        <td className="px-8 py-5 text-center font-black text-slate-800 font-mono text-sm">{totals.sent}</td>
                        <td className="px-8 py-5 text-center font-black text-slate-800 font-mono text-sm">{totals.success}</td>
                        <td className="px-8 py-5 text-center font-black text-slate-800 font-mono text-sm">{totals.delivered}</td>
                        <td className="px-8 py-5 text-center font-black text-slate-800 font-mono text-sm">{totals.timeout}</td>
                        <td className="px-8 py-5"></td>
                        <td className="px-8 py-5"></td>
                        <td className="px-8 py-5"></td>
                     </tr>
                     {testData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-8 py-4 text-xs font-bold text-slate-600 font-mono">{row.terminal}</td>
                           <td className="px-8 py-4 text-center text-xs font-medium text-slate-600 font-mono">{row.sentCount}</td>
                           <td className="px-8 py-4 text-center text-xs font-medium text-slate-600 font-mono">{row.successCount}</td>
                           <td className="px-8 py-4 text-center text-xs font-medium text-slate-600 font-mono">{row.deliveredCount}</td>
                           <td className="px-8 py-4 text-center text-xs font-medium text-slate-600 font-mono">{row.timeoutCount}</td>
                           <td className="px-8 py-4 text-xs font-mono text-slate-500">{row.senderNum || ''}</td>
                           <td className="px-8 py-4 text-xs font-mono text-slate-500">{row.receiverNum || ''}</td>
                           <td className="px-8 py-4 text-right text-xs font-mono text-slate-400">{row.deliveredTime || ''}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            {testData.every(r => r.sentCount === 0) && (
              <div className="py-20 flex flex-col items-center justify-center text-slate-300">
                <RefreshCw className="w-10 h-10 opacity-20 mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">等待测试启动获取实时数据</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 底部引导说明 */}
      <div className="flex items-center justify-center gap-10 text-[10px] font-black text-slate-300 uppercase tracking-widest pt-4">
         <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-slate-200" />
            <span>端到端连接验证</span>
         </div>
         <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-slate-200" />
            <span>时延抖动监控</span>
         </div>
         <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-slate-200" />
            <span>报告自动归档</span>
         </div>
      </div>
    </div>
  );
};

export default SmsSend;
