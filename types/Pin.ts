export type MapPin = {
  message: string;
  image?: string;
  latitude: number;
  longitude: number;
  category: 'demo' | 'short' | 'medium' | 'long' | 'superLong' | 'doubleLong';
  expiresAt: number;
  isBlockingRoute: boolean;
};