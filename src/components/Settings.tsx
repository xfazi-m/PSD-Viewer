import { useState, useEffect } from 'react';
import { getSettings, saveSettings, AppSettings } from '../utils/storage';
import { motion } from 'motion/react';
import { Save } from 'lucide-react';

export function Settings({ onSave }: { onSave: () => void }) {
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  if (!settings) return null;

  const toggleSaveHistory = async () => {
    const newSettings = { ...settings, saveHistory: !settings.saveHistory };
    setSettings(newSettings);
    await saveSettings(newSettings);
    onSave();
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-sm">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Save className="text-electric" size={24} /> Ustawienia Systemu
      </h2>
      
      <div className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50">
        <div>
          <h3 className="font-medium text-slate-800">Zapisuj historię plików</h3>
          <p className="text-sm text-slate-500 mt-1">Pliki PSD będą automatycznie zapisywane w pamięci przeglądarki</p>
        </div>
        
        <button
          onClick={toggleSaveHistory}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-electric focus:ring-offset-2 ${
            settings.saveHistory ? 'bg-electric' : 'bg-slate-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.saveHistory ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
