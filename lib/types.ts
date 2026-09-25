export type Language = 'es' | 'en';

export type ReservationStatus = 
  | 'Pendiente'
  | 'Contactado'
  | 'Confirmado'
  | 'Depósito pendiente'
  | 'Pagado'
  | 'Completado'
  | 'Cancelado'
  | 'No se presentó';

export interface Reservation {
  id: string;
  code: string;
  createdAt: string;
  customerName: string;
  phone: string;
  email: string;
  date: string;
  timeSlot: string;
  adults: number;
  children: number;
  tourId: string;
  tourName: string;
  lodgingType: 'Hotel' | 'Airbnb' | 'Crucero' | 'Residente';
  hotelOrAddress?: string;
  needsTransport: boolean;
  transportPickupLocation?: string;
  // Cruise passenger specific fields
  isCruisePassenger: boolean;
  shipName?: string;
  arrivalPort?: 'Mahogany Bay' | 'Coxen Hole (Town Center)' | 'Otro';
  shipArrivalTime?: string;
  shipDepartureTime?: string;
  cruisePassengersCount?: number;
  // Additional details
  specialRequests?: string;
  status: ReservationStatus;
  totalAmount: number;
  paidAmount: number;
  internalNotes?: string;
}

export interface TourPackage {
  id: string;
  name: {
    es: string;
    en: string;
  };
  subtitle: {
    es: string;
    en: string;
  };
  description: {
    es: string;
    en: string;
  };
  highlightBadge?: {
    es: string;
    en: string;
  };
  imageUrl: string;
  stats: {
    ziplines: number;
    platforms: number;
    maxHeight: string; // e.g. "320 ft / 98 m"
    totalLength: string; // e.g. "2 millas / 3.2 km"
    duration: string; // e.g. "1.5 - 2 horas"
    difficulty: {
      es: string;
      en: string;
    };
  };
  features: {
    es: string[];
    en: string[];
  };
  priceAdult: number;
  priceChild: number;
  currency: string;
  isAvailable: boolean;
}

export interface PriceTier {
  id: string;
  title: {
    es: string;
    en: string;
  };
  ageRange: {
    es: string;
    en: string;
  };
  price: number;
  currency: string;
  tag?: {
    es: string;
    en: string;
  };
  isPopular?: boolean;
  included: {
    es: string[];
    en: string[];
  };
  conditions: {
    es: string;
    en: string;
  };
}

export interface GalleryItem {
  id: string;
  title: {
    es: string;
    en: string;
  };
  category: 'tirolesas' | 'plataformas' | 'visitantes' | 'paisajes' | 'instalaciones' | 'guias' | 'videos';
  imageUrl: string;
  videoUrl?: string;
  isFeatured: boolean;
  type: 'image' | 'video';
}

export interface ReviewItem {
  id: string;
  name: string;
  location: string;
  email?: string;
  country?: string;
  countryCode?: string;
  rating: number;
  date: string;
  tour: string;
  comment: {
    es: string;
    en: string;
  };
  avatarUrl?: string;
  isVerified: boolean;
  isActive: boolean;
}

export interface FaqItem {
  id: string;
  question: {
    es: string;
    en: string;
  };
  answer: {
    es: string;
    en: string;
  };
  category?: string;
}

export interface SiteConfig {
  companyName: string;
  tagline: {
    es: string;
    en: string;
  };
  heroTitle: {
    es: string;
    en: string;
  };
  heroSubtitle: {
    es: string;
    en: string;
  };
  heroSecondary: {
    es: string;
    en: string;
  };
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  municipality: string;
  department: string;
  country: string;
  openingHours: {
    es: string;
    en: string;
  };
  facebookUrl: string;
  instagramUrl: string;
  tripadvisorUrl: string;
  googleMapsUrl: string;
  cruisePortNotes: {
    es: string;
    en: string;
  };
}

export type AdminRole = 
  | 'Administrador general'
  | 'Encargado de reservaciones'
  | 'Caja'
  | 'Marketing'
  | 'Solo lectura';

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
  isRoot?: boolean;
}
