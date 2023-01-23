import { HttpService } from '@nestjs/axios';
import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { Starred, StarredDocument } from './schemas/starred.schema';
export declare class GithubActionsService {
    private http;
    private readonly userModel;
    private readonly starredModel;
    private jwtService;
    constructor(http: HttpService, userModel: Model<UserDocument>, starredModel: Model<StarredDocument>, jwtService: JwtService);
    authorizeUser(req: any, res: any): Promise<void>;
    getStarred(req: any, res: any): Promise<(Starred & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    postStarred(req: any, githubActionDto: any): Promise<string>;
    getGitHubUser({ code }: {
        code: string;
    }): Promise<any>;
}
