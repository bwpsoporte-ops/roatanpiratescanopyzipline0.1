'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Language, SiteConfig } from '@/lib/types';
import { translations } from '@/lib/translations';

interface LocationSectionProps {
  lang: Language;
  siteConfig: SiteConfig;
}

export function LocationSection({ lang, siteConfig }: LocationSectionProps) {
  const t = translations[lang];

  return (
    <section id="ubicacion" className="py-24 bg-[#090e15] relative text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#162230] border border-[#c5a059]/40 text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-3">
            {t.location.badge}
          </span>
          <h2
            id="location-heading"
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white"
          >
            {t.location.title}
          </h2>
          <div className="w-20 h-1 bg-[#d4af37] mx-auto my-4 rounded-full" />
          <p className="text-base sm:text-lg text-gray-300">
            {t.location.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Column 1: Location & Contact Details */}
          <div className="lg:col-span-6 bg-[#101822] border border-[#c5a059]/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <h3 className="font-heading text-2xl font-bold text-[#d4af37] mb-6">
                {t.location.infoTitle}
              </h3>

              <div className="space-y-4 text-sm text-gray-300">
                <div className="p-4 bg-[#151f2c] rounded-xl border border-gray-800">
                  <span className="text-xs uppercase tracking-wider text-[#ffd778] font-bold block mb-1">
                    {t.location.addressLabel}
                  </span>
                  <span className="text-white font-medium text-sm leading-relaxed block">
                    {siteConfig.address}, {siteConfig.municipality}, {siteConfig.department}, {siteConfig.country}
                  </span>
                </div>

                <div className="p-4 bg-[#151f2c] rounded-xl border border-gray-800">
                  <span className="text-xs uppercase tracking-wider text-[#ffd778] font-bold block mb-1">
                    {t.location.hoursLabel}
                  </span>
                  <span className="text-white font-medium text-sm block">
                    {siteConfig.openingHours[lang]}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 bg-[#151f2c] rounded-xl border border-gray-800">
                    <span className="text-xs text-gray-400 block mb-1 uppercase font-semibold">
                      {t.location.phoneLabel}
                    </span>
                    <a href={`tel:${siteConfig.phone}`} className="font-bold text-white hover:text-[#ffd778] block">
                      {siteConfig.phone}
                    </a>
                  </div>

                  <div className="p-4 bg-[#151f2c] rounded-xl border border-gray-800">
                    <span className="text-xs text-gray-400 block mb-1 uppercase font-semibold">
                      {t.location.whatsappLabel}
                    </span>
                    <a
                      href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-emerald-400 hover:text-emerald-300 block"
                    >
                      {siteConfig.whatsapp}
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-[#151f2c] rounded-xl border border-gray-800">
                  <span className="text-xs text-gray-400 block mb-1 uppercase font-semibold">
                    {t.location.emailLabel}
                  </span>
                  <a href={`mailto:${siteConfig.email}`} className="font-bold text-white hover:text-[#ffd778]">
                    {siteConfig.email}
                  </a>
                </div>

                <div className="p-4 bg-[#151f2c] rounded-xl border border-gray-800">
                  <span className="text-xs uppercase tracking-wider text-[#ffd778] font-bold block mb-1">
                    {t.location.landmarksLabel}
                  </span>
                  <p className="text-xs sm:text-sm text-gray-300">
                    {t.location.landmarksText}
                  </p>
                </div>
              </div>
            </div>

            {/* Google Maps External Button */}
            <div className="mt-8 pt-4 border-t border-gray-800">
              <a
                href={siteConfig.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                id="location-how-to-arrive-btn"
                className="btn-wine-red w-full py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <span>{t.location.openMaps}</span>
                <ExternalLink className="w-4 h-4 text-[#ffd778]" />
              </a>
            </div>
          </div>

          {/* Column 2: Location Map & Transit Times */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            {/* Nautical Position Card */}
            <div className="relative rounded-3xl overflow-hidden border border-[#c5a059]/40 bg-[#0d151f] shadow-xl p-7 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                <span className="text-xs font-bold uppercase tracking-widest text-[#ffd778]">
                  Coordenadas GPS Base Camp
                </span>
                <span className="text-xs text-gray-400 font-mono">16°20′N 86°29′W</span>
              </div>

              <div className="my-8">
                <span className="text-xs text-gray-400 uppercase tracking-wider block">
                  Punto de Encuentro Oficial
                </span>
                <h4 className="font-heading text-2xl font-bold text-white mt-1">
                  Pirates of the Caribbean Zipline Base Camp
                </h4>
                <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                  Ubicado en la cresta central de la selva de Roatán. Transporte privado disponible directamente desde el muelle de su crucero o resort.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-800 text-xs text-gray-400">
                <span>French Harbour Ridge, Roatán</span>
                <a
                  href={siteConfig.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#d4af37] font-bold hover:underline"
                >
                  Abrir Ruta en Navegación GPS →
                </a>
              </div>
            </div>

            {/* Transit Times Cards for Cruisers & Tourists */}
            <div className="bg-[#101822] border border-[#c5a059]/30 rounded-3xl p-6 shadow-xl">
              <h4 className="font-heading text-base font-bold text-[#d4af37] mb-4">
                {t.location.cruiseTimesTitle}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-[#151f2c] rounded-xl border border-gray-800">
                  <span className="text-xs text-gray-400 block">{t.location.ports.mahogany}</span>
                  <span className="font-bold text-emerald-400 text-sm mt-0.5 block">{t.location.ports.mahoganyTime}</span>
                </div>

                <div className="p-3.5 bg-[#151f2c] rounded-xl border border-gray-800">
                  <span className="text-xs text-gray-400 block">{t.location.ports.coxen}</span>
                  <span className="font-bold text-emerald-400 text-sm mt-0.5 block">{t.location.ports.coxenTime}</span>
                </div>

                <div className="p-3.5 bg-[#151f2c] rounded-xl border border-gray-800">
                  <span className="text-xs text-gray-400 block">{t.location.ports.airport}</span>
                  <span className="font-bold text-white text-sm mt-0.5 block">{t.location.ports.airportTime}</span>
                </div>

                <div className="p-3.5 bg-[#151f2c] rounded-xl border border-gray-800">
                  <span className="text-xs text-gray-400 block">{t.location.ports.westBay}</span>
                  <span className="font-bold text-white text-sm mt-0.5 block">{t.location.ports.westBayTime}</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 mt-4 italic">
                * {siteConfig.cruisePortNotes[lang]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
