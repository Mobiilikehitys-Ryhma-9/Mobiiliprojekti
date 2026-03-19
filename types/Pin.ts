export type MapPin = {
  message: string
  image?: string
  latitude: number
  longitude: number
  category: 'short' | 'medium' | 'long'
  expiresAt: number
};