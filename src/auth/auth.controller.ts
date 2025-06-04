import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { isValid, parse } from '@telegram-apps/init-data-node';
import { ConfigService } from '@nestjs/config';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('signin')
  async signin(@Body() body: { initData: string }) {
    const botToken = this.configService.get<string>('BOT_TOKEN');
    const { initData } = body;

    const isInitDataValid = isValid(initData, botToken);
    if (!isInitDataValid) {
      throw new BadRequestException('AUTH__INVALID_INITDATA');
    }

    const tgId = parse(initData).user?.id;
    if (!tgId) {
      throw new BadRequestException('AUTH__NO_TELEGRAM_ID');
    }

    const user = await this.authService.findByTelegramId(tgId);
    if (!user) {
      throw new BadRequestException('AUTH__USER_NOT_FOUND');
    }

    const payload = { sub: user.id, telegramId: tgId };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}
