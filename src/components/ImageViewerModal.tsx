import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface ImageViewerModalProps {
  isOpen: boolean;
  imageUrl: string;
  imageName: string;
  onClose: () => void;
}

export function ImageViewerModal({ isOpen, imageUrl, imageName, onClose }: ImageViewerModalProps) {
  const [scale, setScale] = useState(1);

  if (!isOpen) return null;

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md"
          onClick={onClose}
        >
          {/* Controls Bar */}
          <div className="absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-800/90 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-2xl z-50 pointer-events-auto">
            <button
              onClick={handleZoomOut}
              className="p-2.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-95"
              title="Pomniejsz"
            >
              <ZoomOut size={20} />
            </button>
            <div className="w-16 text-center text-sm font-medium text-slate-300 bg-slate-900/50 rounded-full py-1">
              {Math.round(scale * 100)}%
            </div>
            <button
              onClick={handleZoomIn}
              className="p-2.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-95"
              title="Powiększ"
            >
              <ZoomIn size={20} />
            </button>
            <div className="w-px h-6 bg-white/10 mx-1 border-none" />
            <button
              onClick={handleReset}
              className="p-2.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-95"
              title="Oryginalny rozmiar"
            >
              <Maximize size={20} />
            </button>
            <div className="w-px h-6 bg-white/10 mx-1 border-none" />
            <button
              onClick={onClose}
              className="p-2.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-full transition-colors active:scale-95"
              title="Zamknij"
            >
              <X size={20} />
            </button>
          </div>

          {/* Image Container */}
          <div 
            className="relative w-full h-full flex items-center justify-center overflow-auto pointer-events-auto p-4 sm:p-20"
            onClick={(e) => e.stopPropagation()} // Prevent bubbling to background onClose
          >
            <motion.div
              animate={{ scale }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex items-center justify-center"
            >
              <img
                src={imageUrl}
                alt={imageName}
                className="max-w-full max-h-[85vh] sm:max-h-full object-contain drop-shadow-2xl rounded-sm"
                draggable={false}
              />
            </motion.div>
          </div>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-800/80 backdrop-blur-md rounded-full border border-white/10 text-slate-300 text-xs font-medium max-w-[90vw] truncate pointer-events-none">
            {imageName}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
