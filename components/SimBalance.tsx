
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Settings2, 
  Edit3, 
  Trash2, 
  X, 
  Clock,
  AlertCircle,
  ShieldCheck,
  MessageSquare,
  Terminal,
  Globe,
  Zap,
  Search,
  CheckCircle2,
  ChevronDown,
  Info
} from './Icons';

type BalanceSubTab = 'operator' | 'ussd' | 'sms';

interface OperatorRule {
  id: string;
  operatorId: string;
  operatorName: string;
  method: 'USSD' | 'SMS' | 'AT';
  warningThreshold: string;
  invalidValue: string;
}

interface SmsKeywordRule {
  id: string;
  operatorId: string;
  senderNum: string;
  recipientNum: string;
  querySms: string;
  parseScope: string;
  validKeyword: string;
  invalidKeyword: string;
  invalidSimKeyword: string;
}

interface UssdKeywordRule {
  id: string;
  operatorId: string;
  ussdCommand: string;
  validKeyword: string;
  invalidKeyword: string;
  invalidSimKeyword: string;
}

const SimBalance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<BalanceSubTab>('operator');
  const [isBillingSettingsOpen, setIsBillingSettingsOpen] = useState(false);
  
  // Modals
  const [isSmsEditModalOpen, setIsSmsEditModalOpen] = useState(false);
  const [isUssdEditModalOpen, setIsUssdEditModalOpen] = useState(false);
  const [isOperatorEditModalOpen, setIsOperatorEditModalOpen] = useState(false);
  
  const [isQuerying, setIsQuerying] = useState(false);
  
  // Editing States
  const [editingSmsRule, setEditingSmsRule] = useState<SmsKeywordRule | null>(null);
  const [editingUssdRule, setEditingUssdRule] = useState<UssdKeywordRule | null>(null);
  const [editingOperator, setEditingOperator] = useState<OperatorRule | null>(null);

  // Mock Data
  const [operators] = useState<OperatorRule[]>([
    { id: '1', operatorId: '101', operatorName: '-', method: 'USSD', warningThreshold: '0.00', invalidValue: '0.00' },
    { id: '2', operatorId: '46000', operatorName: '中国移动', method: 'SMS', warningThreshold: '5.00', invalidValue: '-1.00' },
    { id: '3', operatorId: '46001', operatorName: '中国联通', method: 'USSD', warningThreshold: '2.00', invalidValue: '0.00' },
  ]);

  const [ussdKeywordRules] = useState<UssdKeywordRule[]>([
    { id: 'u1', operatorId: '101', ussdCommand: '', validKeyword: '-', invalidKeyword: '-', invalidSimKeyword: '-' },
    { id: 'u2', operatorId: '46001', ussdCommand: '*101#', validKeyword: 'Balance:', invalidKeyword: 'Error', invalidSimKeyword: 'Invalid' },
  ]);

  const [smsKeywordRules] = useState<SmsKeywordRule[]>([
    { id: 's1', operatorId: '101', senderNum: '-', recipientNum: '-', querySms: '-', parseScope: '-', validKeyword: '-', invalidKeyword: '-', invalidSimKeyword: '-' },
    { id: 's2', operatorId: '46001', senderNum: '10010', recipientNum: '10010', querySms: 'YE', parseScope: 'Content', validKeyword: '余额', invalidKeyword: '欠费', invalidSimKeyword: '停机' },
  ]);

  const [billingConfig, setBillingConfig] = useState({
    operatorSource: 'IMSI',
    ussdQuery: true,
    cycleQueryMin: '0',
    useLastBalance: true,
    queryOnSwitch: false,
    switchOnLowBalance: false,
    alertSmsContent: ''
  });

  const handleImmediateQuery = () => {
    setIsQuerying(true);
    setTimeout(() => {
      setIsQuerying(false);
      alert("余额查询任务已提交至网关。");
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-enter max-w-[1600px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">卡余额查询</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">配置计费策略与解析关键字</p>
        </div>
        
        <button 
            onClick={() => setIsBillingSettingsOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 hover:border-primary-200 hover:text-primary-600 transition-all shadow-sm active:scale-95"
        >
            <Settings2 className="w-4 h-4" />
            计费设置
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col glass-card rounded-2xl border border-white/60 shadow-soft overflow-hidden bg-white/60">
        
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-100/50">
          {[
            { id: 'operator', label: '运营商', icon: Globe },
            { id: 'ussd', label: 'USSD 查询关键字', icon: Terminal },
            { id: 'sms', label: '短信查询关键字', icon: MessageSquare },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as BalanceSubTab)}
              className={`px-8 py-3.5 text-sm font-bold transition-all relative border-r border-slate-200 flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-slate-600 hover:bg-white/40'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary-600"></div>
              )}
            </button>
          ))}
        </div>

        {/* Toolbar - Conditional Button for 'operator' tab */}
        <div className="flex-none p-4 bg-white border-b border-slate-200 flex items-center gap-3 h-[60px]">
           {activeTab !== 'operator' && (
             <button 
               onClick={handleImmediateQuery}
               disabled={isQuerying}
               className="flex items-center gap-2 px-5 py-1.5 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
             >
               <Search className={`w-4 h-4 ${isQuerying ? 'animate-spin' : ''}`} />
               立即查询
             </button>
           )}
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-auto bg-white">
          {activeTab === 'operator' && (
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f8f9fc] sticky top-0 z-10">
                <tr className="border-b border-slate-200">
                  <th className="px-8 py-4 text-sm font-bold text-slate-600">运营商ID</th>
                  <th className="px-8 py-4 text-sm font-bold text-slate-600">运营商名</th>
                  <th className="px-8 py-4 text-sm font-bold text-slate-600">默认方法</th>
                  <th className="px-8 py-4 text-sm font-bold text-slate-600">警戒值</th>
                  <th className="px-8 py-4 text-sm font-bold text-slate-600">无效值</th>
                  <th className="px-8 py-4 text-sm font-bold text-slate-600 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {operators.map(op => (
                  <tr key={op.id} className="hover:bg-[#fcfdfe] transition-all group">
                    <td className="px-8 py-4 text-sm font-mono text-slate-700">{op.operatorId}</td>
                    <td className="px-8 py-4 text-sm text-slate-700">{op.operatorName}</td>
                    <td className="px-8 py-4 text-sm font-bold text-indigo-600">{op.method}</td>
                    <td className="px-8 py-4 text-sm font-mono text-slate-600">{op.warningThreshold}</td>
                    <td className="px-8 py-4 text-sm font-mono text-slate-600">{op.invalidValue}</td>
                    <td className="px-8 py-4 text-right">
                       <button 
                         onClick={() => { setEditingOperator(op); setIsOperatorEditModalOpen(true); }}
                         className="p-1.5 text-slate-400 hover:text-primary-600 bg-white border border-transparent group-hover:border-slate-100 rounded-md shadow-sm transition-all"
                       >
                          <Edit3 className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'ussd' && (
            <table className="w-full text-left border-collapse">
                <thead className="bg-[#f8f9fc] sticky top-0 z-10">
                    <tr className="border-b border-slate-200">
                        <th className="px-8 py-4 text-sm font-bold text-slate-700">运营商ID</th>
                        <th className="px-8 py-4 text-sm font-bold text-slate-700">USSD命令</th>
                        <th className="px-8 py-4 text-sm font-bold text-slate-700">有效余额关键字</th>
                        <th className="px-8 py-4 text-sm font-bold text-slate-700">无效余额关键字</th>
                        <th className="px-8 py-4 text-sm font-bold text-slate-700">无效SIM关键字</th>
                        <th className="px-8 py-4 text-sm font-bold text-slate-700 text-right">操作</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {ussdKeywordRules.map(rule => (
                        <tr key={rule.id} className="hover:bg-[#fcfdfe] transition-all group">
                            <td className="px-8 py-4 text-sm font-mono text-slate-700">{rule.operatorId}</td>
                            <td className="px-8 py-4 text-sm text-slate-600 font-mono">{rule.ussdCommand || '-'}</td>
                            <td className="px-8 py-4 text-sm text-emerald-600 font-medium">{rule.validKeyword}</td>
                            <td className="px-8 py-4 text-sm text-rose-500 font-medium">{rule.invalidKeyword}</td>
                            <td className="px-8 py-4 text-sm text-rose-800 font-medium">{rule.invalidSimKeyword}</td>
                            <td className="px-8 py-4 text-right">
                               <button 
                                 onClick={() => { setEditingUssdRule(rule); setIsUssdEditModalOpen(true); }}
                                 className="p-1.5 text-slate-400 hover:text-primary-600 bg-white border border-transparent group-hover:border-slate-100 rounded-md shadow-sm transition-all"
                               >
                                  <Edit3 className="w-4 h-4" />
                               </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          )}

          {activeTab === 'sms' && (
            <table className="w-full text-left border-collapse">
                <thead className="bg-[#f8f9fc] sticky top-0 z-10">
                    <tr className="border-b border-slate-200">
                        <th className="px-8 py-4 text-sm font-bold text-slate-700">运营商ID</th>
                        <th className="px-8 py-4 text-sm font-bold text-slate-700">发送号码</th>
                        <th className="px-8 py-4 text-sm font-bold text-slate-700">接收号码</th>
                        <th className="px-8 py-4 text-sm font-bold text-slate-700">查询短信</th>
                        <th className="px-8 py-4 text-sm font-bold text-slate-700">解析范围</th>
                        <th className="px-8 py-4 text-sm font-bold text-slate-700">有效余额关键字</th>
                        <th className="px-8 py-4 text-sm font-bold text-slate-700">无效余额关键字</th>
                        <th className="px-8 py-4 text-sm font-bold text-slate-700">无效SIM关键字</th>
                        <th className="px-8 py-4 text-sm font-bold text-slate-700 text-right">操作</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {smsKeywordRules.map(rule => (
                        <tr key={rule.id} className="hover:bg-[#fcfdfe] transition-all group">
                            <td className="px-8 py-4 text-sm font-mono text-slate-700">{rule.operatorId}</td>
                            <td className="px-8 py-4 text-sm text-slate-600">{rule.senderNum}</td>
                            <td className="px-8 py-4 text-sm text-slate-600">{rule.recipientNum}</td>
                            <td className="px-8 py-4 text-sm text-slate-600 font-mono">{rule.querySms}</td>
                            <td className="px-8 py-4 text-sm text-slate-600">{rule.parseScope}</td>
                            <td className="px-8 py-4 text-sm text-emerald-600 font-medium">{rule.validKeyword}</td>
                            <td className="px-8 py-4 text-sm text-rose-500 font-medium">{rule.invalidKeyword}</td>
                            <td className="px-8 py-4 text-sm text-rose-800 font-medium">{rule.invalidSimKeyword}</td>
                            <td className="px-8 py-4 text-right">
                               <button 
                                 onClick={() => { setEditingSmsRule(rule); setIsSmsEditModalOpen(true); }}
                                 className="p-1.5 text-slate-400 hover:text-primary-600 bg-white border border-transparent group-hover:border-slate-100 rounded-md shadow-sm transition-all"
                               >
                                  <Edit3 className="w-4 h-4" />
                               </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          )}
        </div>

        {/* Footer info */}
        <div className="flex-none p-4 bg-slate-50/50 border-t border-slate-100 backdrop-blur-md flex items-center justify-between">
           <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              解析引擎实时自检: 运行中 (v2.4.1)
           </div>
           <p className="text-[10px] text-slate-400 font-bold italic tracking-wide">
             提示: 所有的关键字配置将在下次自动化任务触发时生效
           </p>
        </div>
      </div>

      {/* Edit USSD Keywords Modal */}
      {isUssdEditModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsUssdEditModalOpen(false)}></div>
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-white/60 animate-enter overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800">编辑 USSD 查询关键字</h3>
                    <button onClick={() => setIsUssdEditModalOpen(false)} className="p-1 rounded-md hover:bg-slate-100 text-slate-400 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-8 space-y-8 bg-white">
                    {[
                      { label: '运营商ID', value: editingUssdRule?.operatorId },
                      { label: 'USSD命令', value: editingUssdRule?.ussdCommand },
                      { label: '有效余额关键字', value: editingUssdRule?.validKeyword },
                      { label: '无效余额关键字', value: editingUssdRule?.invalidKeyword },
                      { label: '无效SIM关键字', value: editingUssdRule?.invalidSimKeyword },
                    ].map((field, idx) => (
                      <div key={idx} className="flex items-center">
                        <div className="w-32 text-right pr-6">
                          <label className="text-sm font-medium text-slate-600 whitespace-nowrap">{field.label}</label>
                        </div>
                        <div className="flex-1">
                          <input 
                            type="text" 
                            defaultValue={field.value}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-800 focus:outline-none focus:border-primary-500 transition-all placeholder:text-slate-300"
                          />
                        </div>
                      </div>
                    ))}
                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                    <button onClick={() => setIsUssdEditModalOpen(false)} className="px-5 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">取消</button>
                    <button onClick={() => setIsUssdEditModalOpen(false)} className="btn-primary px-8 py-2 rounded-lg text-sm font-bold shadow-lg shadow-primary-500/20 active:scale-95 transition-all">保存更改</button>
                </div>
            </div>
        </div>,
        document.body
      )}

      {/* Edit SMS Keywords Modal */}
      {isSmsEditModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsSmsEditModalOpen(false)}></div>
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-white/60 animate-enter overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800">编辑短信查询关键字</h3>
                    <button onClick={() => setIsSmsEditModalOpen(false)} className="p-1 rounded-md hover:bg-slate-100 text-slate-400 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-8 space-y-8 bg-white">
                    {[
                      { label: '运营商ID', value: editingSmsRule?.operatorId },
                      { label: '发送号码', value: editingSmsRule?.senderNum },
                      { label: '接收号码', value: editingSmsRule?.recipientNum },
                      { label: '查询短信', value: editingSmsRule?.querySms },
                      { label: '解析范围', value: editingSmsRule?.parseScope },
                      { label: '有效余额关键字', value: editingSmsRule?.validKeyword },
                      { label: '无效余额关键字', value: editingSmsRule?.invalidKeyword },
                      { label: '无效SIM关键字', value: editingSmsRule?.invalidSimKeyword },
                    ].map((field, idx) => (
                      <div key={idx} className="flex items-center">
                        <div className="w-32 text-right pr-6">
                          <label className="text-sm font-medium text-slate-600 whitespace-nowrap">{field.label}</label>
                        </div>
                        <div className="flex-1">
                          <input 
                            type="text" 
                            defaultValue={field.value}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-800 focus:outline-none focus:border-primary-500 transition-all placeholder:text-slate-300"
                          />
                        </div>
                      </div>
                    ))}
                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                    <button onClick={() => setIsSmsEditModalOpen(false)} className="px-5 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">取消</button>
                    <button onClick={() => setIsSmsEditModalOpen(false)} className="btn-primary px-8 py-2 rounded-lg text-sm font-bold shadow-lg shadow-primary-500/20 active:scale-95 transition-all">保存更改</button>
                </div>
            </div>
        </div>,
        document.body
      )}

      {/* Edit Operator Modal */}
      {isOperatorEditModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsOperatorEditModalOpen(false)}></div>
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-white/60 animate-enter overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800">编辑运营商映射</h3>
                    <button onClick={() => setIsOperatorEditModalOpen(false)} className="p-1 rounded-md hover:bg-slate-100 text-slate-400 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-8 space-y-8 bg-white">
                    <div className="flex items-center">
                        <div className="w-32 text-right pr-6">
                          <label className="text-sm font-medium text-slate-600 whitespace-nowrap">运营商ID</label>
                        </div>
                        <div className="flex-1">
                          <input type="text" defaultValue={editingOperator?.operatorId} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-800 focus:outline-none focus:border-primary-500 shadow-sm" />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="w-32 text-right pr-6">
                          <label className="text-sm font-medium text-slate-600 whitespace-nowrap">运营商名</label>
                        </div>
                        <div className="flex-1">
                          <input type="text" defaultValue={editingOperator?.operatorName} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-800 focus:outline-none focus:border-primary-500 shadow-sm" />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="w-32 text-right pr-6">
                          <label className="text-sm font-medium text-slate-600 whitespace-nowrap">默认查询方法</label>
                        </div>
                        <div className="flex-1 relative">
                          <select defaultValue={editingOperator?.method} className="w-full px-3 py-2 appearance-none bg-white border border-slate-200 rounded-md text-sm text-slate-800 focus:outline-none focus:border-primary-500 shadow-sm">
                             <option value="USSD">USSD</option>
                             <option value="SMS">SMS</option>
                             <option value="AT">AT</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="w-32 text-right pr-6">
                          <label className="text-sm font-medium text-slate-600 whitespace-nowrap">余额警戒值</label>
                        </div>
                        <div className="flex-1">
                          <input type="text" defaultValue={editingOperator?.warningThreshold} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-mono text-slate-800 focus:outline-none focus:border-primary-500 shadow-sm" />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="w-32 text-right pr-6">
                          <label className="text-sm font-medium text-slate-600 whitespace-nowrap">无效余额定义</label>
                        </div>
                        <div className="flex-1">
                          <input type="text" defaultValue={editingOperator?.invalidValue} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-mono text-slate-800 focus:outline-none focus:border-primary-500 shadow-sm" />
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                    <button onClick={() => setIsOperatorEditModalOpen(false)} className="px-5 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">取消</button>
                    <button onClick={() => setIsOperatorEditModalOpen(false)} className="btn-primary px-8 py-2 rounded-lg text-sm font-bold shadow-lg shadow-primary-500/20 active:scale-95 transition-all">保存更改</button>
                </div>
            </div>
        </div>,
        document.body
      )}

      {/* Global Billing Settings Modal - Optimized based on provided screenshot */}
      {isBillingSettingsOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsBillingSettingsOpen(false)}></div>
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-white/60 animate-enter overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex-none flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">计费设置</h3>
                    <button onClick={() => setIsBillingSettingsOpen(false)} className="p-1 rounded-lg hover:bg-slate-200/50 text-slate-400 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-10 space-y-6">
                    {/* 运营商来源 */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-4 text-right pr-4">
                          <label className="text-sm font-medium text-slate-600">运营商来源</label>
                        </div>
                        <div className="md:col-span-7 relative">
                          <select 
                            value={billingConfig.operatorSource}
                            onChange={(e) => setBillingConfig({...billingConfig, operatorSource: e.target.value})}
                            className="w-full appearance-none px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 shadow-sm transition-all cursor-pointer"
                          >
                            <option>IMSI</option>
                            <option>HPLMN</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* USSD查询 */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-4 text-right pr-4">
                          <label className="text-sm font-medium text-slate-600">USSD查询</label>
                        </div>
                        <div className="md:col-span-7 flex items-center h-full">
                          <input 
                            type="checkbox" 
                            checked={billingConfig.ussdQuery}
                            onChange={(e) => setBillingConfig({...billingConfig, ussdQuery: e.target.checked})}
                            className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer shadow-sm" 
                          />
                        </div>
                    </div>

                    {/* 周期查询余额(分) */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-4 flex items-center justify-end gap-1 pr-4">
                          <label className="text-sm font-medium text-slate-600">周期查询余额(分)</label>
                          <Info className="w-3.5 h-3.5 text-primary-500 cursor-help" />
                        </div>
                        <div className="md:col-span-7">
                          <input 
                            type="text"
                            value={billingConfig.cycleQueryMin}
                            onChange={(e) => setBillingConfig({...billingConfig, cycleQueryMin: e.target.value})}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 shadow-sm transition-all"
                          />
                        </div>
                    </div>

                    {/* 使用上次余额 */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-4 flex items-center justify-end gap-1 pr-4">
                          <label className="text-sm font-medium text-slate-600">使用上次余额</label>
                          <Info className="w-3.5 h-3.5 text-primary-500 cursor-help" />
                        </div>
                        <div className="md:col-span-7 flex items-center h-full">
                          <input 
                            type="checkbox" 
                            checked={billingConfig.useLastBalance}
                            onChange={(e) => setBillingConfig({...billingConfig, useLastBalance: e.target.checked})}
                            className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer shadow-sm" 
                          />
                        </div>
                    </div>

                    {/* 切卡时查余额 */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-4 text-right pr-4">
                          <label className="text-sm font-medium text-slate-600">切卡时查余额</label>
                        </div>
                        <div className="md:col-span-7 flex items-center h-full">
                          <input 
                            type="checkbox" 
                            checked={billingConfig.queryOnSwitch}
                            onChange={(e) => setBillingConfig({...billingConfig, queryOnSwitch: e.target.checked})}
                            className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer shadow-sm" 
                          />
                        </div>
                    </div>

                    {/* 余额不足时切卡 */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-4 text-right pr-4">
                          <label className="text-sm font-medium text-slate-600">余额不足时切卡</label>
                        </div>
                        <div className="md:col-span-7 flex items-center h-full">
                          <input 
                            type="checkbox" 
                            checked={billingConfig.switchOnLowBalance}
                            onChange={(e) => setBillingConfig({...billingConfig, switchOnLowBalance: e.target.checked})}
                            className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer shadow-sm" 
                          />
                        </div>
                    </div>

                    {/* 当余额低于警戒值时发送短信 */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-4 text-right pr-4">
                          <label className="text-sm font-medium text-slate-600">当余额低于警戒值时发送短信</label>
                        </div>
                        <div className="md:col-span-7">
                          <input 
                            type="text"
                            placeholder="请输入"
                            value={billingConfig.alertSmsContent}
                            onChange={(e) => setBillingConfig({...billingConfig, alertSmsContent: e.target.value})}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 shadow-sm transition-all placeholder:text-slate-300"
                          />
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={() => setIsBillingSettingsOpen(false)} className="px-6 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">取消</button>
                    <button onClick={() => setIsBillingSettingsOpen(false)} className="btn-primary px-10 py-2 rounded-lg text-sm font-bold shadow-lg shadow-primary-500/20 active:scale-95 transition-all">确认</button>
                </div>
            </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default SimBalance;
