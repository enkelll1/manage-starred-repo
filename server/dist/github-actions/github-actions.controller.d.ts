import { Request, Response } from 'express';
import { GithubActionsService } from './github-actions.service';
import { GithubActionDto } from './dto/create-github-action.dto';
export declare class GithubActionsController {
    private readonly githubActionsService;
    constructor(githubActionsService: GithubActionsService);
    authorizeUser(req: Request, res: Response): Promise<void>;
    getStarred(req: Request, res: Response): Promise<(import("./schemas/starred.schema").Starred & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    postStarred(req: Request, githubActionDto: GithubActionDto): Promise<string>;
}
