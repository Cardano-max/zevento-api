"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadModule = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const routing_constants_1 = require("../routing/routing.constants");
const lead_controller_1 = require("./lead.controller");
const lead_service_1 = require("./lead.service");
const scoring_service_1 = require("./scoring.service");
let LeadModule = class LeadModule {
};
exports.LeadModule = LeadModule;
exports.LeadModule = LeadModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            bullmq_1.BullModule.registerQueue({ name: routing_constants_1.LEAD_ROUTING_QUEUE }),
        ],
        controllers: [lead_controller_1.LeadController],
        providers: [lead_service_1.LeadService, scoring_service_1.ScoringService],
        exports: [scoring_service_1.ScoringService],
    })
], LeadModule);
//# sourceMappingURL=lead.module.js.map