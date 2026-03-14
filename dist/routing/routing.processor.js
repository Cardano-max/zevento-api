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
var RoutingProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutingProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const bullmq_2 = require("bullmq");
const routing_constants_1 = require("./routing.constants");
const routing_service_1 = require("./routing.service");
let RoutingProcessor = RoutingProcessor_1 = class RoutingProcessor extends bullmq_1.WorkerHost {
    constructor(routingService) {
        super();
        this.routingService = routingService;
        this.logger = new common_1.Logger(RoutingProcessor_1.name);
    }
    async process(job) {
        this.logger.log(`Processing lead routing job ${job.id}: leadId=${job.data.leadId}, mode=${job.data.mode}`);
        if (job.data.mode === 'A') {
            await this.routingService.routeDirect(job.data.leadId);
        }
        else {
            await this.routingService.routeTopThree(job.data.leadId);
        }
        this.logger.log(`Lead routing job ${job.id} completed successfully`);
    }
    onFailed(job, error) {
        this.logger.error(`Lead routing job ${job.id} failed (attempt ${job.attemptsMade}/${job.opts?.attempts ?? '?'}): ${error.message}`, error.stack);
    }
};
exports.RoutingProcessor = RoutingProcessor;
__decorate([
    (0, bullmq_1.OnWorkerEvent)('failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job, Error]),
    __metadata("design:returntype", void 0)
], RoutingProcessor.prototype, "onFailed", null);
exports.RoutingProcessor = RoutingProcessor = RoutingProcessor_1 = __decorate([
    (0, bullmq_1.Processor)(routing_constants_1.LEAD_ROUTING_QUEUE),
    __metadata("design:paramtypes", [routing_service_1.RoutingService])
], RoutingProcessor);
//# sourceMappingURL=routing.processor.js.map