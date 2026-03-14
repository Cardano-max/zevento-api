import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ContactMaskingService } from '../contact-masking.service';
import { ConsentService } from '../consent.service';
export declare class MaskPhoneInterceptor implements NestInterceptor {
    private readonly contactMaskingService;
    private readonly consentService;
    constructor(contactMaskingService: ContactMaskingService, consentService: ConsentService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
