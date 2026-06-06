import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CompareService } from './compare.service';

@ApiTags('Compare')
@Controller('compare')
export class CompareController {
  constructor(private compareService: CompareService) {}

  @Get()
  @ApiOperation({ summary: 'Compare 2-3 colleges' })
  @ApiQuery({ name: 'ids', type: String, description: 'Comma-separated college IDs' })
  compare(@Query('ids') ids: string) {
    const idArray = ids ? ids.split(',').map((id) => id.trim()) : [];
    return this.compareService.compare(idArray);
  }
}
