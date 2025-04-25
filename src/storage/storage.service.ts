import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class StorageService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  constructor() {
    const region = process.env.YC_BUCKET_REGION || 'ru-central1';
    const endpoint =
      process.env.S3_ENDPOINT || 'https://storage.yandexcloud.net';
    const accessKey = process.env.YC_ACCESS_KEY_ID;
    const secretKey = process.env.YC_SECRET_ACCESS_KEY;
    const bucket = process.env.YC_BUCKET_NAME;

    if (!accessKey || !secretKey || !bucket) {
      throw new Error(
        'S3 credentials or bucket are missing in environment variables',
      );
    }

    this.s3 = new S3Client({
      region,
      endpoint,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
    });

    this.bucket = bucket;
  }

  async uploadFile(
    file: Express.Multer.File,
    fileName?: string,
  ): Promise<string> {
    const key = fileName || file.originalname;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await this.s3.send(command);
      return key;
    } catch (err) {
      console.error('Ошибка загрузки в S3:', err);
      throw new InternalServerErrorException('Не удалось загрузить файл');
    }
  }
}
