
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DeviceStatus from './components/DeviceStatus';
import PortStatus from './components/PortStatus';
import ImeiSettings from './components/ImeiSettings';
import UssdManagement from './components/UssdManagement';
import AtCommandManagement from './components/AtCommandManagement';
import GatewaySettings from './components/GatewaySettings';
import SystemVersion from './components/SystemVersion';
import SystemLogs from './components/SystemLogs';
import SystemTools from './components/SystemTools';
import SystemReboot from './components/SystemReboot';
import { 
  Menu, 
  Bell, 
  ChevronDown, 
  Globe, 
  Cpu, 
  Layers, 
  CreditCard, 
  MessageSquare,
  Cable,
  User,
  Settings,
  LogOut,
  Search
} from './components/Icons';

const Placeholder: React.FC<{title: string}> = ({ title }) => (
  <div className="glass-card p-12 flex flex-col items-center justify-center text-center h-[60vh] text-slate-400 animate-enter m-4 rounded-xl border border-white/60">
    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
        <span className="text-3xl grayscale opacity-50">🚧</span>
    </div>
    <h2 className="text-lg font-bold text-slate-700 mb-2">{title}</h2>
    <p className="text-sm text-slate-500">功能模块建设中...</p>
  </div>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        {/* Header - Simplified & Clean */}
        <header className="sticky top-0 z-20 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-sm transition-all">
          {/* Left: Identity Info */}
          <div className="flex items-center gap-4 lg:gap-8 shrink-0">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" strokeWidth={2} />
            </button>
            
            <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium">
              <div className="flex items-center text-slate-600 font-mono bg-white/60 border border-slate-200/80 px-2.5 py-1 rounded-md shadow-sm">
                 <Globe className="w-3.5 h-3.5 mr-2 text-slate-400" />
                 192.168.0.74
              </div>
              
              <div className="hidden sm:flex items-center bg-primary-50/50 text-primary-700 px-2.5 py-1 rounded-md border border-primary-100/50">
                 <Cpu className="w-3.5 h-3.5 mr-2" />
                 EG91
              </div>
            </div>
          </div>

          {/* Center: Search (Minimal) */}
          <div className="hidden md:flex flex-1 max-sm px-6">
             <div className="relative w-full group">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Search className="h-4 w-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                 </div>
                 <input 
                     type="text" 
                     className="block w-full pl-10 pr-3 py-1.5 text-sm border border-slate-200/80 rounded-lg leading-5 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" 
                     placeholder="搜索菜单" 
                 />
             </div>
          </div>

          {/* Right: Status & User */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Control Panel Indicators - Clean Badges */}
            <div className="hidden xl:flex items-center gap-3 mr-2">
                {[
                  { label: '告警', val: '2', icon: Bell, color: 'text-rose-500', bg: 'hover:bg-rose-50' },
                  { label: '端口', val: '12/16', icon: Cable, color: 'text-slate-500', bg: 'hover:bg-slate-50' },
                  { label: 'SIM卡', val: '3/8', icon: CreditCard, color: 'text-slate-500', bg: 'hover:bg-slate-50' },
                ].map((item, i) => (
                  <button key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-transparent hover:border-slate-200 transition-all duration-200 ${item.bg}`}>
                      <div className="relative">
                        <item.icon className={`w-4 h-4 ${item.color}`} strokeWidth={2} />
                        {item.label === '告警' && item.val !== '0' && <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"></span>}
                      </div>
                      <div className="flex flex-col items-start leading-none">
                          <span className="text-xs font-bold text-slate-700 font-mono">{item.val}</span>
                      </div>
                  </button>
                ))}
            </div>

            <div className="h-6 w-px bg-slate-200 hidden xl:block"></div>

            {/* User Dropdown */}
            <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 group"
                >
                   <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-600 border border-slate-200 shadow-sm">
                      <User className="w-4 h-4" strokeWidth={2} />
                   </div>
                   <div className="hidden md:flex flex-col items-start">
                      <span className="text-xs font-bold text-slate-700 leading-none mb-0.5">Admin</span>
                      <span className="text-[10px] text-slate-400 uppercase">所有者</span>
                   </div>
                   <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-xl z-20 overflow-hidden ring-1 ring-black/5 animate-enter border border-slate-100">
                        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
                            <p className="text-sm font-bold text-slate-800">系统管理员</p>
                            <p className="text-xs text-slate-500 mt-0.5">admin@telarvo.com</p>
                        </div>
                        <div className="p-1.5 space-y-0.5">
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-left group">
                                <Settings className="w-4 h-4 text-slate-400 group-hover:text-primary-500" />
                                账户设置
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-rose-600 rounded-lg hover:bg-rose-50 transition-colors text-left group">
                                <LogOut className="w-4 h-4 text-rose-400 group-hover:text-rose-500" />
                                退出登录
                            </button>
                        </div>
                    </div>
                  </>
                )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto scroll-smooth">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/device/status" element={<DeviceStatus />} />
          <Route path="/device/version" element={<SystemVersion />} />
          <Route path="/device/logs" element={<SystemLogs />} />
          <Route path="/device/tools" element={<SystemTools />} />
          <Route path="/device/reboot" element={<SystemReboot />} />
          <Route path="/gateway/status" element={<PortStatus />} />
          <Route path="/gateway/imei" element={<ImeiSettings />} />
          <Route path="/gateway/ussd" element={<UssdManagement />} />
          <Route path="/gateway/at" element={<AtCommandManagement />} />
          <Route path="/gateway/config" element={<GatewaySettings />} />
          <Route path="/device/*" element={<Placeholder title="设备管理" />} />
          <Route path="/gateway/*" element={<Placeholder title="网关设置" />} />
          <Route path="/sim/*" element={<Placeholder title="SIM卡管理" />} />
          <Route path="/policy/*" element={<Placeholder title="策略管理" />} />
          <Route path="/sms/*" element={<Placeholder title="短信业务" />} />
          <Route path="/stats/*" element={<Placeholder title="数据统计" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
