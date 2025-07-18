import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from './cloudinary.service';
import { v2 as cloudinary } from 'cloudinary';

describe('CloudinaryService', () => {
  let service: CloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CloudinaryService,
        {
          provide: 'CLOUDINARY',
          useValue: cloudinary,
        },
      ],
    }).compile();

    service = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should upload image successfully', async () => {
    jest.spyOn(cloudinary.uploader, 'upload_stream').mockImplementation((...args: any[]) => {
      const callback = typeof args[0] === 'function' ? args[0] : args[1];
      return {
        end: (buffer: Buffer) => {
          if (callback) callback(null, { public_id: 'mock_id', secure_url: 'mock_url' });
        },
      } as any;
    });

    const mockFile = {
      buffer: Buffer.from('mock data'),
    } as Express.Multer.File;

    const result = await service.uploadImage(mockFile);
    expect(result).toHaveProperty('public_id', 'mock_id');
    expect(result).toHaveProperty('secure_url', 'mock_url');
  });

  it('should throw error if upload_stream returns error', async () => {
    jest.spyOn(cloudinary.uploader, 'upload_stream').mockImplementation((...args: any[]) => {
      const callback = typeof args[0] === 'function' ? args[0] : args[1];
      return {
        end: (buffer: Buffer) => {
          if (callback) callback(new Error('Upload error'), null);
        },
      } as any;
    });

    const mockFile = {
      buffer: Buffer.from('mock data'),
    } as Express.Multer.File;

    await expect(service.uploadImage(mockFile)).rejects.toThrow('Upload error');
  });

  it('should throw error if upload_stream returns no result', async () => {
    jest.spyOn(cloudinary.uploader, 'upload_stream').mockImplementation((...args: any[]) => {
      const callback = typeof args[0] === 'function' ? args[0] : args[1];
      return {
        end: (buffer: Buffer) => {
          if (callback) callback(null, null);
        },
      } as any;
    });

    const mockFile = {
      buffer: Buffer.from('mock data'),
    } as Express.Multer.File;

    await expect(service.uploadImage(mockFile)).rejects.toThrow('No result returned from Cloudinary');
  });
});
