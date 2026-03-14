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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var OrderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const prisma_service_1 = require("../prisma/prisma.service");
const notification_service_1 = require("../notification/notification.service");
const VALID_ORDER_TRANSITIONS = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['DISPATCHED', 'CANCELLED'],
    DISPATCHED: ['DELIVERED'],
};
const ORDER_STATUS_MESSAGES = {
    CONFIRMED: {
        title: 'Order Confirmed',
        body: 'Your order has been confirmed by the supplier!',
    },
    DISPATCHED: {
        title: 'Order Dispatched',
        body: 'Your order has been dispatched and is on its way!',
    },
    DELIVERED: {
        title: 'Order Delivered',
        body: 'Your order has been delivered!',
    },
    CANCELLED: {
        title: 'Order Cancelled',
        body: 'Your order has been cancelled.',
    },
};
let OrderService = OrderService_1 = class OrderService {
    constructor(prisma, notificationService, stockAlertQueue) {
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.stockAlertQueue = stockAlertQueue;
        this.logger = new common_1.Logger(OrderService_1.name);
    }
    async createOrder(buyerId, dto) {
        const { vendorId, items, shippingAddress, note } = dto;
        const productIds = items.map((i) => i.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
        });
        if (products.length !== productIds.length) {
            const foundIds = products.map((p) => p.id);
            const missing = productIds.filter((id) => !foundIds.includes(id));
            throw new common_1.NotFoundException(`Product(s) not found: ${missing.join(', ')}`);
        }
        const wrongVendor = products.filter((p) => p.vendorId !== vendorId);
        if (wrongVendor.length > 0) {
            throw new common_1.BadRequestException(`Product(s) do not belong to vendor ${vendorId}: ${wrongVendor.map((p) => p.name).join(', ')}`);
        }
        const inactive = products.filter((p) => !p.isActive);
        if (inactive.length > 0) {
            throw new common_1.BadRequestException(`Product(s) are not available: ${inactive.map((p) => p.name).join(', ')}`);
        }
        const productMap = new Map(products.map((p) => [p.id, p]));
        for (const item of items) {
            const product = productMap.get(item.productId);
            if (item.quantity < product.moq) {
                throw new common_1.BadRequestException(`Minimum order quantity for "${product.name}" is ${product.moq}. You ordered ${item.quantity}.`);
            }
        }
        const totalPaise = items.reduce((sum, item) => {
            const product = productMap.get(item.productId);
            return sum + item.quantity * product.pricePaise;
        }, 0);
        const order = await this.prisma.$transaction(async (tx) => {
            const updatedProducts = [];
            for (const item of items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId },
                    select: { id: true, name: true, stock: true, lowStockThreshold: true },
                });
                if (!product) {
                    throw new common_1.NotFoundException(`Product ${item.productId} not found`);
                }
                if (product.stock < item.quantity) {
                    throw new common_1.BadRequestException(`Insufficient stock for "${productMap.get(item.productId).name}". Available: ${product.stock}, requested: ${item.quantity}.`);
                }
                const updated = await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                    select: { id: true, stock: true, lowStockThreshold: true },
                });
                updatedProducts.push(updated);
            }
            const createdOrder = await tx.productOrder.create({
                data: {
                    buyerId,
                    vendorId,
                    status: 'PENDING',
                    totalPaise,
                    shippingAddress,
                    note,
                    items: {
                        create: items.map((item) => {
                            const product = productMap.get(item.productId);
                            return {
                                productId: item.productId,
                                quantity: item.quantity,
                                unitPaise: product.pricePaise,
                                totalPaise: item.quantity * product.pricePaise,
                            };
                        }),
                    },
                    statusHistory: {
                        create: {
                            fromStatus: null,
                            toStatus: 'PENDING',
                        },
                    },
                },
                include: {
                    items: {
                        include: {
                            product: {
                                select: { id: true, name: true, pricePaise: true },
                            },
                        },
                    },
                    vendor: { select: { id: true, businessName: true } },
                },
            });
            return { createdOrder, updatedProducts };
        });
        for (const updated of order.updatedProducts) {
            if (updated.stock <= updated.lowStockThreshold) {
                await this.stockAlertQueue.add('low-stock', {
                    productId: updated.id,
                    currentStock: updated.stock,
                });
                this.logger.log(`Low stock alert enqueued: product=${updated.id}, stock=${updated.stock}, threshold=${updated.lowStockThreshold}`);
            }
        }
        this.logger.log(`Order created: ${order.createdOrder.id}, buyer=${buyerId}, vendor=${vendorId}, total=${totalPaise}`);
        return order.createdOrder;
    }
    async getOrderById(orderId) {
        const order = await this.prisma.productOrder.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                pricePaise: true,
                                images: {
                                    take: 1,
                                    orderBy: { sortOrder: 'asc' },
                                    select: { cloudinaryUrl: true },
                                },
                            },
                        },
                    },
                },
                vendor: { select: { id: true, businessName: true } },
                buyer: { select: { id: true, phone: true } },
                statusHistory: { orderBy: { changedAt: 'desc' } },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async getMyOrders(buyerId, page, limit) {
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            this.prisma.productOrder.findMany({
                where: { buyerId },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    vendor: { select: { id: true, businessName: true } },
                    _count: { select: { items: true } },
                },
            }),
            this.prisma.productOrder.count({ where: { buyerId } }),
        ]);
        return {
            data: orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getVendorOrders(vendorId, page, limit, status) {
        const skip = (page - 1) * limit;
        const where = { vendorId };
        if (status) {
            where.status = status;
        }
        const [orders, total] = await Promise.all([
            this.prisma.productOrder.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    buyer: { select: { id: true, phone: true } },
                    _count: { select: { items: true } },
                },
            }),
            this.prisma.productOrder.count({ where }),
        ]);
        return {
            data: orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async cancelOrder(orderId, requesterId, requesterRole) {
        return this.transitionOrderStatus(orderId, { status: 'CANCELLED' }, requesterId, requesterRole);
    }
    async transitionOrderStatus(orderId, dto, requesterId, requesterRole) {
        const order = await this.prisma.productOrder.findUnique({
            where: { id: orderId },
            include: {
                items: true,
                vendor: { select: { id: true, userId: true } },
                buyer: { select: { id: true, phone: true } },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const currentStatus = order.status;
        const targetStatus = dto.status;
        const isAdmin = requesterRole === 'ADMIN';
        const isVendorOwner = order.vendor.userId === requesterId;
        const isSupplier = requesterRole === 'SUPPLIER';
        const isBuyer = (requesterRole === 'PLANNER' || requesterRole === 'CUSTOMER') &&
            order.buyerId === requesterId;
        if (!isAdmin) {
            if (isSupplier && isVendorOwner) {
            }
            else if (isBuyer) {
                if (targetStatus !== 'CANCELLED') {
                    throw new common_1.ForbiddenException('Buyers can only cancel orders, not advance their status');
                }
                if (!['PENDING', 'CONFIRMED'].includes(currentStatus)) {
                    throw new common_1.ForbiddenException(`Buyers can only cancel orders in PENDING or CONFIRMED status. Current status: ${currentStatus}`);
                }
            }
            else {
                throw new common_1.ForbiddenException('You do not have permission to update this order status');
            }
        }
        const allowedTransitions = VALID_ORDER_TRANSITIONS[currentStatus] ?? [];
        if (!allowedTransitions.includes(targetStatus)) {
            throw new common_1.BadRequestException(`Invalid status transition from ${currentStatus} to ${targetStatus}. Allowed: ${allowedTransitions.join(', ') || 'none (terminal state)'}`);
        }
        await this.prisma.$transaction(async (tx) => {
            const updated = await tx.productOrder.updateMany({
                where: { id: orderId, status: currentStatus },
                data: {
                    status: targetStatus,
                    confirmedAt: targetStatus === 'CONFIRMED' ? new Date() : undefined,
                    dispatchedAt: targetStatus === 'DISPATCHED' ? new Date() : undefined,
                    deliveredAt: targetStatus === 'DELIVERED' ? new Date() : undefined,
                    cancelledAt: targetStatus === 'CANCELLED' ? new Date() : undefined,
                },
            });
            if (updated.count === 0) {
                throw new common_1.BadRequestException('Order status conflict — may have been updated by another request');
            }
            await tx.orderStatusHistory.create({
                data: {
                    orderId,
                    fromStatus: currentStatus,
                    toStatus: targetStatus,
                    note: dto.note ?? null,
                },
            });
            if (targetStatus === 'CANCELLED') {
                for (const item of order.items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stock: { increment: item.quantity } },
                    });
                }
            }
        });
        const pushMessage = ORDER_STATUS_MESSAGES[targetStatus];
        if (pushMessage) {
            await this.notificationService.sendPushToCustomer(order.buyerId, {
                title: pushMessage.title,
                body: pushMessage.body,
                data: { orderId, type: 'ORDER_STATUS', status: targetStatus },
            });
        }
        if (targetStatus === 'CANCELLED' && (isAdmin || (isSupplier && isVendorOwner))) {
        }
        if (targetStatus === 'CANCELLED' && isBuyer) {
            await this.notificationService.sendPushToVendor(order.vendor.id, {
                leadId: orderId,
                eventType: 'Order cancelled by customer',
                city: 'Order Update',
            });
        }
        this.logger.log(`Order ${orderId}: ${currentStatus} → ${targetStatus} by ${requesterRole} ${requesterId}`);
        return this.prisma.productOrder.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: { select: { id: true, name: true, pricePaise: true } },
                    },
                },
                vendor: { select: { id: true, businessName: true } },
                buyer: { select: { id: true, phone: true } },
                statusHistory: { orderBy: { changedAt: 'desc' } },
            },
        });
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = OrderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, bullmq_1.InjectQueue)('stock-alerts')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService,
        bullmq_2.Queue])
], OrderService);
//# sourceMappingURL=order.service.js.map