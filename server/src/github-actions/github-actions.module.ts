import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GithubActionsService } from './github-actions.service';
import { GithubActionsController } from './github-actions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt-auth.strategy';
import { Starred, StarredSchema } from './schemas/starred.schema';

@Module({
  controllers: [GithubActionsController],
  providers: [GithubActionsService, JwtStrategy],
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ConfigModule.forRoot(),
    PassportModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Starred.name, schema: StarredSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: `${process.env.EXPIRES_IN}h` },
    }),
  ],
})
export class GithubActionsModule {}
