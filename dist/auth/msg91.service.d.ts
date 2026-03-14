export declare class Msg91Service {
    private readonly logger;
    private readonly isDevelopment;
    sendOtp(phone: string, otp: string): Promise<void>;
}
