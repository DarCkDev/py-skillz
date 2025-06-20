import { Controller, Post, Body } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly iaService: GeminiService) {}

  @Post('chat')
  async chat(@Body('message') message: string) {
    const reply = await this.iaService.sendMessage(message);
    return { reply };
  }
}
