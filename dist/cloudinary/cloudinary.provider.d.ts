export declare const CLOUDINARY = "CLOUDINARY";
export declare const CloudinaryProvider: {
    provide: string;
    useFactory: () => import("cloudinary").ConfigOptions;
};
