import { FulfillmentSource } from '@zevento/shared';
export declare class CreateProductDto {
    name: string;
    categoryId: string;
    pricePaise: number;
    stock: number;
    lowStockThreshold?: number;
    moq?: number;
    description?: string;
    fulfillmentSource?: FulfillmentSource;
}
