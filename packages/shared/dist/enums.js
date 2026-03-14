"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FulfillmentSource = exports.ProductOrderStatus = exports.PayoutStatus = exports.PaymentStatus = exports.LeadAssignmentStatus = exports.LeadStatus = exports.AdminNotificationType = exports.TransactionStatus = exports.TransactionType = exports.SubscriptionStatus = exports.SubscriptionTier = exports.KycDocumentType = exports.VendorStatus = exports.OnboardingStep = exports.WebhookEventStatus = exports.ConsentStatus = exports.ConsentType = exports.MarketStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["CUSTOMER"] = "CUSTOMER";
    Role["PLANNER"] = "PLANNER";
    Role["SUPPLIER"] = "SUPPLIER";
    Role["ADMIN"] = "ADMIN";
})(Role || (exports.Role = Role = {}));
var MarketStatus;
(function (MarketStatus) {
    MarketStatus["PLANNED"] = "PLANNED";
    MarketStatus["ACTIVE"] = "ACTIVE";
    MarketStatus["PAUSED"] = "PAUSED";
})(MarketStatus || (exports.MarketStatus = MarketStatus = {}));
var ConsentType;
(function (ConsentType) {
    ConsentType["PHONE_REVEAL"] = "PHONE_REVEAL";
    ConsentType["LEAD_CREATION"] = "LEAD_CREATION";
    ConsentType["DATA_PROCESSING"] = "DATA_PROCESSING";
})(ConsentType || (exports.ConsentType = ConsentType = {}));
var ConsentStatus;
(function (ConsentStatus) {
    ConsentStatus["GRANTED"] = "GRANTED";
    ConsentStatus["REVOKED"] = "REVOKED";
})(ConsentStatus || (exports.ConsentStatus = ConsentStatus = {}));
var WebhookEventStatus;
(function (WebhookEventStatus) {
    WebhookEventStatus["RECEIVED"] = "RECEIVED";
    WebhookEventStatus["PROCESSING"] = "PROCESSING";
    WebhookEventStatus["PROCESSED"] = "PROCESSED";
    WebhookEventStatus["FAILED"] = "FAILED";
})(WebhookEventStatus || (exports.WebhookEventStatus = WebhookEventStatus = {}));
// Phase 2: Vendor Onboarding & Subscriptions
var OnboardingStep;
(function (OnboardingStep) {
    OnboardingStep[OnboardingStep["REGISTERED"] = 1] = "REGISTERED";
    OnboardingStep[OnboardingStep["BUSINESS_DETAILS"] = 2] = "BUSINESS_DETAILS";
    OnboardingStep[OnboardingStep["PORTFOLIO"] = 3] = "PORTFOLIO";
    OnboardingStep[OnboardingStep["SERVICE_AREA"] = 4] = "SERVICE_AREA";
    OnboardingStep[OnboardingStep["KYC_SUBMITTED"] = 5] = "KYC_SUBMITTED";
})(OnboardingStep || (exports.OnboardingStep = OnboardingStep = {}));
var VendorStatus;
(function (VendorStatus) {
    VendorStatus["DRAFT"] = "DRAFT";
    VendorStatus["PENDING_KYC"] = "PENDING_KYC";
    VendorStatus["APPROVED"] = "APPROVED";
    VendorStatus["REJECTED"] = "REJECTED";
    VendorStatus["SUSPENDED"] = "SUSPENDED";
})(VendorStatus || (exports.VendorStatus = VendorStatus = {}));
var KycDocumentType;
(function (KycDocumentType) {
    KycDocumentType["AADHAAR"] = "AADHAAR";
    KycDocumentType["PAN"] = "PAN";
    KycDocumentType["GST_CERTIFICATE"] = "GST_CERTIFICATE";
})(KycDocumentType || (exports.KycDocumentType = KycDocumentType = {}));
var SubscriptionTier;
(function (SubscriptionTier) {
    SubscriptionTier["BASIC"] = "BASIC";
    SubscriptionTier["PREMIUM"] = "PREMIUM";
})(SubscriptionTier || (exports.SubscriptionTier = SubscriptionTier = {}));
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["CREATED"] = "CREATED";
    SubscriptionStatus["AUTHENTICATED"] = "AUTHENTICATED";
    SubscriptionStatus["ACTIVE"] = "ACTIVE";
    SubscriptionStatus["PENDING"] = "PENDING";
    SubscriptionStatus["HALTED"] = "HALTED";
    SubscriptionStatus["PAUSED"] = "PAUSED";
    SubscriptionStatus["CANCELLED"] = "CANCELLED";
    SubscriptionStatus["COMPLETED"] = "COMPLETED";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["SUBSCRIPTION"] = "SUBSCRIPTION";
    TransactionType["LEAD_PURCHASE"] = "LEAD_PURCHASE";
    TransactionType["BOOKING_COMMISSION"] = "BOOKING_COMMISSION";
    TransactionType["MARKETPLACE_SALE"] = "MARKETPLACE_SALE";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PAID"] = "PAID";
    TransactionStatus["FAILED"] = "FAILED";
    TransactionStatus["REFUNDED"] = "REFUNDED";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var AdminNotificationType;
(function (AdminNotificationType) {
    AdminNotificationType["KYC_SUBMISSION"] = "KYC_SUBMISSION";
    AdminNotificationType["DISPUTE"] = "DISPUTE";
})(AdminNotificationType || (exports.AdminNotificationType = AdminNotificationType = {}));
// Phase 3: Lead Routing Engine
var LeadStatus;
(function (LeadStatus) {
    LeadStatus["PENDING"] = "PENDING";
    LeadStatus["ROUTING"] = "ROUTING";
    LeadStatus["ROUTED"] = "ROUTED";
    LeadStatus["EXPIRED"] = "EXPIRED";
    LeadStatus["CANCELLED"] = "CANCELLED";
})(LeadStatus || (exports.LeadStatus = LeadStatus = {}));
var LeadAssignmentStatus;
(function (LeadAssignmentStatus) {
    LeadAssignmentStatus["PENDING"] = "PENDING";
    LeadAssignmentStatus["NOTIFIED"] = "NOTIFIED";
    LeadAssignmentStatus["ACCEPTED"] = "ACCEPTED";
    LeadAssignmentStatus["DECLINED"] = "DECLINED";
    LeadAssignmentStatus["EXPIRED"] = "EXPIRED";
})(LeadAssignmentStatus || (exports.LeadAssignmentStatus = LeadAssignmentStatus = {}));
// Phase 5: Payments and Commission Settlement
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["CAPTURED"] = "CAPTURED";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PayoutStatus;
(function (PayoutStatus) {
    PayoutStatus["PENDING"] = "PENDING";
    PayoutStatus["QUEUED"] = "QUEUED";
    PayoutStatus["PROCESSING"] = "PROCESSING";
    PayoutStatus["PROCESSED"] = "PROCESSED";
    PayoutStatus["REVERSED"] = "REVERSED";
    PayoutStatus["FAILED"] = "FAILED";
    PayoutStatus["PENDING_BANK_DETAILS"] = "PENDING_BANK_DETAILS";
})(PayoutStatus || (exports.PayoutStatus = PayoutStatus = {}));
// Phase 6: B2B Product Marketplace
var ProductOrderStatus;
(function (ProductOrderStatus) {
    ProductOrderStatus["PENDING"] = "PENDING";
    ProductOrderStatus["CONFIRMED"] = "CONFIRMED";
    ProductOrderStatus["DISPATCHED"] = "DISPATCHED";
    ProductOrderStatus["DELIVERED"] = "DELIVERED";
    ProductOrderStatus["CANCELLED"] = "CANCELLED";
})(ProductOrderStatus || (exports.ProductOrderStatus = ProductOrderStatus = {}));
var FulfillmentSource;
(function (FulfillmentSource) {
    FulfillmentSource["SUPPLIER"] = "SUPPLIER";
    FulfillmentSource["ZEVENTO"] = "ZEVENTO";
})(FulfillmentSource || (exports.FulfillmentSource = FulfillmentSource = {}));
//# sourceMappingURL=enums.js.map