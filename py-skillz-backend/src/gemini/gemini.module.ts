// src/ia/ia.module.ts (o gemini.module.ts)
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeminiService } from './gemini.service';
import { GeminiController } from './gemini.controller';

@Module({
  imports: [ConfigModule],
  controllers: [GeminiController],
  providers: [GeminiService],
})
export class GeminiModule {}
