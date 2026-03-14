import { RegisterDeviceDto } from './dto/register-device.dto';
import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    registerDevice(user: any, dto: RegisterDeviceDto): Promise<{
        success: boolean;
    }>;
}
