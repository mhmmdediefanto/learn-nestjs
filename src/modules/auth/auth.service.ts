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

    await this.prisma.accessRefreshToken.deleteMany({
      where: { userId: user.id },
    });

    const token = await this.generateToken(user);
    const refreshToken = uuidv4();
    await this.storeGenerateAccessRefreshToken(user, refreshToken);

    return {
      ...token,
      refresh_token: refreshToken,
    };
  }

  async refreshToken({ refreshToken }: { refreshToken: string }) {
    try {
      const stored = await this.prisma.accessRefreshToken.findUnique({
        where: {
          refreshToken: refreshToken,
        },
        include: {
          user: true,
        },
      });

      if (!stored || stored.expiredAt < new Date()) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const user = stored.user;

      // generate ulang token baru
      const access_token = this.jwtService.sign(
        { sub: user.id, email: user.email },
        { expiresIn: '15m' },
      );

      const new_refresh_token = uuidv4();
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);

      await this.prisma.accessRefreshToken.update({
        where: { userId: user.id },
        data: {
          refreshToken: new_refresh_token,
          expiredAt: expires,
        },
      });

      return {
        access_token,
        refresh_token: new_refresh_token,
        user,
      };
    } catch (error) {
      console.error('--- CRITICAL REFRESH TOKEN ERROR ---', error);
      throw error;
    }
  }

  async logout(userId: string) {
    await this.prisma.accessRefreshToken.deleteMany({
      where: { userId },
    });
    return;
  }

  private async generateToken(user: User) {
    const payload = { sub: user.id, email: user.email };
    try {
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: '15m',
      });
      return {
        access_token: token,
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

  private async storeGenerateAccessRefreshToken(user: User, token: string) {
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
