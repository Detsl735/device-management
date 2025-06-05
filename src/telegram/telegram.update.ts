import { Update, Ctx, On } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from 'src/device/entities/device.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { Public } from 'src/auth/public.decorator';

@Public()
@Update()
export class TelegramUpdate {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepo: Repository<Device>,

    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  @On('callback_query')
  async handleCallback(@Ctx() ctx: Context) {
    const data = (ctx.callbackQuery as any)?.data;
    const [action, deviceId, requesterId] = data.split('_');

    const device = await this.deviceRepo.findOne({
      where: { id: Number(deviceId) },
      relations: ['employee'],
    });

    const requester = await this.employeeRepo.findOneBy({
      id: Number(requesterId),
    });

    if (!device || !requester) {
      await ctx.reply('⛔ Устройство или пользователь не найдены');
      return;
    }

    if (action === 'accept') {
      device.employee = requester;
      await this.deviceRepo.save(device);
      await ctx.telegram.sendMessage(
        requester.telegramId,
        `✅ Запрос одобрен, устройство ${device.serialNum} передано вам`,
      );
      await ctx.reply('📦 Устройство передано');
    }

    if (action === 'reject') {
      await ctx.telegram.sendMessage(
        requester.telegramId,
        '❌ Вам отказали в устройстве',
      );
      await ctx.reply('🚫 Вы отклонили запрос');
    }

    await ctx.answerCbQuery();
  }
}
