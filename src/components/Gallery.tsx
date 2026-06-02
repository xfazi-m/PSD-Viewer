import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PsdFile } from '../types';
import { formatBytes } from '../utils/psd';
import { Trash2, Download, ChevronDown, Maximize2 } from 'lucide-react';
import { ImageViewerModal } from './ImageViewerModal';

interface GalleryProps {
  files: PsdFile[];
  onDelete?: (id: string) => void;
}

const handleDownload = (file: PsdFile, scale: number) => {
  if (scale === 1) {
    const link = document.createElement('a');
    link.href = file.previewUrl;
    link.download = `${file.name.replace(/\.psd$/i, '')}_oryginalna.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.floor(img.width * scale));
    canvas.height = Math.max(1, Math.floor(img.height * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${file.name.replace(/\.psd$/i, '')}_srednia.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  img.src = file.previewUrl;
};

export function Gallery({ files, onDelete }: GalleryProps) {
  const [selectedFile, setSelectedFile] = useState<PsdFile | null>(null);

  if (files.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 flex-1 content-start w-full pb-32">
        <AnimatePresence>
          {files.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative flex flex-col bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <div 
                className="aspect-video bg-white/50 rounded-2xl overflow-hidden mb-3 relative flex items-center justify-center cursor-pointer group/img"
                onClick={() => setSelectedFile(file)}
              >
                <img
                  src={file.previewUrl}
                  alt={file.name}
                  className="max-w-full max-h-full object-contain filter drop-shadow-md z-10 p-2 transition-transform duration-500 group-hover/img:scale-105"
                />
                
                {/* Fullscreen Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 z-20 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center text-slate-800 opacity-0 group-hover/img:opacity-100 transform scale-75 group-hover/img:scale-100 transition-all duration-300">
                    <Maximize2 size={20} />
                  </div>
                </div>
              </div>
            
            <div className="flex justify-between items-start px-2 mb-3">
              <div className="overflow-hidden">
                <h3 className="text-sm font-semibold truncate w-full pr-2 text-slate-800" title={file.name}>
                  {file.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {file.width} x {file.height} {file.timestamp ? `• ${new Date(file.timestamp).toLocaleDateString()}` : ''}
                </p>
              </div>
              <span className="text-[10px] font-mono bg-white/60 backdrop-blur-md px-2 py-1 rounded-md text-slate-600 border border-white/50 shrink-0 shadow-sm mt-1">
                {formatBytes(file.size)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-2 pt-3 border-t border-white/50">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider w-full sm:w-auto">Pobierz PNG:</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDownload(file, 1); }} 
                  className="px-2.5 py-1.5 bg-electric text-white hover:bg-black rounded-lg text-[11px] font-medium shadow-sm transition-colors active:scale-95"
                  title="Pobierz w oryginalnej jakości"
                >
                  Oryginalna
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDownload(file, 0.5); }} 
                  className="px-2.5 py-1.5 bg-white text-slate-700 hover:text-black hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-medium shadow-sm transition-colors active:scale-95"
                  title="Pobierz połowę wielkości"
                >
                  Średnia
                </button>
              </div>
              
              {onDelete && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(file.id); }}
                  className="p-2 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-200 rounded-lg shadow-sm transition-colors active:scale-95 shrink-0"
                  title="Usuń z historii"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>

    {selectedFile && (
      <ImageViewerModal
        isOpen={!!selectedFile}
        imageUrl={selectedFile.previewUrl}
        imageName={selectedFile.name}
        onClose={() => setSelectedFile(null)}
      />
    )}
  </>
  );
}


