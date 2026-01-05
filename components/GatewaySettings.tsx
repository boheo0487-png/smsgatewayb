
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
  Link as LinkIcon, 
  AlertCircle, 
  Upload, 
  X,
  CheckCircle2,
  Lock,
  Cpu,
  ShieldCheck
} from './Icons';

// --- UI Components ---

const Toggle: React.FC<{ checked: boolean; onChange: () => void; disabled?: boolean }> = ({ checked, onChange, disabled }) => (
  <button 
    onClick={!disabled ? onChange : undefined}
    disabled={disabled}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50 ${checked ? 'bg-primary-600' : 'bg-slate-200'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const SettingsCard: React.FC<{ 
  title: string; 
  description?: string;
  icon: React.ElementType; 
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}> = ({ title, description, icon: Icon, children, className = "", action }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full transition-shadow hover:shadow-md ${className}`}>
    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm text-primary-600">
                <Icon className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div>
                <h3 className="font-bold text-slate-800 text-sm leading-tight">{title}</h3>
                {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
            </div>
        </div>
        {action}
    </div>
    <div className="p-6 space-y-6 flex-1">
        {children}
    </div>
  </div>
);

const Field: React.FC<{ 
  label: string; 
  children: React.ReactNode; 
  help?: string;
  required?: boolean;
  align?: 'center' | 'start';
}> = ({ label, children, help, required, align = 'center' }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 ${align === 'center' ? 'items-center' : 'items-start'}`}>
    <div className="sm:col-span-4 lg:col-span-3">
        <label className="block text-sm font-semibold text-slate-700">
            {label}
            {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
    </div>
    <div className="sm:col-span-8 lg:col-span-9">
        {children}
        {help && <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{help}</p>}
    </div>
  </div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input 
    {...props}
    className={`w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm disabled:bg-slate-50 disabled:text-slate-500 ${props.className || ''}`}
  />
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <div className="relative w-full">
      <select 
        {...props}
        className={`w-full appearance-none px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm disabled:bg-slate-50 disabled:text-slate-500 cursor-pointer ${props.className || ''}`}
      />
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
  </div>
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea 
      {...props}
      className={`w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm resize-none ${props.className || ''}`}
    />
);


// --- Main Component ---

const GatewaySettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'network' | 'advanced'>('network');
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [networkConfig, setNetworkConfig] = useState({
      protocol: 'static',
      ip: '192.168.0.74',
      mask: '255.255.255.0',
      gateway: '192.168.0.1',
      dns1: '192.168.0.1',
      dns2: '114.114.114.114'
  });

  const [vpnConfig, setVpnConfig] = useState({
      protocol: 'disable',
      server: '',
      username: '',
      password: '',
      openVpnMode: 'cert',
      pptChap: 'auto'
  });

  const [sysConfig, setSysConfig] = useState({
      name: '演示设备',
      timezone: '+08:00',
      ntpEnabled: false,
      ntpServer1: '0.pool.ntp.org',
      allowIp: '',
      blockIp: ''
  });

  const [notifyConfig, setNotifyConfig] = useState({
      enabled: false,
      url: 'http://',
      interval: 10,
      events: {
          mms: false,
          smsRecv: true,
          smsSend: true,
          smsControl: false
      }
  });

  const [mgmtConfig, setMgmtConfig] = useState({
      type: 'disable',
      address: '',
      port: 1883,
      user: 'root'
  });

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-enter pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">网络设置</h1>
           <p className="text-sm text-slate-500 mt-1.5">配置网关的网络连接、VPN通道及高级管理选项</p>
        </div>
        <div className="flex gap-3">
            <button className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
               重置更改
            </button>
            <button 
                onClick={handleSave}
                disabled={loading}
                className="btn-primary px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all"
            >
               {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
               保存配置
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 p-1 bg-slate-200/50 rounded-xl w-fit">
        {[
            { id: 'network', label: '网络设置', icon: Globe },
            { id: 'advanced', label: '高级设置', icon: Sliders }
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                    flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all duration-200
                    ${activeTab === tab.id 
                        ? 'bg-white text-primary-600 shadow-sm ring-1 ring-black/5' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}
                `}
            >
                <tab.icon className="w-4 h-4" strokeWidth={2.5} />
                {tab.label}
            </button>
        ))}
      </div>

      {/* Content Area */}
      {activeTab === 'network' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {/* WAN Interface */}
            <SettingsCard 
                title="WAN 接口配置" 
                description="配置设备接入互联网的物理接口参数"
                icon={Globe}
            >
                 {/* Connection Status Indicator */}
                 <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-sm font-bold text-emerald-800">网络已连接</span>
                    </div>
                    <div className="text-xs font-mono text-emerald-600 bg-white/50 px-2 py-1 rounded">
                        Uptime: 24d 12h
                    </div>
                 </div>

                 <Field label="连接协议">
                     <Select 
                        value={networkConfig.protocol} 
                        onChange={(e) => setNetworkConfig({...networkConfig, protocol: e.target.value})}
                     >
                         <option value="static">静态地址 (Static IP)</option>
                         <option value="dhcp">动态获取 (DHCP)</option>
                         <option value="pppoe">拨号上网 (PPPoE)</option>
                     </Select>
                 </Field>

                 {networkConfig.protocol === 'static' && (
                     <div className="space-y-4 animate-in fade-in slide-in-from-top-1">
                         <Field label="IPv4 地址" required>
                             <Input 
                                value={networkConfig.ip} 
                                onChange={(e) => setNetworkConfig({...networkConfig, ip: e.target.value})} 
                             />
                         </Field>
                         <Field label="子网掩码" required>
                             <Input 
                                value={networkConfig.mask} 
                                onChange={(e) => setNetworkConfig({...networkConfig, mask: e.target.value})} 
                             />
                         </Field>
                         <Field label="默认网关" required>
                             <Input 
                                value={networkConfig.gateway} 
                                onChange={(e) => setNetworkConfig({...networkConfig, gateway: e.target.value})} 
                             />
                         </Field>
                         <div className="border-t border-slate-100 my-4 pt-4"></div>
                         <Field label="DNS 服务器 1">
                             <Input 
                                value={networkConfig.dns1} 
                                onChange={(e) => setNetworkConfig({...networkConfig, dns1: e.target.value})} 
                             />
                         </Field>
                         <Field label="DNS 服务器 2">
                             <Input 
                                value={networkConfig.dns2} 
                                onChange={(e) => setNetworkConfig({...networkConfig, dns2: e.target.value})} 
                             />
                         </Field>
                     </div>
                 )}
            </SettingsCard>

            {/* VPN Settings */}
            <SettingsCard 
                title="VPN 隧道" 
                description="建立安全的虚拟专用网络连接"
                icon={Shield}
            >
                <Field label="VPN 协议">
                    <Select 
                        value={vpnConfig.protocol}
                        onChange={(e) => setVpnConfig({...vpnConfig, protocol: e.target.value})}
                    >
                        <option value="disable">禁用 (Disabled)</option>
                        <option value="openvpn">OpenVPN</option>
                        <option value="pptp">PPTP</option>
                        <option value="l2tp">L2TP</option>
                    </Select>
                </Field>

                {vpnConfig.protocol !== 'disable' && (
                    <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-top-1">
                         <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
                            <Field label="服务器地址" required>
                                <Input placeholder="vpn.example.com" />
                            </Field>
                         </div>

                         {vpnConfig.protocol === 'openvpn' && (
                             <>
                                <Field label="验证模式">
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="ovpnmode" className="text-primary-600" defaultChecked />
                                            <span className="text-sm text-slate-700">证书 (Certificate)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="ovpnmode" className="text-primary-600" />
                                            <span className="text-sm text-slate-700">账号密码</span>
                                        </label>
                                    </div>
                                </Field>
                                <Field label="配置文件" help="支持 .ovpn 格式配置文件">
                                     <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <input type="text" readOnly className="w-full pl-9 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-500" placeholder="未选择文件" />
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                <LinkIcon className="w-4 h-4" />
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                            浏览...
                                        </button>
                                     </div>
                                </Field>
                             </>
                         )}

                         {(vpnConfig.protocol === 'pptp' || vpnConfig.protocol === 'l2tp') && (
                             <>
                                <Field label="用户名" required>
                                    <Input placeholder="VPN Username" />
                                </Field>
                                <Field label="密码" required>
                                    <Input type="password" placeholder="VPN Password" />
                                </Field>
                                {vpnConfig.protocol === 'pptp' && (
                                    <Field label="MPPE 加密">
                                        <Select>
                                            <option>Auto</option>
                                            <option>MPPE-128</option>
                                            <option>None</option>
                                        </Select>
                                    </Field>
                                )}
                             </>
                         )}

                         <Field label="开机自动连接">
                            <Toggle checked={true} onChange={() => {}} />
                         </Field>
                    </div>
                )}
            </SettingsCard>
        </div>
      )}

      {/* Advanced Tab Content */}
      {activeTab === 'advanced' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {/* System Config */}
            <div className="space-y-6">
                <SettingsCard 
                    title="系统常规" 
                    icon={Cpu}
                >
                    <Field label="设备名称">
                        <Input 
                            value={sysConfig.name} 
                            onChange={(e) => setSysConfig({...sysConfig, name: e.target.value})} 
                        />
                    </Field>
                    <Field label="时区设置">
                        <Select 
                            value={sysConfig.timezone} 
                            onChange={(e) => setSysConfig({...sysConfig, timezone: e.target.value})} 
                        >
                            <option value="+08:00">(GMT+08:00) 北京，重庆，香港</option>
                            <option value="+00:00">(GMT+00:00) UTC</option>
                            <option value="-05:00">(GMT-05:00) 东部时间 (美国和加拿大)</option>
                        </Select>
                    </Field>
                    <Field label="NTP 时间同步">
                        <div className="flex items-center gap-4">
                            <Toggle 
                                checked={sysConfig.ntpEnabled} 
                                onChange={() => setSysConfig({...sysConfig, ntpEnabled: !sysConfig.ntpEnabled})} 
                            />
                            <span className="text-sm text-slate-500">{sysConfig.ntpEnabled ? '已启用' : '已禁用'}</span>
                        </div>
                    </Field>
                    {sysConfig.ntpEnabled && (
                        <Field label="NTP 服务器" align="start">
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-1">
                                <Input value={sysConfig.ntpServer1} placeholder="Server 1" />
                                <Input placeholder="Server 2 (Optional)" />
                            </div>
                        </Field>
                    )}
                </SettingsCard>

                <SettingsCard 
                    title="安全策略" 
                    icon={Shield}
                    className="border-l-4 border-l-primary-500"
                >
                    <Field label="允许 IP 列表" help="仅允许列表中的 IP 访问管理后台，多个 IP 用分号分隔。" align="start">
                        <Textarea 
                            rows={3} 
                            placeholder="e.g. 192.168.1.100; 10.0.0.0/24" 
                            className="font-mono text-xs"
                        />
                    </Field>
                    <Field label="禁止 IP 列表" help="拒绝列表中的 IP 访问，优先级高于允许列表。" align="start">
                        <Textarea 
                            rows={3} 
                            placeholder="" 
                            className="font-mono text-xs"
                        />
                    </Field>
                </SettingsCard>
            </div>

            {/* Management & Notification */}
            <div className="space-y-6">
                <SettingsCard 
                    title="通知服务 (Webhook)" 
                    description="将设备事件推送到第三方服务器"
                    icon={Bell}
                    action={
                        <Toggle 
                            checked={notifyConfig.enabled} 
                            onChange={() => setNotifyConfig({...notifyConfig, enabled: !notifyConfig.enabled})} 
                        />
                    }
                >
                    {notifyConfig.enabled ? (
                      <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                          <Field label="推送 URL" required>
                              <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">POST</span>
                                  <Input 
                                      className="pl-14" 
                                      value={notifyConfig.url} 
                                      onChange={(e) => setNotifyConfig({...notifyConfig, url: e.target.value})} 
                                  />
                              </div>
                          </Field>
                          <Field label="推送间隔" help="最小间隔时间（秒）">
                               <div className="flex items-center gap-3">
                                   <Input type="number" className="w-24" value={notifyConfig.interval} />
                                   <span className="text-sm text-slate-500">秒</span>
                               </div>
                          </Field>
                          
                          <div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-100">
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">订阅事件</p>
                              <label className="flex items-center gap-3 cursor-pointer">
                                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                                  <span className="text-sm text-slate-700">接收短信 (Incoming SMS)</span>
                              </label>
                              <label className="flex items-center gap-3 cursor-pointer">
                                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                                  <span className="text-sm text-slate-700">发送状态报告 (Delivery Report)</span>
                              </label>
                              <label className="flex items-center gap-3 cursor-pointer">
                                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                                  <span className="text-sm text-slate-700">接收彩信 (Incoming MMS)</span>
                              </label>
                          </div>
                      </div>
                    ) : (
                      <div className="py-10 flex flex-col items-center justify-center text-center opacity-40 select-none animate-in fade-in duration-500">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 shadow-inner border border-slate-200">
                             <ShieldCheck className="w-8 h-8 text-slate-300" />
                          </div>
                          <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">服务未激活</h4>
                          <p className="text-xs font-bold mt-1 max-w-[200px] text-slate-400">请开启上方开关以配置事件推送参数</p>
                      </div>
                    )}
                </SettingsCard>

                <SettingsCard 
                    title="远程管理" 
                    icon={Router}
                >
                    <Field label="管理协议">
                        <Select 
                            value={mgmtConfig.type}
                            onChange={(e) => setMgmtConfig({...mgmtConfig, type: e.target.value})}
                        >
                            <option value="disable">禁用</option>
                            <option value="mqtt">MQTT 远程控制</option>
                            <option value="tr069">TR-069 (CWMP)</option>
                        </Select>
                    </Field>

                    {mgmtConfig.type !== 'disable' && (
                        <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-1">
                            <Field label="服务器地址" required>
                                <Input placeholder="host.example.com" value="t6.xinhaicapital.com" />
                            </Field>
                            <Field label="端口">
                                <Input type="number" className="w-32" value={1883} />
                            </Field>
                            <Field label="鉴权账户">
                                <div className="grid grid-cols-2 gap-2">
                                    <Input placeholder="Username" value="root" />
                                    <Input type="password" placeholder="Password" value="root" />
                                </div>
                            </Field>
                            
                            <div className="mt-4 flex items-center justify-between p-3 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>连接状态</span>
                                </div>
                                <span className="font-bold">在线</span>
                            </div>
                        </div>
                    )}
                </SettingsCard>
            </div>
        </div>
      )}
    </div>
  );
};

export default GatewaySettings;
