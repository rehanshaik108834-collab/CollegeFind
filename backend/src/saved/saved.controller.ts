import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SavedService } from './saved.service';
import { JwtAuthGuard, CurrentUser } from '../auth/jwt.guard';

@ApiTags('Saved')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('saved')
export class SavedController {
  constructor(private savedService: SavedService) {}

  @Get()
  @ApiOperation({ summary: 'Get all saved colleges for current user' })
  getSaved(@CurrentUser() user: any) {
    return this.savedService.getSaved(user.id);
  }

  @Get('ids')
  @ApiOperation({ summary: 'Get IDs of saved colleges' })
  getSavedIds(@CurrentUser() user: any) {
    return this.savedService.getSavedIds(user.id);
  }

  @Post(':collegeId')
  @ApiOperation({ summary: 'Save a college' })
  save(@CurrentUser() user: any, @Param('collegeId') collegeId: string) {
    return this.savedService.save(user.id, collegeId);
  }

  @Delete(':collegeId')
  @ApiOperation({ summary: 'Remove a saved college' })
  unsave(@CurrentUser() user: any, @Param('collegeId') collegeId: string) {
    return this.savedService.unsave(user.id, collegeId);
  }
}
