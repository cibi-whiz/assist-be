import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDTO, RegisterDTO } from './auth.validate';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async login(payload: LoginDTO) {
    const { email, password } = payload;

    const user = await this.prisma.assistUser.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
    

    return {
      success: true,
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async register(payload: RegisterDTO) {
    const { email, password, name } = payload;

    const existingUser = await this.prisma.assistUser.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.assistUser.create({
      data: {
        name,
        email,
        password: hashedPassword,
        created_by: 1, // TODO: Get from authenticated user or system user
        updated_by: 1, // TODO: Get from authenticated user or system user
      },
    });

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}
