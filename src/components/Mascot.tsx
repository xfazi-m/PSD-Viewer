import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, MessageSquare } from 'lucide-react';

const MESSAGES = [
  "Cześć! Przeciągnij pliki w prostokąt i zobacz jak się pojawiają!",
  "Czy wiesz, że PSD oznacza 'Photoshop Document'?",
  "Zapisuje całą historię Twoich plików lokalnie, nic nie trafia do chmury!",
  "Ten podgląd odczytuje kompozyt z Twojego pliku PSD.",
  "Aby zwolnić miejsce pamięci zajrzyj do sekcji Ustawienia.",
  "Działam płynnie na telefonie! Prześlij plik prosto z menedżera pamięci."
];

export function Mascot() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isVisible || isMinimized) return;
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % MESSAGES.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [isVisible, isMinimized]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-end gap-3 pointer-events-none origin-bottom-right scale-90 sm:scale-100">
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="flex flex-col sm:flex-row items-end sm:items-end gap-3 pointer-events-auto"
          >
            <motion.div
              className="relative bg-white/70 backdrop-blur-2xl border border-white/60 text-slate-800 rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-60 sm:w-72 sm:mb-14 mb-2"
            >
              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-2 text-slate-400 hover:text-slate-700 transition-colors p-2 z-10 rounded-full hover:bg-black/5"
                title="Zamknij asystenta"
              >
                <X size={14} />
              </button>
              
              <div className="flex gap-3 items-start pr-4">
                <Sparkles size={18} className="text-electric shrink-0 mt-0.5" />
                <div className="relative h-16 w-full overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={messageIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="text-[12px] sm:text-sm leading-relaxed font-medium absolute inset-0"
                    >
                      {MESSAGES[messageIndex]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              <div className="mt-2 flex justify-between items-center">
                 <button
                  onClick={() => setIsMinimized(true)}
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-700 transition-colors px-2 py-1 -ml-2 rounded-lg hover:bg-black/5"
                >
                  Zwiń
                </button>
                <div className="flex gap-1">
                  {MESSAGES.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${idx === messageIndex ? 'bg-electric w-3' : 'bg-slate-300'}`} 
                    />
                  ))}
                </div>
              </div>
            </motion.div>
            
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className="pointer-events-auto cursor-pointer relative flex-shrink-0 group" 
        onClick={() => setIsMinimized(!isMinimized)}
        title={isMinimized ? "Pokaż asystenta" : "Ukryj dymek"}
      >
        <motion.div
          animate={{ y: isMinimized ? 0 : [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className={`w-14 h-14 ${isMinimized ? 'w-12 h-12' : ''} bg-electric rounded-2xl shadow-lg shadow-blue-500/30 flex flex-col items-center justify-center relative z-10 transition-all duration-300 transform group-hover:scale-105 border border-white/30 backdrop-blur-xl`}>
            <div className="flex gap-1.5 mb-0.5">
              <motion.div
                animate={{ scaleY: [1, 0.2, 1, 1, 1] }}
                transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1, 0.95, 1], ease: "easeInOut" }}
                className="w-1.5 h-3 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              />
              <motion.div
                animate={{ scaleY: [1, 0.2, 1, 1, 1] }}
                transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1, 0.95, 1], ease: "easeInOut", delay: 0.1 }}
                className="w-1.5 h-3 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              />
            </div>
            <motion.div 
               animate={{ width: isMinimized ? 12 : [16, 24, 16] }}
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
               className="h-1 bg-white/50 rounded-full mt-1" 
            />
            
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/10 to-white/40 pointer-events-none" />
          </div>

          {isMinimized && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center pointer-events-none animate-pulse shadow-sm">
               <MessageSquare size={8} className="text-white fill-current" />
            </div>
          )}

          {!isMinimized && (
            <motion.div 
              animate={{ scaleX: [1, 0.8, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-slate-900/10 rounded-full blur-sm" 
            />
          )}
        </motion.div>
      </div>

    </div>
  );
}
