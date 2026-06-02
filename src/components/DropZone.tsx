import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, FileType, Loader2 } from 'lucide-react';

interface DropZoneProps {
  onFilesDropped: (files: FileList | File[]) => void;
  isLoading: boolean;
}

export function DropZone({ onFilesDropped, isLoading }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragActive) setIsDragActive(true);
  }, [isDragActive]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesDropped(e.dataTransfer.files);
    }
  }, [onFilesDropped]);

  return (
    <div className="w-full select-none">
      <motion.div
        animate={{
          scale: isDragActive ? 1.02 : 1,
          borderColor: isDragActive ? '#007AFF' : 'rgba(255,255,255,0.6)',
          backgroundColor: isDragActive ? 'rgba(240,247,255,0.7)' : 'rgba(255,255,255,0.4)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="relative w-full border-2 border-dashed rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden group mb-6 sm:mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all focus-within:ring-2 focus-within:ring-electric"
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".psd,image/vnd.adobe.photoshop,application/x-photoshop,*/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onFilesDropped(e.target.files);
              if (inputRef.current) inputRef.current.value = '';
            }
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          title="Kliknij aby wybrać pliki"
        />

        <div className="relative z-0 flex flex-col items-center pointer-events-none">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loading" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="text-electric mb-3 sm:mb-4">
                <Loader2 size={40} className="animate-spin" />
              </motion.div>
            ) : isDragActive ? (
              <motion.div key="active" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-electric mb-3 sm:mb-4">
                <FileType size={40} />
              </motion.div>
            ) : (
              <motion.div key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-slate-400 group-hover:text-electric transition-colors mb-3 sm:mb-4">
                <Upload size={40} />
              </motion.div>
            )}
          </AnimatePresence>

          <h2 className="text-base sm:text-lg font-medium text-slate-700 mb-1 sm:mb-2">
            {isLoading ? 'Przetwarzanie plików...' : 'Przeciągnij pliki PSD tutaj'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isLoading
              ? 'Trwa generowanie podglądów, proszę czekać...'
              : 'albo kliknij w to pole, aby wybrać pliki z urządzenia'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
