import { Request } from 'express';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { TransitionOrderStatusDto } from './dto/transition-order-status.dto';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    createOrder(dto: CreateOrderDto, user: JwtPayload): Promise<{
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
    getMyOrders(user: JwtPayload, page?: string, limit?: string): Promise<{
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
    getVendorOrders(req: Request & {
        vendorId: string;
    }, page?: string, limit?: string, status?: string): Promise<{
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
    getOrderById(id: string): Promise<{
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
    cancelOrder(id: string, user: JwtPayload): Promise<({
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
    transitionStatus(id: string, dto: TransitionOrderStatusDto, user: JwtPayload): Promise<({
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
