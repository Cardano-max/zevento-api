export declare class ContactMaskingService {
    maskPhone(phone: string): string;
    maskEmail(email: string): string;
    maskUserData(userData: any, fieldsToMask: string[]): any;
    shouldMaskForRole(viewerRole: string, dataOwnerRole: string): boolean;
}
