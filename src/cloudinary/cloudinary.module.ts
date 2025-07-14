import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'CLOUDINARY',
      useFactory: (configService: ConfigService) => {
        cloudinary.config({
          cloud_name: configService.get<string>('CLOUDINARY_NAME'),
          api_key: configService.get<string>('CLOUDINARY_API_KEY'),
          api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
          timeout: 120000,
        });

        return cloudinary;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['CLOUDINARY'],
})
export class CloudinaryModule {}