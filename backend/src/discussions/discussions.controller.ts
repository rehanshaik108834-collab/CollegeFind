import {
  Controller, Get, Post, Patch, Param, Query, Body, UseGuards, Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DiscussionsService } from './discussions.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { ThreadQueryDto } from './dto/thread-query.dto';
import { JwtAuthGuard, CurrentUser } from '../auth/jwt.guard';

@ApiTags('Discussions')
@Controller('discussions')
export class DiscussionsController {
  constructor(private discussionsService: DiscussionsService) {}

  @Get()
  @ApiOperation({ summary: 'List discussion threads with search, filter, sort, pagination' })
  findAll(@Query() query: ThreadQueryDto) {
    return this.discussionsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get thread detail with answers' })
  findById(@Param('id') id: string) {
    return this.discussionsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new discussion thread' })
  createThread(@Body() dto: CreateThreadDto, @CurrentUser() user: any) {
    return this.discussionsService.createThread(dto, user.id);
  }

  @Post(':id/answers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Post an answer to a thread' })
  createAnswer(
    @Param('id') id: string,
    @Body() dto: CreateAnswerDto,
    @CurrentUser() user: any,
  ) {
    return this.discussionsService.createAnswer(id, dto, user.id);
  }

  @Post(':id/vote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upvote/un-upvote a thread' })
  voteThread(@Param('id') id: string, @CurrentUser() user: any) {
    return this.discussionsService.voteThread(id, user.id);
  }

  @Post('answers/:id/vote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upvote/un-upvote an answer' })
  voteAnswer(@Param('id') id: string, @CurrentUser() user: any) {
    return this.discussionsService.voteAnswer(id, user.id);
  }

  @Patch('answers/:id/accept')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark/unmark an answer as accepted (thread author only)' })
  acceptAnswer(@Param('id') id: string, @CurrentUser() user: any) {
    return this.discussionsService.acceptAnswer(id, user.id);
  }
}
