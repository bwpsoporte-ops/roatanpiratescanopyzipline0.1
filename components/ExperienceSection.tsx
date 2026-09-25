'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Language, TourPackage } from '@/lib/types';
import { translations } from '@/lib/translations';
import { ExperienceModal } from './ExperienceModal';

interface ExperienceSectionProps {
  lang: Language;
  tours: TourPackage[];
  onBookTour: (tourId: string) => void;
}

export function ExperienceSection({ lang, tours, onBookTour }: ExperienceSectionProps) {
  const [selectedTour, setSelectedTour] = useState<TourPackage | null>(null);
  const t = translations[lang];

  return (
    <section id="experiencia" className="pirate-experience-section py-20 relative overflow-hidden">
      <div className="experience-ambient-mark" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Parchment-Style Main Showcase Container */}
        <div className="experience-chart text-[#241f17] p-6 sm:p-10 md:p-14 relative overflow-hidden">
          {/* Decorative Corner Accents */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#8c1d24]" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#8c1d24]" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#8c1d24]" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#8c1d24]" />

          <div className="experience-chart-header mb-12">
            <div className="experience-title-copy">
              <span className="experience-chart-badge">{t.experience.parchmentBadge}</span>
              <h2 id="experience-heading" className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">{t.experience.title}</h2>
              <span className="experience-ink-rule" aria-hidden="true" />
              <p className="text-base sm:text-lg leading-relaxed">{t.experience.description}</p>
            </div>
            <div className="experience-pirate-seal" aria-label={lang === 'es' ? 'Sello oficial de la expedición canopy' : 'Official canopy expedition seal'}>
              <span className="experience-seal-ring"><Image src="/brand/pirates-logo.png" alt="Pirates of the Caribbean Zipline" fill sizes="150px" className="object-contain" /></span>
              <strong>{lang === 'es' ? 'Expedición Oficial' : 'Official Expedition'}</strong>
              <small>Roatán · Honduras</small>
            </div>
          </div>

          {/* Primary Featured Tour Showcase */}
          {tours.length > 0 && (
            <div className="experience-feature-layout grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
              {/* Tour Photo */}
              <div className="experience-feature-photo lg:col-span-6 relative h-80 sm:h-96 overflow-hidden group">
                <Image
                  src={tours[0].imageUrl}
                  alt={tours[0].name[lang]}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs uppercase tracking-wider text-[#ffd778] font-bold block mb-0.5">
                    Roatán, Islas de la Bahía
                  </span>
                  <p className="font-heading text-xl font-bold">
                    {tours[0].name[lang]}
                  </p>
                </div>
              </div>

              {/* Course Highlights & Real Stats */}
              <div className="lg:col-span-6 space-y-6">
                <div className="experience-stats-panel p-5">
                  <h3 className="font-heading text-base font-bold text-[#1a140f] mb-3 uppercase tracking-wider">
                    {t.experience.quickStats}
                  </h3>
                  
                  {/* Real Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="experience-stat-tile p-3">
                      <span className="block text-2xl font-extrabold text-[#8c1d24]">
                        {tours[0].stats.ziplines}
                      </span>
                      <span className="text-[11px] font-semibold text-[#5c4e3c] uppercase">
                        {t.experience.stats.ziplines}
                      </span>
                    </div>

                    <div className="experience-stat-tile p-3">
                      <span className="block text-2xl font-extrabold text-[#8c1d24]">
                        {tours[0].stats.platforms}
                      </span>
                      <span className="text-[11px] font-semibold text-[#5c4e3c] uppercase">
                        {t.experience.stats.platforms}
                      </span>
                    </div>

                    <div className="experience-stat-tile p-3">
                      <span className="block text-sm sm:text-base font-extrabold text-[#8c1d24] mt-1">
                        {tours[0].stats.maxHeight}
                      </span>
                      <span className="text-[11px] font-semibold text-[#5c4e3c] uppercase">
                        {t.experience.stats.height}
                      </span>
                    </div>

                    <div className="experience-stat-tile p-3">
                      <span className="block text-sm sm:text-base font-extrabold text-[#8c1d24] mt-1">
                        {tours[0].stats.totalLength}
                      </span>
                      <span className="text-[11px] font-semibold text-[#5c4e3c] uppercase">
                        {t.experience.stats.length}
                      </span>
                    </div>

                    <div className="experience-stat-tile p-3">
                      <span className="block text-sm sm:text-base font-extrabold text-[#8c1d24] mt-1">
                        {tours[0].stats.duration}
                      </span>
                      <span className="text-[11px] font-semibold text-[#5c4e3c] uppercase">
                        {t.experience.stats.duration}
                      </span>
                    </div>

                    <div className="experience-stat-tile p-3">
                      <span className="block text-xs font-bold text-emerald-800 mt-1.5">
                        {tours[0].stats.difficulty[lang]}
                      </span>
                      <span className="text-[11px] font-semibold text-[#5c4e3c] uppercase">
                        {t.experience.stats.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Highlights checklist with clean editorial typography */}
                <div className="experience-highlights space-y-2.5">
                  <h4 className="font-heading text-xs font-bold text-[#1a140f] uppercase tracking-wider">
                    {t.experience.highlightsTitle}
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[#382e22]">
                    {t.experience.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#8c1d24] font-bold select-none">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap gap-4">
                  <button
                    type="button"
                    id="experience-see-more-btn"
                    onClick={() => setSelectedTour(tours[0])}
                    className="experience-primary-action px-6 py-3 text-sm font-bold tracking-wide"
                  >
                    {t.experience.seeMore}
                  </button>

                  <button
                    type="button"
                    onClick={() => onBookTour(tours[0].id)}
                    className="experience-secondary-action px-6 py-3 font-bold text-sm transition-colors"
                  >
                    {t.experience.bookTour} (${tours[0].priceAdult} USD)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Additional Tour Cards (if more than one circuit exists) */}
          {tours.length > 1 && (
            <div className="border-t border-[#b89f72]/40 pt-10">
              <h3 className="font-heading text-2xl font-bold text-[#1a140f] text-center mb-8">
                {t.experience.toursTitle}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tours.map((tour) => (
                  <div
                    key={tour.id}
                    className="experience-tour-note p-5 flex flex-col justify-between transition-shadow"
                  >
                    <div>
                      <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                        <Image
                          src={tour.imageUrl}
                          alt={tour.name[lang]}
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {tour.highlightBadge && (
                          <div className="absolute top-3 left-3 bg-[#8c1d24] text-[#ffd778] text-xs font-bold px-3 py-1 rounded-full uppercase">
                            {tour.highlightBadge[lang]}
                          </div>
                        )}
                      </div>
                      <h4 className="font-heading text-xl font-bold text-[#1a140f]">
                        {tour.name[lang]}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#5c4e3c] mt-1 mb-3">
                        {tour.subtitle[lang]}
                      </p>
                      <p className="text-xs text-[#382e22] line-clamp-3 mb-4">
                        {tour.description[lang]}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#b89f72]/30 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-[#5c4e3c] block">
                          {lang === 'es' ? 'Adulto' : 'Adult'}
                        </span>
                        <span className="text-xl font-extrabold text-[#8c1d24]">
                          ${tour.priceAdult} USD
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedTour(tour)}
                          className="px-4 py-2 text-xs font-bold rounded-full border border-[#8c1d24] text-[#8c1d24] hover:bg-[#8c1d24] hover:text-white transition-colors"
                        >
                          {t.experience.viewDetails}
                        </button>
                        <button
                          type="button"
                          onClick={() => onBookTour(tour.id)}
                          className="btn-wine-red px-4 py-2 text-xs font-bold rounded-full"
                        >
                          {t.experience.bookTour}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Standalone Deep-Dive Modal */}
      <ExperienceModal
        isOpen={Boolean(selectedTour)}
        onClose={() => setSelectedTour(null)}
        tour={selectedTour}
        lang={lang}
        onBookTour={onBookTour}
      />
    </section>
  );
}
