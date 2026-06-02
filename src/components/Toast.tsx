import { motion, AnimatePresence } from 'motion/react';

interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl text-sm font-medium flex items-center gap-3 whitespace-nowrap"
        >
          <span className="w-2 h-2 rounded-full bg-electric animate-pulse shrink-0" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
