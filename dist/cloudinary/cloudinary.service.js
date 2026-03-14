"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CloudinaryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const streamifier = require("streamifier");
let CloudinaryService = CloudinaryService_1 = class CloudinaryService {
    constructor() {
        this.logger = new common_1.Logger(CloudinaryService_1.name);
        this.isDevelopment = process.env.NODE_ENV === 'development';
    }
    isMockMode() {
        return (this.isDevelopment &&
            (!process.env.CLOUDINARY_CLOUD_NAME ||
                !process.env.CLOUDINARY_API_KEY ||
                !process.env.CLOUDINARY_API_SECRET));
    }
    async uploadImage(file, folder) {
        if (this.isMockMode()) {
            this.logger.warn('Cloudinary env vars not set — returning mock upload data (dev mode)');
            return {
                publicId: `dev-mock-${Date.now()}`,
                url: 'https://via.placeholder.com/400x300',
                width: 400,
                height: 300,
            };
        }
        try {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                    resource_type: 'image',
                    folder,
                    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
                }, (error, result) => {
                    if (error || !result) {
                        return reject(error || new Error('Upload failed'));
                    }
                    resolve(result);
                });
                streamifier.createReadStream(file.buffer).pipe(uploadStream);
            });
            return {
                publicId: result.public_id,
                url: result.secure_url,
                width: result.width,
                height: result.height,
            };
        }
        catch (error) {
            this.logger.error(`Cloudinary upload failed: ${error}`);
            throw new common_1.BadRequestException('Image upload failed. Please try again with a valid image file.');
        }
    }
    async deleteImage(publicId) {
        if (this.isMockMode()) {
            this.logger.warn(`Cloudinary mock: would delete ${publicId} (dev mode)`);
            return;
        }
        try {
            await cloudinary_1.v2.uploader.destroy(publicId);
        }
        catch (error) {
            this.logger.error(`Cloudinary delete failed for ${publicId}: ${error}`);
            throw new common_1.BadRequestException('Failed to delete image.');
        }
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = CloudinaryService_1 = __decorate([
    (0, common_1.Injectable)()
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map