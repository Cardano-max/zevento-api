"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
let RedisService = RedisService_1 = class RedisService {
    constructor() {
        this.logger = new common_1.Logger(RedisService_1.name);
        this.client = null;
        this.useMemory = false;
        this.memStore = new Map();
    }
    onModuleInit() {
        const redisUrl = process.env.REDIS_URL;
        if (!redisUrl) {
            this.logger.warn('REDIS_URL not set — using in-memory store');
            this.useMemory = true;
            return;
        }
        this.client = new ioredis_1.default(redisUrl, {
            lazyConnect: true,
            retryStrategy: (times) => {
                if (times > 3) {
                    this.logger.warn('Redis unavailable — falling back to in-memory store');
                    this.useMemory = true;
                    return null;
                }
                return Math.min(times * 200, 1000);
            },
        });
        this.client.on('connect', () => this.logger.log('Connected to Redis'));
        this.client.on('error', (err) => {
            this.logger.error(`Redis error: ${err.message}`);
            this.useMemory = true;
        });
        this.client.connect().catch(() => {
            this.useMemory = true;
        });
    }
    onModuleDestroy() {
        if (this.client)
            this.client.disconnect();
    }
    memGet(key) {
        const entry = this.memStore.get(key);
        if (!entry)
            return null;
        if (entry.expiresAt && Date.now() > entry.expiresAt) {
            this.memStore.delete(key);
            return null;
        }
        return entry.value;
    }
    async get(key) {
        if (this.useMemory || !this.client)
            return this.memGet(key);
        try {
            return await this.client.get(key);
        }
        catch {
            return this.memGet(key);
        }
    }
    async set(key, value, ttlSeconds) {
        if (this.useMemory || !this.client) {
            this.memStore.set(key, { value, expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null });
            return;
        }
        try {
            if (ttlSeconds)
                await this.client.set(key, value, 'EX', ttlSeconds);
            else
                await this.client.set(key, value);
        }
        catch {
            this.memStore.set(key, { value, expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null });
        }
    }
    async del(key) {
        this.memStore.delete(key);
        if (this.client && !this.useMemory) {
            try {
                await this.client.del(key);
            }
            catch { }
        }
    }
    async incr(key) {
        if (this.useMemory || !this.client) {
            const cur = parseInt(this.memGet(key) ?? '0', 10) + 1;
            const existing = this.memStore.get(key);
            this.memStore.set(key, { value: String(cur), expiresAt: existing?.expiresAt ?? null });
            return cur;
        }
        try {
            return await this.client.incr(key);
        }
        catch {
            const cur = parseInt(this.memGet(key) ?? '0', 10) + 1;
            this.memStore.set(key, { value: String(cur), expiresAt: null });
            return cur;
        }
    }
    async expire(key, ttlSeconds) {
        const existing = this.memStore.get(key);
        if (existing) {
            this.memStore.set(key, { ...existing, expiresAt: Date.now() + ttlSeconds * 1000 });
        }
        if (this.client && !this.useMemory) {
            try {
                await this.client.expire(key, ttlSeconds);
            }
            catch { }
        }
    }
    async ttl(key) {
        if (this.useMemory || !this.client) {
            const entry = this.memStore.get(key);
            if (!entry?.expiresAt)
                return -1;
            return Math.max(0, Math.floor((entry.expiresAt - Date.now()) / 1000));
        }
        try {
            return await this.client.ttl(key);
        }
        catch {
            return -1;
        }
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)()
], RedisService);
//# sourceMappingURL=redis.service.js.map