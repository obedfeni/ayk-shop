export const COLORS = {
  primary: '#D97706',
  primaryDark: '#B45309',
  primaryLight: '#FCD34D',
  accent: '#EC4899',
  success: '#10B981',
  danger: '#EF4444',
  text: '#1C1917',
  textSoft: '#78716C',
  textMuted: '#A8A29E',
  bg: '#FEFCE8',
  surface: '#FFFBEB',
  border: '#E7E5E4',
};

export const FONTS = {
  serif: 'Georgia, Cambria, serif',
  sans: 'Inter, system-ui, sans-serif',
};

export const BUSINESS = {
  name: process.env.NEXT_PUBLIC_BUSINESS_NAME || 'AYK Jewelry',
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+233541234567',
  currency: process.env.NEXT_PUBLIC_CURRENCY || 'GHS',
  maxImages: 3,
  maxQuantity: 50,
};

export const CATEGORIES = ['All', 'Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Sets'];
