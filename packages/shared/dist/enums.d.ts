export declare enum Role {
    CUSTOMER = "CUSTOMER",
    PLANNER = "PLANNER",
    SUPPLIER = "SUPPLIER",
    ADMIN = "ADMIN"
}
export declare enum MarketStatus {
    PLANNED = "PLANNED",
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED"
}
export declare enum ConsentType {
    PHONE_REVEAL = "PHONE_REVEAL",
    LEAD_CREATION = "LEAD_CREATION",
    DATA_PROCESSING = "DATA_PROCESSING"
}
export declare enum ConsentStatus {
    GRANTED = "GRANTED",
    REVOKED = "REVOKED"
}
export declare enum WebhookEventStatus {
    RECEIVED = "RECEIVED",
    PROCESSING = "PROCESSING",
    PROCESSED = "PROCESSED",
    FAILED = "FAILED"
}
export declare enum OnboardingStep {
    REGISTERED = 1,
    BUSINESS_DETAILS = 2,
    PORTFOLIO = 3,
    SERVICE_AREA = 4,
    KYC_SUBMITTED = 5
}
export declare enum VendorStatus {
    DRAFT = "DRAFT",
    PENDING_KYC = "PENDING_KYC",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    SUSPENDED = "SUSPENDED"
}
export declare enum KycDocumentType {
    AADHAAR = "AADHAAR",
    PAN = "PAN",
    GST_CERTIFICATE = "GST_CERTIFICATE"
}
export declare enum SubscriptionTier {
    BASIC = "BASIC",
    PREMIUM = "PREMIUM"
}
export declare enum SubscriptionStatus {
    CREATED = "CREATED",
    AUTHENTICATED = "AUTHENTICATED",
    ACTIVE = "ACTIVE",
    PENDING = "PENDING",
    HALTED = "HALTED",
    PAUSED = "PAUSED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED"
}
export declare enum TransactionType {
    SUBSCRIPTION = "SUBSCRIPTION",
    LEAD_PURCHASE = "LEAD_PURCHASE",
    BOOKING_COMMISSION = "BOOKING_COMMISSION",
    MARKETPLACE_SALE = "MARKETPLACE_SALE"
}
export declare enum TransactionStatus {
    PAID = "PAID",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}
export declare enum AdminNotificationType {
    KYC_SUBMISSION = "KYC_SUBMISSION",
    DISPUTE = "DISPUTE"
}
export declare enum LeadStatus {
    PENDING = "PENDING",
    ROUTING = "ROUTING",
    ROUTED = "ROUTED",
    EXPIRED = "EXPIRED",
    CANCELLED = "CANCELLED"
}
export declare enum LeadAssignmentStatus {
    PENDING = "PENDING",
    NOTIFIED = "NOTIFIED",
    ACCEPTED = "ACCEPTED",
    DECLINED = "DECLINED",
    EXPIRED = "EXPIRED"
}
export declare enum PaymentStatus {
    PENDING = "PENDING",
    CAPTURED = "CAPTURED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}
export declare enum PayoutStatus {
    PENDING = "PENDING",
    QUEUED = "QUEUED",
    PROCESSING = "PROCESSING",
    PROCESSED = "PROCESSED",
    REVERSED = "REVERSED",
    FAILED = "FAILED",
    PENDING_BANK_DETAILS = "PENDING_BANK_DETAILS"
}
export declare enum ProductOrderStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    DISPATCHED = "DISPATCHED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED"
}
export declare enum FulfillmentSource {
    SUPPLIER = "SUPPLIER",
    ZEVENTO = "ZEVENTO"
}
//# sourceMappingURL=enums.d.ts.map