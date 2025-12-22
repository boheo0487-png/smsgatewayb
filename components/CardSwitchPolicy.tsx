
import React, { useState } from 'react';
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
  Check
} from './Icons';

type PolicySubTab = 'lock' | 'timeshare';

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
    className={`w-6 h-6 rounded-md border-2 cursor-pointer transition-all flex items-center justify-center ${checked ? 'bg-primary-600 border-primary-600 shadow-md' : 'bg-white border-slate-300'}`}
  >
    {checked && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
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
  const [isSaving, setIsSaving] = useState(false);
  
  // 核心锁卡配置状态
  const [lockSettings, setLockSettings] = useState({
    smsAlertEnabled: false,
    smsAlertNumber: '',
    byOnlineDuration: false,
    byOnlineDurationVal: 7200,
    lockDurationVal: 0,
    
    // 连续未送达联动项
    byConsecUndelivered: false,
    byConsecUndeliveredReset: false,
    byConsecUndeliveredUssd: false,
    byConsecUndeliveredCount: 5,
    byConsecUndeliveredLockTime: 0,

    // 累计未送达联动项
    byCumulUndelivered: false,
    byCumulUndeliveredReset: false,
    byCumulUndeliveredUssd: false,
    byCumulUndeliveredCount: 20,
    byCumulUndeliveredLockTime: 0,

    // 累计发送失败联动项
    byCumulSendFail: false,
    byCumulSendFailReset: false,
    byCumulSendFailUssd: false,
    byCumulSendFailCount: 10,
    byCumulSendFailLockTime: 0,

    // 累计发送短信数联动项
    byCumulSent: false,
    byCumulSentReset: false,
    byCumulSentUssd: false,
    byCumulSentCount: 500,
    byCumulSentLockTime: 0,

    // 连续发送失败联动项
    byConsecSendFail: false,
    byConsecSendFailReset: false,
    byConsecSendFailUssd: false,
    byConsecSendFailCount: 5,
    byConsecSendFailLockTime: 0,

    // 累计接收短信数联动项
    byCumulReceived: false,
    byCumulReceivedReset: false,
    byCumulReceivedCount: 8,
    byCumulReceivedLockTime: 0,
    byCumulReceivedKeywords: '',
    byCumulReceivedSenders: '',

    // 短信模块错误原因代码
    byModuleErrorCode: false,
    byModuleErrorCodeVal: '',
    byModuleErrorCodeOccurrences: 3,

    // 按端口互打次数 (优化: 联动显示)
    byPortIntercall: false,
    byPortIntercallReset: false,
    byPortIntercallUssd: false,
    byPortIntercallCount: 50,
    byPortIntercallLockTime: 0
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("策略已下发。");
    }, 1000);
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
        
        {/* 工具栏 */}
        <div className="px-8 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                策略内核 v2.5.1
             </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-600 text-sm font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" /> 恢复默认
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary px-8 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-primary-500/20 transition-all disabled:opacity-50 active:scale-95 flex items-center gap-3"
            >
               {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
               保存配置
            </button>
          </div>
        </div>

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
                         <InputField 
                            value={lockSettings.byOnlineDurationVal} 
                            onChange={(v) => setLockSettings({...lockSettings, byOnlineDurationVal: v})} 
                            showSpinners={true}
                         />
                      </div>
                      <div className="flex flex-col py-3">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                             <span className="text-sm font-bold text-slate-600">锁定时长(秒)</span>
                             <HelpCircle className="w-4 h-4 text-blue-500" fill="currentColor" />
                           </div>
                           <InputField 
                              value={lockSettings.lockDurationVal} 
                              onChange={(v) => setLockSettings({...lockSettings, lockDurationVal: v})} 
                           />
                        </div>
                        <p className="mt-2 text-xs font-bold text-slate-400">0表示不锁，-1表示一直锁</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* 按连续未送达短信数 */}
              <div className="bg-slate-50/30 rounded-[2rem] border border-slate-100 px-4 mb-4">
                <SettingRow label="按连续未送达短信数" border={lockSettings.byConsecUndelivered}>
                   <Toggle 
                    checked={lockSettings.byConsecUndelivered} 
                    onChange={() => setLockSettings({...lockSettings, byConsecUndelivered: !lockSettings.byConsecUndelivered})} 
                   />
                </SettingRow>

                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${lockSettings.byConsecUndelivered ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                   <div className="pl-6 space-y-6 pt-2">
                      <div className="flex flex-col gap-1.5">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <span className="text-sm font-bold text-slate-600">切卡时重置</span>
                               <Info className="w-4 h-4 text-blue-500 cursor-help" fill="currentColor" />
                            </div>
                            <CheckboxCustom 
                               checked={lockSettings.byConsecUndeliveredReset} 
                               onChange={(v) => setLockSettings({...lockSettings, byConsecUndeliveredReset: v})} 
                            />
                         </div>
                         <p className="text-xs font-bold text-slate-400">切换到下一张卡时重置这个条件</p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                         <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-600">USSD查询</span>
                            <CheckboxCustom 
                               checked={lockSettings.byConsecUndeliveredUssd} 
                               onChange={(v) => setLockSettings({...lockSettings, byConsecUndeliveredUssd: v})} 
                            />
                         </div>
                         <p className="text-xs font-bold text-slate-400">切换前发送USSD查询命令</p>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-sm font-bold text-slate-600">短信数</span>
                         <InputField 
                            value={lockSettings.byConsecUndeliveredCount} 
                            onChange={(v) => setLockSettings({...lockSettings, byConsecUndeliveredCount: parseInt(v) || 0})} 
                         />
                      </div>
                      <div className="flex flex-col gap-1.5">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <span className="text-sm font-bold text-slate-600">锁定时长(秒)</span>
                               <Info className="w-4 h-4 text-blue-500 cursor-help" fill="currentColor" />
                            </div>
                            <InputField 
                               value={lockSettings.byConsecUndeliveredLockTime} 
                               onChange={(v) => setLockSettings({...lockSettings, byConsecUndeliveredLockTime: parseInt(v) || 0})} 
                            />
                         </div>
                         <p className="text-xs font-bold text-slate-400">0表示不锁，-1表示一直锁</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* 按累计未送达短信数 */}
              <div className="bg-slate-50/30 rounded-[2rem] border border-slate-100 px-4 mb-4">
                <SettingRow label="按累计未送达短信数" border={lockSettings.byCumulUndelivered}>
                   <Toggle 
                    checked={lockSettings.byCumulUndelivered} 
                    onChange={() => setLockSettings({...lockSettings, byCumulUndelivered: !lockSettings.byCumulUndelivered})} 
                   />
                </SettingRow>

                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${lockSettings.byCumulUndelivered ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                   <div className="pl-6 space-y-6 pt-2">
                      <div className="flex flex-col gap-1.5">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <span className="text-sm font-bold text-slate-600">切卡时重置</span>
                               <Info className="w-4 h-4 text-blue-500 cursor-help" fill="currentColor" />
                            </div>
                            <CheckboxCustom 
                               checked={lockSettings.byCumulUndeliveredReset} 
                               onChange={(v) => setLockSettings({...lockSettings, byCumulUndeliveredReset: v})} 
                            />
                         </div>
                         <p className="text-xs font-bold text-slate-400">切换到下一张卡时重置这个条件</p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                         <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-600">USSD查询</span>
                            <CheckboxCustom 
                               checked={lockSettings.byCumulUndeliveredUssd} 
                               onChange={(v) => setLockSettings({...lockSettings, byCumulUndeliveredUssd: v})} 
                            />
                         </div>
                         <p className="text-xs font-bold text-slate-400">切换前发送USSD查询命令</p>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-sm font-bold text-slate-600">短信数</span>
                         <InputField 
                            value={lockSettings.byCumulUndeliveredCount} 
                            onChange={(v) => setLockSettings({...lockSettings, byCumulUndeliveredCount: parseInt(v) || 0})} 
                         />
                      </div>
                      <div className="flex flex-col gap-1.5">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <span className="text-sm font-bold text-slate-600">锁定时长(秒)</span>
                               <Info className="w-4 h-4 text-blue-500 cursor-help" fill="currentColor" />
                            </div>
                            <InputField 
                               value={lockSettings.byCumulUndeliveredLockTime} 
                               onChange={(v) => setLockSettings({...lockSettings, byCumulUndeliveredLockTime: parseInt(v) || 0})} 
                            />
                         </div>
                         <p className="text-xs font-bold text-slate-400">0表示不锁，-1表示一直锁</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* 按累计发送短信失败数 */}
              <div className="bg-slate-50/30 rounded-[2rem] border border-slate-100 px-4 mb-4">
                <SettingRow label="按累计发送短信失败数" border={lockSettings.byCumulSendFail}>
                   <Toggle 
                    checked={lockSettings.byCumulSendFail} 
                    onChange={() => setLockSettings({...lockSettings, byCumulSendFail: !lockSettings.byCumulSendFail})} 
                   />
                </SettingRow>

                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${lockSettings.byCumulSendFail ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                   <div className="pl-6 space-y-6 pt-2">
                      <div className="flex flex-col gap-1.5">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <span className="text-sm font-bold text-slate-600">切卡时重置</span>
                               <Info className="w-4 h-4 text-blue-500 cursor-help" fill="currentColor" />
                            </div>
                            <CheckboxCustom 
                               checked={lockSettings.byCumulSendFailReset} 
                               onChange={(v) => setLockSettings({...lockSettings, byCumulSendFailReset: v})} 
                            />
                         </div>
                         <p className="text-xs font-bold text-slate-400">切换到下一张卡时重置这个条件</p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                         <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-600">USSD查询</span>
                            <CheckboxCustom 
                               checked={lockSettings.byCumulSendFailUssd} 
                               onChange={(v) => setLockSettings({...lockSettings, byCumulSendFailUssd: v})} 
                            />
                         </div>
                         <p className="text-xs font-bold text-slate-400">切换前发送USSD查询命令</p>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-sm font-bold text-slate-600">短信数</span>
                         <InputField 
                            value={lockSettings.byCumulSendFailCount} 
                            onChange={(v) => setLockSettings({...lockSettings, byCumulSendFailCount: parseInt(v) || 0})} 
                         />
                      </div>
                      <div className="flex flex-col gap-1.5">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <span className="text-sm font-bold text-slate-600">锁定时长(秒)</span>
                               <Info className="w-4 h-4 text-blue-500 cursor-help" fill="currentColor" />
                            </div>
                            <InputField 
                               value={lockSettings.byCumulSendFailLockTime} 
                               onChange={(v) => setLockSettings({...lockSettings, byCumulSendFailLockTime: parseInt(v) || 0})} 
                            />
                         </div>
                         <p className="text-xs font-bold text-slate-400">0表示不锁，-1表示一直锁</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* 按累计发送短信数 */}
              <div className="bg-slate-50/30 rounded-[2rem] border border-slate-100 px-4 mb-4">
                <SettingRow label="按累计发送短信数" border={lockSettings.byCumulSent}>
                   <Toggle 
                    checked={lockSettings.byCumulSent} 
                    onChange={() => setLockSettings({...lockSettings, byCumulSent: !lockSettings.byCumulSent})} 
                   />
                </SettingRow>

                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${lockSettings.byCumulSent ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                   <div className="pl-6 space-y-6 pt-2">
                      <div className="flex flex-col gap-1.5">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <span className="text-sm font-bold text-slate-600">切卡时重置</span>
                               <Info className="w-4 h-4 text-blue-500 cursor-help" fill="currentColor" />
                            </div>
                            <CheckboxCustom 
                               checked={lockSettings.byCumulSentReset} 
                               onChange={(v) => setLockSettings({...lockSettings, byCumulSentReset: v})} 
                            />
                         </div>
                         <p className="text-xs font-bold text-slate-400">切换到下一张卡时重置这个条件</p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                         <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-600">USSD查询</span>
                            <CheckboxCustom 
                               checked={lockSettings.byCumulSentUssd} 
                               onChange={(v) => setLockSettings({...lockSettings, byCumulSentUssd: v})} 
                            />
                         </div>
                         <p className="text-xs font-bold text-slate-400">切换前发送USSD查询命令</p>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-sm font-bold text-slate-600">短信数</span>
                         <InputField 
                            value={lockSettings.byCumulSentCount} 
                            onChange={(v) => setLockSettings({...lockSettings, byCumulSentCount: parseInt(v) || 0})} 
                         />
                      </div>
                      <div className="flex flex-col gap-1.5">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <span className="text-sm font-bold text-slate-600">锁定时长(秒)</span>
                               <Info className="w-4 h-4 text-blue-500 cursor-help" fill="currentColor" />
                            </div>
                            <InputField 
                               value={lockSettings.byCumulSentLockTime} 
                               onChange={(v) => setLockSettings({...lockSettings, byCumulSentLockTime: parseInt(v) || 0})} 
                            />
                         </div>
                         <p className="text-xs font-bold text-slate-400">0表示不锁，-1表示一直锁</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* 按连续发送短信失败数 */}
              <div className="bg-slate-50/30 rounded-[2rem] border border-slate-100 px-4 mb-4">
                <SettingRow label="按连续发送短信失败数" border={lockSettings.byConsecSendFail}>
                   <Toggle 
                    checked={lockSettings.byConsecSendFail} 
                    onChange={() => setLockSettings({...lockSettings, byConsecSendFail: !lockSettings.byConsecSendFail})} 
                   />
                </SettingRow>

                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${lockSettings.byConsecSendFail ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                   <div className="pl-6 space-y-6 pt-2">
                      <div className="flex flex-col gap-1.5">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <span className="text-sm font-bold text-slate-600">切卡时重置</span>
                               <Info className="w-4 h-4 text-blue-500 cursor-help" fill="currentColor" />
                            </div>
                            <CheckboxCustom 
                               checked={lockSettings.byConsecSendFailReset} 
                               onChange={(v) => setLockSettings({...lockSettings, byConsecSendFailReset: v})} 
                            />
                         </div>
                         <p className="text-xs font-bold text-slate-400">切换到下一张卡时重置这个条件</p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                         <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-600">USSD查询</span>
                            <CheckboxCustom 
                               checked={lockSettings.byConsecSendFailUssd} 
                               onChange={(v) => setLockSettings({...lockSettings, byConsecSendFailUssd: v})} 
                            />
                         </div>
                         <p className="text-xs font-bold text-slate-400">切换前发送USSD查询命令</p>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-sm font-bold text-slate-600">短信数</span>
                         <InputField 
                            value={lockSettings.byConsecSendFailCount} 
                            onChange={(v) => setLockSettings({...lockSettings, byConsecSendFailCount: parseInt(v) || 0})} 
                         />
                      </div>
                      <div className="flex flex-col gap-1.5">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <span className="text-sm font-bold text-slate-600">锁定时长(秒)</span>
                               <Info className="w-4 h-4 text-blue-500 cursor-help" fill="currentColor" />
                            </div>
                            <InputField 
                               value={lockSettings.byConsecSendFailLockTime} 
                               onChange={(v) => setLockSettings({...lockSettings, byConsecSendFailLockTime: parseInt(v) || 0})} 
                            />
                         </div>
                         <p className="text-xs font-bold text-slate-400">0表示不锁，-1表示一直锁</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* 按累计接收短信数 */}
              <div className="bg-slate-50/30 rounded-[2rem] border border-slate-100 px-4 mb-4">
                <SettingRow label="按累计接收短信数" border={lockSettings.byCumulReceived}>
                   <Toggle 
                    checked={lockSettings.byCumulReceived} 
                    onChange={() => setLockSettings({...lockSettings, byCumulReceived: !lockSettings.byCumulReceived})} 
                   />
                </SettingRow>

                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${lockSettings.byCumulReceived ? 'max-h-[600px] opacity-100 pb-6' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                   <div className="pl-6 space-y-6 pt-2">
                      <div className="flex flex-col gap-1.5">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <span className="text-sm font-bold text-slate-600">切卡时重置</span>
                               <Info className="w-4 h-4 text-blue-500 cursor-help" fill="currentColor" />
                            </div>
                            <CheckboxCustom 
                               checked={lockSettings.byCumulReceivedReset} 
                               onChange={(v) => setLockSettings({...lockSettings, byCumulReceivedReset: v})} 
                            />
                         </div>
                         <p className="text-xs font-bold text-slate-400">切换到下一张卡时重置这个条件</p>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-sm font-bold text-slate-600">短信数</span>
                         <InputField 
                            value={lockSettings.byCumulReceivedCount} 
                            onChange={(v) => setLockSettings({...lockSettings, byCumulReceivedCount: parseInt(v) || 0})} 
                         />
                      </div>
                      <div className="flex flex-col gap-1.5">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <span className="text-sm font-bold text-slate-600">锁定时长(秒)</span>
                               <Info className="w-4 h-4 text-blue-500 cursor-help" fill="currentColor" />
                            </div>
                            <InputField 
                               value={lockSettings.byCumulReceivedLockTime} 
                               onChange={(v) => setLockSettings({...lockSettings, byCumulReceivedLockTime: parseInt(v) || 0})} 
                            />
                         </div>
                         <p className="text-xs font-bold text-slate-400">0表示不锁，-1表示一直锁</p>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-sm font-bold text-slate-600">短信内容关键字</span>
                         <InputField 
                            value={lockSettings.byCumulReceivedKeywords} 
                            placeholder="请输入"
                            onChange={(v) => setLockSettings({...lockSettings, byCumulReceivedKeywords: v})} 
                         />
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-sm font-bold text-slate-600">发送号码</span>
                         <InputField 
                            value={lockSettings.byCumulReceivedSenders} 
                            placeholder="请输入"
                            onChange={(v) => setLockSettings({...lockSettings, byCumulReceivedSenders: v})} 
                         />
                      </div>
                   </div>
                </div>
              </div>

              {/* 按短信模块错误原因代码 */}
              <div className="bg-slate-50/30 rounded-[2rem] border border-slate-100 px-4 mb-4">
                <SettingRow label="按短信模块错误原因代码" border={lockSettings.byModuleErrorCode}>
                   <Toggle 
                    checked={lockSettings.byModuleErrorCode} 
                    onChange={() => setLockSettings({...lockSettings, byModuleErrorCode: !lockSettings.byModuleErrorCode})} 
                   />
                </SettingRow>

                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${lockSettings.byModuleErrorCode ? 'max-h-[300px] opacity-100 pb-6' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                   <div className="pl-6 space-y-6 pt-2">
                      <div className="flex items-center justify-between">
                         <span className="text-sm font-bold text-slate-600">连续出现次数</span>
                         <InputField 
                            value={lockSettings.byModuleErrorCodeOccurrences} 
                            onChange={(v) => setLockSettings({...lockSettings, byModuleErrorCodeOccurrences: parseInt(v) || 0})} 
                            showSpinners={true}
                         />
                      </div>

                      <div className="flex flex-col gap-1.5">
                         <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-600">模块错误码</span>
                            <InputField 
                               value={lockSettings.byModuleErrorCodeVal} 
                               placeholder="请输入"
                               onChange={(v) => setLockSettings({...lockSettings, byModuleErrorCodeVal: v})} 
                            />
                         </div>
                         <p className="text-xs font-bold text-slate-400">多个模块错误码原因用分号区分</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* 按端口互打次数 (优化: 联动显示) */}
              <div className="bg-slate-50/30 rounded-[2rem] border border-slate-100 px-4 mb-4">
                <SettingRow label="按端口互打次数" border={lockSettings.byPortIntercall}>
                  <Toggle 
                    checked={lockSettings.byPortIntercall} 
                    onChange={() => setLockSettings({...lockSettings, byPortIntercall: !lockSettings.byPortIntercall})} 
                  />
                </SettingRow>

                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${lockSettings.byPortIntercall ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                   <div className="pl-6 space-y-6 pt-2">
                      {/* 切卡时重置 */}
                      <div className="flex flex-col gap-1.5">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <span className="text-sm font-bold text-slate-600">切卡时重置</span>
                               <Info className="w-4 h-4 text-blue-500 cursor-help" fill="currentColor" />
                            </div>
                            <CheckboxCustom 
                               checked={lockSettings.byPortIntercallReset} 
                               onChange={(v) => setLockSettings({...lockSettings, byPortIntercallReset: v})} 
                            />
                         </div>
                         <p className="text-xs font-bold text-slate-400">切换到下一张卡时重置这个条件</p>
                      </div>

                      {/* USSD查询 */}
                      <div className="flex flex-col gap-1.5">
                         <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-600">USSD查询</span>
                            <CheckboxCustom 
                               checked={lockSettings.byPortIntercallUssd} 
                               onChange={(v) => setLockSettings({...lockSettings, byPortIntercallUssd: v})} 
                            />
                         </div>
                         <p className="text-xs font-bold text-slate-400">切换前发送USSD查询命令</p>
                      </div>

                      {/* 累计互打次数 */}
                      <div className="flex items-center justify-between">
                         <span className="text-sm font-bold text-slate-600">累计互打次数</span>
                         <InputField 
                            value={lockSettings.byPortIntercallCount} 
                            onChange={(v) => setLockSettings({...lockSettings, byPortIntercallCount: parseInt(v) || 0})} 
                         />
                      </div>

                      {/* 锁定时长(秒) */}
                      <div className="flex flex-col gap-1.5">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <span className="text-sm font-bold text-slate-600">锁定时长(秒)</span>
                               <Info className="w-4 h-4 text-blue-500 cursor-help" fill="currentColor" />
                            </div>
                            <InputField 
                               value={lockSettings.byPortIntercallLockTime} 
                               onChange={(v) => setLockSettings({...lockSettings, byPortIntercallLockTime: parseInt(v) || 0})} 
                            />
                         </div>
                         <p className="text-xs font-bold text-slate-400">0表示不锁，-1表示一直锁</p>
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
            <div className="p-12 text-center text-slate-400">
               <Sliders className="w-12 h-12 mx-auto mb-4 opacity-20" />
               <p className="text-sm font-bold">分时策略正在加载中...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardSwitchPolicy;
