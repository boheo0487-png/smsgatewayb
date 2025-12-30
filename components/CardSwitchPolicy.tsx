
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  ShieldAlert, 
  Clock, 
  Save, 
  RefreshCw, 
  AlertTriangle, 
  ChevronDown,
  Zap,
  ShieldCheck,
  RotateCcw,
  Shield,
  Settings2,
  Info,
  Sliders,
  Smartphone,
  MessageSquare,
  HelpCircle,
  Check,
  Plus,
  Edit3,
  Trash2,
  X,
  /* Adding missing ArrowRight icon to resolve import error */
  ArrowRight
} from './Icons';

type PolicySubTab = 'lock' | 'timeshare';

interface TimeshareRule {
  id: string;
  start: string;
  end: string;
  sims: boolean[]; // 对应 T1M1 - T1M8
}

const Toggle: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <button 
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-primary-500/10 ${checked ? 'bg-primary-600' : 'bg-slate-200'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const CheckboxCustom: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
  <div 
    onClick={() => onChange(!checked)}
    className={`w-5 h-5 rounded-md border-2 cursor-pointer transition-all flex items-center justify-center shrink-0 ${checked ? 'bg-primary-600 border-primary-600 shadow-md' : 'bg-white border-slate-300'}`}
  >
    {checked && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
  </div>
);

const SettingRow: React.FC<{ 
  label: React.ReactNode; 
  hasTooltip?: boolean;
  tooltipContent?: string;
  children: React.ReactNode;
  border?: boolean;
  className?: string;
  helpText?: string;
}> = ({ label, hasTooltip = false, tooltipContent, children, border = true, className = "", helpText }) => (
  <div className={`flex flex-col py-5 ${border ? 'border-b border-slate-100' : ''} ${className}`}>
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div className="flex items-center gap-2">
        <div className="text-sm font-bold text-slate-700 tracking-tight">{label}</div>
        {hasTooltip && (
          <div className="group relative">
             <HelpCircle className="w-4 h-4 text-blue-500 cursor-help transition-opacity" fill="currentColor" />
             {tooltipContent && (
               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-xl">
                 {tooltipContent}
               </div>
             )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4 shrink-0">
        {children}
      </div>
    </div>
    {helpText && (
      <p className="mt-2 text-xs font-bold text-slate-400 tracking-wide pl-1">{helpText}</p>
    )}
  </div>
);

const InputField: React.FC<{ value: string | number; unit?: string; placeholder?: string; onChange: (v: string) => void; showSpinners?: boolean }> = ({ value, unit, placeholder, onChange, showSpinners = false }) => (
  <div className="relative group flex items-center gap-2">
    <div className="relative flex items-center">
      <input 
        type="text" 
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-48 px-4 py-2 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-mono font-black text-slate-700 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all shadow-inner placeholder:text-slate-300 placeholder:font-sans placeholder:font-bold pr-10"
      />
      {showSpinners && (
        <div className="absolute right-2 flex flex-col gap-0.5 text-slate-300">
          <button className="hover:text-primary-500 transition-colors focus:outline-none"><ChevronDown className="w-3 h-3 rotate-180" /></button>
          <button className="hover:text-primary-500 transition-colors focus:outline-none"><ChevronDown className="w-3 h-3" /></button>
        </div>
      )}
    </div>
    {unit && <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[24px]">{unit}</span>}
  </div>
);

const CardSwitchPolicy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PolicySubTab>('lock');
  
  // 1. 锁卡配置状态 (恢复全量配置)
  const [lockSettings, setLockSettings] = useState({
    smsAlertEnabled: false,
    smsAlertNumber: '',
    byOnlineDuration: false,
    byOnlineDurationVal: 7200,
    lockDurationVal: 0,
    byConsecUndelivered: false,
    byConsecUndeliveredReset: false,
    byConsecUndeliveredUssd: false,
    byConsecUndeliveredCount: 5,
    byConsecUndeliveredLockTime: 0,
    byCumulUndelivered: false,
    byCumulUndeliveredReset: false,
    byCumulUndeliveredUssd: false,
    byCumulUndeliveredCount: 20,
    byCumulUndeliveredLockTime: 0,
    byCumulSendFail: false,
    byCumulSendFailReset: false,
    byCumulSendFailUssd: false,
    byCumulSendFailCount: 10,
    byCumulSendFailLockTime: 0,
    byCumulSent: false,
    byCumulSentReset: false,
    byCumulSentUssd: false,
    byCumulSentCount: 500,
    byCumulSentLockTime: 0,
    byConsecSendFail: false,
    byConsecSendFailReset: false,
    byConsecSendFailUssd: false,
    byConsecSendFailCount: 5,
    byConsecSendFailLockTime: 0,
    byCumulReceived: false,
    byCumulReceivedReset: false,
    byCumulReceivedCount: 8,
    byCumulReceivedLockTime: 0,
    byCumulReceivedKeywords: '',
    byCumulReceivedSenders: '',
    byModuleErrorCode: false,
    byModuleErrorCodeVal: '',
    byModuleErrorCodeOccurrences: 3,
    byPortIntercall: false,
    byPortIntercallReset: false,
    byPortIntercallUssd: false,
    byPortIntercallCount: 50,
    byPortIntercallLockTime: 0
  });

  // 2. 分时策略状态
  const [timeshareRules, setTimeshareRules] = useState<TimeshareRule[]>([
    { id: '1', start: '08:00', end: '12:00', sims: [true, true, true, true, false, false, false, false] },
    { id: '2', start: '12:00', end: '18:00', sims: [false, false, false, false, true, true, true, true] }
  ]);
  const [selectedRuleIds, setSelectedRuleIds] = useState<string[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<TimeshareRule | null>(null);

  const handleToggleSelectRule = (id: string) => {
    setSelectedRuleIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const openAddModal = () => {
    setEditingRule({
      id: Math.random().toString(36).substr(2, 9),
      start: '00:00',
      end: '00:00',
      sims: Array(8).fill(false)
    });
    setIsEditModalOpen(true);
  };

  const openEditModal = () => {
    if (selectedRuleIds.length !== 1) {
      alert("请选择一条策略进行编辑");
      return;
    }
    const rule = timeshareRules.find(r => r.id === selectedRuleIds[0]);
    if (rule) {
      setEditingRule({ ...rule });
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteRules = () => {
    if (selectedRuleIds.length === 0) return;
    if (confirm(`确定要删除选中的 ${selectedRuleIds.length} 条策略吗？`)) {
      setTimeshareRules(prev => prev.filter(r => !selectedRuleIds.includes(r.id)));
      setSelectedRuleIds([]);
    }
  };

  const saveRule = () => {
    if (!editingRule) return;
    setTimeshareRules(prev => {
      const exists = prev.find(r => r.id === editingRule.id);
      if (exists) {
        return prev.map(r => r.id === editingRule.id ? editingRule : r);
      }
      return [...prev, editingRule];
    });
    setIsEditModalOpen(false);
    setEditingRule(null);
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 animate-enter pb-24">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">切卡策略管理</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">配置端口 SIM 卡的自动切换与故障锁定逻辑</p>
        </div>
        
        <div className="flex p-1.5 bg-slate-200/40 rounded-2xl w-fit border border-slate-200/60 backdrop-blur-sm shadow-inner">
          {[
            { id: 'lock', label: '锁卡条件设置', icon: ShieldAlert },
            { id: 'timeshare', label: 'SIM 分时策略', icon: Clock },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as PolicySubTab)}
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

      <div className="glass-card bg-white rounded-[2rem] border border-white/60 shadow-soft overflow-hidden flex flex-col min-h-[600px]">
        
        <div className="p-10 flex-1 bg-white overflow-y-auto">
          {activeTab === 'lock' && (
            <div className="space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-4xl mx-auto">
              {/* 短信告警面板 */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-[2rem] p-8 mb-10 shadow-inner">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 items-center">
                     <SettingRow label="开启短信告警" border={false}>
                        <Toggle 
                          checked={lockSettings.smsAlertEnabled} 
                          onChange={() => setLockSettings({...lockSettings, smsAlertEnabled: !lockSettings.smsAlertEnabled})} 
                        />
                     </SettingRow>

                     <div className={`transition-all duration-500 ease-out overflow-hidden ${lockSettings.smsAlertEnabled ? 'max-h-20 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4 pointer-events-none'}`}>
                         <SettingRow label="短信告警号码" border={false}>
                            <InputField 
                              value={lockSettings.smsAlertNumber} 
                              placeholder="接收手机号"
                              onChange={(v) => setLockSettings({...lockSettings, smsAlertNumber: v})} 
                            />
                         </SettingRow>
                     </div>
                  </div>
              </div>

              <div className="px-1 mb-4 flex items-center gap-3">
                 <div className="w-1.5 h-4 bg-primary-500 rounded-full"></div>
                 <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">触发锁卡阈值配置</h4>
              </div>

              {/* 在线时长控制 */}
              <div className="bg-slate-50/30 rounded-[2rem] border border-slate-100 px-4 mb-4">
                <SettingRow label="按在线时长" border={lockSettings.byOnlineDuration}>
                  <Toggle 
                    checked={lockSettings.byOnlineDuration} 
                    onChange={() => setLockSettings({...lockSettings, byOnlineDuration: !lockSettings.byOnlineDuration})} 
                  />
                </SettingRow>
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${lockSettings.byOnlineDuration ? 'max-h-[300px] opacity-100 pb-4' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                   <div className="pl-6 space-y-2">
                      <div className="flex items-center justify-between py-3">
                         <span className="text-sm font-bold text-slate-600">在线时长(秒)</span>
                         <InputField value={lockSettings.byOnlineDurationVal} onChange={(v) => setLockSettings({...lockSettings, byOnlineDurationVal: v})} showSpinners={true} />
                      </div>
                      <div className="flex flex-col py-3">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2"><span className="text-sm font-bold text-slate-600">锁定时长(秒)</span><HelpCircle className="w-4 h-4 text-blue-500" fill="currentColor" /></div>
                           <InputField value={lockSettings.lockDurationVal} onChange={(v) => setLockSettings({...lockSettings, lockDurationVal: v})} />
                        </div>
                        <p className="mt-2 text-xs font-bold text-slate-400">0表示不锁，-1表示一直锁</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* 按连续未送达短信数 */}
              <div className="bg-slate-50/30 rounded-[2rem] border border-slate-100 px-4 mb-4">
                <SettingRow label="按连续未送达短信数" border={lockSettings.byConsecUndelivered}>
                   <Toggle checked={lockSettings.byConsecUndelivered} onChange={() => setLockSettings({...lockSettings, byConsecUndelivered: !lockSettings.byConsecUndelivered})} />
                </SettingRow>
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${lockSettings.byConsecUndelivered ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                   <div className="pl-6 space-y-6 pt-2">
                      <div className="flex items-center justify-between">
                         <span className="text-sm font-bold text-slate-600">切卡时重置</span>
                         <CheckboxCustom checked={lockSettings.byConsecUndeliveredReset} onChange={(v) => setLockSettings({...lockSettings, byConsecUndeliveredReset: v})} />
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-sm font-bold text-slate-600">短信数</span>
                         <InputField value={lockSettings.byConsecUndeliveredCount} onChange={(v) => setLockSettings({...lockSettings, byConsecUndeliveredCount: parseInt(v) || 0})} />
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-sm font-bold text-slate-600">锁定时长(秒)</span>
                         <InputField value={lockSettings.byConsecUndeliveredLockTime} onChange={(v) => setLockSettings({...lockSettings, byConsecUndeliveredLockTime: parseInt(v) || 0})} />
                      </div>
                   </div>
                </div>
              </div>

              {/* 按累计未送达短信数 */}
              <div className="bg-slate-50/30 rounded-[2rem] border border-slate-100 px-4 mb-4">
                <SettingRow label="按累计未送达短信数" border={lockSettings.byCumulUndelivered}>
                   <Toggle checked={lockSettings.byCumulUndelivered} onChange={() => setLockSettings({...lockSettings, byCumulUndelivered: !lockSettings.byCumulUndelivered})} />
                </SettingRow>
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${lockSettings.byCumulUndelivered ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                   <div className="pl-6 space-y-6 pt-2">
                      <div className="flex items-center justify-between">
                         <span className="text-sm font-bold text-slate-600">短信数</span>
                         <InputField value={lockSettings.byCumulUndeliveredCount} onChange={(v) => setLockSettings({...lockSettings, byCumulUndeliveredCount: parseInt(v) || 0})} />
                      </div>
                   </div>
                </div>
              </div>

              {/* 按连续发送短信失败数 */}
              <div className="bg-slate-50/30 rounded-[2rem] border border-slate-100 px-4 mb-4">
                <SettingRow label="按连续发送短信失败数" border={lockSettings.byConsecSendFail}>
                   <Toggle checked={lockSettings.byConsecSendFail} onChange={() => setLockSettings({...lockSettings, byConsecSendFail: !lockSettings.byConsecSendFail})} />
                </SettingRow>
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${lockSettings.byConsecSendFail ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                   <div className="pl-6 space-y-6 pt-2">
                      <div className="flex items-center justify-between">
                         <span className="text-sm font-bold text-slate-600">失败短信数</span>
                         <InputField value={lockSettings.byConsecSendFailCount} onChange={(v) => setLockSettings({...lockSettings, byConsecSendFailCount: parseInt(v) || 0})} />
                      </div>
                   </div>
                </div>
              </div>

              {/* 按短信模块错误原因代码 */}
              <div className="bg-slate-50/30 rounded-[2rem] border border-slate-100 px-4 mb-4">
                <SettingRow label="按短信模块错误原因代码" border={lockSettings.byModuleErrorCode}>
                   <Toggle checked={lockSettings.byModuleErrorCode} onChange={() => setLockSettings({...lockSettings, byModuleErrorCode: !lockSettings.byModuleErrorCode})} />
                </SettingRow>
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${lockSettings.byModuleErrorCode ? 'max-h-[300px] opacity-100 pb-6' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                   <div className="pl-6 space-y-6 pt-2">
                      <div className="flex flex-col gap-1.5">
                         <div className="flex items-center justify-between"><span className="text-sm font-bold text-slate-600">模块错误码</span><InputField value={lockSettings.byModuleErrorCodeVal} placeholder="请输入" onChange={(v) => setLockSettings({...lockSettings, byModuleErrorCodeVal: v})} /></div>
                         <p className="text-xs font-bold text-slate-400">多个模块错误码原因用分号区分</p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="mt-12 p-8 bg-rose-50/50 border border-rose-100 rounded-[2rem] flex items-start gap-5 shadow-sm">
                <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                   <p className="text-xs font-black text-rose-800 uppercase tracking-widest">锁定逻辑说明</p>
                   <p className="text-sm text-rose-700 leading-relaxed font-bold">
                     当上述启用的任意一项指标达到设定阈值时，网关将根据配置的“锁定时长”执行锁卡动作。
                   </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeshare' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col h-full">
               {/* 功能工具栏 */}
               <div className="flex items-center gap-2 mb-8">
                  <button onClick={openAddModal} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm group">
                    <Plus className="w-4 h-4 text-slate-400 group-hover:text-primary-500" /> 新增
                  </button>
                  <button onClick={openEditModal} disabled={selectedRuleIds.length !== 1} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm group">
                    <Edit3 className="w-4 h-4 text-slate-400 group-hover:text-primary-500" /> 编辑
                  </button>
                  <button onClick={handleDeleteRules} disabled={selectedRuleIds.length === 0} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 transition-all shadow-sm group">
                    <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-rose-500" /> 删除
                  </button>
               </div>

               {/* 数据表格 */}
               <div className="border border-slate-100 rounded-[2rem] overflow-hidden bg-white shadow-soft">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="w-16 px-6 py-5">
                           <CheckboxCustom 
                            checked={selectedRuleIds.length === timeshareRules.length && timeshareRules.length > 0} 
                            onChange={() => setSelectedRuleIds(selectedRuleIds.length === timeshareRules.length ? [] : timeshareRules.map(r => r.id))} 
                           />
                        </th>
                        <th className="w-48 px-6 py-5 text-sm font-black text-slate-800 tracking-tight">时间段 (Start - End)</th>
                        <th className="px-6 py-5 text-sm font-black text-slate-800 tracking-tight">SIM 集合激活状态 (T1M1 - T1M8)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {timeshareRules.map(rule => (
                        <tr key={rule.id} className="hover:bg-slate-50/30 transition-colors group">
                           <td className="px-6 py-5">
                             <CheckboxCustom checked={selectedRuleIds.includes(rule.id)} onChange={() => handleToggleSelectRule(rule.id)} />
                           </td>
                           <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-mono font-black text-slate-700">{rule.start}</span>
                                <ArrowRight className="w-3 h-3 text-slate-300" />
                                <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-mono font-black text-slate-700">{rule.end}</span>
                              </div>
                           </td>
                           <td className="px-6 py-5">
                              <div className="flex flex-wrap items-center gap-2">
                                 {rule.sims.map((checked, idx) => (
                                   <div 
                                      key={idx} 
                                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all border ${
                                        checked 
                                          ? 'bg-primary-600 text-white border-primary-600 shadow-sm shadow-primary-500/20' 
                                          : 'bg-slate-50 text-slate-300 border-slate-100'
                                      }`}
                                   >
                                      M{idx+1}
                                   </div>
                                 ))}
                              </div>
                           </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* 编辑/新增弹窗 (PORTAL) */}
      {isEditModalOpen && editingRule && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl border border-white/60 animate-enter overflow-hidden flex flex-col">
                <div className="px-10 py-6 border-b border-slate-100 bg-slate-50/50 flex-none flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 tracking-tight text-lg">配置分时策略</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Scheduling SIM Set Management</p>
                        </div>
                    </div>
                    <button onClick={() => setIsEditModalOpen(false)} className="p-2 rounded-xl hover:bg-slate-200/50 text-slate-400 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-10 space-y-10 overflow-y-auto max-h-[70vh]">
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2.5">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">开始时间</label>
                         <input type="time" value={editingRule.start} onChange={(e) => setEditingRule({...editingRule, start: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-base font-mono font-black text-slate-700 outline-none focus:border-primary-500 transition-all shadow-inner" />
                      </div>
                      <div className="space-y-2.5">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">结束时间</label>
                         <input type="time" value={editingRule.end} onChange={(e) => setEditingRule({...editingRule, end: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-base font-mono font-black text-slate-700 outline-none focus:border-primary-500 transition-all shadow-inner" />
                      </div>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">SIM 集合勾选 (T1M1 - T1M8)</label>
                      <div className="grid grid-cols-4 gap-4">
                         {editingRule.sims.map((checked, idx) => (
                           <label key={idx} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-100/50 transition-colors group">
                              <span className="text-xs font-black text-slate-700 uppercase">T1M{idx+1}</span>
                              <CheckboxCustom checked={checked} onChange={(v) => { const newSims = [...editingRule.sims]; newSims[idx] = v; setEditingRule({...editingRule, sims: newSims}); }} />
                           </label>
                         ))}
                      </div>
                   </div>
                </div>
                <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4 flex-none">
                    <button onClick={() => setIsEditModalOpen(false)} className="px-8 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">取消</button>
                    <button onClick={saveRule} className="btn-primary px-12 py-3 rounded-2xl text-sm font-black shadow-xl shadow-primary-500/20 active:scale-95 transition-all">保存配置</button>
                </div>
            </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CardSwitchPolicy;
