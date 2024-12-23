import { FileInterface } from '@/types/file.types';
import * as Minio from 'minio';

export default class MinioClient implements FileInterface {
  private readonly minioClient: Minio.Client;
  private readonly minioTags = {};
  private readonly S3_NAMESPACE = process.env.S3_NAMESPACE || 'local';
  private readonly keyTags = process.env.KEY_TAGS?.split(',') || [];

  constructor() {
    const accessKey = process.env.S3_ACCESS_KEY;
    const secretKey = process.env.S3_SECRET_KEY;
    const domain = process.env.S3_DOMAIN;
    const port = process.env.S3_PORT;
    const tags = process.env.S3_TAGS;

    if (!accessKey || !domain || !port || !secretKey || !tags) {
      throw new Error('Проверьте данные конфигурации для клиента S3');
    }

    const minioConfig = {
      endPoint: domain,
      accessKey: accessKey,
      secretKey: secretKey,
      port: +port,
      //@FIXME когда будут готовы сертификаты для стендов поменять на true
      useSSL: false,
    };

    this.minioClient = new Minio.Client(minioConfig);

    const valueTags = tags.split(',');

    this.minioTags = this.keyTags.reduce(
      (resultObjectWithTags: { [key: string]: string }, key, index) => {
        resultObjectWithTags[key] = valueTags[index];
        return resultObjectWithTags;
      },
      {},
    );
  }

  getBucketName(fileType: string) {
    return fileType.replace(/([A-Z])/g, '-$1').toLowerCase();
  }

  getPrefixNameBucket(bucketName: string) {
    return `resource-${this.S3_NAMESPACE}-${bucketName}`;
  }
  getBucketAndObjectNames(filePath: string, fileType: string) {
    const bucketName = this.getPrefixNameBucket(this.getBucketName(fileType));
    const objectName = filePath;

    return { bucketName, objectName };
  }

  async createBucketIfNotExists(bucketName: string) {
    const isBucketExists = await this.minioClient.bucketExists(bucketName);

    if (!isBucketExists) {
      await this.makeBucket(bucketName);
    }
  }

  async makeBucket(bucketName: string) {
    await this.minioClient.makeBucket(bucketName);
    await this.minioClient.setBucketTagging(bucketName, this.minioTags);
  }

  async sendFile(fileType: string, nameFile: string, fileBuffer: Buffer) {
    const customBucketName = this.getPrefixNameBucket(
      this.getBucketName(fileType),
    );

    await this.createBucketIfNotExists(customBucketName);

    this.minioClient.putObject(customBucketName, nameFile, fileBuffer);
  }

  async getStreamFile(pathFile: string, fileType: string) {
    const { bucketName, objectName } = this.getBucketAndObjectNames(
      pathFile,
      fileType,
    );
    return this.minioClient.getObject(bucketName, objectName);
  }

  async getBinaryFile(pathFile: string, fileType: string) {
    const { bucketName, objectName } = this.getBucketAndObjectNames(
      pathFile,
      fileType,
    );
    const dataStream = await this.minioClient.getObject(bucketName, objectName);

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];

      dataStream.on('data', (chunk) => {
        chunks.push(chunk);
      });

      dataStream.on('end', () => {
        const binaryData = Buffer.concat(chunks);
        resolve(binaryData);
      });

      dataStream.on('error', (err) => {
        reject(err);
      });
    });
  }

  async deleteFile(filePath: string, fileType: string) {
    const { bucketName, objectName } = this.getBucketAndObjectNames(
      filePath,
      fileType,
    );
    await this.minioClient.removeObject(bucketName, objectName);
  }
}
