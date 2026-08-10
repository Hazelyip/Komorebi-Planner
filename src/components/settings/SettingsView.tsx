import React, { useState } from 'react';
import { Download, Upload, Database, AlertTriangle, Globe } from 'lucide-react';
import { dataManagementService } from '../../services/dataManagementService';
import type { BackupData } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { Language } from '../../i18n/translations';

export const SettingsView: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();

  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const [pendingImportData, setPendingImportData] = useState<BackupData | null>(null);
  const [showConfirmImportModal, setShowConfirmImportModal] = useState(false);
  const [showConfirmClearModal, setShowConfirmClearModal] = useState(false);

  // Export JSON
  const handleExport = async () => {
    try {
      const jsonStr = await dataManagementService.exportBackup();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const todayStr = new Date().toISOString().split('T')[0];

      const a = document.createElement('a');
      a.href = url;
      a.download = `komorebi-journal-backup-${todayStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setImportStatus({ type: 'error', message: `Export failed: ${err.message}` });
    }
  };

  // Import JSON File Selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const validation = dataManagementService.validateBackup(content);

      if (!validation.valid || !validation.data) {
        setImportStatus({
          type: 'error',
          message: validation.error || 'Invalid backup file structure.',
        });
        return;
      }

      setPendingImportData(validation.data);
      setShowConfirmImportModal(true);
    };
    reader.readAsText(file);
    e.target.value = ''; // reset input
  };

  const handleConfirmImport = async (overwrite: boolean) => {
    if (!pendingImportData) return;

    const result = await dataManagementService.importBackup(pendingImportData, overwrite);
    setShowConfirmImportModal(false);
    setPendingImportData(null);

    if (result.success) {
      setImportStatus({ type: 'success', message: result.message });
      setTimeout(() => window.location.reload(), 1200);
    } else {
      setImportStatus({ type: 'error', message: result.message });
    }
  };

  const handleConfirmClear = async () => {
    await dataManagementService.clearAllData();
    setShowConfirmClearModal(false);
    setImportStatus({ type: 'success', message: 'All local data cleared.' });
    setTimeout(() => window.location.reload(), 1200);
  };

  const languageOptions: { code: Language; name: string; nativeName: string; flag: string }[] = [
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  ];

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6 select-none">
      {/* Header */}
      <div className="p-5 bg-white rounded-xl border border-[#e0dad2] shadow-2xs">
        <h2 className="font-serif text-xl font-light text-[#5a5a40]">{t.settings.title}</h2>
        <p className="text-xs text-[#a09a90] mt-0.5">
          {t.settings.subtitle}
        </p>
      </div>

      {importStatus.type && (
        <div
          className={`p-4 rounded-xl border text-xs font-medium ${
            importStatus.type === 'success'
              ? 'bg-[#f0ede6] border-[#e0dad2] text-[#5a5a40]'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {importStatus.message}
        </div>
      )}

      {/* Language Selection Card */}
      <div className="p-5 bg-white rounded-xl border border-[#e0dad2] shadow-2xs space-y-4">
        <h3 className="font-serif text-base font-medium text-[#3a3a3a] flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#5a5a40]" />
          <span>{t.settings.languageSection}</span>
        </h3>

        <p className="text-xs text-[#8a847a] leading-relaxed font-serif">
          {t.settings.languageDesc}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {languageOptions.map((opt) => {
            const isSelected = language === opt.code;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => setLanguage(opt.code)}
                className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#f0ede6] border-[#5a5a40] text-[#5a5a40] shadow-2xs font-semibold'
                    : 'bg-[#f8f6f2] border-[#e0dad2] text-[#8a847a] hover:bg-[#f0ede6]/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{opt.flag}</span>
                  <div className="text-left">
                    <p className="font-medium text-[#3a3a3a]">{opt.nativeName}</p>
                    <p className="text-[10px] text-[#a09a90]">{opt.name}</p>
                  </div>
                </div>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-[#5a5a40]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Backup & Import Section */}
      <div className="p-5 bg-white rounded-xl border border-[#e0dad2] shadow-2xs space-y-4">
        <h3 className="font-serif text-base font-medium text-[#3a3a3a] flex items-center gap-2">
          <Database className="w-4 h-4 text-[#5a5a40]" />
          <span>{t.settings.backupSection}</span>
        </h3>

        <p className="text-xs text-[#8a847a] leading-relaxed font-serif">
          {t.settings.backupDesc}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Export Button */}
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center justify-center gap-2 p-3 bg-[#f8f6f2] hover:bg-[#f0ede6] border border-[#e0dad2] rounded-full text-xs font-medium text-[#3a3a3a] transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#5a5a40]" />
            <span>{t.settings.exportBtn}</span>
          </button>

          {/* Import Button */}
          <label className="flex items-center justify-center gap-2 p-3 bg-[#f8f6f2] hover:bg-[#f0ede6] border border-[#e0dad2] rounded-full text-xs font-medium text-[#3a3a3a] transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-[#5a5a40]" />
            <span>{t.settings.importBtn}</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-5 bg-white rounded-xl border border-red-200/50 shadow-2xs space-y-4">
        <h3 className="font-serif text-base font-medium text-red-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span>{t.settings.resetSection}</span>
        </h3>

        <p className="text-xs text-[#8a847a] leading-relaxed font-serif">
          {t.settings.resetDesc}
        </p>

        <button
          type="button"
          onClick={() => setShowConfirmClearModal(true)}
          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-full text-xs font-medium transition-colors cursor-pointer"
        >
          {t.settings.clearBtn}
        </button>
      </div>

      {/* Confirm Import Modal */}
      {showConfirmImportModal && pendingImportData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-[#e0dad2] p-6 space-y-4">
            <h3 className="font-serif text-lg font-medium text-[#5a5a40]">{t.settings.confirmImportTitle}</h3>
            <p className="text-xs text-[#8a847a] leading-relaxed font-serif">
              {t.settings.confirmImportDesc(
                pendingImportData.todos?.length || 0,
                pendingImportData.journalEntries?.length || 0
              )}
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleConfirmImport(false)}
                className="w-full py-2.5 px-3 bg-[#5a5a40] text-white text-xs font-semibold rounded-full hover:bg-[#4a4a34] transition-colors cursor-pointer"
              >
                {t.settings.mergeBtn}
              </button>
              <button
                type="button"
                onClick={() => handleConfirmImport(true)}
                className="w-full py-2.5 px-3 bg-red-600 text-white text-xs font-semibold rounded-full hover:bg-red-700 transition-colors cursor-pointer"
              >
                {t.settings.overwriteBtn}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmImportModal(false)}
                className="w-full py-2.5 px-3 bg-[#f0ede6] text-[#8a847a] text-xs font-medium rounded-full hover:bg-[#e0dad2] transition-colors cursor-pointer"
              >
                {t.settings.cancelBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Clear Modal */}
      {showConfirmClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-[#e0dad2] p-6 space-y-4">
            <h3 className="font-serif text-lg font-medium text-red-800">{t.settings.confirmClearTitle}</h3>
            <p className="text-xs text-[#8a847a] leading-relaxed font-serif">
              {t.settings.confirmClearDesc}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmClearModal(false)}
                className="px-4 py-2 text-xs font-medium text-[#8a847a] bg-[#f0ede6] rounded-full hover:bg-[#e0dad2] transition-colors cursor-pointer"
              >
                {t.settings.cancelBtn}
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-full shadow-xs cursor-pointer transition-colors"
              >
                {t.settings.yesDeleteAll}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

