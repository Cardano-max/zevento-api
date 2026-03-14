export interface CloudinaryUploadResult {
    publicId: string;
    url: string;
    width: number;
    height: number;
}
export declare class CloudinaryService {
    private readonly logger;
    private readonly isDevelopment;
    private isMockMode;
    uploadImage(file: Express.Multer.File, folder: string): Promise<CloudinaryUploadResult>;
    deleteImage(publicId: string): Promise<void>;
}
