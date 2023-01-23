"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubActionsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const querystring = require("querystring");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const user_schema_1 = require("./schemas/user.schema");
const jwt_1 = require("@nestjs/jwt");
const starred_schema_1 = require("./schemas/starred.schema");
let GithubActionsService = class GithubActionsService {
    constructor(http, userModel, starredModel, jwtService) {
        this.http = http;
        this.userModel = userModel;
        this.starredModel = starredModel;
        this.jwtService = jwtService;
    }
    async authorizeUser(req, res) {
        const code = req.query.code;
        const path = req.query.path;
        if (!code) {
            throw new common_1.BadRequestException('No code!');
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
        }
        else {
            payload = {
                _id: user._id,
                username: user.gh_username,
            };
            token = this.jwtService.sign(payload);
        }
        res.set('x-token', token);
        res.redirect(`http://localhost:3000/repo?token=${token}`);
    }
    async getStarred(req, res) {
        const starredRepos = await this.starredModel.find({
            user_id: req.user.userId,
        });
        const user = await this.userModel.findById(req.user.userId);
        res.json({
            user: user,
            starred_repos: starredRepos
        });
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
            window.location.reload();
            return res.data;
        })
            .catch((err) => {
            window.location.reload();
            throw new common_1.BadRequestException(err.message);
        });
        const savedStarredRepos = await this.starredModel
            .find({
            userId: req.user._id,
        })
            .distinct('repo_git_id');
        repos.map(async (singleRepo) => {
            if (!savedStarredRepos ||
                !savedStarredRepos.includes(String(singleRepo.id))) {
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
    async getGitHubUser({ code }) {
        const githubToken = await this.http
            .post(`https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`)
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
};
GithubActionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_2.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_2.InjectModel)(starred_schema_1.Starred.name)),
    __metadata("design:paramtypes", [axios_1.HttpService,
        mongoose_1.Model,
        mongoose_1.Model,
        jwt_1.JwtService])
], GithubActionsService);
exports.GithubActionsService = GithubActionsService;
//# sourceMappingURL=github-actions.service.js.map