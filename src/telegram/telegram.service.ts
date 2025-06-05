import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService {
  constructor(@InjectBot() private readonly bot: Telegraf<any>) {}

  async sendMessage(chatId: number, text: string) {
    return this.bot.telegram.sendMessage(chatId, text);
  }
}
