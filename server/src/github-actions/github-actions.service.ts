import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as querystring from 'querystring';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { Starred, StarredDocument } from './schemas/starred.schema';

@Injectable()
export class GithubActionsService {
  constructor(
    private http: HttpService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Starred.name)
    private readonly starredModel: Model<StarredDocument>,
    private jwtService: JwtService,
  ) {}

  async authorizeUser(req, res) {
    const code = req.query.code;
    const path = req.query.path;

    if (!code) {
      throw new BadRequestException('No code!');
    }

    const githubUser = await this.getGitHubUser({ code });
    console.log(githubUser);
    const user = await this.userModel.findOne({
      gh_username: githubUser.login,
    });
    let payload;
    let token;
    if (!user) {
      const createdUser = await this.userModel.create({
        gh_username: githubUser.login,
        full_name: githubUser.name,
      });
      payload = {
        _id: createdUser._id,
        username: createdUser.gh_username,
      };
      token = this.jwtService.sign(payload);
    } else {
      payload = {
        _id: user._id,
        username: user.gh_username,
      };
      token = this.jwtService.sign(payload);
    }
    res.set('x-token', token);
    res.redirect(`http://localhost:3000/repo?token=${token}`);
    // res.json({
    //     access_token: this.jwtService.sign(payload),
    // })
  }

  async getStarred(req,res) {
    const starredRepos = await this.starredModel.find({
      user_id: req.user.userId,
    });
    const user= await this.userModel.findById(req.user.userId);
    res.json({
      user:user,
      starred_repos:starredRepos
    })
    return starredRepos;
  }

  async postStarred(req, githubActionDto) {
    const headersObj = {
      Accept: 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
    if (githubActionDto.access_token_gh || githubActionDto.access_token_gh) {
      Object.assign(headersObj, {
        Authorization: `Bearer ${githubActionDto.access_token_gh}`,
      });
    }
    console.log(headersObj);
    const repos = await this.http
      .get(`https://api.github.com/users/${req.user.username_gh}/starred`, {
        headers: headersObj,
      })
      .toPromise()
      .then((res) => {
        window.location.reload()
        return res.data;
      })
      .catch((err) => {
        window.location.reload()
        throw new BadRequestException(err.message);
      });
    const savedStarredRepos = await this.starredModel
      .find({
        userId: req.user._id,
      })
      .distinct('repo_git_id');

    repos.map(async (singleRepo) => {
      if (
        !savedStarredRepos ||
        !savedStarredRepos.includes(String(singleRepo.id))
      ) {
        await this.starredModel.create({
          user_id: req.user.userId,
          repo_name: singleRepo.name,
          repo_owner: singleRepo.owner.login,
          repo_url: singleRepo.html_url,
          repo_git_id: singleRepo.id,
          language: singleRepo.language,
        });
      }
    });

    return 'Finished';
  }

  async getGitHubUser({ code }: { code: string }) {
    const githubToken = await this.http
      .post(
        `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`,
      )
      .toPromise()
      .then((res) => {
        console.log(res.data);
        return res.data;
      })
      .catch((error) => {
        throw error;
      });

    console.log(githubToken);
    const decoded = querystring.parse(githubToken);

    const accessToken = decoded.access_token;
    console.log(accessToken);

    return await this.http
      .get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .toPromise()
      .then((res) => res.data)
      .catch((error) => {
        console.error(`Error getting user from GitHub`);
        throw error;
      });
  }
}
