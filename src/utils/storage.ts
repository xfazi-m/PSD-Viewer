import localforage from 'localforage';
import { PsdFile } from '../types';

localforage.config({
  name: 'PSDViewerHistory',
  storeName: 'psd_files',
});

const SETTINGS_KEY = 'v1_settings';

export interface AppSettings {
  saveHistory: boolean;
}

const defaultSettings: AppSettings = {
  saveHistory: true,
};

export const getSettings = async (): Promise<AppSettings> => {
  try {
    const settings = await localforage.getItem<AppSettings>(SETTINGS_KEY);
    return settings || defaultSettings;
  } catch (error) {
    return defaultSettings;
  }
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await localforage.setItem(SETTINGS_KEY, settings);
  } catch (error) {
  }
};

export const saveFilesToHistory = async (files: PsdFile[]) => {
  try {
    const settings = await getSettings();
    if (!settings.saveHistory) return files; 

    const existing: PsdFile[] = (await localforage.getItem('files')) || [];
    const newFiles = [...files, ...existing];
    
    const uniqueFilesMap = new Map();
    newFiles.forEach(f => {
      if(!uniqueFilesMap.has(f.id)) {
        uniqueFilesMap.set(f.id, f);
      }
    });

    const uniqueFiles = Array.from(uniqueFilesMap.values());
    const limitedFiles = uniqueFiles.slice(0, 50);
    
    await localforage.setItem('files', limitedFiles);
    return limitedFiles;
  } catch (error) {
    return files;
  }
};

export const getHistoryFiles = async (): Promise<PsdFile[]> => {
  try {
    const files: PsdFile[] = (await localforage.getItem('files')) || [];
    return files;
  } catch (error) {
    return [];
  }
};

export const deleteFileFromHistory = async (id: string): Promise<PsdFile[]> => {
  try {
    const existing: PsdFile[] = (await localforage.getItem('files')) || [];
    const filtered = existing.filter(f => f.id !== id);
    await localforage.setItem('files', filtered);
    return filtered;
  } catch (error) {
    return [];
  }
};

export const clearHistory = async (): Promise<void> => {
  try {
    await localforage.setItem('files', []);
  } catch (error) {
  }
};
