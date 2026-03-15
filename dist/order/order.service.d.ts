import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { TransitionOrderStatusDto } from './dto/transition-order-status.dto';
export declare class OrderService {
    private readonly prisma;
    private readonly notificationService;
    private readonly stockAlertQueue;
    private readonly logger;
    constructor(prisma: PrismaService, notificationService: NotificationService, stockAlertQueue: Queue);
    createOrder(buyerId: string, dto: CreateOrderDto): Promise<{
        items: ({
            product: {
                id: string;
                name: string;
                pricePaise: number;
            };
        } & {
            id: string;
            totalPaise: number;
            quantity: number;
            orderId: string;
            productId: string;
            unitPaise: number;
        })[];
        vendor: {
            id: string;
            businessName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        vendorId: string;
        razorpayOrderId: string | null;
        confirmedAt: Date | null;
        cancelledAt: Date | null;
        paymentStatus: string | null;
        commissionRateBps: number | null;
        note: string | null;
        totalPaise: number;
        buyerId: string;
        shippingAddress: string | null;
        dispatchedAt: Date | null;
        deliveredAt: Date | null;
    }>;
    getOrderById(orderId: string): Promise<{
        items: ({
            product: {
                id: string;
                name: string;
                pricePaise: number;
                images: {
                    cloudinaryUrl: string;
                }[];
            };
        } & {
            id: string;
            totalPaise: number;
            quantity: number;
            orderId: string;
            productId: string;
            unitPaise: number;
        })[];
        vendor: {
            id: string;
            businessName: string;
        };
        statusHistory: {
            id: string;
            note: string | null;
            changedAt: Date;
            fromStatus: string | null;
            toStatus: string;
            orderId: string;
        }[];
        buyer: {
            phone: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        vendorId: string;
        razorpayOrderId: string | null;
        confirmedAt: Date | null;
        cancelledAt: Date | null;
        paymentStatus: string | null;
        commissionRateBps: number | null;
        note: string | null;
        totalPaise: number;
        buyerId: string;
        shippingAddress: string | null;
        dispatchedAt: Date | null;
        deliveredAt: Date | null;
    }>;
    getMyOrders(buyerId: string, page: number, limit: number): Promise<{
        data: ({
            _count: {
                items: number;
            };
            vendor: {
                id: string;
                businessName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            vendorId: string;
            razorpayOrderId: string | null;
            confirmedAt: Date | null;
            cancelledAt: Date | null;
            paymentStatus: string | null;
            commissionRateBps: number | null;
            note: string | null;
            totalPaise: number;
            buyerId: string;
            shippingAddress: string | null;
            dispatchedAt: Date | null;
            deliveredAt: Date | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getVendorOrders(vendorId: string, page: number, limit: number, status?: string): Promise<{
        data: ({
            _count: {
                items: number;
            };
            buyer: {
                phone: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            vendorId: string;
            razorpayOrderId: string | null;
            confirmedAt: Date | null;
            cancelledAt: Date | null;
            paymentStatus: string | null;
            commissionRateBps: number | null;
            note: string | null;
            totalPaise: number;
            buyerId: string;
            shippingAddress: string | null;
            dispatchedAt: Date | null;
            deliveredAt: Date | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    cancelOrder(orderId: string, requesterId: string, requesterRole: string): Promise<({
        items: ({
            product: {
                id: string;
                name: string;
                pricePaise: number;
            };
        } & {
            id: string;
            totalPaise: number;
            quantity: number;
            orderId: string;
            productId: string;
            unitPaise: number;
        })[];
        vendor: {
            id: string;
            businessName: string;
        };
        statusHistory: {
            id: string;
            note: string | null;
            changedAt: Date;
            fromStatus: string | null;
            toStatus: string;
            orderId: string;
        }[];
        buyer: {
            phone: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        vendorId: string;
        razorpayOrderId: string | null;
        confirmedAt: Date | null;
        cancelledAt: Date | null;
        paymentStatus: string | null;
        commissionRateBps: number | null;
        note: string | null;
        totalPaise: number;
        buyerId: string;
        shippingAddress: string | null;
        dispatchedAt: Date | null;
        deliveredAt: Date | null;
    }) | null>;
    transitionOrderStatus(orderId: string, dto: TransitionOrderStatusDto, requesterId: string, requesterRole: string): Promise<({
        items: ({
            product: {
                id: string;
                name: string;
                pricePaise: number;
            };
        } & {
            id: string;
            totalPaise: number;
            quantity: number;
            orderId: string;
            productId: string;
            unitPaise: number;
        })[];
        vendor: {
            id: string;
            businessName: string;
        };
        statusHistory: {
            id: string;
            note: string | null;
            changedAt: Date;
            fromStatus: string | null;
            toStatus: string;
            orderId: string;
        }[];
        buyer: {
            phone: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        vendorId: string;
        razorpayOrderId: string | null;
        confirmedAt: Date | null;
        cancelledAt: Date | null;
        paymentStatus: string | null;
        commissionRateBps: number | null;
        note: string | null;
        totalPaise: number;
        buyerId: string;
        shippingAddress: string | null;
        dispatchedAt: Date | null;
        deliveredAt: Date | null;
    }) | null>;
}
