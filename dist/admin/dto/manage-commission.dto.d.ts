export declare class CreateCommissionRateDto {
    categoryId?: string;
    vendorRole?: string;
    rateBps: number;
    effectiveFrom?: string;
    effectiveTo?: string;
}
export declare class UpdateCommissionRateDto {
    rateBps?: number;
    effectiveTo?: string;
}
