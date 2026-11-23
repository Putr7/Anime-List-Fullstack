import { Module } from '@nestjs/common';
import { AnimeService } from './anime.service.js';
import { AnimeController } from './anime.controller.js';

@Module({
  controllers: [AnimeController],
  providers: [AnimeService],
  exports: [AnimeService],
})
export class AnimeModule {}
