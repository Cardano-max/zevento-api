export declare class OrderItemDto {
    productId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    vendorId: string;
    items: OrderItemDto[];
    shippingAddress?: string;
    note?: string;
}
