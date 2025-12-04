import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Server, 
  Router, 
  CreditCard, 
  Shield, 
  MessageSquare, 
  BarChart3, 
  LogOut, 
  ChevronRight,
} from './Icons';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface MenuItem {
  name: string;
  icon: React.ElementType;
  path: string;
  submenu?: { name: string; path: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const menuItems: MenuItem[] = [
    { 
      name: '概览页', 
      icon: LayoutDashboard, 
      path: '/' 
    },
    { 
      name: '设备管理', 
      icon: Server, 
      path: '/device',
      submenu: [
        { name: '设备状态', path: '/device/status' },
        { name: '网络设置', path: '/gateway/config' },
        { name: '系统版本', path: '/device/version' },
        { name: '系统日志', path: '/device/logs' },
        { name: '系统工具', path: '/device/tools' },
        { name: '系统重启', path: '/device/reboot' },
        { name: '管理员', path: '/device/admin' },
      ]
    },
    { 
      name: '网关设置', 
      icon: Router, 
      path: '/gateway',
      submenu: [
        { name: '端口状态', path: '/gateway/status' },
        { name: 'IMEI设置', path: '/gateway/imei' },
        { name: 'USSD指令', path: '/gateway/ussd' },
        { name: 'AT指令', path: '/gateway/at' },
      ]
    },
    { 
      name: 'SIM卡管理', 
      icon: CreditCard, 
      path: '/sim',
      submenu: [
        { name: 'SIM卡状态', path: '/sim/status' },
        { name: 'SIM卡设置', path: '/sim/settings' },
        { name: '卡余额查询', path: '/sim/balance' },
      ]
    },
    { 
      name: '策略管理', 
      icon: Shield, 
      path: '/policy',
      submenu: [
        { name: '切卡策略', path: '/policy/switch' },
        { name: '防封策略', path: '/policy/antiblock' },
        { name: '短信控制策略', path: '/policy/sms-control' },
      ]
    },
    { 
      name: '短信业务', 
      icon: MessageSquare, 
      path: '/sms',
      submenu: [
        { name: '发送短信', path: '/sms/send' },
        { name: '接收短信', path: '/sms/receive' },
        { name: '短信转发', path: '/sms/forward' },
        { name: '发送彩信', path: '/sms/mms-send' },
        { name: '彩信过滤', path: '/sms/mms-filter' },
        { name: '短信设置', path: '/sms/settings' },
      ]
    },
    { 
      name: '数据统计', 
      icon: BarChart3, 
      path: '/stats',
      submenu: [
        { name: '短信统计', path: '/stats/sms' },
        { name: '互发统计', path: '/stats/inter' },
      ]
    },
  ];

  useEffect(() => {
    const activeParent = menuItems.find(item => 
      item.submenu?.some(sub => sub.path === location.pathname)
    );
    if (activeParent && !openMenus.includes(activeParent.name)) {
      setOpenMenus(prev => [...prev, activeParent.name]);
    }
  }, [location.pathname]);

  const toggleMenu = (name: string) => {
    setOpenMenus(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name) 
        : [...prev, name]
    );
  };

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (item: MenuItem) => {
    if (isActive(item.path)) return true;
    return item.submenu?.some(sub => isActive(sub.path));
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      <aside 
        className={`fixed top-0 left-0 z-40 h-full w-64 glass-panel border-r border-white/60 shadow-[2px_0_8px_0_rgba(0,0,0,0.05)] transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full relative bg-white/40 backdrop-blur-xl">
          
          {/* Logo */}
          <div className="h-16 flex items-center px-6 shrink-0 border-b border-white/30">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.88 2.38a1 1 0 0 0-1.76 0l-8 4.8a1 1 0 0 0-.48.86v9.6a1 1 0 0 0 .48.86l8 4.8a1 1 0 0 0 1.76 0l8-4.8a1 1 0 0 0 .48-.86v-9.6a1 1 0 0 0-.48-.86l-8-4.8zM12 5.26l6.23 3.74L12 12.74 5.77 9 12 5.26zM5.5 11.66l6 3.6V22.5l-6-3.6V11.66zm7 10.84v-7.24l6-3.6V18.9l-6 3.6z"/>
              </svg>
              <span className="text-lg font-bold text-slate-800 tracking-tight">Telarvo</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const active = isParentActive(item);
              const isOpen = openMenus.includes(item.name);
              const hasSubmenu = item.submenu && item.submenu.length > 0;

              return (
                <div key={item.name} className="relative mb-1">
                  <div
                    onClick={() => {
                        if (hasSubmenu) {
                            toggleMenu(item.name);
                        }
                    }}
                    className={`relative w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer transition-all duration-200 select-none group border ${
                      active && !hasSubmenu
                        ? 'bg-white/60 border-white/50 text-primary-700 shadow-sm backdrop-blur-md' 
                        : 'border-transparent text-slate-600 hover:bg-white/30 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center w-full">
                       <item.icon className={`w-4 h-4 mr-3 transition-colors ${active ? 'text-primary-600' : 'text-slate-500 group-hover:text-slate-700'}`} strokeWidth={active ? 2 : 1.5} />
                       {hasSubmenu ? (
                           <span className={`flex-1 ${active ? 'font-bold' : ''}`}>{item.name}</span>
                       ) : (
                           <Link to={item.path} className={`flex-1 ${active ? 'font-bold' : ''}`} onClick={() => setIsOpen(false)}>{item.name}</Link>
                       )}
                       {hasSubmenu && (
                         <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''} ${active ? 'text-primary-500' : 'text-slate-400'}`} />
                       )}
                    </div>
                  </div>

                  {/* Submenu */}
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen && hasSubmenu ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="relative pl-4 pr-2 py-1 space-y-0.5 mt-1">
                        {/* Guide Line */}
                        <div className="absolute left-[21px] top-0 bottom-2 w-px bg-slate-300/50"></div>
                        
                        {item.submenu?.map((sub) => (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            onClick={() => setIsOpen(false)}
                            className={`block px-3 py-2 text-[13px] rounded-md transition-all relative ml-5 border ${
                              isActive(sub.path)
                                ? 'bg-white/60 border-white/60 shadow-sm text-primary-700 font-bold translate-x-1 backdrop-blur-sm'
                                : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-white/30'
                            }`}
                          >
                            {sub.name}
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-white/30 bg-white/20">
             <button className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-slate-600 rounded-lg hover:bg-white/50 hover:text-rose-600 transition-all group border border-transparent hover:border-white/40 hover:shadow-sm">
                <LogOut className="w-4 h-4 mr-3 text-slate-400 group-hover:text-rose-500 transition-colors" strokeWidth={1.5} />
                退出登录
             </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;