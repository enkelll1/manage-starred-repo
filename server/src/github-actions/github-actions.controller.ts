import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GithubActionsService } from './github-actions.service';
import { GithubActionDto } from './dto/create-github-action.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('github-actions')
export class GithubActionsController {
  constructor(private readonly githubActionsService: GithubActionsService) {}

  @Get('auth')
  authorizeUser(@Req() req: Request, @Res() res: Response) {
    return this.githubActionsService.authorizeUser(req, res);
  }

  @Get('starred')
  @UseGuards(JwtAuthGuard)
  getStarred(@Req() req: Request, @Res() res: Response) {
    return this.githubActionsService.getStarred(req,res);
  }

  @Post('starred')
  @UseGuards(JwtAuthGuard)
  postStarred(@Req() req: Request, @Body() githubActionDto: GithubActionDto) {
    return this.githubActionsService.postStarred(req, githubActionDto);
  }
}
