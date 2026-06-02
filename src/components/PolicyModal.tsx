import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, HardDrive } from 'lucide-react';

interface PolicyModalProps {
  type: 'privacy' | 'files' | null;
  onClose: () => void;
}

export function PolicyModal({ type, onClose }: PolicyModalProps) {
  if (!type) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full max-w-lg bg-white/80 backdrop-blur-2xl border border-white/60 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute top-0 right-0 p-4">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-electric"
            >
              <X size={20} />
            </button>
          </div>

          {type === 'privacy' && (
            <div>
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="text-electric w-6 h-6" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4 tracking-tight">Polityka Prywatności</h2>
              <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                <p>
                  Twoja prywatność jest dla nas najwyższym priorytetem. <strong>PSD-Viewer nie przetwarza danych w chmurze ani na żadnych zewnętrznych serwerach.</strong>
                </p>
                <p>
                  Całe środowisko zostało zaprojektowane w architekturze "offline-first". Oznacza to, że wszelkie operacje, konwersje i odczyty pikseli odbywają się wyłącznie w pamięci Twojej przeglądarki na Twoim własnym urządzeniu.
                </p>
                <p>
                  Nie śledzimy Twoich plików, nie używamy analityki behawioralnej ani nie wysyłamy logów do zewnętrznych systemów. Jesteśmy w 100% zorientowani na bezpieczeństwo Twoich projektów.
                </p>
              </div>
            </div>
          )}

          {type === 'files' && (
            <div>
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                <HardDrive className="text-indigo-500 w-6 h-6" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4 tracking-tight">Polityka Plików</h2>
              <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                <p>
                  Bezpieczeństwo własności intelektualnej to podstawa. <strong>Wszystkie pliki PSD, które otwierasz, nigdy nie opuszczają Twojego urządzenia.</strong>
                </p>
                <p>
                  Jeżeli masz włączoną "Historię plików" w ustawieniach, miniatury i dane o plikach są zapisywane w specjalnym ograniczonym kontenerze bazy lokalnej (IndexedDB), do którego ma dostęp jedynie Twoja obecna przeglądarka.
                </p>
                <p>
                  Brak zewnętrznych serwerów oznacza brak ryzyka przecieków. Ty w pełni kontrolujesz swoje pliki i w dowolnym momencie możesz całkowicie wyczyścić lokalny magazyn korzystając z odpowiedniej opcji na stronie głównej lub w Historii.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-slate-200/50 flex justify-end">
             <button
                onClick={onClose}
                className="px-6 py-2.5 bg-electric text-white font-medium rounded-xl hover:bg-blue-600 transition-colors shadow-sm active:scale-95"
              >
                Rozumiem
              </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
