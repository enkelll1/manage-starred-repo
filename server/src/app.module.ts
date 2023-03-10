import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GithubActionsModule } from './github-actions/github-actions.module';
import { ConfigModule } from '@nestjs/config';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    GithubActionsModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`${process.env.MONGO_DB_URL}`),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
