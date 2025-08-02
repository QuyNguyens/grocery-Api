// services/cloudinary.service.ts
import { Readable } from 'stream';
import cloudinary from '../../config/cloudinary';

const bufferToStream = (buffer: Buffer) => {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
};

const extractPublicId = (url: string): string | null => {
  const matches = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)\./);
  return matches ? matches[1] : null;
};

export const uploadImage = async (
  buffer: Buffer,
  folder: string,
  oldImageUrl?: string,
): Promise<string> => {

  if (oldImageUrl) {
    const publicId = extractPublicId(oldImageUrl);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (err || !result) return reject(err || new Error('Upload failed'));
        resolve(result.secure_url);
      },
    );

    bufferToStream(buffer).pipe(stream);
  });
};
