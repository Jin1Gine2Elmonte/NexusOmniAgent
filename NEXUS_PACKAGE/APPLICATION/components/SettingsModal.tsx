import React, { useState } from 'react';
import { 
  Settings, Globe, Cpu, Shield, Database, Zap, RefreshCw, 
  LogOut, Cloud, Download, Upload, Trash2, X, Check, Volume2, 
  VolumeX, Grid, Sparkles, Key, Languages, SlidersHorizontal, 
  CheckCircle2, Layers, Monitor, Sliders, Activity
} from 'lucide-react';
import { ModelSelection, MODEL_OPTIONS, SyncStatus, UserProfile } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'ar' | 'en';
  onLanguageChange: (lang: 'ar' | 'en') => void;
  creativityTemp: number;
  onCreativityTempChange: (temp: number) => void;
  enableCyberGrid: boolean;
  onCyberGridToggle: () => void;
  enableSoundFx: boolean;
  onSoundFxToggle: () => void;
  selectedModel: ModelSelection;
  onModelChange: (model: ModelSelection) => void;
  kimiApiKeyInput: string;
  kimiBaseUrlInput: string;
  kimiModelInput: string;
  onKimiConfigChange: (key: 'apiKey' | 'baseUrl' | 'model', value: string) => void;
  userProfile: UserProfile | null;
  syncStatus: SyncStatus;
  onCloudConnect: () => void;
  onSignOut: () => void;
  onExportLocal: () => void;
  onImportLocal: () => void;
  onClearMemory: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  creativityTemp,
  onCreativityTempChange,
  enableCyberGrid,
  onCyberGridToggle,
  enableSoundFx,
  onSoundFxToggle,
  selectedModel,
  onModelChange,
  kimiApiKeyInput,
  kimiBaseUrlInput,
  kimiModelInput,
  onKimiConfigChange,
  userProfile,
  syncStatus,
  onCloudConnect,
  onSignOut,
  onExportLocal,
  onImportLocal,
  onClearMemory
}) => {
  const [activeTab, setActiveTab] = useState<'language' | 'ai' | 'data' | 'security'>('language');

  if (!isOpen) return null;

  const isAr = language === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#09090b] border border-zinc-800/90 rounded-2xl shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[85vh] text-zinc-100"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-zinc-900 border border-purple-500/20 text-purple-400">
              <Settings size={20} className="animate-spin-slow opacity-80" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-wide text-zinc-100 font-mono">
                {isAr ? 'نظام إعدادات نيكسوس السيادي' : 'NEXUS Sovereign System Config'}
              </h2>
              <p className="text-xs text-zinc-300 font-mono">
                {isAr ? 'تخصيص اللغة، المحرك البصري، الذاكرة والمعاملات' : 'Configure Language, AI Core, Memory & Parameters'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800/80 bg-zinc-950/80 px-6 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('language')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-mono transition-all cursor-pointer whitespace-nowrap border-b-2 ${
              activeTab === 'language'
                ? 'border-purple-400 text-white font-bold bg-zinc-900/60'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Languages size={15} className={activeTab === 'language' ? 'text-purple-400' : 'text-zinc-500'} />
            <span>{isAr ? 'اللغة والواجهة' : 'Language & Interface'}</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-mono transition-all cursor-pointer whitespace-nowrap border-b-2 ${
              activeTab === 'ai'
                ? 'border-cyan-400 text-white font-bold bg-zinc-900/60'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Cpu size={15} className={activeTab === 'ai' ? 'text-cyan-400' : 'text-zinc-500'} />
            <span>{isAr ? 'محرك الذكاء والنموذج' : 'AI Engine & Model'}</span>
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-mono transition-all cursor-pointer whitespace-nowrap border-b-2 ${
              activeTab === 'data'
                ? 'border-emerald-400 text-white font-bold bg-zinc-900/60'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Database size={15} className={activeTab === 'data' ? 'text-emerald-400' : 'text-zinc-500'} />
            <span>{isAr ? 'البيانات والذاكرة' : 'Data & Memory'}</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-mono transition-all cursor-pointer whitespace-nowrap border-b-2 ${
              activeTab === 'security'
                ? 'border-amber-400 text-white font-bold bg-zinc-900/60'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Shield size={15} className={activeTab === 'security' ? 'text-amber-400' : 'text-zinc-500'} />
            <span>{isAr ? 'الأمان والبروتوكول' : 'Security & Rules'}</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: LANGUAGE & INTERFACE */}
          {activeTab === 'language' && (
            <div className="space-y-6">
              {/* Language Selection Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-mono font-bold text-zinc-200 flex items-center gap-2">
                    <Globe size={15} className="text-purple-400" />
                    <span>{isAr ? 'لغة واجهة النظام والمحرك الإدراكي' : 'System Interface & Cognition Language'}</span>
                  </label>
                  <span className="text-[10px] font-mono text-zinc-400">
                    ISO 639-1 Standard
                  </span>
                </div>

                {/* Professional Language Matrix Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Arabic Option */}
                  <button
                    onClick={() => onLanguageChange('ar')}
                    className={`relative p-4 rounded-xl border text-right transition-all cursor-pointer ${
                      language === 'ar'
                        ? 'bg-zinc-900/90 border-purple-500/50 text-white shadow-md shadow-purple-950/20'
                        : 'bg-zinc-950/40 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                          language === 'ar' ? 'bg-purple-950/80 text-purple-200 border border-purple-500/30' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          AR-SA
                        </span>
                        <div>
                          <div className={`text-sm font-bold ${language === 'ar' ? 'text-white' : 'text-zinc-300'}`}>العربية</div>
                          <div className="text-[10px] text-zinc-400 font-mono">Arabic Sovereign Core</div>
                        </div>
                      </div>

                      {language === 'ar' && (
                        <div className="flex items-center gap-1 text-purple-300 text-[10px] font-mono font-bold bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-500/30">
                          <CheckCircle2 size={12} />
                          <span>{isAr ? 'نشط' : 'ACTIVE'}</span>
                        </div>
                      )}
                    </div>

                    <p className={`text-[11px] leading-relaxed ${language === 'ar' ? 'text-zinc-200' : 'text-zinc-400'}`}>
                      {isAr 
                        ? 'النمط السيادي الفصيح، مع توجيه النص اليمني (RTL) ودعم المصطلحات الهندسية الدقيقة.'
                        : 'Sovereign Arabic dialect with native Right-to-Left (RTL) structural flow and precision terminology.'}
                    </p>
                  </button>

                  {/* English Option */}
                  <button
                    onClick={() => onLanguageChange('en')}
                    className={`relative p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      language === 'en'
                        ? 'bg-zinc-900/90 border-purple-500/50 text-white shadow-md shadow-purple-950/20'
                        : 'bg-zinc-950/40 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                          language === 'en' ? 'bg-purple-950/80 text-purple-200 border border-purple-500/30' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          EN-US
                        </span>
                        <div>
                          <div className={`text-sm font-bold ${language === 'en' ? 'text-white' : 'text-zinc-300'}`}>English</div>
                          <div className="text-[10px] text-zinc-400 font-mono">Precision Technical Engine</div>
                        </div>
                      </div>

                      {language === 'en' && (
                        <div className="flex items-center gap-1 text-purple-300 text-[10px] font-mono font-bold bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-500/30">
                          <CheckCircle2 size={12} />
                          <span>ACTIVE</span>
                        </div>
                      )}
                    </div>

                    <p className={`text-[11px] leading-relaxed ${language === 'en' ? 'text-zinc-200' : 'text-zinc-400'}`}>
                      {isAr
                        ? 'المحرك التقني باللغة الإنجليزية، تدفق يساري (LTR) ملائم للأكواد والأدوات البرمجية.'
                        : 'High-precision technical English with native Left-to-Right (LTR) layout & engineering syntax.'}
                    </p>
                  </button>
                </div>
              </div>

              {/* Language Metrics & System Locale Info */}
              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/90 space-y-2">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-zinc-300 flex items-center gap-1.5">
                    <Languages size={13} className="text-purple-400" />
                    <span>{isAr ? 'الترميز والتنسيق الحالي:' : 'Active Locale & Encoding:'}</span>
                  </span>
                  <span className="text-purple-300 font-bold">
                    {language === 'ar' ? 'ar-SA (العربية - المملكة العربية السعودية)' : 'en-US (English - United States)'}
                  </span>
                </div>
                <div className="flex items-center justify-between font-mono text-[10px] text-zinc-300 pt-1 border-t border-zinc-900">
                  <span>{isAr ? 'نمط اتجاه الشاشة:' : 'Screen Layout Mode:'} <strong className="text-zinc-100">{language === 'ar' ? 'RTL (من اليمين لليار)' : 'LTR (Left to Right)'}</strong></span>
                  <span>{isAr ? 'الحفظ التلقائي:' : 'Auto Persistence:'} <strong className="text-emerald-300">LocalStorage Enabled</strong></span>
                </div>
              </div>

              {/* Interface Visual Toggles */}
              <div className="border-t border-zinc-800/80 pt-5 space-y-4">
                <h3 className="text-xs font-mono font-bold text-zinc-200 flex items-center gap-2">
                  <Monitor size={15} className="text-purple-400" />
                  <span>{isAr ? 'المظهر والمؤثرات البصرية' : 'Aesthetics & Visual FX'}</span>
                </h3>

                {/* Cyber Grid */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/40 border border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-zinc-800/80 text-purple-300">
                      <Grid size={16} />
                    </div>
                    <div>
                      <div className="font-bold text-zinc-100">{isAr ? 'الشبكة الضوئية السايبرانية (Cyber Grid)' : 'Cyber Grid Background'}</div>
                      <div className="text-[11px] text-zinc-300 mt-0.5">{isAr ? 'عرض خطوط الشبكة المستقبلية المتحركة خلفية الشاشة' : 'Render futuristic animated grid lines in canvas background'}</div>
                    </div>
                  </div>
                  <button
                    onClick={onCyberGridToggle}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${enableCyberGrid ? 'bg-purple-600' : 'bg-zinc-800'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${enableCyberGrid ? (isAr ? 'left-1' : 'right-1') : (isAr ? 'right-1' : 'left-1')}`} />
                  </button>
                </div>

                {/* Sound FX */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/40 border border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-zinc-800/80 text-purple-300">
                      {enableSoundFx ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    </div>
                    <div>
                      <div className="font-bold text-zinc-100">{isAr ? 'المؤثرات الصوتية والبيئية' : 'Ambient Audio Effects'}</div>
                      <div className="text-[11px] text-zinc-300 mt-0.5">{isAr ? 'أصوات التفاعل الإلكتروني واستجابة المحرك' : 'Synthesizer clicks and neural response sounds'}</div>
                    </div>
                  </div>
                  <button
                    onClick={onSoundFxToggle}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${enableSoundFx ? 'bg-purple-600' : 'bg-zinc-800'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${enableSoundFx ? (isAr ? 'left-1' : 'right-1') : (isAr ? 'right-1' : 'left-1')}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI ENGINE & MODEL */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              {/* Active Model Selector */}
              <div>
                <label className="block text-xs font-mono font-bold text-cyan-300 mb-2 flex items-center gap-2">
                  <Cpu size={16} />
                  <span>{isAr ? 'اختيار النموذج الأساسي للمعالجة' : 'Primary AI Engine Model'}</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 bg-zinc-950/60 rounded-xl border border-zinc-800">
                  {MODEL_OPTIONS.map((m) => {
                    const isSelected = selectedModel === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => onModelChange(m.id)}
                        className={`flex items-center justify-between p-2.5 rounded-lg border text-right transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-950/60 border-cyan-400 text-white font-bold shadow-sm shadow-cyan-950'
                            : 'bg-zinc-900/40 border-zinc-800/60 text-zinc-300 hover:bg-zinc-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Zap size={14} className={isSelected ? 'text-cyan-400' : 'text-zinc-500'} />
                          <div className="truncate">
                            <div className="text-xs font-bold truncate">{m.name}</div>
                            <div className="text-[9px] font-mono text-zinc-400 truncate">{m.modelNumber}</div>
                          </div>
                        </div>
                        {m.badge && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-cyan-300 shrink-0">
                            {m.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Creativity / Temperature Slider */}
              <div className="border-t border-zinc-800/80 pt-5 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono font-bold text-zinc-200 flex items-center gap-2">
                    <Sliders size={15} className="text-cyan-400" />
                    <span>{isAr ? 'معامل الحرارة والابتكار (Temperature)' : 'Model Temperature / Creativity'}</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    {creativityTemp.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={creativityTemp}
                  onChange={(e) => onCreativityTempChange(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                  <span>{isAr ? '0.1 (دقيق ومنطقي حاسم)' : '0.1 (Strict Analytical)'}</span>
                  <span>{isAr ? '0.7 (متوازن للتحليل والنص)' : '0.7 (Balanced Response)'}</span>
                  <span>{isAr ? '1.0 (إبداعي ومبتكر)' : '1.0 (High Creativity)'}</span>
                </div>
              </div>

              {/* Kimi Moonshot API Gate */}
              <div className="border-t border-zinc-800/80 pt-5 space-y-3">
                <h3 className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-2">
                  <Key size={15} />
                  <span>{isAr ? 'إعدادات خادم Kimi / Moonshot Gateway' : 'Kimi / Moonshot Custom API'}</span>
                </h3>
                <div className="space-y-2.5 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800">
                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1 font-mono">API Key</label>
                    <input
                      type="password"
                      placeholder="sk-........................"
                      value={kimiApiKeyInput}
                      onChange={(e) => onKimiConfigChange('apiKey', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1 font-mono">Base URL</label>
                      <input
                        type="text"
                        placeholder="https://api.moonshot.cn/v1"
                        value={kimiBaseUrlInput}
                        onChange={(e) => onKimiConfigChange('baseUrl', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1 font-mono">Model ID</label>
                      <input
                        type="text"
                        placeholder="moonshot-v1-8k"
                        value={kimiModelInput}
                        onChange={(e) => onKimiConfigChange('model', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DATA & MEMORY */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              {/* Cloud Sync Section */}
              <div className="space-y-3">
                <label className="block text-xs font-mono font-bold text-emerald-300 flex items-center gap-2">
                  <Cloud size={16} />
                  <span>{isAr ? 'مصفوفة التزامن السحابي (Cloud Sync)' : 'Cloud Memory Matrix'}</span>
                </label>
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${syncStatus.isSynced ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                      <Database size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-zinc-200">
                        {userProfile ? userProfile.displayName || userProfile.email : (isAr ? 'غير متصل بالسحابة' : 'Disconnected')}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                        {syncStatus.isSynced 
                          ? (isAr ? 'تم التزامن الآمن مع حساب Google Cloud' : 'Synchronized securely') 
                          : (isAr ? 'البيانات محفوظة محلياً في ذاكرة المتصفح' : 'Data stored locally in browser')}
                      </div>
                    </div>
                  </div>

                  {userProfile ? (
                    <button
                      onClick={onSignOut}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/50 transition-all font-mono text-xs cursor-pointer"
                    >
                      <LogOut size={13} />
                      <span>{isAr ? 'قطع الاتصال' : 'Sign Out'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={onCloudConnect}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 transition-all font-mono text-xs cursor-pointer font-bold shadow-sm shadow-emerald-950"
                    >
                      <Cloud size={13} />
                      <span>{isAr ? 'ربط السحابة' : 'Connect'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Local Backup & Import */}
              <div className="border-t border-zinc-800/80 pt-5 space-y-3">
                <label className="block text-xs font-mono font-bold text-zinc-200 flex items-center gap-2">
                  <Download size={15} className="text-emerald-400" />
                  <span>{isAr ? 'النسخ الاحتياطي والتصدير المحترس' : 'Backup & Data Export'}</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={onExportLocal}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 text-zinc-200 hover:text-emerald-300 transition-all cursor-pointer font-mono font-bold"
                  >
                    <Download size={15} />
                    <span>{isAr ? 'تصدير نسخة احتياطية' : 'Backup File'}</span>
                  </button>

                  <button
                    onClick={onImportLocal}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 text-zinc-200 hover:text-emerald-300 transition-all cursor-pointer font-mono font-bold"
                  >
                    <Upload size={15} />
                    <span>{isAr ? 'استيراد نسخة سابق' : 'Restore Backup'}</span>
                  </button>
                </div>
              </div>

              {/* Memory Clear Danger Zone */}
              <div className="border-t border-zinc-800/80 pt-5 space-y-3">
                <label className="block text-xs font-mono font-bold text-red-400 flex items-center gap-2">
                  <Trash2 size={15} />
                  <span>{isAr ? 'منطقة الخطر - مسح الذاكرة المحلية' : 'Danger Zone - Wipe Memory'}</span>
                </label>
                <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-red-200">{isAr ? 'تطهير الذاكرة المحلية بالكامل' : 'Wipe All Local Storage'}</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">{isAr ? 'سيتم استئصال كافة الجلسات والسجلات المخزنة محلياً' : 'Permanently remove all local sessions and logs'}</div>
                  </div>
                  <button
                    onClick={onClearMemory}
                    className="px-3.5 py-2 rounded-lg bg-red-900/50 hover:bg-red-800 border border-red-500/50 text-white font-mono font-bold text-xs transition-all cursor-pointer shrink-0"
                  >
                    {isAr ? 'مسح الذاكرة' : 'Wipe Memory'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY & RULES */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-3 text-amber-400 font-mono font-bold">
                  <Shield size={18} />
                  <span>{isAr ? 'بروتوكولات الأمان الشاملة (NEXUS Protocol V-5000)' : 'NEXUS Sovereign Security Protocol'}</span>
                </div>
                <p className="text-zinc-300 leading-relaxed">
                  {isAr 
                    ? 'يعمل النظام بأعلى درجات التشفير المحلي والسحابي. يتم إخفاء وتأمين كافة المفاتيح البرمجية والبيانات الحساسة في طبقة الخادم المعزولة.'
                    : 'All API keys and communications are processed exclusively via isolated server proxy environments to prevent key leakage and ensure maximum operational integrity.'}
                </p>
              </div>

              <div className="space-y-2 font-mono text-zinc-400">
                <div className="flex justify-between p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800">
                  <span>{isAr ? 'حالة التشفير' : 'Encryption Standard'}:</span>
                  <span className="text-emerald-400 font-bold">AES-256 + RSA-4096</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800">
                  <span>{isAr ? 'الخادم الآمن' : 'Secure Ingress Port'}:</span>
                  <span className="text-cyan-400 font-bold">Cloud Run Sandbox (Port 3000)</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800">
                  <span>{isAr ? 'بروتوكول الهوية' : 'Identity Provider'}:</span>
                  <span className="text-purple-400 font-bold">Firebase Auth / OAuth 2.0</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800/80 bg-zinc-950/80 flex items-center justify-between font-mono text-xs">
          <div className="text-zinc-500 flex items-center gap-2">
            <Activity size={12} className="text-emerald-400" />
            <span>NEXUS V-5000 ACTIVE</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-400/60 text-white font-bold transition-all cursor-pointer shadow-md shadow-purple-950"
          >
            {isAr ? 'حفظ وإغلاق' : 'Save & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
