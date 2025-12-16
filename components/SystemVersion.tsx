
import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Server, 
  Upload, 
  Download, 
  RotateCcw, 
  Shield, 
  RefreshCw, 
  FileText,
  X,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Play
} from './Icons';

// Reusable UI Components for Consistency
const SectionCard: React.FC<{ 
  title: string; 
  icon: React.ElementType; 
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}> = ({ title, icon: Icon, children, className = "", headerAction }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col transition-all duration-200 hover:shadow-md ${className}`}>
    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
       <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-slate-400" />
          <h3 className="font-bold text-slate-800 text-base">{title}</h3>
       </div>
       {headerAction}
    </div>
    <div className="p-6 flex-1 flex flex-col">
       {children}
    </div>
  </div>
);

const FileUploadZone: React.FC<{
  label: string;
  sublabel: string;
  accept: string;
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  compact?: boolean;
}> = ({ label, sublabel, accept, onFileSelect, selectedFile, compact = false }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-200 group relative overflow-hidden ${
        selectedFile 
          ? 'border-primary-300 bg-primary-50/30' 
          : 'border-slate-200 hover:border-primary-400 hover:bg-slate-50'
      } ${compact ? 'p-4' : 'p-6'}`}
    >
      <input 
        type="file" 
        ref={inputRef} 
        className="hidden" 
        accept={accept}
        onChange={(e) => e.target.files && onFileSelect(e.target.files[0])} 
      />
      
      <div className={`flex flex-col items-center justify-center gap-2 ${compact ? 'flex-row' : ''}`}>
        <div className={`rounded-full transition-colors flex items-center justify-center ${
            selectedFile 
                ? 'bg-primary-100 text-primary-600' 
                : 'bg-slate-100 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-500'
            } ${compact ? 'w-8 h-8 p-1.5' : 'w-10 h-10 p-2.5'}`}>
           {selectedFile ? <FileText className="w-full h-full" /> : <Upload className="w-full h-full" />}
        </div>
        <div className={compact ? 'text-left flex-1 pl-2' : ''}>
           <p className="text-sm font-bold text-slate-700 truncate max-w-[200px]">
             {selectedFile ? selectedFile.name : label}
           </p>
           {!selectedFile && (
               <p className="text-xs text-slate-400 mt-0.5">
                 {sublabel}
               </p>
           )}
           {selectedFile && (
               <p className="text-xs text-slate-400 mt-0.5">
                 {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
               </p>
           )}
        </div>
        {selectedFile && (
            <div className="text-primary-600">
                <CheckCircle2 className="w-5 h-5" />
            </div>
        )}
      </div>
    </div>
  );
};

const SystemVersion: React.FC = () => {
  const [firmwareFile, setFirmwareFile] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [upgradeProgress, setUpgradeProgress] = useState(0);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // Restore process state
  const [isRestoring, setIsRestoring] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  // License process state
  const [isActivating, setIsActivating] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);

  const handleUpgrade = () => {
    if (!firmwareFile) return;
    setIsUpgrading(true);
    // Simulate progress
    const interval = setInterval(() => {
      setUpgradeProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
              setIsUpgrading(false);
              setShowUpgradeModal(false);
              setFirmwareFile(null);
              setUpgradeProgress(0);
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };
  
  const handleRestore = () => {
      if (!restoreFile) return;
      setIsRestoring(true);
      setTimeout(() => {
          setIsRestoring(false);
          setRestoreFile(null);
          setShowRestoreModal(false);
          // In a real app, you would show a success toast here
      }, 2000);
  }

  const handleActivateLicense = () => {
      if (!licenseFile) return;
      setIsActivating(true);
      setTimeout(() => {
          setIsActivating(false);
          setLicenseFile(null);
          setShowLicenseModal(false);
          // In a real app, you would show a success toast here
      }, 2000);
  };

  const openUpgradeModal = () => {
      setFirmwareFile(null);
      setUpgradeProgress(0);
      setIsUpgrading(false);
      setShowUpgradeModal(true);
  };

  const openRestoreModal = () => {
      setRestoreFile(null);
      setIsRestoring(false);
      setShowRestoreModal(true);
  };

  const openLicenseModal = () => {
      setLicenseFile(null);
      setIsActivating(false);
      setShowLicenseModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-enter pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">系统维护</h1>
           <p className="text-sm text-slate-500 mt-1.5">管理设备固件版本、配置备份及授权许可</p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Firmware Hero Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row items-center p-6 md:p-8 gap-8 transition-shadow hover:shadow-md">
           <div className="flex-1 flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-white border border-primary-100 flex items-center justify-center text-primary-600 shadow-sm shrink-0">
                 <Server className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <div className="space-y-3">
                 <div>
                     <h2 className="text-lg font-bold text-slate-900">系统固件</h2>
                     <p className="text-sm text-slate-500">设备核心操作系统与组件</p>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="text-3xl font-mono font-bold text-slate-800 tracking-tight leading-none">
                        1.34.26691
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 uppercase tracking-wide">
                        Latest
                    </span>
                 </div>
              </div>
           </div>
           
           <div className="w-full md:w-auto flex flex-col items-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
               <button 
                  onClick={openUpgradeModal}
                  className="btn-primary w-full md:w-auto px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5"
                >
                  <Upload className="w-4 h-4" />
                  上传新固件
               </button>
               <p className="text-xs text-slate-400">上次检查: 今天 09:30</p>
           </div>
        </div>

        {/* Maintenance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
           {/* Backup & Restore */}
           <SectionCard title="备份与还原" icon={RotateCcw}>
              <div className="space-y-6">
                  {/* Export Action */}
                  <div className="group relative bg-slate-50 hover:bg-white border border-slate-200 rounded-xl p-4 transition-all duration-200 hover:shadow-md cursor-pointer hover:border-primary-200">
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                              <div className="p-2.5 bg-white rounded-lg text-slate-500 shadow-sm border border-slate-100 group-hover:text-primary-600 group-hover:border-primary-100 transition-colors">
                                  <Download className="w-5 h-5" />
                              </div>
                              <div>
                                  <h4 className="font-bold text-slate-700 group-hover:text-primary-700 transition-colors">导出备份文件</h4>
                                  <p className="text-xs text-slate-400 mt-0.5 group-hover:text-slate-500">下载当前完整配置包 (.tar.gz)</p>
                              </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
                      </div>
                  </div>

                  {/* Divider with label */}
                  <div className="relative">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-slate-100"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white px-2 text-xs font-bold text-slate-400 uppercase">OR</span>
                      </div>
                  </div>

                  {/* Import Action - Concise Button */}
                  <div className="space-y-3">
                      <div className="flex items-center justify-between">
                         <label className="text-sm font-bold text-slate-700">恢复配置</label>
                      </div>
                      
                      <button 
                        onClick={openRestoreModal}
                        className="w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary-600 hover:border-primary-200 shadow-sm hover:shadow-md"
                      >
                         <Upload className="w-4 h-4" />
                         上传备份存档
                      </button>
                      <p className="text-xs text-slate-400 text-center">支持 .tar.gz 格式配置文件</p>
                  </div>

                  <div className="pt-2 mt-auto">
                      <button className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1.5 transition-colors px-2 py-1 rounded hover:bg-rose-50 w-fit">
                          <AlertCircle className="w-3.5 h-3.5" /> 恢复出厂设置
                      </button>
                  </div>
              </div>
           </SectionCard>

           {/* License Management */}
           <SectionCard title="授权管理" icon={Shield}>
              <div className="space-y-6 flex flex-col h-full">
                   {/* Status Indicator */}
                   <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border border-emerald-200">
                               <CheckCircle2 className="w-5 h-5" />
                           </div>
                           <div>
                               <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide">当前状态</p>
                               <p className="text-sm font-bold text-slate-800">授权有效</p>
                           </div>
                       </div>
                       <div className="text-right">
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">有效期剩余</p>
                           <p className="text-xl font-mono font-bold text-emerald-600">342 <span className="text-sm text-emerald-500 font-sans">天</span></p>
                       </div>
                   </div>

                   {/* Update Section */}
                   <div className="space-y-3 pt-2">
                       <label className="text-sm font-bold text-slate-700">更新授权许可</label>
                       <button 
                            onClick={openLicenseModal}
                            className="w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary-600 hover:border-primary-200 shadow-sm hover:shadow-md"
                        >
                             <Upload className="w-4 h-4" />
                             上传 License 文件
                       </button>
                       <p className="text-xs text-slate-400 text-center">支持 .key 或 .lic 格式授权文件</p>
                   </div>
                   
                   <div className="mt-auto"></div>
              </div>
           </SectionCard>

        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => !isUpgrading && setShowUpgradeModal(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-white/60 animate-enter overflow-hidden flex flex-col z-10">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                         <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Server className="w-5 h-5" />
                         </div>
                         <div>
                             <h3 className="font-bold text-slate-800">系统固件升级</h3>
                             <p className="text-xs text-slate-500">上传一个 sysupgrade 兼容固件以更新正在运行的固件。</p>
                         </div>
                    </div>
                    {!isUpgrading && (
                        <button onClick={() => setShowUpgradeModal(false)} className="p-1 rounded-lg hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
                
                <div className="p-8 space-y-6">
                    {!isUpgrading ? (
                        <>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700">选择固件包</label>
                                <FileUploadZone 
                                    label="点击或拖拽固件包到此处"
                                    sublabel="支持 .bin 格式文件"
                                    accept=".bin"
                                    selectedFile={firmwareFile}
                                    onFileSelect={setFirmwareFile}
                                />
                                <p className="text-xs text-slate-400 px-1">* 升级过程预计需要 2-5 分钟，设备将自动重启。</p>
                            </div>
                            <div className="flex justify-end pt-4 gap-3">
                                 <button 
                                    onClick={() => setShowUpgradeModal(false)}
                                    className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                                 >
                                    取消
                                 </button>
                                 <button 
                                    onClick={handleUpgrade}
                                    disabled={!firmwareFile}
                                    className="btn-primary px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                                  >
                                     <RefreshCw className="w-4 h-4" />
                                     开始更新
                                  </button>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-8 py-6">
                            <div className="flex flex-col items-center gap-6 text-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-20"></div>
                                    <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 relative z-10">
                                        <RefreshCw className="w-8 h-8 animate-spin" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">正在更新系统...</h4>
                                    <p className="text-sm text-slate-500 mt-2">请勿关闭浏览器或断开电源，设备将自动重启</p>
                                </div>
                            </div>
                            
                            <div className="space-y-2 max-w-xs mx-auto w-full">
                                <div className="flex justify-between text-xs font-bold text-slate-600">
                                    <span>安装进度</span>
                                    <span>{upgradeProgress}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                    className="h-full bg-primary-500 transition-all duration-300 ease-out"
                                    style={{ width: `${upgradeProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
      )}

      {/* Restore Modal */}
      {showRestoreModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => !isRestoring && setShowRestoreModal(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-white/60 animate-enter overflow-hidden flex flex-col z-10">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                         <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <RotateCcw className="w-5 h-5" />
                         </div>
                         <div>
                             <h3 className="font-bold text-slate-800">恢复系统配置</h3>
                             <p className="text-xs text-slate-500">设备将恢复到备份时的状态</p>
                         </div>
                    </div>
                    {!isRestoring && (
                        <button onClick={() => setShowRestoreModal(false)} className="p-1 rounded-lg hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
                
                <div className="p-8 space-y-6">
                    {!isRestoring ? (
                        <>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700">选择备份文件</label>
                                <FileUploadZone 
                                    label="点击或拖拽备份文件到此处"
                                    sublabel="支持 .tar.gz 格式"
                                    accept=".tar.gz"
                                    selectedFile={restoreFile}
                                    onFileSelect={setRestoreFile}
                                />
                                {restoreFile && (
                                    <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100/50">
                                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                        <p className="text-xs text-amber-700">警告：恢复配置将覆盖当前所有设置，设备可能会自动重启。</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end pt-4 gap-3">
                                 <button 
                                    onClick={() => setShowRestoreModal(false)}
                                    className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                                 >
                                    取消
                                 </button>
                                 <button 
                                    onClick={handleRestore}
                                    disabled={!restoreFile}
                                    className="btn-primary px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                                  >
                                     <RotateCcw className="w-4 h-4" />
                                     确认恢复
                                  </button>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-8 py-6">
                            <div className="flex flex-col items-center gap-6 text-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-20"></div>
                                    <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 relative z-10">
                                        <RefreshCw className="w-8 h-8 animate-spin" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">正在恢复配置...</h4>
                                    <p className="text-sm text-slate-500 mt-2">请稍候，设备可能需要重启以应用更改</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
      )}

      {/* License Modal */}
      {showLicenseModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => !isActivating && setShowLicenseModal(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-white/60 animate-enter overflow-hidden flex flex-col z-10">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                         <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Shield className="w-5 h-5" />
                         </div>
                         <div>
                             <h3 className="font-bold text-slate-800">更新授权许可</h3>
                             <p className="text-xs text-slate-500">上传新的许可证文件以激活功能</p>
                         </div>
                    </div>
                    {!isActivating && (
                        <button onClick={() => setShowLicenseModal(false)} className="p-1 rounded-lg hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
                
                <div className="p-8 space-y-6">
                    {!isActivating ? (
                        <>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700">选择授权文件</label>
                                <FileUploadZone 
                                    label="点击或拖拽文件到此处"
                                    sublabel="支持 .key 或 .lic 格式"
                                    accept=".key,.lic"
                                    selectedFile={licenseFile}
                                    onFileSelect={setLicenseFile}
                                />
                            </div>
                            <div className="flex justify-end pt-4 gap-3">
                                 <button 
                                    onClick={() => setShowLicenseModal(false)}
                                    className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                                 >
                                    取消
                                 </button>
                                 <button 
                                    onClick={handleActivateLicense}
                                    disabled={!licenseFile}
                                    className="btn-primary px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                                  >
                                     <CheckCircle2 className="w-4 h-4" />
                                     验证并激活
                                  </button>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-8 py-6">
                            <div className="flex flex-col items-center gap-6 text-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20"></div>
                                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 relative z-10">
                                        <RefreshCw className="w-8 h-8 animate-spin" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">正在验证授权...</h4>
                                    <p className="text-sm text-slate-500 mt-2">系统正在核验许可证签名，请稍候</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default SystemVersion;
