export declare const CONSENT_KEY = "requires_consent";
export interface ConsentMetadata {
    consentType: string;
    targetUserIdParam: string;
}
export declare const RequiresConsent: (consentType: string, targetUserIdParam?: string) => import("@nestjs/common").CustomDecorator<string>;
