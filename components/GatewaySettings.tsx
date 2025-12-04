import React, { useState } from 'react';
import { 
  Globe, 
  Shield, 
  Bell, 
  Server, 
  Save, 
  RefreshCw, 
  ChevronDown,
  Router,
  Activity,
  Sliders,
  MessageSquare,
  Link as LinkIcon,
  AlertCircle,
  Upload,
  X
} from './Icons';

const Toggle: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <button 
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50 ${checked ? 'bg-primary-600' : 'bg-slate-200'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const SectionHeader: React.FC<{ title: string; description: string; icon: React.ElementType; color: string }> = ({ title, description, icon: Icon, color }) => (
  <div className="flex items-start gap-4 mb-6">
    <div className={`p-2.5 rounded-xl ${color.replace('text-', 'bg-').replace('600', '50')} ${color}`}>
       <Icon className="w-5 h-5" />
    </div>
    <div>
      <h2 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h2>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  </div>
);

const FormGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-slate-50/50 rounded-xl border border-slate-100 p-6 space-y-6">
    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{title}</h3>
    {children}
  </div>
);

const InputField: React.FC<{ label: string; value: string; placeholder?: string; type?: string }> = ({ label, value, placeholder, type = "text" }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    <input 
      type={type} 
      defaultValue={value} 
      placeholder={placeholder}
      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
    />
  </div>
);

const SelectField: React.FC<{ label: string; value: string; options: string[] }> = ({ label, value, options }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    <div className="relative">
      <select defaultValue={value} className="w-full appearance-none px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm">
        {options.map(opt => <option key={opt}>{opt}</option>)}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>
  </div>
);

// New components for Horizontal Layout to match the image
const HorizontalInput: React.FC<{ label: string; value: string; placeholder?: string; type?: string }> = ({ label, value, placeholder, type = "text" }) => (
  <div className="grid grid-cols-[100px_1fr] items-center gap-4">
    <label className="text-sm font-medium text-slate-600 text-right">{label}</label>
    <input 
      type={type}
      defaultValue={value}
      placeholder={placeholder}
      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
    />
  </div>
);

const HorizontalSelect: React.FC<{ label: string; value: string; options: string[] }> = ({ label, value, options }) => (
  <div className="grid grid-cols-[100px_1fr] items-center gap-4">
    <label className="text-sm font-medium text-slate-600 text-right">{label}</label>
    <div className="relative w-full">
      <select defaultValue={value} className="w-full appearance-none px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm">
        {options.map(opt => <option key={opt}>{opt}</option>)}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>
  </div>
);

const HorizontalTextarea: React.FC<{ label: string; placeholder?: string; helpText?: string }> = ({ label, placeholder, helpText }) => (
  <div className="grid grid-cols-[100px_1fr] gap-4">
    <label className="text-sm font-medium text-slate-600 text-right pt-2.5">{label}</label>
    <div className="space-y-1.5">
      <textarea 
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm resize-none"
      />
      {helpText && <p className="text-xs text-slate-400">{helpText}</p>}
    </div>
  </div>
);

const GatewaySettings: React.FC = () => {
  const [vpnProtocol, setVpnProtocol] = useState('禁用');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Advanced Settings State
  const [ntpSync, setNtpSync] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-enter pb-12">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold text-slate-800 tracking-tight">网络参数设置</h1>
           <p className="text-sm text-slate-500 mt-1">配置网关的网络连接、VPN通道及高级管理选项</p>
        </div>
        <div className="flex gap-3">
            <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
               重置
            </button>
            <button 
                onClick={handleSave}
                disabled={loading}
                className="btn-primary px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
               {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
               保存配置
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Network Settings */}
        <div className="glass-card p-6 rounded-2xl border border-white/60 shadow-soft h-full">
            <SectionHeader 
                title="网络设置" 
                description="管理 WAN 口连接与 VPN 通道"
                icon={Globe}
                color="text-primary-600"
            />
            
            <div className="space-y-6">
                <FormGroup title="常规网络">
                    {/* Status Row */}
                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                        <label className="text-sm font-medium text-slate-600 text-right">状态</label>
                        <div className="flex items-center">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm border border-emerald-400">
                                <LinkIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                                已连接
                            </span>
                        </div>
                    </div>

                    <HorizontalSelect label="协议" value="静态地址" options={['静态地址', 'DHCP', 'PPPoE']} />
                    <HorizontalInput label="IPv4 地址" value="192.168.0.74" />
                    <HorizontalInput label="子网掩码" value="255.255.255.0" />
                    <HorizontalInput label="网关" value="192.168.0.1" />
                    <HorizontalInput label="DNS1" value="192.168.0.1" />
                    <HorizontalInput label="DNS2" value="114.114.114.114" />
                </FormGroup>

                <FormGroup title="VPN 设置">
                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                        <div className="flex items-center justify-end gap-1">
                            <label className="text-sm font-medium text-slate-600">协议</label>
                             <div className="group relative">
                                <AlertCircle className="w-3.5 h-3.5 text-primary-500 cursor-help" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    选择 VPN 协议以启用连接
                                </div>
                             </div>
                        </div>
                        <div className="relative w-full">
                            <select 
                                value={vpnProtocol} 
                                onChange={(e) => setVpnProtocol(e.target.value)}
                                className="w-full appearance-none px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
                            >
                                <option value="禁用">禁用</option>
                                <option value="OpenVPN">OpenVPN</option>
                                <option value="PPTP">PPTP</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {vpnProtocol === 'OpenVPN' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 pt-4 border-t border-slate-100/50 mt-4">
                             {/* Mode Selection */}
                             <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                <div className="flex items-center justify-end gap-1">
                                    <label className="text-sm font-medium text-slate-600">模式</label>
                                    <AlertCircle className="w-3.5 h-3.5 text-primary-500 cursor-help" />
                                </div>
                                <div className="flex gap-2">
                                    <div className="relative w-full">
                                        <select className="w-full appearance-none px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm">
                                            <option>口令</option>
                                            <option>证书</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                    <button className="flex-none px-3 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm" title="导入配置">
                                        <Upload className="w-4 h-4" />
                                    </button>
                                </div>
                             </div>

                             <HorizontalInput label="服务器地址" value="" placeholder="请输入" />
                             <HorizontalInput label="用户名" value="" placeholder="请输入" />
                             <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                <label className="text-sm font-medium text-slate-600 text-right">密码</label>
                                <input 
                                  type="password"
                                  placeholder="请输入"
                                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
                                />
                             </div>
                             
                             <HorizontalSelect label="传输协议" value="UDP" options={['UDP', 'TCP']} />
                             
                             <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                <label className="text-sm font-medium text-slate-600 text-right">MTU</label>
                                <input 
                                  type="number"
                                  defaultValue="1500"
                                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
                                />
                             </div>

                             <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                <label className="text-sm font-medium text-slate-600 text-right">证书状态</label>
                                <div>
                                     <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-300 text-white shadow-sm">
                                        <div className="bg-white/20 rounded-full p-0.5">
                                            <X className="w-2.5 h-2.5" strokeWidth={3} />
                                        </div>
                                        未导入
                                    </span>
                                </div>
                             </div>
                        </div>
                    )}
                    
                    {vpnProtocol === 'PPTP' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 pt-4 border-t border-slate-100/50 mt-4">
                             <HorizontalInput label="服务器地址" value="" placeholder="请输入" />
                             <HorizontalInput label="用户名" value="" placeholder="请输入" />
                             <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                <label className="text-sm font-medium text-slate-600 text-right">密码</label>
                                <input 
                                  type="password" 
                                  placeholder="请输入"
                                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
                                />
                             </div>
                             
                             <HorizontalSelect label="CHAP" value="AUTO" options={['AUTO', 'CHAP', 'MS-CHAP', 'MS-CHAPv2']} />
                             <HorizontalSelect label="MPPE" value="No MPPE" options={['No MPPE', 'MPPE-40', 'MPPE-128']} />

                             <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                <label className="text-sm font-medium text-slate-600 text-right">MTU</label>
                                <input 
                                  type="number"
                                  defaultValue="1400"
                                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
                                />
                             </div>

                             <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                <label className="text-sm font-medium text-slate-600 text-right">本地IP</label>
                                <span className="text-sm text-slate-800 font-mono">0.0.0.0</span>
                             </div>
                             <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                <label className="text-sm font-medium text-slate-600 text-right">远端IP</label>
                                <span className="text-sm text-slate-800 font-mono">0.0.0.0</span>
                             </div>
                        </div>
                    )}
                </FormGroup>
            </div>
        </div>

        {/* Advanced Settings */}
        <div className="glass-card p-6 rounded-2xl border border-white/60 shadow-soft h-full">
            <SectionHeader 
                title="高级设置" 
                description="系统管理、通知与远程控制"
                icon={Sliders}
                color="text-indigo-600"
            />

            <div className="space-y-6">
                <FormGroup title="常规系统">
                    <HorizontalInput label="设备名称" value="演示设备" />
                    <HorizontalInput label="时区" value="+08:00" />
                    <HorizontalInput label="本地时间" value="2025-12-04 17:40:24" />
                    
                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                        <label className="text-sm font-medium text-slate-600 text-right">NTP同步</label>
                        <div>
                             <input 
                                type="checkbox" 
                                checked={ntpSync} 
                                onChange={(e) => setNtpSync(e.target.checked)}
                                className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer" 
                             />
                        </div>
                    </div>
                    
                    {ntpSync && (
                         <div className="space-y-4 animate-in fade-in slide-in-from-top-1">
                             <HorizontalInput label="NTP服务器地址 1" value="0.openwrt.pool.ntp.org" />
                             <HorizontalInput label="NTP服务器地址 2" value="1.openwrt.pool.ntp.org" />
                         </div>
                    )}

                    <HorizontalTextarea 
                        label="允许的IP地址" 
                        helpText="多个以英文分号分隔(最大1023个英文字符)"
                    />
                    <HorizontalTextarea 
                        label="不允许的IP地址" 
                        helpText="多个以英文分号分隔(最大1023个英文字符)"
                    />
                </FormGroup>

                <FormGroup title="通知设置">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                            <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-md ${notifyEmail ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <Bell className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-slate-700">邮件告警通知</span>
                            </div>
                            <Toggle checked={notifyEmail} onChange={() => setNotifyEmail(!notifyEmail)} />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                            <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-md ${notifySms ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <MessageSquare className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-slate-700">短信转发通知</span>
                            </div>
                            <Toggle checked={notifySms} onChange={() => setNotifySms(!notifySms)} />
                        </div>
                    </div>
                </FormGroup>

                <FormGroup title="设备网管 (TR-069)">
                        <InputField label="ACS URL" value="http://acs.example.com/cpe" />
                        <div className="grid grid-cols-2 gap-4">
                        <InputField label="ACS 用户名" value="cpe" />
                        <InputField label="ACS 密码" value="******" type="password" />
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-xs text-slate-500">上次心跳: 2 分钟前</span>
                        </div>
                </FormGroup>
            </div>
        </div>

      </div>
    </div>
  );
};

export default GatewaySettings;