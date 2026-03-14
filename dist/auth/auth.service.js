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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const msg91_service_1 = require("./msg91.service");
const otp_service_1 = require("./otp.service");
const rate_limit_service_1 = require("./rate-limit.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(otp, msg91, rateLimit, prisma, jwt) {
        this.otp = otp;
        this.msg91 = msg91;
        this.rateLimit = rateLimit;
        this.prisma = prisma;
        this.jwt = jwt;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async sendOtp(phone) {
        const limit = await this.rateLimit.checkSendLimit(phone);
        if (!limit.allowed) {
            throw new common_1.HttpException({
                message: 'Too many OTP requests. Please try again later.',
                retryAfterSeconds: limit.retryAfterSeconds,
            }, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        const code = this.otp.generateOtp();
        await this.otp.storeOtp(phone, code);
        await this.msg91.sendOtp(phone, code);
        const masked = `****${phone.slice(-4)}`;
        if (process.env.OTP_BYPASS_CODE) {
            return { message: 'OTP sent', phone: masked, otp: process.env.OTP_BYPASS_CODE };
        }
        return { message: 'OTP sent', phone: masked };
    }
    async verifyOtp(phone, submittedOtp, requestedRole) {
        const limit = await this.rateLimit.checkVerifyLimit(phone);
        if (!limit.allowed) {
            throw new common_1.HttpException({
                message: 'Too many failed attempts. Please try again later.',
                retryAfterSeconds: limit.retryAfterSeconds,
            }, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        const isValid = await this.otp.verifyOtp(phone, submittedOtp);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Invalid or expired OTP');
        }
        let user = await this.prisma.user.findUnique({
            where: { phone },
            include: { roles: true },
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    phone,
                    roles: {
                        create: {
                            role: 'CUSTOMER',
                        },
                    },
                },
                include: { roles: true },
            });
            this.logger.log(`New user created: ${user.id} (${phone})`);
        }
        const activeRoles = user.roles.filter((r) => r.isActive);
        if (activeRoles.length === 0) {
            const newRole = await this.prisma.userRole.create({
                data: {
                    userId: user.id,
                    role: 'CUSTOMER',
                },
            });
            user.roles.push(newRole);
        }
        const refreshedActiveRoles = user.roles.filter((r) => r.isActive);
        let activeRole;
        if (requestedRole) {
            const hasRole = refreshedActiveRoles.some((r) => r.role === requestedRole);
            if (!hasRole) {
                throw new common_1.UnauthorizedException(`User does not have the role: ${requestedRole}`);
            }
            activeRole = requestedRole;
        }
        else {
            const customerRole = refreshedActiveRoles.find((r) => r.role === 'CUSTOMER');
            activeRole = customerRole
                ? 'CUSTOMER'
                : refreshedActiveRoles[0].role;
        }
        const payload = { userId: user.id, phone: user.phone, activeRole };
        const accessToken = this.jwt.sign(payload);
        await this.rateLimit.resetOnSuccess(phone);
        return {
            accessToken,
            user: {
                id: user.id,
                phone: user.phone,
                name: user.name,
                roles: user.roles.map((r) => ({
                    id: r.id,
                    role: r.role,
                    isActive: r.isActive,
                })),
                activeRole,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [otp_service_1.OtpService,
        msg91_service_1.Msg91Service,
        rate_limit_service_1.RateLimitService,
        prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map