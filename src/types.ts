export interface PsdFile {
  id: string;
  name: string;
  size: number;
  previewUrl: string;
  width: number;
  height: number;
  channels: number;
  bitsPerChannel: number;
  timestamp?: number;
}
