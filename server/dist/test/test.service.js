"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestService = void 0;
const common_1 = require("@nestjs/common");
const GitHub = require("github-api");
let TestService = class TestService {
    async testA() {
        const gh = await new GitHub({
            username: 'enkel1967@gmail.com',
            password: 'Abazhuri1!'
        });
        const me = gh.getUser();
        console.log(me);
        const starredRepos = await me.listStarredRepos();
        console.log(starredRepos);
    }
};
TestService = __decorate([
    (0, common_1.Injectable)()
], TestService);
exports.TestService = TestService;
//# sourceMappingURL=test.service.js.map