"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGithubActionDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_github_action_dto_1 = require("./create-github-action.dto");
class UpdateGithubActionDto extends (0, mapped_types_1.PartialType)(create_github_action_dto_1.CreateGithubActionDto) {
}
exports.UpdateGithubActionDto = UpdateGithubActionDto;
//# sourceMappingURL=update-github-action.dto.js.map