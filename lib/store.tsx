'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type {
  Language,
  Reservation,
  ReservationStatus,
  PriceTier,
  TourPackage,
  GalleryItem,
  SiteConfig,
  ReviewItem,
  FaqItem
} from './types';
import {
  initialSiteConfig,
  initialTours,
  initialPrices,
  initialGallery,
  initialReviews,
  initialFaqs
} from './data';

const LEGACY_STORAGE_KEYS = [
  'potc_config_v2', 'potc_tours_v2', 'potc_prices_v1', 'potc_gallery_v2',
  'potc_reviews_v2', 'potc_faqs_v1', 'potc_reservations_v1', 'pirates_admin_users_v1'
];

type StoredContent = Partial<{
  siteConfig: SiteConfig;
  tours: TourPackage[];
  prices: PriceTier[];
  gallery: GalleryItem[];
  faqs: FaqItem[];
}>;

async function saveContent(key: string, value: unknown) {
  const response = await fetch('/api/content', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, value })
  });
  if (!response.ok) throw new Error(`Could not save ${key}`);
}

function useAppStoreHook() {
  const [lang, setLangState] = useState<Language>('en');
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(initialSiteConfig);
  const [tours, setTours] = useState<TourPackage[]>(initialTours);
  const [prices, setPrices] = useState<PriceTier[]>(initialPrices);
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('potc_lang_v1');
    if (savedLanguage === 'es' || savedLanguage === 'en') setLangState(savedLanguage);
    LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));

    let active = true;
    Promise.all([
      fetch('/api/content', { cache: 'no-store' }).then(async (response): Promise<StoredContent> => response.ok ? response.json() : {}),
      fetch('/api/reviews', { cache: 'no-store' }).then((response) => response.ok ? response.json() : [])
    ]).then(([content, publicReviews]) => {
      if (!active) return;
      if (content.siteConfig) setSiteConfig(content.siteConfig);
      if (content.tours) setTours(content.tours);
      if (content.prices) setPrices(content.prices);
      if (content.gallery) setGallery(content.gallery);
      if (content.faqs) setFaqs(content.faqs);
      setReviews(publicReviews);
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('potc_lang_v1', newLang);
  };

  const updateSiteConfig = (value: SiteConfig) => { setSiteConfig(value); void saveContent('siteConfig', value); };
  const updateTours = (value: TourPackage[]) => { setTours(value); void saveContent('tours', value); };
  const updatePrices = (value: PriceTier[]) => { setPrices(value); void saveContent('prices', value); };
  const updateGallery = (value: GalleryItem[]) => {
    const removed = gallery.filter((item) => !value.some((next) => next.id === item.id) && /^[0-9a-f-]{36}$/i.test(item.id));
    setGallery(value);
    void saveContent('gallery', value).catch(() => undefined);
    removed.forEach((item) => {
      void fetch('/api/admin/upload', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id }) });
    });
  };
  const updateFaqs = (value: FaqItem[]) => { setFaqs(value); void saveContent('faqs', value); };

  const updateReviews = (value: ReviewItem[]) => {
    setReviews(value);
    void fetch('/api/reviews', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value)
    });
  };

  const refreshAdminData = async () => {
    const [reservationResponse, reviewResponse] = await Promise.all([
      fetch('/api/reservations', { cache: 'no-store' }),
      fetch('/api/reviews?scope=admin', { cache: 'no-store' })
    ]);
    if (reservationResponse.ok) setReservations(await reservationResponse.json());
    if (reviewResponse.ok) setReviews(await reviewResponse.json());
  };

  const addReservation = async (booking: Omit<Reservation, 'id' | 'code' | 'createdAt'>): Promise<Reservation> => {
    const response = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });
    if (!response.ok) throw new Error('Reservation could not be created');
    const reservation = await response.json() as Reservation;
    setReservations((current) => [reservation, ...current]);
    return reservation;
  };

  const updateReservationStatus = (id: string, status: ReservationStatus) => {
    setReservations((current) => {
      const next = current.map((reservation) => reservation.id === id ? { ...reservation, status } : reservation);
      const changed = next.find((reservation) => reservation.id === id);
      if (changed) void fetch('/api/reservations', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(changed) });
      return next;
    });
  };

  const updateReservation = (reservation: Reservation) => {
    setReservations((current) => current.map((item) => item.id === reservation.id ? reservation : item));
    void fetch('/api/reservations', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reservation) });
  };

  const deleteReservation = async (id: string, credentials: { username: string; password: string }) => {
    const response = await fetch('/api/reservations', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...credentials })
    });
    if (!response.ok) return false;
    setReservations((current) => current.filter((reservation) => reservation.id !== id));
    return true;
  };

  return {
    lang, setLang,
    siteConfig, updateSiteConfig,
    tours, updateTours,
    prices, updatePrices,
    gallery, updateGallery,
    reviews, updateReviews,
    faqs, updateFaqs,
    reservations, addReservation, updateReservationStatus, updateReservation, deleteReservation,
    refreshAdminData,
    isAdminOpen, setIsAdminOpen
  };
}

export type AppStore = ReturnType<typeof useAppStoreHook>;
const StoreContext = createContext<AppStore | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const store = useAppStoreHook();
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useAppStore(): AppStore {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useAppStore must be used within a StoreProvider');
  return context;
}
