import { FileInterface } from '@/types/file.types';
import * as fs from 'fs';
import * as path from 'path';

import { Readable } from 'stream';

export default class LocalService implements FileInterface {
  private readonly uploadPath: string;

  constructor() {
    this.uploadPath =
      process.env.PATH_UPLOADS || path.join(__dirname, 'src', 'files');
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async sendFile(
    fileType: string,
    fileName: string,
    buffer: Buffer,
  ): Promise<void> {
    const directoryPath = path.join(this.uploadPath, fileType);
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
    const filePath = path.join(directoryPath, fileName);
    fs.writeFileSync(filePath, buffer);
  }

  async getStreamFile(filePath: string, fileType: string): Promise<Readable> {
    const localFilePath = path.join(this.uploadPath, fileType, filePath);

    return fs.createReadStream(localFilePath);
  }

  async deleteFile(fileName: string, fileType: string): Promise<void> {
    const filePath = path.join(this.uploadPath, fileType, fileName);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }
}
