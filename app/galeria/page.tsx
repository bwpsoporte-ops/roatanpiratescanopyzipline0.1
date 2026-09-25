'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { PageHeader } from '@/components/PageHeader';
import { GallerySection } from '@/components/GallerySection';

export default function GaleriaPage() {
  const { lang, gallery } = useAppStore();

  return (
    <div className="bg-[#070b10] min-h-screen">
      {/* Page Header */}
      <PageHeader
        lang={lang}
        badge={lang === 'es' ? 'Recuerdos de Aventura' : 'Adventure Memories'}
        title={
          lang === 'es'
            ? 'Galería de Fotos y Videos'
            : 'Photo & Video Gallery'
        }
        subtitle={
          lang === 'es'
            ? 'Explora momentos reales de nuestros visitantes, vuelos sobre la selva, aventuras en el arrecife y la belleza natural de Roatán.'
            : 'Explore real guest moments, flights above the jungle, reef adventures and the natural beauty of Roatan.'
        }
        breadcrumbs={[
          {
            label: lang === 'es' ? 'Galería' : 'Gallery'
          }
        ]}
      />

      {/* Main Photo & Video Gallery with Fullscreen Lightbox */}
      <GallerySection
        lang={lang}
        gallery={gallery}
      />

      {/* Professional Photo & GoPro Package Info */}
      <section className="py-16 bg-[#0c131c] border-t border-[#c5a059]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#111923] border border-[#c5a059]/30 rounded-3xl p-8 sm:p-12">
            <div className="max-w-3xl">
              <span className="text-xs font-bold text-[#c5a059] uppercase tracking-widest block mb-2">
                {lang === 'es' ? 'Servicio Fotográfico Profesional' : 'Professional Photography Service'}
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-4">
                {lang === 'es'
                  ? 'Captura tu Vuelo en Alta Definición'
                  : 'Capture Your Flight in High Definition'}
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-6">
                {lang === 'es'
                  ? 'Nuestros fotógrafos oficiales están ubicados estratégicamente en las plataformas de mayor altura y velocidad para capturar expresiones épicas en acción. Al finalizar el circuito, puedes visualizar tus fotos en nuestras pantallas digitales y transferirlas directamente a tu teléfono móvil o memoria USB por un costo muy accesible.'
                  : 'Our official staff photographers are strategically stationed on the highest and fastest platforms to capture your most thrilling action moments. Upon completing the circuit, preview your shots on our viewing monitors and instantly transfer high-res photos to your smartphone or USB drive at an affordable rate.'}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/reservar"
                  className="btn-wine-red px-8 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase"
                >
                  {lang === 'es' ? 'Reservar mi Excursión' : 'Book My Excursion'}
                </Link>
                <Link
                  href="/contacto"
                  className="btn-gold-outline px-6 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase"
                >
                  {lang === 'es' ? 'Consultar Dudas' : 'Ask Questions'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
