import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PredictorService } from './predictor.service';
import { PredictQueryDto } from './dto/predict-query.dto';

@ApiTags('Predictor')
@Controller('predict')
export class PredictorController {
  constructor(private predictorService: PredictorService) {}

  @Get()
  @ApiOperation({ summary: 'Predict colleges based on exam rank and category' })
  predict(@Query() query: PredictQueryDto) {
    return this.predictorService.predict(query);
  }
}
