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
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const admin = require("firebase-admin");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificationService = NotificationService_1 = class NotificationService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(NotificationService_1.name);
        this.mockMode = false;
    }
    onModuleInit() {
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;
        if (projectId && clientEmail && privateKey) {
            if (!admin.apps.length) {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId,
                        clientEmail,
                        privateKey: privateKey.replace(/\\n/g, '\n'),
                    }),
                });
            }
            this.logger.log('Firebase Admin SDK initialized');
        }
        else {
            this.mockMode = true;
            this.logger.warn('Firebase not configured — push notifications will be mocked');
        }
    }
    async registerDevice(userId, token, platform) {
        await this.prisma.deviceToken.updateMany({
            where: { token, isActive: true },
            data: { isActive: false },
        });
        await this.prisma.deviceToken.create({
            data: {
                userId,
                token,
                platform,
                isActive: true,
            },
        });
        this.logger.log(`Device token registered for user ${userId} (${platform})`);
    }
    async sendPushToVendor(vendorId, leadData) {
        const vendor = await this.prisma.vendorProfile.findUnique({
            where: { id: vendorId },
            select: { userId: true },
        });
        if (!vendor) {
            this.logger.warn(`Vendor ${vendorId} not found — skipping push`);
            return;
        }
        const devices = await this.prisma.deviceToken.findMany({
            where: { userId: vendor.userId, isActive: true },
        });
        if (devices.length === 0) {
            this.logger.debug(`No active device tokens for vendor ${vendorId} — skipping push`);
            return;
        }
        if (this.mockMode) {
            this.logger.log(`[MOCK PUSH] Vendor ${vendorId}: New ${leadData.eventType} inquiry in ${leadData.city} (leadId: ${leadData.leadId}) — ${devices.length} device(s)`);
            return;
        }
        for (const device of devices) {
            try {
                await admin.messaging().send({
                    token: device.token,
                    notification: {
                        title: 'New Lead Received',
                        body: `New ${leadData.eventType} inquiry in ${leadData.city}`,
                    },
                    data: {
                        leadId: leadData.leadId,
                        type: 'NEW_LEAD',
                    },
                });
            }
            catch (error) {
                const code = error?.code ?? error?.errorInfo?.code ?? '';
                if (code === 'messaging/invalid-registration-token' ||
                    code === 'messaging/registration-token-not-registered') {
                    this.logger.warn(`Invalid/expired FCM token ${device.id} — deactivating`);
                    await this.prisma.deviceToken.update({
                        where: { id: device.id },
                        data: { isActive: false },
                    });
                }
                else {
                    this.logger.error(`FCM send failed for device ${device.id}: ${error.message}`);
                }
            }
        }
    }
    async sendPushToCustomer(customerId, payload) {
        const devices = await this.prisma.deviceToken.findMany({
            where: { userId: customerId, isActive: true },
        });
        if (devices.length === 0) {
            this.logger.debug(`No active device tokens for customer ${customerId} — skipping push`);
            return;
        }
        if (this.mockMode) {
            this.logger.log(`[MOCK PUSH] Customer ${customerId}: ${payload.title} — ${payload.body} — ${devices.length} device(s)`);
            return;
        }
        for (const device of devices) {
            try {
                await admin.messaging().send({
                    token: device.token,
                    notification: { title: payload.title, body: payload.body },
                    data: payload.data,
                });
            }
            catch (error) {
                const code = error?.code ?? error?.errorInfo?.code ?? '';
                if (code === 'messaging/invalid-registration-token' ||
                    code === 'messaging/registration-token-not-registered') {
                    await this.prisma.deviceToken.update({
                        where: { id: device.id },
                        data: { isActive: false },
                    });
                }
                else {
                    this.logger.error(`FCM send failed for device ${device.id}: ${error.message}`);
                }
            }
        }
    }
    async sendPushToMultipleVendors(vendorIds, leadData) {
        const results = await Promise.allSettled(vendorIds.map((vendorId) => this.sendPushToVendor(vendorId, leadData)));
        const failed = results.filter((r) => r.status === 'rejected');
        if (failed.length > 0) {
            this.logger.warn(`${failed.length}/${vendorIds.length} push notifications failed`);
        }
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map