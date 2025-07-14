import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

async validateUser(email: string, password: string) {
  if (!email || !password) {
    throw new UnauthorizedException('Email e senha são obrigatórios');
  }

  const user = await this.prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new UnauthorizedException('Usuário não encontrado');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new UnauthorizedException('Senha inválida');

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    const token = this.jwtService.sign({ sub: user.id, role: user.role });

    return {
      token,
      user,
    };
  }
}
