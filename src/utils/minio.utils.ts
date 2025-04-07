import { v4 as uuidv4 } from 'uuid';
import { Client } from 'minio';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export const getObjectMetaData = (base64Data: string) => {
  const mimeType = base64Data.split(',')[0].split(':')[1].split(';')[0];
  const extension = mimeType.split('/')[1];
  const fileName = `${uuidv4()}.${extension}`;
  return { mimeType, extension, fileName };
};

export const putObjectFromBase64 = async (
  minioClient: Client,
  base64Data: string,
  bucketName: 'projects' | 'pictures' | 'videos',
) => {
  const metadata = getObjectMetaData(base64Data);

  if (bucketName === 'projects') {
    const allowedImageTypes = ['application/pdf'];
    if (!allowedImageTypes.includes(metadata.mimeType)) {
      throw new BadRequestException('File must be PDF');
    }
  } else if (bucketName === 'pictures') {
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedImageTypes.includes(metadata.mimeType)) {
      throw new BadRequestException(
        'File must be a valid image (JPEG, JPG, or PNG)',
      );
    }
  } else if (bucketName === 'videos') {
    const allowedVideoTypes = ['video/mp4', 'video/mov'];
    if (!allowedVideoTypes.includes(metadata.mimeType)) {
      throw new BadRequestException('File must be a valid video (MP4 or MOV)');
    }
  }

  try {
    const fileBuffer = Buffer.from(base64Data.split(',')[1], 'base64');
    await minioClient.putObject(
      bucketName,
      metadata.fileName,
      fileBuffer,
      fileBuffer.length,
      {
        'Content-Type': metadata.mimeType,
      },
    );
    console.log('file uploaded successfully');
    return metadata.fileName;
  } catch (error) {
    console.log(error);
    throw new InternalServerErrorException('Failed while upload file');
  }
};
