export interface VendorScoreFactors {
    vendorId: string;
    subscriptionTier: string;
    averageRating: number;
    responseRate: number;
    locationMatch: boolean;
    fairnessCount: number;
}
