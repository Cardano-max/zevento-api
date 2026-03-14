export declare enum KycAction {
    APPROVE = "APPROVE",
    REJECT = "REJECT"
}
export declare class ReviewKycDto {
    action: KycAction;
    rejectionReason?: string;
}
