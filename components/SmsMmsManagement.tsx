
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Zap, 
  Trash2, 
  FileUp, 
  Check, 
  X, 
  Settings2,
  ChevronDown,
  Info,
  Send,
  Edit3,
  Globe,
  Plus,
  Layers
} from './Icons';

interface MmsOperator {
  id: string;
  operatorId: string;
  mmsc: string;
  proxy: string;
  port: string;
  contextId: string;
}

const SmsMmsManagement: React.FC = () => {
  const [selectedPorts, setSelectedPorts] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [attachment, setAttachment] = useState('');
  const [successCount, setSuccessCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);

  // 彩信设置状态
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [generalSettings, setGeneralSettings] = useState({
    attachmentCount: '5',
    attachmentSize: '300' // KB
  });

  // 运营商列表状态 - 根据截图内容初始化
  const [operators, setOperators] = useState<MmsOperator[]>([
    { id: '1', operatorId: '101', mmsc: 'http://192.168.153.1:1111', proxy: '192.168.153.1', port: '1111', contextId: '0' },
  ]);

  // 编辑运营商弹窗状态
  const [isOpEditOpen, setIsOpEditOpen] = useState(false);
  const [editingOp, setEditingOp] = useState<MmsOperator | null>(null);

  const ports = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8'];

  const togglePort = (port: string) => {
    setSelectedPorts(prev => 
      prev.includes(port) ? prev.filter(p => p !== port) : [...prev, port]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setIsAllSelected(checked);
    setSelectedPorts(checked ? [...ports] : []);
  };

  const handleSend = () => {
    alert("彩信任务已提交队列");
  };

  const clearStat = (type: 'success' | 'failed') => {
    if (type === 'success') setSuccessCount(0);
    else setFailedCount(0);
  };

  const handleOpenOpEdit = (op: MmsOperator) => {
    setEditingOp({ ...op });
    setIsOpEditOpen(true);
  };

  const saveOpEdit = () => {
    if (editingOp) {
      setOperators(prev => prev.map(o => o.id === editingOp.id ? editingOp : o));
      setIsOpEditOpen(false);
      setEditingOp(null);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-enter pb-20">
      
      {/* 头部标题与操作 */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-1">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">彩信收发</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">配置彩信分发任务，支持多端口并发发送与附件上传</p>
        </div>
        
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-white text-primary-600 text-sm font-bold rounded-xl border border-primary-100 hover:bg-primary-50 transition-all shadow-sm active:scale-95 group"
        >
          <Settings2 className="w-4 h-4 group-hover:rotate-45 transition-transform" />
          彩信设置
        </button>
      </div>

      <div className="glass-card bg-white rounded-[2.5rem] border border-white/60 shadow-soft overflow-hidden p-10 space-y-10">
        
        {/* 端口选择区 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-2 pt-2">
            <label className="text-sm font-black text-slate-700 tracking-tight">端口</label>
          </div>
          <div className="md:col-span-10">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div 
                  onClick={() => handleSelectAll(!isAllSelected)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isAllSelected ? 'bg-primary-600 border-primary-600 shadow-md shadow-primary-500/20' : 'bg-white border-slate-300'}`}
                >
                  {isAllSelected && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
                </div>
                <span className="text-sm font-bold text-slate-700">All</span>
              </label>

              <div className="flex flex-wrap gap-x-6 gap-y-4">
                {ports.map(port => (
                  <label key={port} className="flex items-center gap-3 cursor-pointer group">
                    <div 
                      onClick={() => togglePort(port)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedPorts.includes(port) ? 'bg-primary-600 border-primary-600 shadow-md shadow-primary-500/20' : 'bg-white border-slate-300'}`}
                    >
                      {selectedPorts.includes(port) && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
                    </div>
                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">{port}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 收件人 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-2 pt-4">
            <label className="text-sm font-black text-slate-700 tracking-tight">收件人</label>
          </div>
          <div className="md:col-span-8 space-y-2">
            <textarea 
              rows={3} 
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="【提示】最大长度4095 (包括分号) ! 多个以英文分号隔开"
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-3xl text-sm font-mono focus:bg-white focus:border-primary-500 outline-none transition-all shadow-inner placeholder:text-slate-300 placeholder:font-sans font-bold"
            />
          </div>
        </div>

        {/* 主题 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-2 pt-4">
            <label className="text-sm font-black text-slate-700 tracking-tight">主题</label>
          </div>
          <div className="md:col-span-8">
            <textarea 
              rows={2} 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-3xl text-sm focus:bg-white focus:border-primary-500 outline-none transition-all shadow-inner font-bold"
            />
          </div>
        </div>

        {/* 彩信内容 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-2 pt-4">
            <label className="text-sm font-black text-slate-700 tracking-tight">彩信内容</label>
          </div>
          <div className="md:col-span-8">
            <textarea 
              rows={4} 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="【提示】最大长度2400个英文字母或800个本地字符!"
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-3xl text-sm focus:bg-white focus:border-primary-500 outline-none transition-all shadow-inner placeholder:text-slate-300 placeholder:font-sans font-bold"
            />
          </div>
        </div>

        {/* 彩信附件 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-2 pt-4">
            <label className="text-sm font-black text-slate-700 tracking-tight">彩信附件</label>
          </div>
          <div className="md:col-span-8 flex items-center gap-3">
            <textarea 
              rows={2} 
              value={attachment}
              readOnly
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-3xl text-sm focus:bg-white focus:border-primary-500 outline-none transition-all shadow-inner text-slate-400 font-bold"
            />
            <button className="flex-none p-4 bg-white border-2 border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-90">
              <FileUp className="w-6 h-6 text-slate-500" />
            </button>
          </div>
        </div>

        {/* 发送统计 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-2 pt-3">
            <label className="text-sm font-black text-slate-700 tracking-tight">发送成功</label>
          </div>
          <div className="md:col-span-8 space-y-4">
            <div className="w-full max-w-sm flex flex-col gap-3">
              <input 
                type="text" 
                value={successCount}
                readOnly
                className="w-full px-6 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-mono font-black text-emerald-600 shadow-inner"
              />
              <button 
                onClick={() => clearStat('success')}
                className="w-fit p-3 bg-white border-2 border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-90 group"
              >
                <Trash2 className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-2 pt-3">
            <label className="text-sm font-black text-slate-700 tracking-tight">发送失败</label>
          </div>
          <div className="md:col-span-8 space-y-4">
            <div className="w-full max-w-sm flex flex-col gap-3">
              <input 
                type="text" 
                value={failedCount}
                readOnly
                className="w-full px-6 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-mono font-black text-rose-600 shadow-inner"
              />
              <button 
                onClick={() => clearStat('failed')}
                className="w-fit p-3 bg-white border-2 border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-90 group"
              >
                <Trash2 className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* 发送按钮 */}
        <div className="pt-4 flex items-center">
          <button 
            onClick={handleSend}
            className="btn-primary px-16 py-4 rounded-[1.5rem] text-sm font-black shadow-2xl shadow-primary-500/20 active:scale-95 transition-all flex items-center gap-3"
          >
            <Send className="w-5 h-5" />
            发送
          </button>
        </div>
      </div>

      {/* 彩信设置弹窗 */}
      {isSettingsOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsSettingsOpen(false)}></div>
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl border border-white/60 animate-enter overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex-none flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl shadow-sm border border-primary-100">
                            <Settings2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 tracking-tight text-lg">彩信全局配置</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Global MMS Policy & Carrier Settings</p>
                        </div>
                    </div>
                    <button onClick={() => setIsSettingsOpen(false)} className="p-2 rounded-xl hover:bg-slate-200/50 text-slate-400 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-10 space-y-10">
                    {/* 1. 常规设置 */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <div className="w-1 h-4 bg-primary-500 rounded-full"></div>
                           <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">常规设置 (General)</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">彩信附件个数</label>
                                <div className="relative">
                                    <input 
                                      type="number" 
                                      value={generalSettings.attachmentCount}
                                      onChange={(e) => setGeneralSettings({...generalSettings, attachmentCount: e.target.value})}
                                      className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-mono font-black text-slate-700 outline-none focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 transition-all shadow-inner" 
                                    />
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">PCS</div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">彩信附件大小</label>
                                <div className="relative">
                                    <input 
                                      type="number" 
                                      value={generalSettings.attachmentSize}
                                      onChange={(e) => setGeneralSettings({...generalSettings, attachmentSize: e.target.value})}
                                      className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-mono font-black text-slate-700 outline-none focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 transition-all shadow-inner" 
                                    />
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest">KB</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. 运营商列表 - 根据图片更新列名与内容 */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className="w-1 h-4 bg-indigo-500 rounded-full"></div>
                               <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">运营商配置列表 (Operator List)</h4>
                            </div>
                        </div>

                        <div className="border border-slate-100 rounded-[2rem] overflow-hidden bg-white shadow-soft">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                        <th className="px-6 py-4">运营商ID</th>
                                        <th className="px-6 py-4">MMSC</th>
                                        <th className="px-6 py-4">代理</th>
                                        <th className="px-6 py-4">端口</th>
                                        <th className="px-6 py-4">ContextId</th>
                                        <th className="px-8 py-4 text-right">操作</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {operators.map(op => (
                                        <tr key={op.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4 text-xs font-mono font-bold text-slate-600">{op.operatorId}</td>
                                            <td className="px-6 py-4 text-[11px] font-mono text-slate-400 truncate max-w-[240px]">{op.mmsc}</td>
                                            <td className="px-6 py-4 text-xs font-mono text-slate-500">{op.proxy}</td>
                                            <td className="px-6 py-4 text-xs font-mono text-slate-500">{op.port}</td>
                                            <td className="px-6 py-4 text-xs font-mono text-slate-500">{op.contextId}</td>
                                            <td className="px-8 py-4 text-right">
                                                <button 
                                                  onClick={() => handleOpenOpEdit(op)}
                                                  className="p-2 text-slate-400 hover:text-primary-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4 flex-none">
                    <button onClick={() => setIsSettingsOpen(false)} className="px-8 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">取消</button>
                    <button onClick={() => setIsSettingsOpen(false)} className="btn-primary px-12 py-3 rounded-2xl text-sm font-black shadow-xl shadow-primary-500/20 active:scale-95 transition-all">应用全局设置</button>
                </div>
            </div>
        </div>,
        document.body
      )}

      {/* 运营商单行编辑弹窗 */}
      {isOpEditOpen && editingOp && createPortal(
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setIsOpEditOpen(false)}></div>
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg border border-white/60 animate-enter overflow-hidden flex flex-col z-10">
                <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex-none flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm border border-indigo-100">
                            <Globe className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 tracking-tight">编辑运营商参数</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Carrier Configuration (ID: {editingOp.operatorId})</p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpEditOpen(false)} className="p-2 rounded-xl hover:bg-slate-200/50 text-slate-400 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-10 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">MMSC 地址</label>
                        <input 
                          type="text" 
                          value={editingOp.mmsc}
                          onChange={(e) => setEditingOp({...editingOp, mmsc: e.target.value})}
                          className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-mono font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 shadow-inner transition-all" 
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">彩信代理</label>
                            <input 
                              type="text" 
                              value={editingOp.proxy}
                              onChange={(e) => setEditingOp({...editingOp, proxy: e.target.value})}
                              className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-mono font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 shadow-inner transition-all" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">端口</label>
                            <input 
                              type="text" 
                              value={editingOp.port}
                              onChange={(e) => setEditingOp({...editingOp, port: e.target.value})}
                              className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-mono font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 shadow-inner transition-all" 
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">ContextId</label>
                        <div className="relative">
                            <input 
                              type="text" 
                              value={editingOp.contextId}
                              onChange={(e) => setEditingOp({...editingOp, contextId: e.target.value})}
                              className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-mono font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 shadow-inner transition-all" 
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <Layers className="w-4 h-4 text-slate-200" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 flex-none">
                    <button onClick={() => setIsOpEditOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">取消</button>
                    <button onClick={saveOpEdit} className="btn-primary px-10 py-2.5 rounded-2xl text-sm font-black shadow-lg shadow-primary-500/20 active:scale-95 transition-all">保存更改</button>
                </div>
            </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default SmsMmsManagement;
