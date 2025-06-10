import { Controller, Post, Body } from '@nestjs/common';
import { HuggingFaceService } from './huggingface.service';

@Controller('chatHuggingFace')
export class HuggingFaceController {
  constructor(private readonly hfService: HuggingFaceService) {}

  @Post()
  async chat(@Body('message') message: string) {
    const response = await this.hfService.generateResponse(message);
    return { response };
  }
}
