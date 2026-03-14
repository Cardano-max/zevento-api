"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutingModule = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const inbox_module_1 = require("../inbox/inbox.module");
const lead_module_1 = require("../lead/lead.module");
const notification_module_1 = require("../notification/notification.module");
const routing_constants_1 = require("./routing.constants");
const routing_processor_1 = require("./routing.processor");
const routing_service_1 = require("./routing.service");
let RoutingModule = class RoutingModule {
};
exports.RoutingModule = RoutingModule;
exports.RoutingModule = RoutingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.registerQueue({ name: routing_constants_1.LEAD_ROUTING_QUEUE }),
            lead_module_1.LeadModule,
            notification_module_1.NotificationModule,
            inbox_module_1.InboxModule,
        ],
        providers: [routing_service_1.RoutingService, routing_processor_1.RoutingProcessor],
    })
], RoutingModule);
//# sourceMappingURL=routing.module.js.map