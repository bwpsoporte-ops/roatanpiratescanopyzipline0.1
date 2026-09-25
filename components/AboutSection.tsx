'use client';

import React from 'react';
import Image from 'next/image';
import { Language } from '@/lib/types';
import { translations } from '@/lib/translations';

interface AboutSectionProps {
  lang: Language;
}

export function AboutSection({ lang }: AboutSectionProps) {
  const t = translations[lang];

  return (
    <section id="nosotros" className="py-24 bg-[#090e15] relative text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Photos Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative h-96 sm:h-[480px] rounded-3xl overflow-hidden border-2 border-[#c5a059]/40 shadow-2xl">
              <Image
                src="/image/WhatsApp%20Image%202026-09-21%20at%208.25.07%20PM.jpeg"
                alt="Pirates of the Caribbean Zipline Roatan guides and team"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090e15]/90 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase font-bold text-[#ffd778] tracking-widest block mb-1">
                  Roatán Heritage & Guides
                </span>
                <p className="font-heading text-xl font-bold">
                  {lang === 'es' ? 'Guiados por Nativos de la Isla de Roatán' : 'Led by Proud Roatán Native Island Guides'}
                </p>
              </div>
            </div>

            {/* Editorial Seal */}
            <div className="absolute -bottom-5 -right-3 bg-[#111923] border border-[#c5a059] px-5 py-3 rounded-2xl shadow-2xl hidden sm:block">
              <span className="font-heading font-bold text-[#ffd778] text-sm block">
                100% Eco-Sostenible
              </span>
              <span className="text-[11px] text-gray-300">
                {lang === 'es' ? 'Protección activa de la selva virgen' : 'Active canopy rainforest stewardship'}
              </span>
            </div>
          </div>

          {/* Story & Philosophy */}
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#162230] border border-[#c5a059]/40 text-[#d4af37] text-xs font-bold uppercase tracking-widest">
              {t.about.badge}
            </span>

            <h2
              id="about-heading"
              className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white"
            >
              {t.about.title}
            </h2>

            <p className="text-base text-gray-300 leading-relaxed">
              {t.about.storyP1}
            </p>

            <p className="text-base text-gray-300 leading-relaxed">
              {t.about.storyP2}
            </p>

            {/* Pillars - Refined editorial typography */}
            <div className="space-y-3 pt-2">
              <div className="p-4 bg-[#101822] rounded-xl border border-gray-800">
                <span className="text-xs uppercase tracking-wider font-bold text-[#ffd778] block mb-1">
                  {lang === 'es' ? 'Misión' : 'Mission'}
                </span>
                <span className="text-xs sm:text-sm text-gray-300 block">
                  {t.about.values.mission}
                </span>
              </div>

              <div className="p-4 bg-[#101822] rounded-xl border border-gray-800">
                <span className="text-xs uppercase tracking-wider font-bold text-[#ffd778] block mb-1">
                  {lang === 'es' ? 'Visión' : 'Vision'}
                </span>
                <span className="text-xs sm:text-sm text-gray-300 block">
                  {t.about.values.vision}
                </span>
              </div>

              <div className="p-4 bg-[#101822] rounded-xl border border-gray-800">
                <span className="text-xs uppercase tracking-wider font-bold text-[#ffd778] block mb-1">
                  {lang === 'es' ? 'Compromiso Ecológico' : 'Ecological Commitment'}
                </span>
                <span className="text-xs sm:text-sm text-gray-300 block">
                  {t.about.values.eco}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
