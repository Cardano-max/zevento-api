import { PrismaService } from '../prisma/prisma.service';
import { RazorpayService } from '../subscription/razorpay.service';
import { CommissionService } from './commission.service';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
export declare class PaymentService {
    private readonly prisma;
    private readonly razorpayService;
    private readonly commissionService;
    private readonly logger;
    constructor(prisma: PrismaService, razorpayService: RazorpayService, commissionService: CommissionService);
    createBookingOrder(bookingId: string, userId: string): Promise<{
        orderId: string;
        amount: string | number;
        currency: string;
        keyId: string;
    }>;
    createProductOrderPayment(orderId: string, userId: string): Promise<{
        orderId: string;
        amount: string | number;
        currency: string;
        keyId: string;
    }>;
    verifyPayment(dto: VerifyPaymentDto): Promise<{
        status: string;
        paymentId: string;
    }>;
}
