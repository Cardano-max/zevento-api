export declare enum VendorRole {
    PLANNER = "PLANNER",
    SUPPLIER = "SUPPLIER"
}
export declare enum PlanTier {
    BASIC = "BASIC",
    PREMIUM = "PREMIUM"
}
export declare class CreatePlanDto {
    name: string;
    vendorRole: VendorRole;
    tier: PlanTier;
    amountPaise: number;
    periodMonths?: number;
    features?: Record<string, unknown>;
}
export declare class UpdatePlanDto {
    name?: string;
    amountPaise?: number;
    features?: Record<string, unknown>;
    isActive?: boolean;
}
