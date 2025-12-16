
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

// SectionHeader removed as requested

const FormGroup: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = "" }) => (
  <div className={`bg-slate-50/50 rounded-xl border border-slate-100 p-6 space-y-6 ${className}`}>
    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
        {title}
    </h3>
    {children}
  </div>
);

const HorizontalInput: React.FC<{ label: string; value: string; placeholder?: string; type?: string }> = ({ label, value, placeholder, type = "text" }) => (
  <div className="grid grid-cols-1 xl:grid-cols-[120px_1fr] items-center gap-2 xl:gap-4">
    <label className="text-sm font-medium text-slate-600 xl:text-right">{label}</label>
    <input 
      type={type}
      defaultValue={value}
      placeholder={placeholder}
      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
    />
  </div>
);

const HorizontalSelect: React.FC<{ label: string; value?: string; options: string[]; onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void }> = ({ label, value, options, onChange }) => (
  <div className="grid grid-cols-1 xl:grid-cols-[120px_1fr] items-center gap-2 xl:gap-4">
    <label className="text-sm font-medium text-slate-600 xl:text-right">{label}</label>
    <div className="relative w-full">
      <select 
        value={value} 
        onChange={onChange}
        defaultValue={onChange ? undefined : value}
        className="w-full appearance-none px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>
  </div>
);

const HorizontalTextarea: React.FC<{ label: string; placeholder?: string; helpText?: string }> = ({ label, placeholder, helpText }) => (
  <div className="grid grid-cols-1 xl:grid-cols-[120px_1fr] gap-2 xl:gap-4">
    <label className="text-sm font-medium text-slate-600 xl:text-right pt-2.5">{label}</label>
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

const HorizontalToggle: React.FC<{ label: string; checked?: boolean; defaultChecked?: boolean }> = ({ label, checked, defaultChecked }) => {
    const [isChecked, setIsChecked] = React.useState(defaultChecked || false);
    const val = checked !== undefined ? checked : isChecked;
    
    return (
        <div className="grid grid-cols-[1fr_auto] xl:grid-cols-[120px_1fr] items-center gap-4">
            <label className="text-sm font-medium text-slate-600 xl:text-right order-1 xl:order-none">{label}</label>
            <div className="order-2 xl:order-none">
               <Toggle checked={val} onChange={() => setIsChecked(!val)} />
            </div>
        </div>
    );
}

const GatewaySettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'network' | 'advanced'>('network');
  const [vpnProtocol, setVpnProtocol] = useState('禁用');
  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mgmtType, setMgmtType] = useState('禁用');
  
  // Advanced Settings State
  const [ntpSync, setNtpSync] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-enter pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                className="btn-primary px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary-500/20"
            >
               {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
               保存配置
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl w-fit border border-slate-200/60">
        <button 
            onClick={() => setActiveTab('network')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 ${activeTab === 'network' ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
        >
            <Globe className="w-4 h-4" />
            网络设置
        </button>
        <button 
            onClick={() => setActiveTab('advanced')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 ${activeTab === 'advanced' ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
        >
            <Sliders className="w-4 h-4" />
            高级设置
        </button>
      </div>

      {/* Content Area */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/60 shadow-soft min-h-[500px]">
        
        {/* Network Settings Tab */}
        {activeTab === 'network' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <FormGroup title="常规网络">
                        {/* Status Row */}
                        <div className="grid grid-cols-1 xl:grid-cols-[120px_1fr] items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 xl:text-right">状态</label>
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
                        <div className="grid grid-cols-1 xl:grid-cols-[120px_1fr] items-center gap-2 xl:gap-4">
                            <div className="flex items-center xl:justify-end gap-1">
                                <label className="text-sm font-medium text-slate-600">协议</label>
                                <div className="group relative">
                                    <AlertCircle className="w-3.5 h-3.5 text-primary-500 cursor-help" />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
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
                                <div className="grid grid-cols-1 xl:grid-cols-[120px_1fr] items-center gap-2 xl:gap-4">
                                    <div className="flex items-center xl:justify-end gap-1">
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
                                <div className="grid grid-cols-1 xl:grid-cols-[120px_1fr] items-center gap-2 xl:gap-4">
                                    <label className="text-sm font-medium text-slate-600 xl:text-right">密码</label>
                                    <input 
                                    type="password"
                                    placeholder="请输入"
                                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
                                    />
                                </div>
                                
                                <HorizontalSelect label="传输协议" value="UDP" options={['UDP', 'TCP']} />
                                
                                <div className="grid grid-cols-1 xl:grid-cols-[120px_1fr] items-center gap-2 xl:gap-4">
                                    <label className="text-sm font-medium text-slate-600 xl:text-right">MTU</label>
                                    <input 
                                    type="number"
                                    defaultValue="1500"
                                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-[120px_1fr] items-center gap-2 xl:gap-4">
                                    <label className="text-sm font-medium text-slate-600 xl:text-right">证书状态</label>
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
                                <div className="grid grid-cols-1 xl:grid-cols-[120px_1fr] items-center gap-2 xl:gap-4">
                                    <label className="text-sm font-medium text-slate-600 xl:text-right">密码</label>
                                    <input 
                                    type="password" 
                                    placeholder="请输入"
                                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
                                    />
                                </div>
                                
                                <HorizontalSelect label="CHAP" value="AUTO" options={['AUTO', 'CHAP', 'MS-CHAP', 'MS-CHAPv2']} />
                                <HorizontalSelect label="MPPE" value="No MPPE" options={['No MPPE', 'MPPE-40', 'MPPE-128']} />

                                <div className="grid grid-cols-1 xl:grid-cols-[120px_1fr] items-center gap-2 xl:gap-4">
                                    <label className="text-sm font-medium text-slate-600 xl:text-right">MTU</label>
                                    <input 
                                    type="number"
                                    defaultValue="1400"
                                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-[120px_1fr] items-center gap-2 xl:gap-4">
                                    <label className="text-sm font-medium text-slate-600 xl:text-right">本地IP</label>
                                    <span className="text-sm text-slate-800 font-mono">0.0.0.0</span>
                                </div>
                                <div className="grid grid-cols-1 xl:grid-cols-[120px_1fr] items-center gap-2 xl:gap-4">
                                    <label className="text-sm font-medium text-slate-600 xl:text-right">远端IP</label>
                                    <span className="text-sm text-slate-800 font-mono">0.0.0.0</span>
                                </div>
                            </div>
                        )}
                    </FormGroup>
                </div>
            </div>
        )}

        {/* Advanced Settings Tab */}
        {activeTab === 'advanced' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-8">
                        <FormGroup title="常规系统">
                            <HorizontalInput label="设备名称" value="演示设备" />
                            <HorizontalInput label="时区" value="+08:00" />
                            <HorizontalInput label="本地时间" value="2025-12-04 17:40:24" />
                            
                            <div className="grid grid-cols-1 xl:grid-cols-[120px_1fr] items-center gap-2 xl:gap-4">
                                <label className="text-sm font-medium text-slate-600 xl:text-right">NTP同步</label>
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
                            <div className="grid grid-cols-1 xl:grid-cols-[120px_1fr] items-center gap-2 xl:gap-4">
                                <label className="text-sm font-medium text-slate-600 xl:text-right">启用</label>
                                <div>
                                    <Toggle 
                                        checked={notifyEnabled} 
                                        onChange={() => setNotifyEnabled(!notifyEnabled)} 
                                    />
                                </div>
                            </div>

                            {notifyEnabled && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-1 pt-2">
                                    <HorizontalInput label="URL" value="http://192.168.0.105:23333/post_sms" />
                                    <HorizontalInput label="间隔时间(秒)" value="10" />
                                    
                                    <HorizontalToggle label="上报接收的彩信" />
                                    <HorizontalToggle label="上报接收的短信" defaultChecked={true} />
                                    <HorizontalToggle label="上报发送的短信" defaultChecked={true} />
                                    <HorizontalToggle label="上报短信控制数据" />
                                    <HorizontalToggle label="上报流量控制数据" />
                                </div>
                            )}
                        </FormGroup>
                    </div>

                    <div className="space-y-8">
                        <FormGroup title="设备网管">
                            <p className="text-sm text-slate-500 mb-4 px-1">启用并注册网管服务器后，可通过服务器访问此设备的Web界面</p>
                            
                            <HorizontalSelect 
                                label="网管类型" 
                                value={mgmtType} 
                                options={['禁用', '远程网管']} 
                                onChange={(e) => setMgmtType(e.target.value)}
                            />

                            {mgmtType === '远程网管' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-1 pt-2">
                                    <HorizontalInput label="网管地址" value="t6.xinhaicapital.com" />
                                    <HorizontalInput label="网管端口" value="1883" />
                                    <HorizontalInput label="账号" value="root" />
                                    <HorizontalInput label="密码" value="root" type="password" />
                                    
                                    <div className="grid grid-cols-1 xl:grid-cols-[120px_1fr] items-center gap-2 xl:gap-4">
                                        <label className="text-sm font-medium text-slate-600 xl:text-right">状态</label>
                                        <div>
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm border border-emerald-400">
                                                <LinkIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                                                已连接
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </FormGroup>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default GatewaySettings;
