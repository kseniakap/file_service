import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { FileModel } from '@/entities/file.entity';

export default class FilePersistenceService {
  constructor(
    @InjectRepository(FileModel)
    private readonly fileRepository: Repository<FileModel>,
  ) {}

  async findAll() {
    const files = await this.fileRepository.find();
    return files;
  }

  async find(id: number) {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) throw new Error('Файл не найден');
    return file;
  }

  async findByIds(ids: number[]) {
    try {
      const files = await this.fileRepository.findBy({ id: In(ids) });
      return files;
    } catch (error) {
      throw error;
    }
  }

  async create(
    filePath: string,
    originalname: string,
    size: number,
    fileType: string,
  ) {
    try {
      const file = this.fileRepository.create({
        path: filePath,
        name: originalname,
        size: size,
        type: fileType,
      });
      return this.fileRepository.save(file);
    } catch (error) {
      throw error;
    }
  }

  async destroy(file: FileModel) {
    this.fileRepository.restore(file.id);
  }
}
