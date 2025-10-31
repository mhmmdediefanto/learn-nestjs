import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AuthLoginDto } from './dto/auth.login.dto';
import { comparePassword } from 'src/common/utils/bcrypt';
import { User } from 'generated/prisma/client';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async authenticate(data: AuthLoginDto) {
    const { email, password } = data;
    // cek email dan password
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return await this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = { sub: user.id, email: user.email };
    try {
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
      });
      const refreshToken = uuidv4();
      await this.storeGenerateAccessToken(user, refreshToken);

      return {
        access_token: token,
        refresh_token: refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
      console.error('--- CRITICAL JWT SIGN ERROR ---', error);
      throw new Error('Failed to generate token');
    }
  }

  private async storeGenerateAccessToken(user: User, token: string) {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 7);

    await this.prisma.accessRefreshToken.create({
      data: {
        userId: user.id,
        refreshToken: token,
        expiredAt: expiredDate,
      },
    });
  }
}
