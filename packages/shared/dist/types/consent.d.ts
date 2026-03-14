export interface ConsentRecord {
    id: string;
    userId: string;
    consentType: string;
    status: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}
export interface ConsentCheckResult {
    hasConsent: boolean;
    grantedAt?: Date;
    consentType: string;
}
//# sourceMappingURL=consent.d.ts.map