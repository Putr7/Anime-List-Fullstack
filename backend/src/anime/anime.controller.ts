import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AnimeService } from './anime.service.js';
import { CreateAnimeDto } from './dto/create-anime.dto.js';
import { UpdateAnimeDto } from './dto/update-anime.dto.js';

@Controller('anime')
export class AnimeController {
  // Dependency Injection: Service di-inject melalui constructor
  constructor(private readonly animeService: AnimeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAnimeDto: CreateAnimeDto) {
    return this.animeService.create(createAnimeDto);
  }

  @Get()
  findAll() {
    return this.animeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.animeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAnimeDto: UpdateAnimeDto,
  ) {
    return this.animeService.update(id, updateAnimeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.animeService.remove(id);
  }

  @Post('reset')
  reset() {
    return this.animeService.reset();
  }
}
