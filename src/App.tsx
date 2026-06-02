import React, { useState, useEffect } from 'react';
import { DropZone } from './components/DropZone';
import { Gallery } from './components/Gallery';
import { Mascot } from './components/Mascot';
import { Toast } from './components/Toast';
import { Settings } from './components/Settings';
import { PolicyModal } from './components/PolicyModal';
import { PsdFile } from './types';
import { parsePsd } from './utils/psd';
import { saveFilesToHistory, getHistoryFiles, deleteFileFromHistory, clearHistory } from './utils/storage';
import { Layers } from 'lucide-react';

type View = 'home' | 'history' | 'settings';
type ModalType = 'privacy' | 'files' | null;

export default function App() {
  const [currentFiles, setCurrentFiles] = useState<PsdFile[]>([]);
  const [historyFiles, setHistoryFiles] = useState<PsdFile[]>([]);
  const [currentView, setCurrentView] = useState<View>('home');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, [currentView]);

  const loadHistory = async () => {
    const history = await getHistoryFiles();
    setHistoryFiles(history);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const processFiles = async (fileList: FileList | File[] | null) => {
    if (!fileList || fileList.length === 0) return;

    setIsLoading(true);
    const psdFiles = Array.from(fileList).filter(file => {
      const name = file.name.toLowerCase();
      return name.endsWith('.psd') || name.includes('.psd') || file.type.includes('photoshop');
    });

    if (psdFiles.length === 0) {
      showToast('⚠️ Proszę wybrać pliki w formacie .psd');
      setIsLoading(false);
      return;
    }

    try {
      const parsedFiles = await Promise.all(psdFiles.map(file => parsePsd(file)));
      await saveFilesToHistory(parsedFiles);
      setCurrentFiles((prev) => [...parsedFiles, ...prev]);
      setCurrentView('home');
      showToast(`✅ Pomyślnie wczytano pliki (${parsedFiles.length})`);
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd';
      showToast(`❌ Błąd: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFromHistory = async (id: string) => {
    const updated = await deleteFileFromHistory(id);
    setHistoryFiles(updated);
    setCurrentFiles(prev => prev.filter(f => f.id !== id));
    showToast('Usuni\u0119to plik z historii');
  };

  const handleClearHistory = async () => {
    await clearHistory();
    setHistoryFiles([]);
    setCurrentFiles([]);
    showToast('Historia wyczyszczona');
  };

  const handleHeaderFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 relative overflow-hidden bg-transparent">
      <Toast message={toastMessage} />

      <header className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-10 py-5 sm:py-6 border-b border-white/20 bg-white/40 backdrop-blur-xl z-20 gap-5 sm:gap-0 shrink-0">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('home')}>
          <div className="w-8 h-8 bg-electric rounded-lg flex items-center justify-center shrink-0 shadow-sm">
            <Layers className="text-white w-4 h-4" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-slate-800">PSD-Viewer</span>
        </div>
        <nav className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm font-medium">
          <button 
            onClick={() => setCurrentView('home')} 
            className={`transition-colors ${currentView === 'home' ? 'text-electric font-semibold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Strona Główna
          </button>
          <button 
            onClick={() => setCurrentView('history')} 
            className={`transition-colors flex gap-2 items-center ${currentView === 'history' ? 'text-electric font-semibold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Historia {historyFiles.length > 0 && <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">{historyFiles.length}</span>}
          </button>
          <button 
            onClick={() => setCurrentView('settings')} 
            className={`transition-colors ${currentView === 'settings' ? 'text-electric font-semibold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Ustawienia
          </button>
        </nav>
        <label className="cursor-pointer w-full sm:w-auto px-6 py-3 sm:py-2 bg-electric text-white rounded-full text-sm font-medium hover:bg-electric-hover transition-colors shadow-sm active:scale-95 shrink-0 select-none text-center inline-flex items-center justify-center">
          <span>Wgraj nowy plik</span>
          <input
            type="file"
            className="sr-only"
            multiple
            accept=".psd,image/vnd.adobe.photoshop,application/x-photoshop,*/*"
            onChange={handleHeaderFileChange}
          />
        </label>
      </header>

      <main className="flex-1 flex flex-col p-4 sm:p-10 overflow-auto z-10 relative">
        {currentView === 'home' && (
          <>
            <DropZone 
              onFilesDropped={processFiles} 
              isLoading={isLoading} 
            />
            {currentFiles.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-slate-700 mb-6 border-b border-slate-200/50 pb-2">Ostatnio wczytane</h3>
                <Gallery files={currentFiles} onDelete={handleDeleteFromHistory} />
              </div>
            )}
          </>
        )}

        {currentView === 'history' && (
          <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8 border-b border-slate-200/50 pb-4">
              <h2 className="text-2xl font-semibold text-slate-800">Historia przeglądanych plików</h2>
              {historyFiles.length > 0 && (
                <button 
                  onClick={handleClearHistory} 
                  className="px-4 py-2 text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
                >
                  Wyczyść Historię
                </button>
              )}
            </div>
            
            {historyFiles.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <p>Brak zapisanych plików w historii</p>
              </div>
            ) : (
              <Gallery files={historyFiles} onDelete={handleDeleteFromHistory} />
            )}
          </div>
        )}

        {currentView === 'settings' && (
          <Settings onSave={() => showToast('Zapisano ustawienia')} />
        )}
      </main>

      <footer className="px-4 sm:px-10 py-5 sm:py-4 text-[10px] sm:text-xs text-slate-500 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-center border-t border-white/20 bg-white/30 backdrop-blur-md shrink-0 z-20">
        <div>wykonane przez xfazi.pl</div>
        <div className="flex gap-4 sm:gap-6">
          <button onClick={() => setActiveModal('privacy')} className="hover:text-slate-800 transition-colors">Prywatność</button>
          <button onClick={() => setActiveModal('files')} className="hover:text-slate-800 transition-colors">Polityka Plików</button>
        </div>
      </footer>

      <Mascot />
      <PolicyModal type={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
}
