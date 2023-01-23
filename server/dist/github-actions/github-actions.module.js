"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubActionsModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const github_actions_service_1 = require("./github-actions.service");
const github_actions_controller_1 = require("./github-actions.controller");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./schemas/user.schema");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const jwt_auth_strategy_1 = require("./strategies/jwt-auth.strategy");
const starred_schema_1 = require("./schemas/starred.schema");
let GithubActionsModule = class GithubActionsModule {
};
GithubActionsModule = __decorate([
    (0, common_1.Module)({
        controllers: [github_actions_controller_1.GithubActionsController],
        providers: [github_actions_service_1.GithubActionsService, jwt_auth_strategy_1.JwtStrategy],
        imports: [
            axios_1.HttpModule.register({
                timeout: 5000,
                maxRedirects: 5,
            }),
            config_1.ConfigModule.forRoot(),
            passport_1.PassportModule,
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: starred_schema_1.Starred.name, schema: starred_schema_1.StarredSchema },
            ]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: `${process.env.EXPIRES_IN}h` },
            }),
        ],
    })
], GithubActionsModule);
exports.GithubActionsModule = GithubActionsModule;
//# sourceMappingURL=github-actions.module.js.map