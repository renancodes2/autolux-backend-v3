import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: '$2b$10$hashedpassword',
    role: Role.USER,
    createdAt: new Date(),
    city: null,
    state: null,
    phone: null,
    profilePic: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token123'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should throw UnauthorizedException if email or password are missing', async () => {
      await expect(service.validateUser('', 'password')).rejects.toThrow(UnauthorizedException);
      await expect(service.validateUser('email@example.com', '')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      await expect(service.validateUser('email@example.com', 'password')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockImplementation(async () => false);
      await expect(service.validateUser('test@example.com', 'wrongpassword')).rejects.toThrow(UnauthorizedException);
    });

    it('should return user without password if credentials are valid', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockImplementation(async () => true);
      const result = await service.validateUser('test@example.com', 'correctpassword');
      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        createdAt: mockUser.createdAt,
        city: mockUser.city,
        state: mockUser.state,
        phone: mockUser.phone,
        profilePic: mockUser.profilePic,
      });
    });
  });

  describe('login', () => {
    it('should return token and user on login', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        createdAt: mockUser.createdAt,
        city: mockUser.city,
        state: mockUser.state,
        phone: mockUser.phone,
        profilePic: mockUser.profilePic,
      });

      const result = await service.login('test@example.com', 'correctpassword');

      expect(result).toEqual({
        token: 'token123',
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
          createdAt: mockUser.createdAt,
          city: mockUser.city,
          state: mockUser.state,
          phone: mockUser.phone,
          profilePic: mockUser.profilePic,
        },
      });

      expect(jwtService.sign).toHaveBeenCalledWith({ sub: mockUser.id, role: mockUser.role });
    });
  });
});
