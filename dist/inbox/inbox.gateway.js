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
var InboxGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboxGateway = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const prisma_service_1 = require("../prisma/prisma.service");
let InboxGateway = InboxGateway_1 = class InboxGateway {
    constructor(jwtService, prisma) {
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.logger = new common_1.Logger(InboxGateway_1.name);
    }
    afterInit(server) {
        server.use(async (socket, next) => {
            const token = socket.handshake.auth?.token;
            if (!token) {
                return next(new Error('Missing auth token'));
            }
            try {
                const payload = this.jwtService.verify(token);
                socket.data.jwtPayload = payload;
                next();
            }
            catch {
                next(new Error('Invalid or expired token'));
            }
        });
        this.logger.log('InboxGateway initialized — JWT socket middleware registered');
    }
    async handleConnection(client) {
        const payload = client.data.jwtPayload;
        if (!payload) {
            client.disconnect(true);
            return;
        }
        const vendor = await this.prisma.vendorProfile.findUnique({
            where: { userId: payload.userId },
            select: { id: true },
        });
        if (!vendor) {
            this.logger.warn(`No vendor profile found for userId ${payload.userId} — disconnecting`);
            client.disconnect(true);
            return;
        }
        const room = `vendor:${vendor.id}`;
        await client.join(room);
        client.data.vendorId = vendor.id;
        this.logger.log(`Vendor ${vendor.id} connected — joined room ${room}`);
    }
    handleDisconnect(client) {
        const vendorId = client.data?.vendorId;
        this.logger.log(`Vendor ${vendorId ?? 'unknown'} disconnected`);
    }
    emitToVendor(vendorId, event, data) {
        this.server.to(`vendor:${vendorId}`).emit(event, data);
        this.logger.debug(`Emitted '${event}' to vendor:${vendorId}`);
    }
};
exports.InboxGateway = InboxGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], InboxGateway.prototype, "server", void 0);
exports.InboxGateway = InboxGateway = InboxGateway_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*', credentials: true } }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService])
], InboxGateway);
//# sourceMappingURL=inbox.gateway.js.map