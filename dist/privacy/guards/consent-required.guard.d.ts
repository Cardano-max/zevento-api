import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConsentService } from '../consent.service';
import { AuditLogService } from '../audit-log.service';
export declare class ConsentRequiredGuard implements CanActivate {
    private readonly reflector;
    private readonly consentService;
    private readonly auditLogService;
    constructor(reflector: Reflector, consentService: ConsentService, auditLogService: AuditLogService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
