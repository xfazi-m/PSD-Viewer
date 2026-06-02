import { readPsd } from 'ag-psd';
import { PsdFile } from '../types';

export const parsePsd = async (file: File): Promise<PsdFile> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const psd = readPsd(arrayBuffer);

    let previewUrl = '';
    
    if (psd.canvas) {
      previewUrl = psd.canvas.toDataURL('image/png');
    } else {
      throw new Error('Brak podglądu w pliku PSD');
    }

    return {
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      previewUrl,
      width: psd.width,
      height: psd.height,
      channels: psd.channels,
      bitsPerChannel: psd.bitsPerChannel,
      timestamp: Date.now(),
    };
  } catch (err) {
    throw new Error('Nieprawidłowy plik PSD: ' + file.name);
  }
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
