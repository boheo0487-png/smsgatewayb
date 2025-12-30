
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Wifi, 
  MessageSquare, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  RefreshCw, 
  ArrowRight,
  Zap,
  HelpCircle,
  X,
  Check,
  Smartphone,
  Info,
  AlertTriangle,
  Globe,
  Settings2
} from './Icons';

type SubTab = 'browsing' | 'intersend';

interface BrowsingRule {
  id: string;
  start: string;
  end: string;
  flow: number; // MB
}

const CheckboxCustom: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
  <div 
    onClick={() => onChange(!checked)}
    className={`w-6 h-6 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-center shrink-0 ${checked ? 'bg-primary-600 border-primary-600 shadow-md' : 'bg-white border-slate-300 hover:border-slate-400'}`}
  >
    {checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
  </div>
);

const FormRow: React.FC<{ label: string; children: React.ReactNode; helpText?: string }> = ({ label, children, helpText }) => (
  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start py-2">
    <div className="md:col-span-3 pt-3">
      <label className="text-sm font-black text-slate-700 tracking-tight">{label}</label>
    </div>
    <div className="md:col-span-9 space-y-2">
      {children}
      {helpText && <p className="text-[10px] text-slate-400 font-bold italic px-1">{helpText}</p>}
    </div>
  </div>
);

const AntiBlockPolicy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SubTab>('browsing');
  const [isSaving, setIsSaving] = useState(false);
  
  // 1. 模拟上网数据状态
  const [browsingRules, setBrowsingRules] = useState<BrowsingRule[]>([
    { id: '1', start: '00:00', end: '01:00', flow: 1 }
  ]);
  const [selectedBrowsingIds, setSelectedBrowsingIds] = useState<string[]>([]);
  const [isBrowsingModalOpen, setIsBrowsingModalOpen] = useState(false);
  const [editingBrowsing, setEditingBrowsing] = useState<BrowsingRule | null>(null);
  const [targetUrls, setTargetUrls] = useState<string>("https://www.google.com\nhttps://www.bing.com\nhttps://www.wikipedia.org");

  // 2. 短信互发数据状态 (根据截图重构)
  const [interSendConfig, setInterSendConfig] = useState({
    enabled: false,
    content: '',
    consecFailCount: 0,
    onlineDuration: 0,
    keywords: ''
  });

  const handleSaveAll = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("策略已成功应用至设备。");
    }, 1000);
  };

  const openAddBrowsing = () => {
    setEditingBrowsing({ id: Math.random().toString(36).substr(2, 9), start: '00:00', end: '00:00', flow: 1 });
    setIsBrowsingModalOpen(true);
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 animate-enter pb-24">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">防封策略</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">配置模拟上网与短信互动行为，模拟真实用户特征以降低封号风险</p>
        </div>
        
        <div className="flex p-1.5 bg-slate-200/40 rounded-2xl w-fit border border-slate-200/60 backdrop-blur-sm shadow-inner">
          {[
            { id: 'browsing', label: '模拟上网', icon: Wifi },
            { id: 'intersend', label: '短信互发', icon: MessageSquare },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SubTab)}
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

      <div className="glass-card bg-white rounded-[2.5rem] border border-white/60 shadow-soft overflow-hidden min-h-[600px] flex flex-col">
        
        <div className="p-10 flex-1 overflow-y-auto">
          {activeTab === 'browsing' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col h-full space-y-10">
               
               <div className="space-y-6">
                 <div className="flex items-center gap-2">
                    <button onClick={openAddBrowsing} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm group">
                      <Plus className="w-4 h-4 text-slate-400 group-hover:text-primary-500" /> 新增
                    </button>
                    <button disabled={selectedBrowsingIds.length !== 1} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm group">
                      <Edit3 className="w-4 h-4 text-slate-400 group-hover:text-primary-500" /> 编辑
                    </button>
                    <button disabled={selectedBrowsingIds.length === 0} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 transition-all shadow-sm group">
                      <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-rose-500" /> 删除
                    </button>
                 </div>

                 <div className="border border-slate-100 rounded-[2rem] overflow-hidden bg-white shadow-soft">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="w-16 px-6 py-5">
                             <CheckboxCustom 
                              checked={selectedBrowsingIds.length === browsingRules.length && browsingRules.length > 0} 
                              onChange={() => setSelectedBrowsingIds(selectedBrowsingIds.length === browsingRules.length ? [] : browsingRules.map(r => r.id))} 
                             />
                          </th>
                          <th className="px-6 py-5 text-sm font-black text-slate-800 tracking-tight">开始</th>
                          <th className="px-6 py-5 text-sm font-black text-slate-800 tracking-tight">结束</th>
                          <th className="px-6 py-5 text-sm font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                             消耗流量(MB)
                             <Info className="w-3.5 h-3.5 text-primary-500 cursor-help" />
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {browsingRules.map(rule => (
                          <tr key={rule.id} className="hover:bg-slate-50/30 transition-colors">
                             <td className="px-6 py-5">
                               <CheckboxCustom checked={selectedBrowsingIds.includes(rule.id)} onChange={() => setSelectedBrowsingIds(prev => prev.includes(rule.id) ? prev.filter(i => i !== rule.id) : [...prev, rule.id])} />
                             </td>
                             <td className="px-6 py-5 text-sm font-mono font-bold text-slate-600">{rule.start}</td>
                             <td className="px-6 py-5 text-sm font-mono font-bold text-slate-600">{rule.end}</td>
                             <td className="px-6 py-5 text-sm font-mono font-bold text-slate-600">{rule.flow}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
               </div>

               <div className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-10 space-y-6 shadow-inner">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-white text-primary-600 rounded-2xl shadow-sm border border-primary-100">
                           <Globe className="w-6 h-6" />
                        </div>
                        <div>
                           <h3 className="text-lg font-black text-slate-800 tracking-tight">目标 URL 库</h3>
                           <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Target URLs Configuration</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">配置访问地址 (每行一个)</label>
                    <textarea 
                      value={targetUrls}
                      onChange={(e) => setTargetUrls(e.target.value)}
                      rows={5}
                      className="w-full px-6 py-5 bg-white border-2 border-slate-100 rounded-3xl text-sm font-mono font-medium text-slate-600 focus:border-primary-500 focus:ring-8 focus:ring-primary-500/5 outline-none transition-all shadow-inner placeholder:text-slate-300"
                      placeholder="https://..."
                    />
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'intersend' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-3xl mx-auto space-y-12 py-4">
               
               <div className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-10 space-y-10 shadow-inner">
                  
                  <FormRow label="启用">
                     <CheckboxCustom 
                        checked={interSendConfig.enabled} 
                        onChange={() => setInterSendConfig({...interSendConfig, enabled: !interSendConfig.enabled})} 
                     />
                  </FormRow>

                  <FormRow label="短信内容">
                     <textarea 
                        value={interSendConfig.content}
                        onChange={(e) => setInterSendConfig({...interSendConfig, content: e.target.value})}
                        rows={4}
                        placeholder="请输入短信互发内容模板..."
                        className="w-full px-6 py-5 bg-white border-2 border-slate-100 rounded-3xl text-sm font-medium text-slate-600 focus:border-primary-500 focus:ring-8 focus:ring-primary-500/5 outline-none transition-all shadow-inner"
                     />
                  </FormRow>

                  <FormRow label="连续发送失败数">
                     <div className="relative w-48 group">
                        <input 
                           type="number"
                           value={interSendConfig.consecFailCount}
                           onChange={(e) => setInterSendConfig({...interSendConfig, consecFailCount: parseInt(e.target.value) || 0})}
                           className="w-full px-6 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-sm font-mono font-black text-slate-700 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all shadow-sm"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase tracking-widest pointer-events-none">COUNT</div>
                     </div>
                  </FormRow>

                  <FormRow label="在线时长(分)">
                     <div className="relative w-48 group">
                        <input 
                           type="number"
                           value={interSendConfig.onlineDuration}
                           onChange={(e) => setInterSendConfig({...interSendConfig, onlineDuration: parseInt(e.target.value) || 0})}
                           className="w-full px-6 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-sm font-mono font-black text-slate-700 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all shadow-sm"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase tracking-widest pointer-events-none">MINS</div>
                     </div>
                  </FormRow>

                  <FormRow label="接收短信关键字" helpText="多个关键字请用逗号隔开">
                     <input 
                        type="text"
                        value={interSendConfig.keywords}
                        onChange={(e) => setInterSendConfig({...interSendConfig, keywords: e.target.value})}
                        placeholder="请输入关键字..."
                        className="w-full px-6 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all shadow-sm"
                     />
                  </FormRow>

               </div>

               <div className="p-8 bg-amber-50/50 border border-amber-100 rounded-[2rem] flex items-start gap-5">
                  <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                     <p className="text-xs font-black text-amber-800 uppercase tracking-widest">配置说明</p>
                     <p className="text-[13px] text-amber-700 leading-relaxed font-medium">
                        互发策略将随机在设备内部端口间执行。建议设置合理的在线时长，以模拟真人使用的真实互动行为。
                     </p>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* 底部保存条 (全局一致) */}
        <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-end items-center gap-4">
            <div className="flex-1 text-xs text-slate-400 font-bold italic">
               * 点击保存后配置将立即同步至所有活动物理终端
            </div>
            <button 
               onClick={handleSaveAll}
               disabled={isSaving}
               className="btn-primary px-10 py-3.5 rounded-2xl text-sm font-black flex items-center gap-3 shadow-xl shadow-primary-500/20 active:scale-95 transition-all"
            >
               {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
               保存防封策略
            </button>
        </div>
      </div>

      {/* 模拟上网新增弹窗 (保留原本逻辑) */}
      {isBrowsingModalOpen && editingBrowsing && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsBrowsingModalOpen(false)}></div>
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg border border-white/60 animate-enter overflow-hidden flex flex-col">
                <div className="px-10 py-6 border-b border-slate-100 bg-slate-50/50 flex-none flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl shadow-sm">
                            <Wifi className="w-6 h-6" />
                        </div>
                        <h3 className="font-black text-slate-800 tracking-tight text-lg">配置模拟计划</h3>
                    </div>
                    <button onClick={() => setIsBrowsingModalOpen(false)} className="p-2 rounded-xl hover:bg-slate-200/50 text-slate-400 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-10 space-y-8">
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2.5">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">开始时间</label>
                         <input type="time" value={editingBrowsing.start} onChange={(e) => setEditingBrowsing({...editingBrowsing, start: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-base font-mono font-black text-slate-700 outline-none focus:border-primary-500 transition-all shadow-inner" />
                      </div>
                      <div className="space-y-2.5">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">结束时间</label>
                         <input type="time" value={editingBrowsing.end} onChange={(e) => setEditingBrowsing({...editingBrowsing, end: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-base font-mono font-black text-slate-700 outline-none focus:border-primary-500 transition-all shadow-inner" />
                      </div>
                   </div>
                   <div className="space-y-2.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">流量值 (MB)</label>
                      <div className="relative">
                        <input type="number" value={editingBrowsing.flow} onChange={(e) => setEditingBrowsing({...editingBrowsing, flow: parseInt(e.target.value) || 0})} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-lg font-mono font-black text-primary-600 outline-none focus:border-primary-500 transition-all shadow-inner" />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300 uppercase tracking-widest">MEGABYTES</div>
                      </div>
                   </div>
                </div>

                <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                    <button onClick={() => setIsBrowsingModalOpen(false)} className="px-8 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">取消</button>
                    <button onClick={() => {
                        setBrowsingRules(prev => [...prev, editingBrowsing]);
                        setIsBrowsingModalOpen(false);
                    }} className="btn-primary px-12 py-3 rounded-2xl text-sm font-black shadow-xl shadow-primary-500/20 active:scale-95 transition-all">保存计划</button>
                </div>
            </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AntiBlockPolicy;
