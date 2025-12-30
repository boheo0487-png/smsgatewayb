
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Mail, 
  Settings2, 
  Edit3, 
  Check, 
  X, 
  RefreshCw, 
  Save, 
  ShieldCheck, 
  Smartphone, 
  Zap, 
  Lock,
  ChevronDown,
  Info,
  FileText,
  Clock
} from './Icons';

type TabType = 'general' | 'email_to_sms';
type ProtocolType = 'GSM' | 'Email';

interface PortConfig {
  id: string;
  terminal: string;
  forwardNumber: string; // GSM模式使用
  smsCenter: string;    // GSM模式使用
  targetEmail: string;  // Email模式分端口使用
  subject: string;      // Email模式：主题
  remarks: string;      // Email模式：备注
  status: 'active' | 'inactive';
}

const mockPorts: PortConfig[] = [
  { id: '1', terminal: 'M1T1', forwardNumber: '+8613800138000', smsCenter: '+8613800100500', targetEmail: 'admin@example.com', subject: '警报：业务通知', remarks: '核心业务端口', status: 'active' },
  { id: '2', terminal: 'M2T1', forwardNumber: '-', smsCenter: '-', targetEmail: '-', subject: '-', remarks: '-', status: 'inactive' },
  { id: '3', terminal: 'M3T1', forwardNumber: '+8613900139000', smsCenter: '+8613800100500', targetEmail: 'tech@example.com', subject: '技术支持转发', remarks: '运维专用', status: 'active' },
  { id: '4', terminal: 'M4T1', forwardNumber: '-', smsCenter: '-', targetEmail: '-', subject: '-', remarks: '-', status: 'inactive' },
  { id: '5', terminal: 'M5T1', forwardNumber: '-', smsCenter: '-', targetEmail: '-', subject: '-', remarks: '-', status: 'inactive' },
  { id: '6', terminal: 'M6T1', forwardNumber: '-', smsCenter: '-', targetEmail: '-', subject: '-', remarks: '-', status: 'inactive' },
  { id: '7', terminal: 'M7T1', forwardNumber: '-', smsCenter: '-', targetEmail: '-', subject: '-', remarks: '-', status: 'inactive' },
  { id: '8', terminal: 'M8T1', forwardNumber: '-', smsCenter: '-', targetEmail: '-', subject: '-', remarks: '-', status: 'inactive' },
];

const SmsForwarding: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [protocol, setProtocol] = useState<ProtocolType>('GSM');
  const [isMultiPort, setIsMultiPort] = useState(false);
  const [isContentFirst, setIsContentFirst] = useState(false);
  
  // 邮件转短信状态
  const [isEmailToSmsActive, setIsEmailToSmsActive] = useState(false);
  const [emailToSmsData, setEmailToSmsData] = useState({
    account: '',
    password: '',
    interval: '15'
  });
  
  // 弹窗状态
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortConfig | null>(null);
  
  // Email 常规配置状态
  const [emailSettings, setEmailSettings] = useState({
    account: 'sender@telarvo.com',
    password: '••••••••••••',
    globalSubject: 'Telarvo SMS Gateway Notification'
  });

  const handleOpenEdit = (item: PortConfig) => {
    setEditingItem({ ...item });
    setIsEditModalOpen(true);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-enter pb-20">
      
      {/* 顶部标题与 Tab 导航 */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-1">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">短信转发</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">配置端口转发逻辑，支持 GSM 协议镜像或邮件实时同步</p>
        </div>
        
        <div className="flex p-1 bg-slate-200/40 rounded-2xl w-fit border border-slate-200/60 backdrop-blur-sm shadow-inner">
          {[
            { id: 'general', label: '常规设置', icon: Settings2 },
            { id: 'email_to_sms', label: '邮件转短信', icon: Mail },
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

      <div className="flex-1 flex flex-col glass-card rounded-[2.5rem] border border-white/60 shadow-soft overflow-hidden bg-white/60 min-h-[600px]">
        
        {activeTab === 'general' ? (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* 常规设置页头 */}
            <div className="p-10 border-b border-slate-100 bg-slate-50/20">
                <div className="flex items-center gap-10">
                   <h2 className="text-xl font-black text-slate-800 tracking-tight">常规设置</h2>
                   
                   <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-700">转发协议</span>
                        <Info className="w-4 h-4 text-primary-500 cursor-help" />
                      </div>
                      <div className="relative">
                        <select 
                          value={protocol}
                          onChange={(e) => setProtocol(e.target.value as ProtocolType)}
                          className="pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-black text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 shadow-sm appearance-none cursor-pointer min-w-[160px]"
                        >
                          <option value="GSM">GSM</option>
                          <option value="Email">Email</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                   </div>
                </div>
            </div>

            <div className="flex-1 p-10">
              {protocol === 'GSM' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-primary-50 text-primary-600 rounded-xl">
                        <Zap className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">端口业务特性列表</h3>
                   </div>
                   <div className="border border-slate-100 rounded-[2rem] overflow-hidden bg-white shadow-soft">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                            <th className="px-8 py-5">终端 (端口-卡槽)</th>
                            <th className="px-4 py-5">转发号码</th>
                            <th className="px-4 py-5">短信中心</th>
                            <th className="px-8 py-5 text-right">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {mockPorts.map(port => (
                            <tr key={port.id} className="hover:bg-slate-50/50 transition-colors">
                               <td className="px-8 py-5 text-sm font-bold text-slate-700 font-mono">{port.terminal}</td>
                               <td className="px-4 py-5 text-sm font-mono text-slate-600">{port.forwardNumber}</td>
                               <td className="px-4 py-5 text-xs font-mono text-slate-400">{port.smsCenter}</td>
                               <td className="px-8 py-5 text-right">
                                  <button onClick={() => handleOpenEdit(port)} className="p-2 text-slate-400 hover:text-primary-600"><Edit3 className="w-4 h-4" /></button>
                               </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                   </div>
                </div>
              ) : (
                <div className="space-y-10 animate-in fade-in">
                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      <div className="lg:col-span-5 space-y-6">
                         <div className="bg-slate-50/50 border border-slate-200/60 rounded-[2rem] p-8 space-y-8 shadow-inner">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2"><Lock className="w-4 h-4" /> 发件服务配置</h3>
                            <div className="space-y-6">
                               <div className="space-y-2">
                                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">发送邮箱账号</label>
                                  <input type="text" value={emailSettings.account} onChange={(e) => setEmailSettings({...emailSettings, account: e.target.value})} className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary-500/5 outline-none shadow-sm" />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">发送邮箱密码</label>
                                  <input type="password" value={emailSettings.password} onChange={(e) => setEmailSettings({...emailSettings, password: e.target.value})} className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary-500/5 outline-none shadow-sm" />
                               </div>
                            </div>
                            <div className="pt-4 border-t border-slate-200/60 space-y-3">
                               <label className="flex items-center justify-between p-4 bg-white/60 rounded-2xl border border-slate-200 cursor-pointer">
                                  <span className="text-xs font-black text-slate-700">内容在前</span>
                                  <div onClick={() => setIsContentFirst(!isContentFirst)} className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${isContentFirst ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                                    {isContentFirst && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                                  </div>
                               </label>
                               <label className="flex items-center justify-between p-4 bg-white/60 rounded-2xl border border-slate-200 cursor-pointer">
                                  <span className="text-xs font-black text-slate-700">多端口</span>
                                  <div onClick={() => setIsMultiPort(!isMultiPort)} className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${isMultiPort ? 'bg-primary-600 border-primary-600' : 'bg-white border-slate-300'}`}>
                                    {isMultiPort && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                                  </div>
                                </label>
                            </div>
                         </div>
                      </div>
                      <div className="lg:col-span-7 h-full">
                         <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 flex-1 flex flex-col shadow-soft h-full">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-6">全局主题模板</h3>
                            <textarea rows={10} value={emailSettings.globalSubject} onChange={(e) => setEmailSettings({...emailSettings, globalSubject: e.target.value})} className="w-full flex-1 px-8 py-6 bg-slate-50/30 border-2 border-slate-100 rounded-3xl text-sm font-bold focus:bg-white outline-none transition-all shadow-inner resize-none" />
                         </div>
                      </div>
                   </div>
                </div>
              )}
            </div>

            <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 italic">
                   <Info className="w-4 h-4 text-primary-400" />
                   * 保存后设置将立即在活跃物理终端上同步生效
                </div>
                <button className="btn-primary px-12 py-4 rounded-[1.5rem] text-sm font-black flex items-center gap-3 shadow-xl shadow-primary-500/20 active:scale-95 transition-all">
                   <Save className="w-5 h-5" />
                   保存当前设置
                </button>
            </div>
          </div>
        ) : (
          /* --- 邮件转短信 (专门配置标签页) --- */
          <div className="flex-1 flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-y-auto">
            <div className="p-12 sm:p-20 flex-1 flex flex-col items-center">
                <div className="w-full max-w-xl">
                   
                   {/* 1. 顶部启用选框卡片 (对应参考图顶部) */}
                   <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-soft overflow-hidden p-8 flex items-center justify-between group hover:border-primary-300 transition-all mb-10">
                      <div className="flex items-center gap-6">
                         <div className={`p-4 rounded-3xl transition-all duration-500 ${isEmailToSmsActive ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/30' : 'bg-slate-100 text-slate-400'}`}>
                            <Mail className="w-8 h-8" />
                         </div>
                         <div className="space-y-1">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">邮件转短信功能</h3>
                            <p className="text-sm text-slate-400 font-medium">开启后系统将监听配置邮箱并自动转发为短信</p>
                         </div>
                      </div>
                      
                      <div 
                        onClick={() => setIsEmailToSmsActive(!isEmailToSmsActive)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 transform active:scale-90 ${
                          isEmailToSmsActive 
                            ? 'bg-primary-600 shadow-lg shadow-primary-500/30 ring-4 ring-primary-500/10' 
                            : 'bg-white border-2 border-slate-200'
                        }`}
                      >
                        {isEmailToSmsActive && <Check className="w-6 h-6 text-white" strokeWidth={4} />}
                      </div>
                   </div>

                   {/* 2. 条件展示内容表单区 (对应参考图下部) */}
                   {isEmailToSmsActive ? (
                     <div className="space-y-10 animate-in zoom-in-95 fade-in slide-in-from-top-8 duration-700">
                        <div className="space-y-8 bg-white/40 p-8 rounded-[2.5rem] border border-white/60 shadow-soft">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                            <div className="md:col-span-3 text-right pr-4">
                                <label className="text-sm font-black text-slate-600">邮箱账号</label>
                            </div>
                            <div className="md:col-span-9 relative group">
                                <input 
                                  type="text" 
                                  value={emailToSmsData.account}
                                  onChange={(e) => setEmailToSmsData({...emailToSmsData, account: e.target.value})}
                                  placeholder="请输入邮箱地址"
                                  className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:border-primary-500 focus:ring-8 focus:ring-primary-500/5 outline-none transition-all shadow-inner" 
                                />
                                <Mail className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-200 group-focus-within:text-primary-300 transition-colors" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                            <div className="md:col-span-3 text-right pr-4">
                                <label className="text-sm font-black text-slate-600">邮箱密码</label>
                            </div>
                            <div className="md:col-span-9 relative group">
                                <input 
                                  type="password" 
                                  value={emailToSmsData.password}
                                  onChange={(e) => setEmailToSmsData({...emailToSmsData, password: e.target.value})}
                                  placeholder="请输入授权码"
                                  className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:border-primary-500 focus:ring-8 focus:ring-primary-500/5 outline-none transition-all shadow-inner" 
                                />
                                <Lock className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-200 group-focus-within:text-primary-300 transition-colors" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                            <div className="md:col-span-3 text-right pr-4">
                                <label className="text-sm font-black text-slate-600">发送间隔(分)</label>
                            </div>
                            <div className="md:col-span-9 relative">
                                <select 
                                  value={emailToSmsData.interval}
                                  onChange={(e) => setEmailToSmsData({...emailToSmsData, interval: e.target.value})}
                                  className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:border-primary-500 focus:ring-8 focus:ring-primary-500/5 outline-none transition-all shadow-inner appearance-none cursor-pointer"
                                >
                                  <option value="5">5</option>
                                  <option value="10">10</option>
                                  <option value="15">15</option>
                                  <option value="30">30</option>
                                  <option value="60">60</option>
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                                  <Clock className="w-4 h-4 text-slate-400" />
                                  <ChevronDown className="w-4 h-4 text-slate-300" />
                                </div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4">
                          <button 
                            className="w-full btn-primary py-5 rounded-[2rem] text-base font-black flex items-center justify-center gap-3 shadow-2xl shadow-primary-500/30 active:scale-[0.98] transition-all"
                          >
                            <Save className="w-6 h-6" />
                            保存邮件转发配置
                          </button>
                        </div>
                     </div>
                   ) : (
                     /* 3. 未开启时的引导占位 */
                     <div className="py-20 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-24 h-24 bg-slate-100/50 rounded-full flex items-center justify-center mb-6 border border-slate-200 shadow-inner">
                           <ShieldCheck className="w-10 h-10 text-slate-200" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-400">功能未激活</h4>
                        <p className="text-sm text-slate-300 mt-2 max-w-[280px] leading-relaxed">
                          勾选上方开关以配置邮件监听账号，实现邮件与短信的实时双向流转。
                        </p>
                     </div>
                   )}
                </div>
            </div>
            
            {/* 底部装饰条 */}
            <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center gap-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2"><Smartphone className="w-4 h-4" /> 实时触发</div>
                <div className="flex items-center gap-2"><Lock className="w-4 h-4" /> 加密传输</div>
                <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> 失败自动重试</div>
            </div>
          </div>
        )}
      </div>

      {/* 编辑弹窗 */}
      {isEditModalOpen && editingItem && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsEditModalOpen(false)}></div>
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg border border-white/60 animate-enter overflow-hidden flex flex-col">
                <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex-none flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl shadow-sm border border-primary-100">
                            <Edit3 className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 tracking-tight text-lg">编辑终端特性</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{editingItem.terminal}</p>
                        </div>
                    </div>
                    <button onClick={() => setIsEditModalOpen(false)} className="p-2 rounded-xl hover:bg-slate-200/50 text-slate-400 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-10 space-y-8">
                   {protocol === 'GSM' ? (
                     <div className="space-y-6">
                        <div className="space-y-2.5">
                           <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">转发号码</label>
                           <input type="text" defaultValue={editingItem.forwardNumber === '-' ? '' : editingItem.forwardNumber} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-base font-mono font-black text-slate-800 outline-none focus:border-primary-500 shadow-inner" placeholder="+86..." />
                        </div>
                        <div className="space-y-2.5">
                           <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">短信中心</label>
                           <input type="text" defaultValue={editingItem.smsCenter === '-' ? '' : editingItem.smsCenter} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-mono font-bold text-slate-600 outline-none focus:border-primary-500 shadow-inner" />
                        </div>
                     </div>
                   ) : (
                     <div className="space-y-6">
                        <div className="space-y-2.5">
                           <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">收件人</label>
                           <div className="relative">
                              <input type="email" defaultValue={editingItem.targetEmail === '-' ? '' : editingItem.targetEmail} className="w-full px-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-primary-500 shadow-inner" placeholder="user@example.com" />
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                           </div>
                        </div>
                        <div className="space-y-2.5">
                           <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">主题</label>
                           <input type="text" defaultValue={editingItem.subject === '-' ? '' : editingItem.subject} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold" />
                        </div>
                        <div className="space-y-2.5">
                           <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">备注</label>
                           <textarea defaultValue={editingItem.remarks === '-' ? '' : editingItem.remarks} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold resize-none" rows={3} />
                        </div>
                     </div>
                   )}
                </div>

                <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4 flex-none">
                    <button onClick={() => setIsEditModalOpen(false)} className="px-8 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">取消</button>
                    <button onClick={() => setIsEditModalOpen(false)} className="btn-primary px-12 py-3 rounded-2xl text-sm font-black shadow-xl shadow-primary-500/20 active:scale-95 transition-all">确认应用</button>
                </div>
            </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default SmsForwarding;
