import 'multer';
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  ParseIntPipe,
  Param,
  Delete,
  Res,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SetsService } from './sets.service';
import { SetsDto } from './dto/sets.dto';
import { User } from '@/decorators';
import type { Response } from 'express';

@Controller('sets')
export class SetsController {
  constructor(private setsService: SetsService) {}

  @Get()
  getAllSets(@User() user: any) {
    return this.setsService.getAllSets(user.id);
  }

  @Get('due')
  getDueSets(@User() user: any) {
    return this.setsService.getDueSets(user.id);
  }

  @Get(':setId')
  getSetById(@User() user: any, @Param('setId', ParseIntPipe) setId: number) {
    return this.setsService.getSetById(user.id, setId);
  }

  @Get(':setId/practice')
  getPracticeSet(
    @User() user: any,
    @Param('setId', ParseIntPipe) setId: number,
  ) {
    return this.setsService.getPracticeSetById(user.id, setId);
  }

  @Post()
  createSet(@User() user: any, @Body() dto: SetsDto) {
    return this.setsService.createSet(user.id, dto);
  }

  @Post('generate')
  @UseInterceptors(FilesInterceptor('files'))
  async generateSet(
    @User() user: any,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('difficulty') difficulty: string | string[],
    @Body('count') count: string,
  ) {
    const difficultyLevels = Array.isArray(difficulty)
      ? difficulty
      : [difficulty || 'medium'];

    const questionCount = parseInt(count, 10) || 10;

    return this.setsService.generateSetFromFile(
      user.id,
      files,
      difficultyLevels,
      questionCount,
    );
  }

  @Patch(':setId')
  updateSet(
    @User() user: any,
    @Param('setId', ParseIntPipe) setId: number,
    @Body() dto: Partial<SetsDto>,
  ) {
    return this.setsService.updateSet(user.id, setId, dto);
  }

  @Delete(':setId')
  deleteSet(@User() user: any, @Param('setId', ParseIntPipe) setId: number) {
    return this.setsService.deleteSet(user.id, setId);
  }

  @Get(':setId/export/:format')
  async exportSet(
    @User() user: any,
    @Param('setId', ParseIntPipe) setId: number,
    @Param('format') format: 'csv' | 'pdf',
    @Res() res: Response,
  ) {
    const setData = await this.setsService.getSetById(user.id, setId);

    if (format === 'csv') {
      const csv = this.setsService.convertToCSV(setData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition', // download the file instead of displaying it
        `attachment; filename=${setData.title}.csv`,
      );
      return res.send(csv);
    }

    if (format === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${setData.title}.pdf`,
      );
      return this.setsService.generatePDF(setData, res);
    }
  }

  @Post(':setId/share/:userId')
  shareSet(
    @User() user: any,
    @Param('setId', ParseIntPipe) setId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.setsService.sendSet(user.id, setId, userId);
  }
}
