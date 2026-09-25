'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Language, SiteConfig } from '@/lib/types';
import { translations } from '@/lib/translations';

interface HeroProps {
  lang: Language;
  siteConfig: SiteConfig;
  onBookClick?: () => void;
  onExploreClick?: () => void;
}

export function Hero({ lang, siteConfig, onBookClick, onExploreClick }: HeroProps) {
  const t = translations[lang];

  return (
    <section
      id="inicio"
      className="relative min-h-[94vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#090e15]"
    >
      {/* Background Photography with authentic oceanic contrast */}
      <div className="absolute inset-0 z-0 select-none">
        <Image
          src="/image/homeweb.jpeg"
          alt="Guests enjoying the clear boat adventure in Roatan"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05080c]/95 via-[#071019]/75 to-[#05080c]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090e15] via-transparent to-[#090e15]/75" />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 text-left flex flex-col items-start">
        {/* Editorial Sub-badge */}
        <div className="inline-block px-4 py-1.5 rounded-full bg-[#111923]/90 border border-[#c5a059]/40 text-[#d4af37] text-xs font-semibold tracking-widest uppercase mb-6 shadow-sm">
          {t.hero.tag}
        </div>

        {/* Main Headline */}
        <h1
          id="hero-title"
          className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-white tracking-tight leading-[1.02] max-w-5xl drop-shadow-md"
        >
          {siteConfig.heroTitle[lang] || t.hero.title}
        </h1>

        {/* Subtitle */}
        <p
          id="hero-subtitle"
          className="mt-6 text-lg sm:text-xl text-gray-200 max-w-2xl font-normal leading-relaxed"
        >
          {siteConfig.heroSubtitle[lang] || t.hero.subtitle}
        </p>

        {/* Secondary Phrase */}
        <p className="mt-3 text-xs sm:text-sm text-[#d4af37] font-semibold tracking-widest uppercase">
          {siteConfig.heroSecondary[lang] || t.hero.secondary}
        </p>

        {/* Call to Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/reservar"
            id="hero-primary-book-btn"
            onClick={onBookClick}
            className="btn-wine-red w-full sm:w-auto px-9 py-3.5 rounded-full text-base font-bold tracking-wide transition-all shadow-lg hover:shadow-xl text-center"
          >
            {t.hero.ctaBook}
          </Link>

          <Link
            href="/experiencia"
            id="hero-secondary-explore-btn"
            onClick={onExploreClick}
            className="btn-gold-outline w-full sm:w-auto px-8 py-3.5 rounded-full text-base font-semibold tracking-wide transition-all text-center"
          >
            {t.hero.ctaExplore}
          </Link>
        </div>

        {/* Authentic Excursion Metrics - Professional editorial presentation */}
        <div
          id="hero-benefits-container"
          className="mt-14 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 border-t border-[#c5a059]/20 pt-8"
        >
          <div className="bg-[#101822]/80 border border-gray-800/80 rounded-xl p-4 text-center">
            <span className="block font-heading text-2xl sm:text-3xl font-bold text-[#ffd778]">
              370 lbs
            </span>
            <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider block mt-1">
              {lang === 'es' ? 'Peso Máximo' : 'Maximum Weight'}
            </span>
          </div>

          <div className="bg-[#101822]/80 border border-gray-800/80 rounded-xl p-4 text-center">
            <span className="block font-heading text-2xl sm:text-3xl font-bold text-[#ffd778]">
              1.5 hr
            </span>
            <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider block mt-1">
              {lang === 'es' ? 'Duración Aproximada' : 'Approx. Duration'}
            </span>
          </div>

          <div className="bg-[#101822]/80 border border-gray-800/80 rounded-xl p-4 text-center">
            <span className="block font-heading text-2xl sm:text-3xl font-bold text-[#ffd778]">
              66 in
            </span>
            <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider block mt-1">
              {lang === 'es' ? 'Cintura del Arnés' : 'Harness Waist Fit'}
            </span>
          </div>

          <div className="bg-[#101822]/80 border border-gray-800/80 rounded-xl p-4 text-center">
            <span className="block font-heading text-2xl sm:text-3xl font-bold text-[#ffd778]">
              EN / ES
            </span>
            <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider block mt-1">
              {lang === 'es' ? 'Guías Bilingües' : 'Bilingual Guides'}
            </span>
          </div>
        </div>

        {/* Cruise Guarantee - Editorial note */}
        <div className="mt-8 text-xs sm:text-sm text-gray-300 bg-[#0c141e]/90 px-5 py-2.5 rounded-full border border-gray-800 shadow-sm">
          <span className="text-[#d4af37] font-bold mr-2">•</span>
          <span>
            {lang === 'es'
              ? 'Garantía oficial de regreso a tiempo para pasajeros de Mahogany Bay y Coxen Hole'
              : 'Official on-time return guarantee for Mahogany Bay & Coxen Hole cruise guests'}
          </span>
        </div>
      </div>
    </section>
  );
}
