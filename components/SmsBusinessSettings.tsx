
import React, { useState } from 'react';
import { 
  Settings2, 
  MessageSquare, 
  Globe, 
  Zap, 
  ShieldCheck, 
  Check, 
  Save, 
  RefreshCw,
  Server,
  Lock,
  User,
  ChevronDown,
  Info,
  Layers,
  Database,
  X,
  Smartphone,
  HelpCircle,
  Plus,
  Edit3,
  Trash2,
  Database as DatabaseIcon,
  Clock,
  /* Add missing ArrowRight icon to resolve the 'Cannot find name' error on line 155 */
  ArrowRight
} from './Icons';

type TabType = 'general' | 'smpp';
type SmppMode = 'disabled' | 'server' | 'client';

const FormField: React.FC<{ label: React.ReactNode; children: React.ReactNode; helpText?: string; required?: boolean }> = ({ label, children, helpText, required }) => (
  <div className="space-y-2.5">
    <div className="flex items-center gap-1.5 px-1">
      <label className="text-[13px] font-black text-slate-700 tracking-tight uppercase">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
    </div>
    <div className="relative">
      {children}
    </div>
    {helpText && <p className="text-[11px] text-slate-400 font-bold italic pl-1 flex items-center gap-1.5">
      <Info className="w-3 h-3 text-slate-300" />
      {helpText}
    </p>}
  </div>
);

const SmsBusinessSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [isSaving, setIsSaving] = useState(false);

  // 常规设置状态 - 优化默认间隔值为 2-5s，更符合实际业务基准
  const [smsConfig, setSmsConfig] = useState({
    intervalMin: '2',
    intervalMax: '5',
    sendTimeout: '180',
    submitTimeout: '600',
    charset: 'AUTO',
    deliveryReport: true
  });

  const [httpConfig, setHttpConfig] = useState({
    maxCacheTasks: '200'
  });

  // SMPP 设置状态
  const [smppMode, setSmppMode] = useState<SmppMode>('disabled');
  const [smppBaseConfig, setSmppBaseConfig] = useState({
    port: '7899',
    submitResponse: '已提交',
    reportResponse: '已发送',
    reportMsgType: 'Deliver_SM',
    submitTimeout: '0',
    maxQueue: '640'
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("配置已成功更新并保存至网关");
    }, 1000);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-enter pb-20">
      
      {/* 顶部标题与 Tab 导航 */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-1">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">短信业务设置</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">管理短信分发策略、协议对接及接口参数</p>
        </div>
        
        <div className="flex p-1.5 bg-slate-200/40 rounded-2xl w-fit border border-slate-200/60 backdrop-blur-sm shadow-inner">
          {[
            { id: 'general', label: '常规设置', icon: Settings2 },
            { id: 'smpp', label: 'SMPP设置', icon: Layers },
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
        
        <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
          {activeTab === 'general' ? (
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
               {/* 模块 A: 短信核心发送参数 - 优化间隔布局 */}
               <div className="bg-white/40 border border-slate-100 rounded-[2.5rem] p-8 lg:p-10 shadow-soft relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                      <MessageSquare className="w-40 h-40" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl shadow-sm border border-primary-100">
                          <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">发送策略参数</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Core SMS Transmission Config</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
                       {/* 优化后的发送间隔字段 */}
                       <FormField label="发送间隔范围 (秒)" helpText="设置单次任务中相邻两条短信的随机延迟波动">
                          <div className="flex items-center gap-2">
                             <div className="relative flex-1 group">
                                <input 
                                  type="number" 
                                  value={smsConfig.intervalMin} 
                                  onChange={(e) => setSmsConfig({...smsConfig, intervalMin: e.target.value})} 
                                  className="w-full pl-4 pr-10 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-mono font-black text-slate-700 focus:border-primary-500 focus:bg-white outline-none shadow-inner transition-all" 
                                  placeholder="Min"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase tracking-tighter">Min</span>
                             </div>
                             <div className="text-slate-300 flex items-center px-1">
                                <ArrowRight className="w-3 h-3" strokeWidth={3} />
                             </div>
                             <div className="relative flex-1 group">
                                <input 
                                  type="number" 
                                  value={smsConfig.intervalMax} 
                                  onChange={(e) => setSmsConfig({...smsConfig, intervalMax: e.target.value})} 
                                  className="w-full pl-4 pr-10 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-mono font-black text-slate-700 focus:border-primary-500 focus:bg-white outline-none shadow-inner transition-all" 
                                  placeholder="Max"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase tracking-tighter">Max</span>
                             </div>
                          </div>
                       </FormField>

                       <FormField label="发送超时" helpText="单条短信的发送超时限制">
                          <div className="relative">
                            <input type="number" value={smsConfig.sendTimeout} onChange={(e) => setSmsConfig({...smsConfig, sendTimeout: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-mono font-black text-slate-700 focus:border-primary-500 focus:bg-white outline-none shadow-inner transition-all" />
                            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">SEC</span>
                          </div>
                       </FormField>
                       <FormField label="提交超时" helpText="提交至网络基站的等待阈值">
                          <div className="relative">
                            <input type="number" value={smsConfig.submitTimeout} onChange={(e) => setSmsConfig({...smsConfig, submitTimeout: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-mono font-black text-slate-700 focus:border-primary-500 focus:bg-white outline-none shadow-inner transition-all" />
                            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">SEC</span>
                          </div>
                       </FormField>
                       <FormField label="字符编码集" helpText="自动匹配或强制指定短信内容的编码格式">
                          <div className="relative">
                             <select value={smsConfig.charset} onChange={(e) => setSmsConfig({...smsConfig, charset: e.target.value})} className="w-full pl-5 pr-10 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-black text-slate-700 appearance-none outline-none focus:border-primary-500 focus:bg-white cursor-pointer shadow-inner transition-all">
                               <option value="AUTO">AUTO (智能自动)</option>
                               <option value="UTF-8">UTF-8</option>
                               <option value="GSM7">GSM-7</option>
                               <option value="UCS2">UCS-2 (中文/特殊字符)</option>
                             </select>
                             <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                       </FormField>
                       <div className="flex items-center h-full pt-6">
                          <label className="flex items-center justify-between w-full p-4 bg-slate-50/50 rounded-2xl border border-slate-100 shadow-inner cursor-pointer group/toggle hover:bg-white transition-colors">
                             <div className="flex items-center gap-3">
                                <span className="text-sm font-black text-slate-700 uppercase tracking-tight">送达报告</span>
                                <HelpCircle className="w-4 h-4 text-slate-300 group-hover/toggle:text-primary-400 transition-colors" />
                             </div>
                             <div onClick={() => setSmsConfig({...smsConfig, deliveryReport: !smsConfig.deliveryReport})} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${smsConfig.deliveryReport ? 'bg-primary-600 border-primary-600 shadow-lg shadow-primary-500/20' : 'bg-white border-slate-300'}`}>
                                {smsConfig.deliveryReport && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
                             </div>
                          </label>
                       </div>
                    </div>
                  </div>
               </div>

               {/* 模块 B: HTTP 业务接口设置 */}
               <div className="bg-white/40 border border-slate-100 rounded-[2.5rem] p-8 lg:p-10 shadow-soft">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm border border-indigo-100">
                        <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-800 tracking-tight">HTTP 业务接口设置</h2>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Webhook & Queue Management</p>
                    </div>
                  </div>

                  <div className="space-y-10">
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-6">
                           <FormField label="设备最大缓存任务数" helpText="最大缓存500条任务">
                              <div className="relative group">
                                 <input type="number" value={httpConfig.maxCacheTasks} onChange={(e) => setHttpConfig({...httpConfig, maxCacheTasks: e.target.value})} placeholder="200" className="w-full px-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-base font-mono font-black text-primary-600 focus:border-primary-500 focus:bg-white outline-none transition-all shadow-inner" />
                                 <DatabaseIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-400 transition-colors" />
                                 <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest">Tasks</div>
                              </div>
                           </FormField>
                        </div>
                        <div className="lg:col-span-6 flex items-end">
                           <div className="w-full p-6 bg-indigo-50/50 border border-indigo-100 rounded-3xl flex items-start gap-4">
                              <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-500 shrink-0">
                                <Info className="w-4 h-4" />
                              </div>
                              <p className="text-[13px] text-indigo-700 leading-relaxed font-bold">
                                此参数定义了网关在等待无线网络资源时，内存中允许积压的最大 HTTP 短信指令数量。超过此阈值将触发过载保护，确保系统稳定性。
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          ) : (
            /* --- SMPP 设置视图 --- */
            <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">
               
               {/* 顶部模式切换面板 */}
               <div className="bg-slate-100/50 border border-slate-200 p-8 rounded-[3rem] shadow-inner flex flex-col items-center gap-6">
                  <div className="flex flex-col items-center gap-1.5">
                     <div className="p-3 bg-white text-slate-400 rounded-2xl shadow-sm border border-slate-200">
                        <Layers className="w-6 h-6" />
                     </div>
                     <h3 className="text-lg font-black text-slate-800 tracking-tight">业务模式</h3>
                  </div>

                  <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm gap-1">
                    {[
                      { id: 'disabled', label: '禁用模式', icon: X },
                      { id: 'server', label: '服务端模式', icon: Server },
                      { id: 'client', label: '客户端模式', icon: Smartphone },
                    ].map(mode => (
                      <button
                        key={mode.id}
                        onClick={() => setSmppMode(mode.id as SmppMode)}
                        className={`flex items-center gap-3 px-8 py-3 text-sm font-black rounded-xl transition-all duration-300 ${
                          smppMode === mode.id 
                            ? 'bg-slate-900 text-white shadow-xl' 
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <mode.icon className="w-4 h-4" />
                        {mode.label}
                      </button>
                    ))}
                  </div>
               </div>

               {/* 核心配置表单内容区 - 只有非禁用模式才显示 */}
               {smppMode !== 'disabled' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
                     
                     {/* 主表单参数 (适配图片布局) */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 px-4">
                        
                        {/* 第一行逻辑：服务端模式显示端口，客户端模式显示模式下拉 */}
                        {smppMode === 'server' ? (
                           <FormField label="端口" helpText="如果要指定端口，请加 端口">
                              <input 
                                 type="text" 
                                 value={smppBaseConfig.port} 
                                 onChange={(e) => setSmppBaseConfig({...smppBaseConfig, port: e.target.value})} 
                                 className="w-full px-5 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-sm font-mono font-black text-slate-700 focus:border-primary-500 outline-none shadow-sm transition-all" 
                              />
                           </FormField>
                        ) : (
                           <FormField label={
                              <div className="flex items-center gap-1.5">
                                 <span>模式</span>
                                 <HelpCircle className="w-3.5 h-3.5 text-primary-400 cursor-help" />
                              </div>
                           }>
                              <div className="relative group">
                              <select 
                                 value={smppMode}
                                 onChange={(e) => setSmppMode(e.target.value as SmppMode)}
                                 className="w-full px-5 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none appearance-none focus:border-primary-500 shadow-sm transition-all cursor-pointer"
                              >
                                 <option value="disabled">禁用</option>
                                 <option value="server">服务端</option>
                                 <option value="client">客户端</option>
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-hover:text-primary-400 transition-colors pointer-events-none" />
                              </div>
                           </FormField>
                        )}

                        <FormField label="提交响应">
                           <div className="relative group">
                           <select 
                              value={smppBaseConfig.submitResponse}
                              onChange={(e) => setSmppBaseConfig({...smppBaseConfig, submitResponse: e.target.value})}
                              className="w-full px-5 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none appearance-none focus:border-primary-500 shadow-sm transition-all cursor-pointer"
                           >
                              <option>已提交</option>
                              <option>已接收</option>
                           </select>
                           <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                           </div>
                        </FormField>

                        <FormField label="报告响应">
                           <div className="relative group">
                           <select 
                              value={smppBaseConfig.reportResponse}
                              onChange={(e) => setSmppBaseConfig({...smppBaseConfig, reportResponse: e.target.value})}
                              className="w-full px-5 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none appearance-none focus:border-primary-500 shadow-sm transition-all cursor-pointer"
                           >
                              <option>已发送</option>
                              <option>已送达</option>
                           </select>
                           <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                           </div>
                        </FormField>

                        <FormField label="报告消息类型">
                           <div className="relative group">
                           <select 
                              value={smppBaseConfig.reportMsgType}
                              onChange={(e) => setSmppBaseConfig({...smppBaseConfig, reportMsgType: e.target.value})}
                              className="w-full px-5 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none appearance-none focus:border-primary-500 shadow-sm transition-all cursor-pointer"
                           >
                              <option>Deliver_SM</option>
                              <option>Data_SM</option>
                           </select>
                           <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                           </div>
                        </FormField>

                        <FormField label="提交超时(分)">
                           <input 
                              type="number" 
                              value={smppBaseConfig.submitTimeout} 
                              onChange={(e) => setSmppBaseConfig({...smppBaseConfig, submitTimeout: e.target.value})} 
                              className="w-full px-5 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-sm font-mono font-black text-slate-700 focus:border-primary-500 outline-none shadow-sm transition-all" 
                           />
                        </FormField>

                        <FormField label={
                           <div className="flex items-center gap-1.5">
                              <span>最大排队数</span>
                              <Info className="w-3.5 h-3.5 text-primary-400" />
                           </div>
                        }>
                           <input 
                              type="number" 
                              value={smppBaseConfig.maxQueue} 
                              onChange={(e) => setSmppBaseConfig({...smppBaseConfig, maxQueue: e.target.value})} 
                              className="w-full px-5 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-sm font-mono font-black text-slate-700 focus:border-primary-500 outline-none shadow-sm transition-all" 
                           />
                        </FormField>

                        <div className="md:col-span-2 pt-4">
                           <button 
                              onClick={handleSave}
                              className="px-10 py-3 bg-primary-600 text-white text-sm font-black rounded-xl shadow-lg shadow-primary-500/20 active:scale-95 transition-all flex items-center gap-2"
                           >
                              <Save className="w-4 h-4" /> 保存
                           </button>
                        </div>
                     </div>

                     {/* 账号管理表格 (适配图片样式) */}
                     <div className="space-y-6 pt-12">
                        <div className="flex items-center gap-3 px-4">
                           <button className="flex items-center gap-1.5 px-6 py-2.5 bg-white border-2 border-slate-100 rounded-xl text-sm font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                              <Plus className="w-4 h-4 text-primary-500" /> 新增
                           </button>
                           <button className="flex items-center gap-1.5 px-6 py-2.5 bg-white border-2 border-slate-100 rounded-xl text-sm font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                              <Edit3 className="w-4 h-4 text-indigo-500" /> 编辑
                           </button>
                           <button className="flex items-center gap-1.5 px-6 py-2.5 bg-white border-2 border-slate-100 rounded-xl text-sm font-black text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all shadow-sm">
                              <Trash2 className="w-4 h-4 text-rose-400" /> 删除
                           </button>
                        </div>
                        
                        <div className="border-2 border-slate-100 rounded-[2.5rem] overflow-hidden bg-white/40 shadow-soft mx-4">
                           <table className="w-full text-left border-collapse">
                              <thead>
                                 <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-4 w-12 text-center">
                                       <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary-600" />
                                    </th>
                                    <th className="px-4 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">账号</th>
                                    <th className="px-4 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">密码</th>
                                    <th className="px-4 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">IP</th>
                                    <th className="px-4 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">端口</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">状态</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                       <div className="flex flex-col items-center justify-center text-slate-300 space-y-4">
                                          <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
                                             <DatabaseIcon className="w-10 h-10 opacity-10" />
                                          </div>
                                          <span className="text-sm font-bold italic tracking-wider text-slate-400">暂无数据</span>
                                       </div>
                                    </td>
                                 </tr>
                              </tbody>
                           </table>
                        </div>
                     </div>

                     {/* 前缀路由表格 (适配图片样式) */}
                     <div className="space-y-6 pt-12">
                        <div className="flex items-center gap-3 px-4">
                           <button className="flex items-center gap-1.5 px-6 py-2.5 bg-white border-2 border-slate-100 rounded-xl text-sm font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                              <Plus className="w-4 h-4 text-primary-500" /> 新增
                           </button>
                           <button className="flex items-center gap-1.5 px-6 py-2.5 bg-white border-2 border-slate-100 rounded-xl text-sm font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                              <Edit3 className="w-4 h-4 text-indigo-500" /> 编辑
                           </button>
                           <button className="flex items-center gap-1.5 px-6 py-2.5 bg-white border-2 border-slate-100 rounded-xl text-sm font-black text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all shadow-sm">
                              <Trash2 className="w-4 h-4 text-rose-400" /> 删除
                           </button>
                        </div>
                        
                        <div className="border-2 border-slate-100 rounded-[2.5rem] overflow-hidden bg-white/40 shadow-soft mx-4">
                           <table className="w-full text-left border-collapse">
                              <thead>
                                 <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-4 w-12 text-center">
                                       <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary-600" />
                                    </th>
                                    <th className="px-4 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">被叫前缀</th>
                                    <th className="px-4 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">去掉前缀位数</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">增加前缀</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 <tr>
                                    <td colSpan={4} className="py-20 text-center">
                                       <div className="flex flex-col items-center justify-center text-slate-300 space-y-4">
                                          <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
                                             <Smartphone className="w-10 h-10 opacity-10" />
                                          </div>
                                          <span className="text-sm font-bold italic tracking-wider text-slate-400">暂无数据</span>
                                       </div>
                                    </td>
                                 </tr>
                              </tbody>
                           </table>
                        </div>
                     </div>

                  </div>
               )}

               {/* 禁用模式时的提示 (可选) */}
               {smppMode === 'disabled' && (
                  <div className="py-24 flex flex-col items-center justify-center text-slate-300 space-y-6 animate-in fade-in duration-700">
                     <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 shadow-inner">
                        <Zap className="w-12 h-12 opacity-10" />
                     </div>
                     <div className="text-center space-y-1">
                        <p className="text-lg font-black uppercase tracking-widest text-slate-200">SMPP 协议模块未激活</p>
                        <p className="text-xs font-bold text-slate-300">请切换至服务端或客户端模式以启用详细配置</p>
                     </div>
                  </div>
               )}
            </div>
          )}
        </div>

        {/* 底部固定保存/同步条 (只有常规设置或非禁用模式显示) */}
        {(activeTab === 'general' || (activeTab === 'smpp' && smppMode !== 'disabled')) && (
           <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center gap-4">
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  * 系统将在保存后 3 秒内平滑重载业务逻辑
               </div>
               <button 
                   onClick={handleSave}
                   disabled={isSaving}
                   className="btn-primary px-16 py-4 rounded-[1.5rem] text-sm font-black flex items-center gap-3 shadow-2xl shadow-primary-500/20 active:scale-95 transition-all"
               >
                   {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                   保存并同步配置
               </button>
           </div>
        )}
      </div>

      {/* 底部状态条图例 */}
      <div className="flex items-center justify-center gap-12 text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] pt-6">
         <div className="flex items-center gap-3 group cursor-help">
            <ShieldCheck className="w-5 h-5 text-slate-200 group-hover:text-emerald-400 transition-colors" />
            <span>全链路 TLS 1.3 加密</span>
         </div>
         <div className="flex items-center gap-3 group cursor-help">
            <Zap className="w-5 h-5 text-slate-200 group-hover:text-primary-400 transition-colors" />
            <span>实时流量负载均衡</span>
         </div>
         <div className="flex items-center gap-3 group cursor-help">
            <Database className="w-5 h-5 text-slate-200 group-hover:text-indigo-400 transition-colors" />
            <span>持久化配置同步</span>
         </div>
      </div>

    </div>
  );
};

export default SmsBusinessSettings;
