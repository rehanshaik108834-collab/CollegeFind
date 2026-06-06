import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CollegesService } from './colleges.service';
import { CollegeQueryDto } from './dto/college-query.dto';

@ApiTags('Colleges')
@Controller('colleges')
export class CollegesController {
  constructor(private collegesService: CollegesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all colleges with filters and pagination' })
  findAll(@Query() query: CollegeQueryDto) {
    return this.collegesService.findAll(query);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured colleges (rating >= 4.5)' })
  getFeatured() {
    return this.collegesService.getFeatured();
  }

  @Get('filters')
  @ApiOperation({ summary: 'Get available filter options' })
  getFilters() {
    return this.collegesService.getFilters();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get college by slug' })
  findOne(@Param('slug') slug: string) {
    return this.collegesService.findBySlug(slug);
  }
}
