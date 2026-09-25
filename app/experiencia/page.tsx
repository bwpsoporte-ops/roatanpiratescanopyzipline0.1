'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { PageHeader } from '@/components/PageHeader';
import { ExperienceSection } from '@/components/ExperienceSection';
import { SafetySection } from '@/components/SafetySection';
import { AboutSection } from '@/components/AboutSection';

export default function ExperienciaPage() {
  const router = useRouter();
  const { lang, tours } = useAppStore();

  const handleBookTour = (tourId: string) => {
    router.push(`/reservar?tour=${tourId}`);
  };

  return (
    <div className="bg-[#070b10] min-h-screen">
      {/* Page Header */}
      <PageHeader
        lang={lang}
        badge={lang === 'es' ? 'Canopy & Aventura' : 'Canopy & Adventure'}
        title={
          lang === 'es'
            ? 'La Experiencia • Circuito de Canopy Zipline'
            : 'The Experience • Canopy Zipline Circuit'
        }
        subtitle={
          lang === 'es'
            ? 'Siente la libertad de volar entre las copas de la selva tropical de Roatán con 9 cables de alta velocidad, 18 plataformas en los árboles y vistas panorámicas de ambos costados del mar Caribe.'
            : 'Feel the thrill of gliding over Roatan’s tropical rainforest canopy with 9 high-speed cables, 18 treetop platforms, and panoramic views of both sides of the Caribbean Sea.'
        }
        breadcrumbs={[
          {
            label: lang === 'es' ? 'La Experiencia' : 'The Experience'
          }
        ]}
      />

      {/* Main Experience & Tours Section */}
      <ExperienceSection
        lang={lang}
        tours={tours}
        onBookTour={handleBookTour}
      />

      {/* Technical Safety Standards & Petzl Equipment */}
      <SafetySection lang={lang} />

      {/* Practical Guide: What to bring & requirements */}
      <section className="py-16 bg-[#0c131c] border-t border-[#c5a059]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#c5a059] uppercase tracking-widest block mb-2">
              {lang === 'es' ? 'Guía del Viajero' : 'Traveler Guide'}
            </span>
            <h2 className="font-heading text-3xl font-bold text-white">
              {lang === 'es' ? 'Requisitos y Qué Llevar' : 'Requirements & What to Bring'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#111923] border border-gray-800 p-6 rounded-2xl">
              <span className="text-xs font-bold text-[#ffd778] uppercase tracking-widest block mb-3">
                01. {lang === 'es' ? 'Vestimenta recomendada' : 'Recommended Attire'}
              </span>
              <p className="text-sm text-gray-300 leading-relaxed">
                {lang === 'es'
                  ? 'Zapatos cerrados obligatorios (tenis o botas de senderismo). Ropa deportiva cómoda, bermudas o pantalones cortos. Amarrar el cabello largo y evitar accesorios sueltos.'
                  : 'Closed-toe shoes required (sneakers or hiking shoes). Comfortable activewear, shorts or bermudas. Secure long hair and remove dangling jewelry.'}
              </p>
            </div>

            <div className="bg-[#111923] border border-gray-800 p-6 rounded-2xl">
              <span className="text-xs font-bold text-[#ffd778] uppercase tracking-widest block mb-3">
                02. {lang === 'es' ? 'Límites de peso y edad' : 'Weight & Age Limits'}
              </span>
              <p className="text-sm text-gray-300 leading-relaxed">
                {lang === 'es'
                  ? 'Peso mínimo de 40 lbs (aprox. 5 años) y máximo de 300 lbs. Los niños menores de 8 años o de bajo peso pueden deslizarse en tándem de forma segura junto a un guía profesional certificado.'
                  : 'Minimum weight 40 lbs (approx. 5 yrs old) and maximum 300 lbs. Children under 8 or lightweight flyers can safely fly tandem secured to a certified professional guide.'}
              </p>
            </div>

            <div className="bg-[#111923] border border-gray-800 p-6 rounded-2xl">
              <span className="text-xs font-bold text-[#ffd778] uppercase tracking-widest block mb-3">
                03. {lang === 'es' ? 'Instalaciones y casilleros' : 'Lockers & Facilities'}
              </span>
              <p className="text-sm text-gray-300 leading-relaxed">
                {lang === 'es'
                  ? 'Contamos con casilleros de seguridad gratuitos para bolsos y teléfonos, sanitarios impecables, restaurante y bar con bebidas frías de coco y frutas locales.'
                  : 'Complimentary secure lockers available for backpacks and phones, pristine restrooms, and an open-air restaurant bar with cold tropical coconut and fresh fruit drinks.'}
              </p>
            </div>
          </div>

          {/* Direct CTA Banner */}
          <div className="mt-12 bg-gradient-to-r from-[#141d27] via-[#1a2533] to-[#141d27] border border-[#c5a059]/40 p-8 rounded-2xl text-center flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h3 className="text-xl font-bold text-white font-heading">
                {lang === 'es' ? '¿Listo para lanzarte en la tirolesa?' : 'Ready to fly through the canopy?'}
              </h3>
              <p className="text-sm text-gray-300 mt-1">
                {lang === 'es'
                  ? 'Asegura tu cupo con anticipación y garantía de regreso a tiempo para cruceros.'
                  : 'Secure your spot in advance with on-time return guarantee for all cruise ships.'}
              </p>
            </div>
            <Link
              href="/reservar"
              className="btn-wine-red px-8 py-3.5 rounded-full text-sm font-bold tracking-wide shrink-0"
            >
              {lang === 'es' ? 'Reservar Esta Experiencia' : 'Book This Experience'}
            </Link>
          </div>
        </div>
      </section>

      {/* About Section: Guides & History */}
      <AboutSection lang={lang} />
    </div>
  );
}
