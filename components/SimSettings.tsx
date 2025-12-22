
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Settings2, 
  Smartphone, 
  Globe, 
  Save, 
  Search, 
  Edit3, 
  Play, 
  X, 
  Check, 
  CheckCircle2,
  Trash2, 
  Upload, 
  Download, 
  RefreshCw,
  MessageSquare,
  Lock,
  Smartphone as PhoneIcon,
  HelpCircle,
  Plus,
  ArrowRight,
  AlertCircle,
  XCircle,
  ChevronDown,
  AlertTriangle,
  Filter,
  Info,
  FileUp,
  FileDown,
  Zap,
  Power,
  MinusCircle,
  Database,
  Clock,
  ShieldCheck,
  RotateCcw,
  Send
} from './Icons';

type MainTab = 'function' | 'number' | 'apn';
type NumberSubTab = 'general' | 'auto_query' | 'current_number';
type ActionType = 'enable' | 'disable' | 'sms_enable' | 'sms_disable';

interface SimFunctionData {
  id: string;
  terminal: string;
  status: 'error' | 'failure' | 'idle' | 'success';
  statusDesc: string;
  enabled: boolean;
  smsEnabled: boolean;
  lockOperator: string;
  balance: string;
  pin: string;
  smsc: string;
}

interface AutoQueryData {
  id: string;
  operatorId: string;
  method: string;
  content: string;
  keyword: string;
  serviceNum: string;
  receiveNum: string;
  oldPrefix: string;
  newPrefix: string;
}

interface ApnData {
  id: string;
  operatorId: string;
  apn: string;
  user: string;
  pass: string;
}

interface CurrentSimNumber {
  id: string;
  module: string;
  currentNumber: string;
  t1: string;
}

const SimSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('function');
  const [numberSubTab, setNumberSubTab] = useState<NumberSubTab>('current_number');
  
  // Modals Visibility
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQueryEditModalOpen, setIsQueryEditModalOpen] = useState(false);
  const [isApnEditModalOpen, setIsApnEditModalOpen] = useState(false);
  const [isSingleNumberEditOpen, setIsSingleNumberEditOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  const [pendingAction, setPendingAction] = useState<{ type: ActionType; label: string } | null>(null);
  const [pinUnlockEnabled, setPinUnlockEnabled] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  
  // 号码常规设置状态
  const [numSettings, setNumSettings] = useState({
    storageEnabled: true,
    autoClean: false,
    cleanDays: 30,
    verifyPrefix: true,
    storageType: 'Local'
  });
  
  // Selection States
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedQueryIds, setSelectedQueryIds] = useState<string[]>([]);
  const [selectedSimIds, setSelectedSimIds] = useState<string[]>([]);
  const [selectedApnIds, setSelectedApnIds] = useState<string[]>([]);

  // Mock Data
  const [functionData] = useState<SimFunctionData[]>([
    { id: '1', terminal: 'M1T1', status: 'error', statusDesc: 'SIM故障', enabled: true, smsEnabled: true, lockOperator: '0', balance: '0.00', pin: '-', smsc: '-' },
    { id: '2', terminal: 'M2T1', status: 'failure', statusDesc: '注册失败', enabled: true, smsEnabled: true, lockOperator: '0', balance: '0.00', pin: '-', smsc: '-' },
    { id: '3', terminal: 'M3T1', status: 'idle', statusDesc: '-', enabled: true, smsEnabled: true, lockOperator: '0', balance: '0.00', pin: '-', smsc: '-' },
    { id: '4', terminal: 'M4T1', status: 'failure', statusDesc: '注册失败', enabled: true, smsEnabled: true, lockOperator: '0', balance: '0.00', pin: '-', smsc: '-' },
    { id: '5', terminal: 'M5T1', status: 'idle', statusDesc: '-', enabled: true, smsEnabled: true, lockOperator: '0', balance: '0.00', pin: '-', smsc: '-' },
    { id: '8', terminal: 'M8T1', status: 'failure', statusDesc: '注册失败', enabled: true, smsEnabled: true, lockOperator: '0', balance: '0.00', pin: '-', smsc: '-' },
  ]);

  const [autoQueryData] = useState<AutoQueryData[]>([
    { id: '1', operatorId: '101', method: 'AT', content: '-', keyword: '-', serviceNum: '-', receiveNum: '-', oldPrefix: '-', newPrefix: '-' }
  ]);

  const [apnData] = useState<ApnData[]>([
    { id: '1', operatorId: '101', apn: 'VZWINTERNET', user: '-', pass: '-' },
    { id: '2', operatorId: '46000', apn: 'CMNET', user: '-', pass: '-' },
  ]);

  const [currentSimNumbers, setCurrentSimNumbers] = useState<CurrentSimNumber[]>([
    { id: '1', module: 'M1', currentNumber: '', t1: '12' },
    { id: '2', module: 'M2', currentNumber: '12300010097', t1: '-' },
    { id: '4', module: 'M4', currentNumber: '12300010006', t1: '-' },
    { id: '8', module: 'M8', currentNumber: '12300010098', t1: '-' },
  ]);

  const [editingSim, setEditingSim] = useState<CurrentSimNumber | null>(null);

  // Handlers
  const toggleSelectOne = (id: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(id) ? list.filter(i => i !== id) : [...list, id]);
  };

  const handleOpenSimEdit = () => {
    if (selectedSimIds.length !== 1) return;
    const sim = currentSimNumbers.find(s => s.id === selectedSimIds[0]);
    if (sim) {
      setEditingSim({ ...sim });
      setIsSingleNumberEditOpen(true);
    }
  };

  const handleSaveSimEdit = () => {
    if (editingSim) {
      setCurrentSimNumbers(prev => prev.map(s => s.id === editingSim.id ? editingSim : s));
      setIsSingleNumberEditOpen(false);
      setEditingSim(null);
    }
  };

  const openConfirmModal = (type: ActionType, label: string) => {
    if (selectedIds.length === 0) {
      alert("请先选择要操作的终端");
      return;
    }
    setPendingAction({ type, label });
    setIsConfirmModalOpen(true);
  };

  const executeAction = () => {
    setIsConfirmModalOpen(false);
    setPendingAction(null);
    setSelectedIds([]);
    alert(`已执行: ${pendingAction?.label}`);
  };

  const handleImmediateQuery = () => {
    if (selectedQueryIds.length === 0) {
      alert("请先选择需要查询的项");
      return;
    }
    setIsQuerying(true);
    setTimeout(() => {
      setIsQuerying(false);
      alert("指令已下发，请稍后刷新查看");
    }, 1500);
  };

  // 获取选中终端的名称列表用于编辑弹窗
  const selectedTerminalNames = useMemo(() => {
    return functionData
      .filter(item => selectedIds.includes(item.id))
      .map(item => item.terminal)
      .join(',');
  }, [selectedIds, functionData]);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-enter max-w-[1600px] mx-auto space-y-6">
      
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">SIM 卡设置</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">配置端口业务功能、管理 SIM 卡号码及运营商网络参数</p>
        </div>
        
        <div className="flex p-1.5 bg-slate-200/40 rounded-2xl w-fit border border-slate-200/60 backdrop-blur-sm shadow-inner">
          {[
            { id: 'function', label: '功能设置', icon: Settings2 },
            { id: 'number', label: '号码管理', icon: Smartphone },
            { id: 'apn', label: 'APN 设置', icon: Globe },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as MainTab)}
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

      <div className="flex-1 flex flex-col glass-card rounded-2xl border border-white/60 shadow-soft overflow-hidden bg-white/60">
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* 1. 功能设置视图 */}
          {activeTab === 'function' && (
            <div className="flex-1 flex flex-col min-h-0 animate-in fade-in">
                {/* 工具栏 */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            if (selectedIds.length === 0) {
                              alert("请至少选择一个终端进行编辑");
                              return;
                            }
                            setIsEditModalOpen(true);
                          }} 
                          className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 hover:border-primary-200 hover:text-primary-600 hover:shadow-sm transition-all active:scale-95 group"
                        >
                            <Edit3 className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-colors" /> 编辑
                        </button>
                        <button 
                          onClick={() => openConfirmModal('enable', '启用')}
                          className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 hover:border-emerald-200 hover:text-emerald-600 hover:shadow-sm transition-all active:scale-95 group"
                        >
                            <CheckCircle2 className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" /> 启用
                        </button>
                        <button 
                          onClick={() => openConfirmModal('disable', '禁用')}
                          className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 hover:border-rose-200 hover:text-rose-600 hover:shadow-sm transition-all active:scale-95 group"
                        >
                            <XCircle className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition-colors" /> 禁用
                        </button>
                        <button 
                          onClick={() => openConfirmModal('sms_enable', '短信启用')}
                          className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 hover:border-emerald-200 hover:text-emerald-600 hover:shadow-sm transition-all active:scale-95 group"
                        >
                            <div className="relative">
                              <MessageSquare className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                              <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full">
                                <CheckCircle2 className="w-2 h-2 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                              </div>
                            </div>
                            短信启用
                        </button>
                        <button 
                          onClick={() => openConfirmModal('sms_disable', '短信禁用')}
                          className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 hover:border-rose-200 hover:text-rose-600 hover:shadow-sm transition-all active:scale-95 group"
                        >
                            <div className="relative">
                              <MessageSquare className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
                              <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full">
                                <MinusCircle className="w-2 h-2 text-slate-400 group-hover:text-rose-500 transition-colors" />
                              </div>
                            </div>
                            短信禁用
                        </button>
                    </div>

                    <button 
                      onClick={() => setIsPinModalOpen(true)} 
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl border border-transparent hover:bg-slate-200 transition-all active:scale-95"
                    >
                        <Lock className="w-3.5 h-3.5" /> PIN解锁设置
                    </button>
                </div>
                <div className="flex-1 overflow-auto bg-white">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/80 sticky top-0 z-10">
                            <tr className="border-b border-slate-200">
                                <th className="px-6 py-4 w-12 text-center">
                                    <input 
                                      type="checkbox" 
                                      checked={selectedIds.length === functionData.length && functionData.length > 0} 
                                      onChange={() => setSelectedIds(selectedIds.length === functionData.length ? [] : functionData.map(d => d.id))} 
                                      className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer" 
                                    />
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">终端</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">状态描述</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">业务开关</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">短信开关</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">锁运营商</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">余额</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">PIN码</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">短信中心</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {functionData.map(item => (
                                <tr key={item.id} className={`hover:bg-slate-50/60 transition-all ${selectedIds.includes(item.id) ? 'bg-primary-50/30' : ''}`}>
                                    <td className="px-6 py-4 text-center">
                                        <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelectOne(item.id, selectedIds, setSelectedIds)} className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer" />
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-700 font-mono">{item.terminal}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-rose-500">{item.statusDesc}</td>
                                    <td className="px-6 py-4 text-center"><div className="flex justify-center"><CheckCircle2 className={`w-5 h-5 ${item.enabled ? 'text-emerald-500' : 'text-slate-200'}`} /></div></td>
                                    <td className="px-6 py-4 text-center"><div className="flex justify-center"><CheckCircle2 className={`w-5 h-5 ${item.smsEnabled ? 'text-emerald-500' : 'text-slate-200'}`} /></div></td>
                                    <td className="px-6 py-4 text-xs font-mono text-slate-400 text-center">{item.lockOperator}</td>
                                    <td className="px-6 py-4 text-xs font-mono font-bold text-emerald-600 text-right">{item.balance}</td>
                                    <td className="px-6 py-4 text-xs font-mono text-slate-400 text-center">{item.pin}</td>
                                    <td className="px-6 py-4 text-xs font-mono text-slate-400">{item.smsc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          )}

          {/* 2. 号码管理视图 */}
          {activeTab === 'number' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/10">
               <div className="flex border-b border-slate-200 bg-slate-100/50">
                  {[
                    { id: 'current_number', label: '当前SIM号码' },
                    { id: 'auto_query', label: '自动查询号码' },
                    { id: 'general', label: '常规设置' },
                  ].map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setNumberSubTab(sub.id as NumberSubTab)}
                      className={`px-8 py-3.5 text-sm font-bold transition-all relative border-r border-slate-200 ${
                        numberSubTab === sub.id 
                          ? 'bg-white text-primary-600 shadow-sm' 
                          : 'text-slate-600 hover:bg-white/40'
                      }`}
                    >
                      {sub.label}
                      {numberSubTab === sub.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary-600"></div>
                      )}
                    </button>
                  ))}
               </div>

               <div className="flex-1 overflow-auto bg-white flex flex-col">
                  {numberSubTab === 'general' && (
                    <div className="p-12 animate-in fade-in flex flex-col items-center">
                        <div className="w-full max-w-xl">
                            {/* Updated General Settings content to match image: "号码存储" with a blue checkmark toggle */}
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
                                <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex items-center gap-3">
                                    <Settings2 className="w-5 h-5 text-primary-600" />
                                    <h3 className="font-black text-slate-800 tracking-tight">常规设置</h3>
                                </div>
                                <div className="p-10">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h4 className="text-lg font-black text-slate-800 tracking-tight">号码存储</h4>
                                            <p className="text-sm text-slate-400 font-medium">配置是否自动存储与管理捕获到的 SIM 号码</p>
                                        </div>
                                        <button 
                                            onClick={() => setNumSettings({...numSettings, storageEnabled: !numSettings.storageEnabled})}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 transform active:scale-95 ${
                                                numSettings.storageEnabled 
                                                    ? 'bg-primary-600 shadow-lg shadow-primary-500/30' 
                                                    : 'bg-slate-100 border-2 border-slate-200'
                                            }`}
                                        >
                                            {numSettings.storageEnabled && <Check className="w-6 h-6 text-white" strokeWidth={4} />}
                                        </button>
                                    </div>
                                    
                                    <div className="mt-12 p-6 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-start gap-4">
                                        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                        <p className="text-xs text-blue-700 leading-relaxed font-medium">
                                            开启号码存储后，系统将自动在“当前SIM号码”中记录端口变更记录。您可以通过点击“号码管理”下的子标签页来查看已存储的数据。
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                  )}

                  {numberSubTab === 'auto_query' && (
                    <div className="flex-1 flex flex-col min-h-0 animate-in fade-in">
                        <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/30">
                            <button 
                              onClick={() => setIsQueryEditModalOpen(true)} 
                              className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 hover:border-primary-200 hover:text-primary-600 hover:shadow-sm transition-all active:scale-95 group"
                            >
                                <Edit3 className="w-4 h-4 text-slate-400 group-hover:text-primary-500" /> 编辑
                            </button>
                            <button 
                              onClick={handleImmediateQuery}
                              disabled={isQuerying}
                              className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-sm transition-all active:scale-95 group"
                            >
                                {isQuerying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />}
                                立即查询
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto">
                           <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50/80 sticky top-0 z-10">
                                    <tr className="border-b border-slate-200">
                                        <th className="px-6 py-4 w-12 text-center">
                                            <input type="checkbox" checked={selectedQueryIds.length === autoQueryData.length} onChange={() => setSelectedQueryIds(selectedQueryIds.length === autoQueryData.length ? [] : autoQueryData.map(d => d.id))} className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer" />
                                        </th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">运营商ID</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">方法</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">内容</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">关键词</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">服务号码</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">接收号码</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {autoQueryData.map(item => (
                                        <tr key={item.id} className={`hover:bg-slate-50/60 transition-all ${selectedQueryIds.includes(item.id) ? 'bg-primary-50/30' : ''}`}>
                                            <td className="px-6 py-4 text-center">
                                                <input type="checkbox" checked={selectedQueryIds.includes(item.id)} onChange={() => toggleSelectOne(item.id, selectedQueryIds, setSelectedQueryIds)} className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer" />
                                            </td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-700 font-mono">{item.operatorId}</td>
                                            <td className="px-6 py-4 text-xs font-bold text-primary-600">{item.method}</td>
                                            <td className="px-6 py-4 text-xs text-slate-400">{item.content}</td>
                                            <td className="px-6 py-4 text-xs text-slate-400">{item.keyword}</td>
                                            <td className="px-6 py-4 text-xs text-slate-400">{item.serviceNum}</td>
                                            <td className="px-6 py-4 text-xs text-slate-400">{item.receiveNum}</td>
                                        </tr>
                                    ))}
                                </tbody>
                           </table>
                        </div>
                    </div>
                  )}
                  
                  {numberSubTab === 'current_number' && (
                    <div className="flex-1 flex flex-col min-h-0 animate-in fade-in">
                        <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/30">
                          <button 
                            onClick={handleOpenSimEdit}
                            disabled={selectedSimIds.length !== 1}
                            className={`flex items-center gap-2 px-4 py-2 bg-white text-sm font-bold rounded-xl border transition-all active:scale-95 group ${selectedSimIds.length === 1 ? 'border-slate-200 text-slate-700 hover:border-primary-200 hover:text-primary-600 hover:shadow-sm' : 'border-slate-100 text-slate-300 cursor-not-allowed'}`}
                          >
                            <Edit3 className={`w-4 h-4 ${selectedSimIds.length === 1 ? 'text-slate-400 group-hover:text-primary-500' : 'text-slate-200'}`} /> 编辑
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 hover:border-primary-200 hover:text-primary-600 hover:shadow-sm transition-all active:scale-95 group">
                            <FileUp className="w-4 h-4 text-slate-400 group-hover:text-primary-500" /> 导入
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 hover:border-primary-200 hover:text-primary-600 hover:shadow-sm transition-all active:scale-95 group">
                            <FileDown className="w-4 h-4 text-slate-400 group-hover:text-primary-500" /> 导出
                          </button>
                          <button 
                            onClick={() => { if(confirm('确定要清空所有号码吗？')) setSelectedSimIds([]); }}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 hover:border-rose-200 hover:text-rose-600 hover:shadow-sm transition-all active:scale-95 group"
                          >
                            <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-rose-500" /> 清空
                          </button>
                        </div>
                        <div className="flex-1 overflow-auto">
                           <table className="w-full text-left border-collapse">
                              <thead className="bg-slate-50/80 sticky top-0 z-10">
                                 <tr className="border-b border-slate-200">
                                    <th className="px-6 py-4 w-12 text-center">
                                       <input type="checkbox" checked={selectedSimIds.length === currentSimNumbers.length} onChange={() => setSelectedSimIds(selectedSimIds.length === currentSimNumbers.length ? [] : currentSimNumbers.map(s => s.id))} className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer" />
                                    </th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">模块</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">当前SIM号码</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">T1</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                 {currentSimNumbers.map(sim => (
                                    <tr key={sim.id} className={`hover:bg-slate-50/60 transition-all ${selectedSimIds.includes(sim.id) ? 'bg-primary-50/30' : ''}`}>
                                       <td className="px-6 py-4 text-center">
                                          <input type="checkbox" checked={selectedSimIds.includes(sim.id)} onChange={() => toggleSelectOne(sim.id, selectedSimIds, setSelectedSimIds)} className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer" />
                                       </td>
                                       <td className="px-6 py-4 text-xs font-bold text-slate-700 font-mono">{sim.module}</td>
                                       <td className="px-6 py-4 text-xs font-bold text-slate-600 font-mono">{sim.currentNumber || '-'}</td>
                                       <td className="px-6 py-4 text-xs font-bold text-slate-400 font-mono">{sim.t1}</td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* 3. APN 设置视图 */}
          {activeTab === 'apn' && (
            <div className="flex-1 flex flex-col min-h-0 animate-in fade-in">
                <div className="p-4 border-b border-slate-100 flex items-center bg-slate-50/30">
                    <button 
                      onClick={() => setIsApnEditModalOpen(true)} 
                      className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white text-sm font-black rounded-xl shadow-lg shadow-primary-500/20 hover:bg-primary-700 active:scale-95 transition-all"
                    >
                        <Edit3 className="w-4 h-4" /> 编辑
                    </button>
                </div>
                <div className="flex-1 overflow-auto bg-white">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/80 sticky top-0 z-10">
                            <tr className="border-b border-slate-200">
                                <th className="px-8 py-4 w-12 text-center">
                                    <input type="checkbox" checked={selectedApnIds.length === apnData.length} onChange={() => setSelectedApnIds(selectedApnIds.length === apnData.length ? [] : apnData.map(a => a.id))} className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer" />
                                </th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">运营商ID</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">APN 名称</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">用户名</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">密码</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {apnData.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50/60 transition-all">
                                    <td className="px-8 py-4 text-center">
                                        <input type="checkbox" checked={selectedApnIds.includes(item.id)} onChange={() => toggleSelectOne(item.id, selectedApnIds, setSelectedApnIds)} className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer" />
                                    </td>
                                    <td className="px-8 py-4 text-xs font-bold text-slate-700 font-mono tracking-tight">{item.operatorId}</td>
                                    <td className="px-8 py-4 text-xs font-black text-primary-600 font-mono tracking-tight">{item.apn}</td>
                                    <td className="px-8 py-4 text-xs font-bold text-slate-500">{item.user}</td>
                                    <td className="px-8 py-4 text-xs font-bold text-slate-400 font-mono tracking-widest">{item.pass}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          )}
        </div>
      </div>

      {/* 弹窗部分 */}

      {/* 号码管理 -> 自动查询编辑弹窗 */}
      {isQueryEditModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in" onClick={() => setIsQueryEditModalOpen(false)}></div>
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl border border-white/60 animate-enter overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-10 py-6 border-b border-slate-100 bg-slate-50/50 flex-none flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl shadow-sm border border-primary-100">
                            <Settings2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 tracking-tight text-lg">编辑查询配置</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Operator Query Configuration</p>
                        </div>
                    </div>
                    <button onClick={() => setIsQueryEditModalOpen(false)} className="p-2 rounded-xl hover:bg-slate-200/50 text-slate-400 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-10 space-y-8">
                    {/* 运营商ID */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 items-center">
                        <label className="text-sm font-bold text-slate-600 md:text-right md:pr-4">运营商ID</label>
                        <div className="md:col-span-3">
                            <input 
                                type="text"
                                defaultValue="101"
                                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 shadow-sm"
                            />
                        </div>
                    </div>

                    {/* 方法 */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 items-start">
                        <label className="text-sm font-bold text-slate-600 md:text-right md:pr-4 md:pt-3">方法</label>
                        <div className="md:col-span-3 space-y-2">
                            <div className="relative">
                                <select className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 appearance-none shadow-sm cursor-pointer">
                                    <option value="AT">AT</option>
                                    <option value="USSD">USSD获取</option>
                                    <option value="SMS">短信获取</option>
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium px-1">
                                有三种方法，包括USSD获取、短信获取和AT查询
                            </p>
                        </div>
                    </div>

                    {/* 查询内容 */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 items-center">
                        <label className="text-sm font-bold text-slate-600 md:text-right md:pr-4">查询内容</label>
                        <div className="md:col-span-3">
                            <input 
                                type="text"
                                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 shadow-sm"
                            />
                        </div>
                    </div>

                    {/* 关键字 */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 items-start">
                        <label className="text-sm font-bold text-slate-600 md:text-right md:pr-4 md:pt-3">关键字</label>
                        <div className="md:col-span-3 space-y-2">
                            <input 
                                type="text"
                                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 shadow-sm"
                            />
                            <p className="text-[11px] text-slate-400 font-medium px-1 leading-relaxed">
                                提取号码的关键字。比如,发送USSD查询号码之后，USSD返回响应：your SIM number 923123456,那么号码前面那个字number即为关键字
                            </p>
                        </div>
                    </div>

                    {/* 服务号码 */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 items-center">
                        <label className="text-sm font-bold text-slate-600 md:text-right md:pr-4">服务号码</label>
                        <div className="md:col-span-3">
                            <input 
                                type="text"
                                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none shadow-sm"
                            />
                        </div>
                    </div>

                    {/* 接收号码 */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 items-center">
                        <label className="text-sm font-bold text-slate-600 md:text-right md:pr-4">接收号码</label>
                        <div className="md:col-span-3">
                            <input 
                                type="text"
                                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none shadow-sm"
                            />
                        </div>
                    </div>

                    {/* 被替换的前缀 */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 items-start">
                        <label className="text-sm font-bold text-slate-600 md:text-right md:pr-4 md:pt-3">被替换的前缀</label>
                        <div className="md:col-span-3 space-y-2">
                            <input 
                                type="text"
                                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 shadow-sm"
                            />
                            <p className="text-[11px] text-slate-400 font-medium px-1 leading-relaxed">
                                进行号码前缀替换，实际得到的号码可能为923123456，其中923是国家代码并不需要，这时候可用号码前缀替换，923替换成0，得到最终号码为0123456
                            </p>
                        </div>
                    </div>

                    {/* 替换后的前缀 */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 items-start">
                        <label className="text-sm font-bold text-slate-600 md:text-right md:pr-4 md:pt-3">替换后的前缀</label>
                        <div className="md:col-span-3 space-y-2">
                            <input 
                                type="text"
                                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 shadow-sm"
                            />
                            <p className="text-[11px] text-slate-400 font-medium px-1 leading-relaxed">
                                进行号码前缀替换，实际得到的号码可能为923123456，其中923是国家代码并不需要，这时候可用号码前缀替换，923替换成0，得到最终号码为0123456
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4 flex-none">
                    <button onClick={() => setIsQueryEditModalOpen(false)} className="px-8 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">取消</button>
                    <button onClick={() => setIsQueryEditModalOpen(false)} className="btn-primary px-12 py-3 rounded-2xl text-sm font-black shadow-xl shadow-primary-500/20 active:scale-95 transition-all">保存配置</button>
                </div>
            </div>
        </div>,
        document.body
      )}
      
      {/* 功能设置 -> 批量编辑弹窗 */}
      {isEditModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsEditModalOpen(false)}></div>
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl border border-white/60 animate-enter overflow-hidden flex flex-col">
                <div className="px-10 py-6 border-b border-slate-100 bg-slate-50/50 flex-none flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl">
                          <Settings2 className="w-6 h-6" />
                        </div>
                        <h3 className="font-black text-slate-800 tracking-tight text-lg">编辑功能配置</h3>
                    </div>
                    <button onClick={() => setIsEditModalOpen(false)} className="p-2 rounded-xl hover:bg-slate-200/50 text-slate-400 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-10 space-y-8">
                    <div className="grid grid-cols-4 gap-4 items-start">
                        <label className="text-sm font-bold text-slate-600 text-right pr-4 pt-3">终端(模块-卡槽号)</label>
                        <div className="col-span-3">
                            <textarea 
                                readOnly
                                value={selectedTerminalNames}
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-500 focus:outline-none resize-none shadow-inner"
                                rows={3}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <label className="text-sm font-bold text-slate-600 text-right pr-4">启用</label>
                        <div className="col-span-3 relative">
                            <select className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 appearance-none shadow-sm cursor-pointer">
                                <option value="enable">启用</option>
                                <option value="disable">禁用</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <label className="text-sm font-bold text-slate-600 text-right pr-4">短信启用</label>
                        <div className="col-span-3 relative">
                            <select className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 appearance-none shadow-sm cursor-pointer">
                                <option value="enable">启用</option>
                                <option value="disable">禁用</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-start">
                        <label className="text-sm font-bold text-slate-600 text-right pr-4 pt-3">锁定运营商</label>
                        <div className="col-span-3 space-y-2">
                            <input 
                                type="text"
                                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 shadow-sm"
                            />
                            <p className="text-[11px] text-slate-400 font-medium px-1">
                                如填写中国移动46000,可指定注册在中国移动的网络下，0表示不启用
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <label className="text-sm font-bold text-slate-600 text-right pr-4">余额</label>
                        <div className="col-span-3">
                            <input 
                                type="text"
                                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <label className="text-sm font-bold text-slate-600 text-right pr-4">PIN码</label>
                        <div className="col-span-3">
                            <input 
                                type="text"
                                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <label className="text-sm font-bold text-slate-600 text-right pr-4">短信中心号码</label>
                        <div className="col-span-3">
                            <input 
                                type="text"
                                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none shadow-sm"
                            />
                        </div>
                    </div>
                </div>
                <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4 flex-none">
                    <button onClick={() => setIsEditModalOpen(false)} className="px-8 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">取消</button>
                    <button onClick={() => setIsEditModalOpen(false)} className="btn-primary px-12 py-3 rounded-2xl text-sm font-black shadow-xl shadow-primary-500/20 active:scale-95 transition-all">保存配置</button>
                </div>
            </div>
        </div>,
        document.body
      )}

      {/* 二次确认操作弹窗 */}
      {isConfirmModalOpen && pendingAction && createPortal(
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsConfirmModalOpen(false)}></div>
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm border border-white/60 animate-enter overflow-hidden flex flex-col z-10">
                <div className="p-10 text-center space-y-6">
                    <div className="mx-auto w-20 h-20 bg-primary-50 text-primary-600 rounded-3xl flex items-center justify-center shadow-inner border border-primary-100">
                        <AlertTriangle className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">操作确认</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                          确认要对选中的 <span className="text-primary-600 font-black">{selectedIds.length}</span> 个终端执行 <span className="text-slate-800 font-black">"{pendingAction.label}"</span> 操作吗？
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <button 
                            onClick={() => setIsConfirmModalOpen(false)}
                            className="py-4 text-sm font-black text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all"
                        >
                            取消
                        </button>
                        <button 
                            onClick={executeAction}
                            className="py-4 text-sm font-black text-white bg-primary-600 hover:bg-primary-700 rounded-2xl shadow-xl shadow-primary-500/20 active:scale-95 transition-all"
                        >
                            确定执行
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
      )}

      {/* 号码管理 -> 当前SIM号码编辑弹窗 */}
      {isSingleNumberEditOpen && editingSim && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsSingleNumberEditOpen(false)}></div>
            <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-sm border border-white/60 animate-enter overflow-hidden flex flex-col">
                <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex-none flex items-center justify-between">
                    <h3 className="font-black text-slate-800 tracking-tight">编辑号码配置</h3>
                    <button onClick={() => setIsSingleNumberEditOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-200/50 text-slate-400 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-10 space-y-8">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-sm font-bold text-slate-600 text-right pr-2">模块</label>
                        <div className="col-span-3">
                            <input type="text" readOnly value={editingSim.module} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-400" />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-sm font-bold text-slate-600 text-right pr-2">T1</label>
                        <div className="col-span-3">
                            <input type="text" value={editingSim.t1} onChange={(e) => setEditingSim({...editingSim, t1: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-700 shadow-sm" />
                        </div>
                    </div>
                </div>
                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={() => setIsSingleNumberEditOpen(false)} className="px-5 py-2.5 text-xs font-bold text-slate-500">取消</button>
                    <button onClick={handleSaveSimEdit} className="btn-primary px-8 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-primary-500/20 active:scale-95 transition-all">保存</button>
                </div>
            </div>
        </div>,
        document.body
      )}

      {/* APN 编辑弹窗 */}
      {isApnEditModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsApnEditModalOpen(false)}></div>
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl border border-white/60 animate-enter overflow-hidden flex flex-col">
                <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex-none flex items-center justify-between">
                    <h3 className="font-black text-slate-800 tracking-tight">编辑 APN 配置</h3>
                    <button onClick={() => setIsApnEditModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-200/50 text-slate-400 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-10 space-y-8">
                    {[
                      { label: '运营商ID', val: '101' },
                      { label: 'APN', val: 'VZWINTERNET' },
                      { label: '用户名', val: '' },
                      { label: '密码', val: '', type: 'password' }
                    ].map(field => (
                      <div key={field.label} className="grid grid-cols-4 items-center gap-4">
                        <label className="text-sm font-bold text-slate-600 text-right pr-6">{field.label}</label>
                        <div className="col-span-3">
                          <input type={field.type || 'text'} defaultValue={field.val} className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all" />
                        </div>
                      </div>
                    ))}
                </div>
                <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4 flex-none">
                    <button onClick={() => setIsApnEditModalOpen(false)} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">放弃</button>
                    <button onClick={() => setIsApnEditModalOpen(false)} className="btn-primary px-12 py-3 rounded-2xl text-sm font-black shadow-xl shadow-primary-500/20 active:scale-95 transition-all">应用更改</button>
                </div>
            </div>
        </div>,
        document.body
      )}

      {/* PIN 解锁设置弹窗 */}
      {isPinModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsPinModalOpen(false)}></div>
            <div className="relative bg-white rounded-3xl p-10 max-w-md w-full animate-enter">
                <h3 className="text-lg font-black text-slate-800 mb-6 tracking-tight">PIN 解锁设置</h3>
                <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 mb-8">
                    <span className="text-sm font-bold text-slate-700">启用自动解锁</span>
                    <input type="checkbox" checked={pinUnlockEnabled} onChange={(e) => setPinUnlockEnabled(e.target.checked)} className="w-6 h-6 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer" />
                </div>
                <div className="flex justify-end gap-4">
                    <button onClick={() => setIsPinModalOpen(false)} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">取消</button>
                    <button onClick={() => setIsPinModalOpen(false)} className="btn-primary px-10 py-3 rounded-2xl text-sm font-black shadow-xl shadow-primary-500/20 active:scale-95 transition-all">保存配置</button>
                </div>
            </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default SimSettings;
