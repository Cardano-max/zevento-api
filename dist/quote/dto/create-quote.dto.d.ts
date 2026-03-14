export declare class LineItemDto {
    description: string;
    amountPaise: number;
    quantity?: number;
}
export declare class CreateQuoteDto {
    lineItems: LineItemDto[];
    validUntil: Date;
    note?: string;
}
