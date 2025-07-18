import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    role: Role.USER,
    createdAt: new Date(),
    city: null,
    state: null,
    phone: null,
    profilePic: null,
  };

  const mockUserWithoutPassword = (({ password, ...rest }) => rest)(mockUser);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should hash password and create user without returning password', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');
      (prisma.user.create as jest.Mock).mockResolvedValue({
        ...mockUser,
        password: 'hashedPassword123',
      });

      const createUserDto = { name: 'Test User', email: 'test@example.com', password: 'plainpassword' };
      const result = await service.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('plainpassword', 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          password: 'hashedPassword123',
        },
      });

      expect(result).not.toHaveProperty('password');
      expect(result).toMatchObject(mockUserWithoutPassword);
    });
  });

  describe('findAll', () => {
    it('should return all users without passwords', async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([mockUser]);

      const result = await service.findAll();

      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(result[0]).not.toHaveProperty('password');
      expect(result[0]).toMatchObject(mockUserWithoutPassword);
    });
  });

  describe('findOne', () => {
    it('should return user without password if found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findOne('1');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).not.toHaveProperty('password');
      expect(result).toMatchObject(mockUserWithoutPassword);
    });

    it('should throw NotFoundException if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should hash password if provided and update user returning user without password', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');
      (prisma.user.update as jest.Mock).mockResolvedValue({
        ...mockUser,
        password: 'newHashedPassword',
      });

      const updateUserDto = { name: 'Updated Name', password: 'newpassword' };
      const result = await service.update('1', updateUserDto);

      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { name: 'Updated Name', password: 'newHashedPassword' },
      });

      expect(result).not.toHaveProperty('password');
      expect(result).toMatchObject(mockUserWithoutPassword);
    });

    it('should update user without hashing if password not provided', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);

      const updateUserDto = { name: 'Updated Name' };
      const result = await service.update('1', updateUserDto);

      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateUserDto,
      });

      expect(result).not.toHaveProperty('password');
      expect(result).toMatchObject(mockUserWithoutPassword);
    });
  });

  describe('remove', () => {
    it('should remove user and return user without password', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
      (prisma.user.delete as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.remove('1');

      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).not.toHaveProperty('password');
      expect(result).toMatchObject(mockUserWithoutPassword);
    });
  });
});
