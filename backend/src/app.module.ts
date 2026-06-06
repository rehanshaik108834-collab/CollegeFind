import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CollegesModule } from './colleges/colleges.module';
import { CompareModule } from './compare/compare.module';
import { SavedModule } from './saved/saved.module';
import { PredictorModule } from './predictor/predictor.module';
import { DiscussionsModule } from './discussions/discussions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CollegesModule,
    CompareModule,
    SavedModule,
    PredictorModule,
    DiscussionsModule,
  ],
})
export class AppModule {}

