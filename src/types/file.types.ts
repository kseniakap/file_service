import { Readable } from 'stream';

export interface FileInterface {
  sendFile(fileType: string, nameFile: string, file?: Buffer): Promise<void>;
  getStreamFile(filePath: string, fileType: string): Promise<Readable>;
  deleteFile(filePath: string, fileType: string): Promise<void>;
}
