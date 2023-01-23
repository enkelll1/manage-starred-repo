import { TestService } from "./test.service";
import { Request } from "express";
export declare class TestController {
    private readonly githubActionsService;
    constructor(githubActionsService: TestService);
    findAll(req: Request): Promise<void>;
}
