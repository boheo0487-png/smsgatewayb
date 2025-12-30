
import React, { useState } from 'react';
import { 
  Globe, 
  Server, 
  Lock, 
  User, 
  Zap, 
  ShieldCheck, 
  Check, 
  Save, 
  RefreshCw,
  Link as LinkIcon,
  ShieldAlert,
  Info
} from './Icons';

const Toggle: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <button 
    onClick={onChange}
    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 shadow-inner ${checked ? 'bg-primary-600' : 'bg-slate-200'}`}
  >
    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-md ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
    <div className="md:col-span-3 text-right pr-6">
      <label className="text-base font-black text-slate-700 tracking-tight">{label}</label>
    </div>
    <div className="md:col-span-9">
      {children}
    </div>
  </div>
);

const ImfsSettings: React.FC = () => {
  const [serviceEnabled, setServiceEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState({
    address: '113.45.171.174',
    port: '8901',
    account: 'TGW2',
    password: '******',
    salt: 'sky666',
    remoteAccess: true,
    status: 'connected'
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("IMFS 配置已更新并同步");
    }, 800);
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 animate-enter pb-20">
      {/* 头部标题 */}
      <div className="px-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">IMFS</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">配置 IMFS 服务参数，实现基于互联网的短信分发与远程访问</p>
      </div>

      <div className="glass-card bg-white rounded-[2.5rem] border border-white/60 shadow-soft overflow-hidden min-h-[600px] flex flex-col">
        {/* 服务开关控制区 */}
        <div className="p-10 border-b border-slate-100 bg-slate-50/20">
            <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm transition-all hover:border-primary-300 group">
                <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-3xl transition-all duration-500 ${serviceEnabled ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/30' : 'bg-slate-100 text-slate-400'}`}>
                        <Zap className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">开启服务类型</h2>
                        <p className="text-sm text-slate-400 font-medium mt-1">启用后系统将激活 IMFS 数据传输通道</p>
                    </div>
                </div>
                <Toggle checked={serviceEnabled} onChange={() => setServiceEnabled(!serviceEnabled)} />
            </div>
        </div>

        {/* 内容配置区 */}
        <div className="flex-1 p-10 lg:p-16 flex flex-col justify-center">
            {serviceEnabled ? (
                <div className="max-w-3xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
                    <FormField label="地址">
                        <div className="relative group">
                            <input 
                                type="text" 
                                value={config.address}
                                onChange={(e) => setConfig({...config, address: e.target.value})}
                                className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-base font-mono font-bold text-slate-700 focus:border-primary-500 focus:ring-8 focus:ring-primary-500/5 outline-none transition-all shadow-inner" 
                            />
                            <Globe className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-200 group-focus-within:text-primary-300 transition-colors" />
                        </div>
                    </FormField>

                    <FormField label="端口">
                        <div className="relative group">
                            <input 
                                type="text" 
                                value={config.port}
                                onChange={(e) => setConfig({...config, port: e.target.value})}
                                className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-base font-mono font-bold text-slate-700 focus:border-primary-500 focus:ring-8 focus:ring-primary-500/5 outline-none transition-all shadow-inner" 
                            />
                            <LinkIcon className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-200 group-focus-within:text-primary-300 transition-colors" />
                        </div>
                    </FormField>

                    <FormField label="账号">
                        <div className="relative group">
                            <input 
                                type="text" 
                                value={config.account}
                                onChange={(e) => setConfig({...config, account: e.target.value})}
                                className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-base font-bold text-slate-700 focus:border-primary-500 focus:ring-8 focus:ring-primary-500/5 outline-none transition-all shadow-inner" 
                            />
                            <User className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-200 group-focus-within:text-primary-300 transition-colors" />
                        </div>
                    </FormField>

                    <FormField label="密码">
                        <div className="relative group">
                            <input 
                                type="password" 
                                value={config.password}
                                onChange={(e) => setConfig({...config, password: e.target.value})}
                                className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-base font-bold text-slate-700 focus:border-primary-500 focus:ring-8 focus:ring-primary-500/5 outline-none transition-all shadow-inner" 
                            />
                            <Lock className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-200 group-focus-within:text-primary-300 transition-colors" />
                        </div>
                    </FormField>

                    <FormField label="盐">
                        <div className="relative group">
                            <input 
                                type="text" 
                                value={config.salt}
                                onChange={(e) => setConfig({...config, salt: e.target.value})}
                                className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-base font-mono font-bold text-slate-700 focus:border-primary-500 focus:ring-8 focus:ring-primary-500/5 outline-none transition-all shadow-inner" 
                            />
                            <ShieldAlert className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-200 group-focus-within:text-primary-300 transition-colors" />
                        </div>
                    </FormField>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-start-4 md:col-span-9 flex items-center gap-3">
                            <div 
                                onClick={() => setConfig({...config, remoteAccess: !config.remoteAccess})}
                                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${config.remoteAccess ? 'bg-primary-600 border-primary-600 shadow-lg shadow-primary-500/20' : 'bg-white border-slate-300 hover:border-slate-400'}`}
                            >
                                {config.remoteAccess && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
                            </div>
                            <span className="text-sm font-black text-slate-700">通过该账号进行远程访问</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-4">
                        <div className="md:col-span-3 text-right pr-6">
                            <label className="text-base font-black text-slate-700 tracking-tight">状态</label>
                        </div>
                        <div className="md:col-span-9">
                             <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500 text-white text-sm font-black shadow-lg shadow-emerald-500/20">
                                <LinkIcon className="w-4 h-4" />
                                已连接
                             </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-500">
                    <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-2 shadow-inner border border-slate-100">
                        <ShieldCheck className="w-12 h-12 text-slate-200" />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-slate-400">服务未启用</h4>
                        <p className="text-sm text-slate-300 mt-2 max-w-[300px] leading-relaxed">
                            请开启上方的服务类型开关，配置 IMFS 对接参数，以实现物理终端与云端服务的实时交互。
                        </p>
                    </div>
                </div>
            )}
        </div>

        {/* 底部保存条 */}
        <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] italic">
               <Info className="w-4 h-4 text-primary-400" />
               * 开启服务后系统将尝试在 5 秒内建立长连接握手
            </div>
            <button 
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary px-12 py-4 rounded-[1.5rem] text-sm font-black flex items-center gap-3 shadow-xl shadow-primary-500/20 active:scale-95 transition-all"
            >
                {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                保存 IMFS 配置
            </button>
        </div>
      </div>
    </div>
  );
};

export default ImfsSettings;
