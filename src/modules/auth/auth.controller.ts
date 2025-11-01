import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth.login.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from 'generated/prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async login(
    @Body() data: AuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token, ...authenticated } =
      await this.authService.authenticate(data);

    // Simpan refresh token di cookie
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true kalau di HTTPS
      sameSite: 'none', // agar bisa dipakai di Android app / cross-origin
      path: '/', // default
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    });

    return {
      access_token,
      user: authenticated,
    };
  }

  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'] as string;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const result = await this.authService.refreshToken({ refreshToken });
    // perbarui cookie-nya juga
    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      access_token: result.access_token,
      user: result.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: Request) {
    return {
      message: 'Authenticated successfully!',
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const userId = (req.user as User).id;
    await this.authService.logout(userId);

    // Hapus cookie refresh token
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/',
    });

    return { message: 'Logout berhasil, refresh token dihapus' };
  }
}
