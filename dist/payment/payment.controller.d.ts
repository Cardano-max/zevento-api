import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateProductOrderPaymentDto } from './dto/create-product-order-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { PaymentService } from './payment.service';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createOrder(dto: CreateOrderDto, user: JwtPayload): Promise<{
        orderId: string;
        amount: string | number;
        currency: string;
        keyId: string;
    }>;
    createProductOrderPayment(dto: CreateProductOrderPaymentDto, user: JwtPayload): Promise<{
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
