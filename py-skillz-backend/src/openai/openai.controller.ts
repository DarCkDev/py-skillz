import { Controller, Post, Body } from '@nestjs/common';
import { OpenAIService } from './openai.service';

@Controller('chatOpenAi')
export class OpenAIController {
  constructor(private readonly openAIService: OpenAIService) {}

  @Post()
  async chat(@Body('message') message: string) {
    const response = await this.openAIService.generateResponse(message);
    return { response };
  }
}
//