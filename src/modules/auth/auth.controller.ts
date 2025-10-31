import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth.login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  login(@Body() data: AuthLoginDto) {
    const authenticated = this.authService.authenticate(data);
    return authenticated;
  }

  @Post('refresh-token')
  refreshToken() {
    return 'refresh token';
  }
}
