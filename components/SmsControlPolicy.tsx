
import React, { useState } from 'react';
import { 
  MessageSquare, 
  Settings2, 
  Activity, 
  Shield, 
  Layers, 
  Zap, 
  ChevronDown, 
  Save, 
  RefreshCw, 
  Check, 
  AlertCircle,
  Info,
  Clock,
  Smartphone,
  AlertTriangle,
  ChevronRight,
  MinusCircle
} from './Icons';

interface ControlStat {
  terminal: string;
  status: 'normal' | 'limited';
  hourly: number;
  hourlyRemaining: string | number;
  daily: number;
  dailyRemaining: string | number;
  monthly: number;
  monthlyRemaining: string | number;
  cumulative: number;
  cumulativeRemaining: string | number;
}

const ToggleCard: React.FC<{ 
  checked: boolean; 
  onChange: (v: boolean) => void; 
  disabled?: boolean;
  label: string;
  icon: React.ElementType;
  activeColor: string;
}> = ({ checked, onChange, disabled, label, icon: Icon, activeColor }) => (
  <div className={`glass-card p-6 rounded-[2rem] border transition-all duration-300 flex flex-col gap-4 flex-1 ${disabled ? 'opacity-40 grayscale pointer-events-none' : 'hover:border-primary-300'}`}>
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-2xl transition-all duration-300 ${checked ? `${activeColor} text-white shadow-lg shadow-primary-500/10` : 'bg-slate-100 text-slate-400'}`}>
        <Icon className="w-6 h-6" />
      </div>
      <button 
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-primary-500/10 ${checked ? 'bg-primary-600' : 'bg-slate-200'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
    <div>
      <h3 className="text-sm font-black text-slate-800 tracking-tight">{label}</h3>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
        {checked ? 'Control Active' : 'Control Disabled'}
      </p>
    </div>
  </div>
);

const FormRowCompact: React.FC<{ label: string; children: React.ReactNode; helpText?: string }> = ({ label, children, helpText }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between gap-4">
      <label className="text-[13px] font-bold text-slate-600 tracking-tight whitespace-nowrap">{label}</label>
      <div className="flex-1 flex justify-end">{children}</div>
    </div>
    {helpText && <p className="text-[10px] text-slate-400 font-medium leading-tight">{helpText}</p>}
  </div>
);

const Checkbox: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
  <div 
    onClick={() => onChange(!checked)}
    className={`w-5 h-5 rounded border-2 cursor-pointer transition-all flex items-center justify-center shrink-0 ${checked ? 'bg-primary-600 border-primary-600 shadow-sm' : 'bg-white border-slate-200 hover:border-primary-400'}`}
  >
    {checked && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
  </div>
);

const ConfigPanel: React.FC<{ 
  title: string; 
  icon: React.ElementType; 
  type: 'sms' | 'mms' | 'master';
  config: any;
  onConfigChange: (newConfig: any) => void;
  accentColor: string;
}> = ({ title, icon: Icon, type, config, onConfigChange, accentColor }) => {
  const [isSaving, setIsSaving] = useState(false);
  const ntpHlp = "使用该功能，请设置网络时间服务器";
  const isMms = type === 'mms';
  const bizName = isMms ? '彩信' : '短信';

  const handleApply = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert(`${title} 已保存并同步`);
    }, 800);
  };

  return (
    <div className="glass-card bg-white rounded-[2rem] border border-white/60 shadow-soft overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className={`px-6 py-4 border-b border-slate-100 flex items-center justify-between ${accentColor} bg-opacity-5`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl text-white ${accentColor}`}>
            <Icon className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-black text-slate-800 tracking-tight uppercase">{title}</h2>
        </div>
        <button 
          onClick={handleApply}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-black text-slate-600 hover:text-primary-600 hover:border-primary-200 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          保存配置
        </button>
      </div>
      
      <div className="p-6 space-y-5 flex-1">
         <FormRowCompact label={`${bizName}用尽操作`}>
            <div className="relative w-full max-w-[110px]">
              <select 
                value={config.action}
                onChange={(e) => onConfigChange({...config, action: e.target.value})}
                className="w-full pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-bold text-slate-700 outline-none appearance-none cursor-pointer"
              >
                <option value="切卡">切卡</option>
                <option value="停机">停机</option>
                {type !== 'mms' && <option value="报警">报警</option>}
                {type === 'mms' && <option value="不锁卡">不锁卡</option>}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
            </div>
         </FormRowCompact>

         <FormRowCompact label={`只统计成功${bizName}`}>
            <Checkbox checked={config.onlySuccess} onChange={(v) => onConfigChange({...config, onlySuccess: v})} />
         </FormRowCompact>

         <FormRowCompact label="分SIM设置">
            <Checkbox checked={config.perSim} onChange={(v) => onConfigChange({...config, perSim: v})} />
         </FormRowCompact>

         <div className="grid grid-cols-2 gap-3 pt-2">
            <FormRowCompact label="小时上限">
               <input type="number" value={config.hLimit} onChange={(e) => onConfigChange({...config, hLimit: e.target.value})} className="w-full px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-mono font-black text-slate-700 outline-none text-right" />
            </FormRowCompact>
            <FormRowCompact label="单日上限">
               <input type="number" value={config.dLimit} onChange={(e) => onConfigChange({...config, dLimit: e.target.value})} className="w-full px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-mono font-black text-slate-700 outline-none text-right" />
            </FormRowCompact>
            <FormRowCompact label="单月上限">
               <input type="number" value={config.mLimit} onChange={(e) => onConfigChange({...config, mLimit: e.target.value})} className="w-full px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-mono font-black text-slate-700 outline-none text-right" />
            </FormRowCompact>
            <FormRowCompact label="累计上限">
               <input type="number" value={config.cLimit} onChange={(e) => onConfigChange({...config, cLimit: e.target.value})} className="w-full px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-mono font-black text-slate-700 outline-none text-right" />
            </FormRowCompact>
         </div>
         <p className="text-[9px] text-slate-400 text-center font-bold tracking-wide italic">*{ntpHlp}</p>
      </div>
    </div>
  );
};

const StatsTable: React.FC<{ title: string; bizLabel: string; icon: React.ElementType; data: ControlStat[]; color: string }> = ({ title, bizLabel, icon: Icon, data, color }) => (
  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-500 overflow-hidden">
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${color}`} />
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</h3>
      </div>
    </div>
    <div className="border border-slate-100 rounded-2xl overflow-x-auto bg-white shadow-soft">
      <table className="w-full text-left border-collapse min-w-[1200px]">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="px-4 py-4 w-12 text-center">
               <Checkbox checked={false} onChange={() => {}} />
            </th>
            <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">终端(端口-卡槽号)</th>
            <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">状态</th>
            <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">小时{bizLabel}</th>
            <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">小时剩余</th>
            <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">当日{bizLabel}</th>
            <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">当日剩余</th>
            <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">当月{bizLabel}</th>
            <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">当月剩余</th>
            <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">累计{bizLabel}</th>
            <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">累计剩余</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 font-mono">
          {data.map((stat, i) => (
            <tr key={i} className="hover:bg-slate-50/30 transition-colors">
              <td className="px-4 py-4 text-center">
                 <Checkbox checked={false} onChange={() => {}} />
              </td>
              <td className="px-4 py-4">
                <span className="text-xs font-black text-slate-700">{stat.terminal}</span>
              </td>
              <td className="px-4 py-4 text-center">
                 <div className="flex justify-center">
                    {stat.status === 'limited' ? (
                       <MinusCircle className="w-4 h-4 text-rose-500" strokeWidth={2.5} />
                    ) : (
                       <div className="w-4 h-4" />
                    )}
                 </div>
              </td>
              <td className="px-4 py-4 text-center text-xs font-bold text-slate-600">{stat.hourly}</td>
              <td className={`px-4 py-4 text-center text-xs font-bold ${stat.hourlyRemaining === '无限制' ? 'text-emerald-500' : 'text-slate-600'}`}>{stat.hourlyRemaining}</td>
              <td className="px-4 py-4 text-center text-xs font-bold text-slate-600">{stat.daily}</td>
              <td className={`px-4 py-4 text-center text-xs font-bold ${stat.dailyRemaining === '无限制' ? 'text-emerald-500' : 'text-slate-600'}`}>{stat.dailyRemaining}</td>
              <td className="px-4 py-4 text-center text-xs font-bold text-slate-600">{stat.monthly}</td>
              <td className={`px-4 py-4 text-center text-xs font-bold ${stat.monthlyRemaining === '无限制' ? 'text-emerald-500' : 'text-slate-600'}`}>{stat.monthlyRemaining}</td>
              <td className="px-4 py-4 text-center text-xs font-bold text-slate-600">{stat.cumulative}</td>
              <td className={`px-4 py-4 text-center text-xs font-bold ${stat.cumulativeRemaining === '无限制' ? 'text-emerald-500' : 'text-slate-600'}`}>{stat.cumulativeRemaining}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SmsControlPolicy: React.FC = () => {
  const [masterEnabled, setMasterEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [mmsEnabled, setMmsEnabled] = useState(false);

  const [smsConfig, setSmsConfig] = useState({ action: '切卡', onlySuccess: false, perSim: false, hLimit: 10, dLimit: 20, mLimit: 0, cLimit: 0 });
  const [mmsConfig, setMmsConfig] = useState({ action: '不锁卡', onlySuccess: false, perSim: false, hLimit: 10, dLimit: 0, mLimit: 0, cLimit: 0 });
  const [masterConfig, setMasterConfig] = useState({ action: '切卡', onlySuccess: false, perSim: false, hLimit: 20, dLimit: 50, mLimit: 0, cLimit: 0 });

  const isAnyActive = masterEnabled || smsEnabled || mmsEnabled;

  const smsStats: ControlStat[] = [
    { terminal: 'M1T1', status: 'normal', hourly: 0, hourlyRemaining: '无限制', daily: 0, dailyRemaining: '无限制', monthly: 0, monthlyRemaining: '无限制', cumulative: 0, cumulativeRemaining: '无限制' },
    { terminal: 'M2T1', status: 'limited', hourly: 0, hourlyRemaining: '无限制', daily: 0, dailyRemaining: '无限制', monthly: 0, monthlyRemaining: '无限制', cumulative: 0, cumulativeRemaining: '无限制' },
    { terminal: 'M3T1', status: 'normal', hourly: 0, hourlyRemaining: '无限制', daily: 0, dailyRemaining: '无限制', monthly: 0, monthlyRemaining: '无限制', cumulative: 0, cumulativeRemaining: '无限制' },
  ];

  const mmsStats: ControlStat[] = [
    { terminal: 'M1T1', status: 'normal', hourly: 0, hourlyRemaining: '无限制', daily: 0, dailyRemaining: '无限制', monthly: 0, monthlyRemaining: '无限制', cumulative: 0, cumulativeRemaining: '无限制' },
    { terminal: 'M2T1', status: 'limited', hourly: 0, hourlyRemaining: '无限制', daily: 0, dailyRemaining: '无限制', monthly: 0, monthlyRemaining: '无限制', cumulative: 0, cumulativeRemaining: '无限制' },
    { terminal: 'M3T1', status: 'normal', hourly: 0, hourlyRemaining: '无限制', daily: 0, dailyRemaining: '无限制', monthly: 0, monthlyRemaining: '无限制', cumulative: 0, cumulativeRemaining: '无限制' },
  ];

  return (
    <div className="max-w-[1500px] mx-auto space-y-8 animate-enter pb-24">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-1">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">短信控制策略</h1>
          <p className="text-sm text-slate-500 font-medium">针对业务发送量进行小时、日、月级别的精细化阈值管控</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <ToggleCard 
          label="短信&彩信控制设置" 
          icon={Layers} 
          checked={masterEnabled} 
          onChange={setMasterEnabled} 
          activeColor="bg-indigo-600"
        />
        <ToggleCard 
          label="短信控制设置" 
          icon={MessageSquare} 
          checked={smsEnabled} 
          disabled={masterEnabled}
          onChange={setSmsEnabled} 
          activeColor="bg-primary-600"
        />
        <ToggleCard 
          label="彩信控制设置" 
          icon={Zap} 
          checked={mmsEnabled} 
          disabled={masterEnabled}
          onChange={setMmsEnabled} 
          activeColor="bg-amber-500"
        />
      </div>

      {isAnyActive ? (
        <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-500">
          
          {/* 配置内容区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {masterEnabled ? (
              <div className="lg:col-span-2">
                <ConfigPanel 
                  title="短信&彩信 综合控制配置" 
                  icon={Layers} 
                  type="master"
                  config={masterConfig} 
                  onConfigChange={setMasterConfig}
                  accentColor="bg-indigo-600"
                />
              </div>
            ) : (
              <>
                {smsEnabled && (
                  <div className={mmsEnabled ? 'lg:col-span-1' : 'lg:col-span-2'}>
                    <ConfigPanel 
                      title="短信 专用控制配置" 
                      icon={MessageSquare} 
                      type="sms"
                      config={smsConfig} 
                      onConfigChange={setSmsConfig}
                      accentColor="bg-primary-600"
                    />
                  </div>
                )}
                {mmsEnabled && (
                  <div className={smsEnabled ? 'lg:col-span-1' : 'lg:col-span-2'}>
                    <ConfigPanel 
                      title="彩信 专用控制配置" 
                      icon={Zap} 
                      type="mms"
                      config={mmsConfig} 
                      onConfigChange={setMmsConfig}
                      accentColor="bg-amber-500"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* 实时统计区域 - 短信与彩信独立展示 */}
          <div className="space-y-8">
             <div className="flex items-center gap-3 px-1">
                <Activity className="w-5 h-5 text-slate-400" />
                <h2 className="text-sm font-black text-slate-800 tracking-tight">业务实时监控详情</h2>
             </div>

             <div className="space-y-12">
                {(masterEnabled || smsEnabled) && (
                  <StatsTable 
                    title="短信 实时控制详情 (SMS Usage Detail)" 
                    bizLabel="短信"
                    icon={MessageSquare} 
                    data={smsStats} 
                    color="text-primary-500" 
                  />
                )}
                {(masterEnabled || mmsEnabled) && (
                  <StatsTable 
                    title="彩信 实时控制详情 (MMS Usage Detail)" 
                    bizLabel="彩信"
                    icon={Zap} 
                    data={mmsStats} 
                    color="text-amber-500" 
                  />
                )}
             </div>
          </div>

          <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-[2rem] flex gap-5 shadow-sm">
            <div className="p-2 bg-white rounded-xl text-blue-500 shadow-sm shrink-0 h-fit">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black text-blue-800 uppercase tracking-widest">统计逻辑说明</p>
              <p className="text-[13px] text-blue-700 font-medium leading-relaxed">
                表格展示了各物理终端在不同时间维度的发送计数及剩余可发送配额。若开启了“综合控制”，短信与彩信将共享上述配额统计。
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card py-32 flex flex-col items-center justify-center text-center rounded-[3rem] border border-dashed border-slate-300 bg-white/40">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner text-slate-200">
            <Shield className="w-12 h-12" />
          </div>
          <h2 className="text-xl font-black text-slate-400 tracking-tight">未激活监控策略</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-[360px] font-medium leading-relaxed px-6">
            请从上方开启业务控制选项。开启后，系统将为您展示多维发送统计报表，支持独立监控短信与彩信的配额消耗。
          </p>
        </div>
      )}

    </div>
  );
};

export default SmsControlPolicy;
