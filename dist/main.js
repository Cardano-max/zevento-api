"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { rawBody: true });
    const staticOrigins = process.env.CORS_ORIGINS
        ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
        : [
            'http://localhost:3000',
            'http://localhost:3002',
            'http://localhost:3003',
        ];
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (origin.endsWith('.vercel.app'))
                return callback(null, true);
            if (staticOrigins.includes(origin))
                return callback(null, true);
            callback(new Error('Not allowed by CORS'));
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
    app.useWebSocketAdapter(new platform_socket_io_1.IoAdapter(app));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Zevento Pro API')
        .setDescription('Zevento Pro — India\'s multi-sided event marketplace API.\n\n' +
        '## Authentication\n' +
        '1. Send OTP: `POST /auth/otp/send` with `{ "phone": "+919876543210" }`\n' +
        '2. Verify OTP: `POST /auth/otp/verify` with `{ "phone": "+919876543210", "otp": "123456" }` (in dev mode, OTP is logged to console)\n' +
        '3. Copy the `accessToken` from the response\n' +
        '4. Click **Authorize** button above → paste `Bearer <your-token>`\n\n' +
        '## Roles\n' +
        '- **CUSTOMER** — Browse vendors, submit inquiries, accept quotes, pay for bookings\n' +
        '- **PLANNER** — Event planner vendor role (decorators, organizers)\n' +
        '- **SUPPLIER** — B2B product supplier role\n' +
        '- **ADMIN** — Platform management, analytics, overrides\n\n' +
        '## Test Flow\n' +
        '1. Register & get token → 2. Browse categories/vendors → 3. Submit inquiry → 4. (As vendor) Accept lead, submit quote → 5. (As customer) Accept quote → 6. Pay for booking')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
        .addTag('Auth', 'OTP-based authentication (no guards)')
        .addTag('Customer Browsing', 'Public endpoints — browse categories, vendors (no auth)')
        .addTag('Leads', 'Submit and view event inquiries')
        .addTag('Vendor Profile', 'Vendor onboarding and profile management')
        .addTag('Subscriptions', 'Vendor subscription billing via Razorpay')
        .addTag('Vendor Inbox', 'Real-time lead inbox — accept/decline leads')
        .addTag('Quotes', 'Quote creation, submission, comparison, acceptance')
        .addTag('Bookings', 'Booking status management and vendor calendar')
        .addTag('Payments', 'Payment orders, verification, and webhooks')
        .addTag('Reviews', 'Post-booking reviews and vendor responses')
        .addTag('Products', 'Supplier product catalog management')
        .addTag('Product Catalog', 'Public product browsing (no auth)')
        .addTag('Orders', 'B2B product orders and lifecycle')
        .addTag('Privacy', 'Consent management and audit trail')
        .addTag('Notifications', 'Device token registration for push notifications')
        .addTag('Admin', 'Platform management — users, vendors, KYC, payments, analytics')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document, {
        customSiteTitle: 'Zevento Pro API — Interactive Testing',
        swaggerOptions: {
            persistAuthorization: true,
            docExpansion: 'none',
            filter: true,
            tagsSorter: 'alpha',
        },
    });
    const httpAdapter = app.getHttpAdapter();
    httpAdapter.get('/health', (_req, res) => {
        res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`Zevento API running on http://localhost:${port}`);
    console.log(`Swagger UI: http://localhost:${port}/api-docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map