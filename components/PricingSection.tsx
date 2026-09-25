'use client';

import React from 'react';
import { Anchor, Check, ShipWheel, TicketCheck } from 'lucide-react';
import { Language, PriceTier } from '@/lib/types';
import { translations } from '@/lib/translations';

interface PricingSectionProps {
  lang: Language;
  prices: PriceTier[];
  onBookRate: (rateId: string) => void;
}

export function PricingSection({ lang, prices, onBookRate }: PricingSectionProps) {
  const t = translations[lang];

  return (
    <section id="precios" className="harbor-pricing py-24 relative text-white overflow-hidden">
      <div className="harbor-pricing-ring" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="harbor-pricing-header mb-14">
          <div>
            <span className="harbor-pricing-kicker"><Anchor className="h-4 w-4" />{t.pricing.badge}</span>
            <h2 id="pricing-heading" className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">{t.pricing.title}</h2>
            <p className="text-base sm:text-lg">{t.pricing.subtitle}</p>
          </div>
          <div className="harbor-rate-seal"><ShipWheel className="h-8 w-8" /><strong>{lang === 'es' ? 'Tarifas Oficiales' : 'Official Rates'}</strong><span>Roatán · 2026</span></div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {prices.map((tier, tierIndex) => {
            const isFeatured = tier.isPopular;

            return (
              <div
                key={tier.id}
                id={`price-card-${tier.id}`}
                className={`harbor-ticket relative flex flex-col justify-between p-6 transition-all duration-300 ${isFeatured ? 'is-featured' : ''}`}
              >
                <span className="harbor-ticket-number">{String(tierIndex + 1).padStart(2, '0')}</span>
                {/* Clean ribbon tag for Featured */}
                {isFeatured && (
                  <div className="harbor-popular-stamp">
                    <TicketCheck className="h-3.5 w-3.5" />{tier.tag?.[lang] || t.pricing.popularTag}
                  </div>
                )}

                <div>
                  {/* Category Title & Age */}
                  <div className="harbor-ticket-heading text-center pb-4">
                    <h3 className="font-heading text-xl font-bold mb-1">
                      {tier.title[lang]}
                    </h3>
                    <span className="text-xs block font-medium">
                      {tier.ageRange[lang]}
                    </span>
                  </div>

                  {/* Price display */}
                  <div className="harbor-ticket-price text-center my-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-2xl font-bold">$</span>
                      <span className="text-5xl font-extrabold tracking-tight">
                        {tier.price}
                      </span>
                      <span className="text-xs font-semibold uppercase">
                        {tier.currency}
                      </span>
                    </div>
                    <span className="text-xs block mt-1">
                      {t.pricing.perPerson}
                    </span>
                  </div>

                  {/* Included Services with refined bullets */}
                  <div className="space-y-3 mb-6">
                    <span className="harbor-ticket-label text-xs font-bold uppercase tracking-wider block">
                      {t.pricing.includedTitle}
                    </span>
                    <ul className="harbor-ticket-list space-y-2 text-xs sm:text-sm">
                      {tier.included[lang].map((inc, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Conditions */}
                  {tier.conditions && (
                    <div className="harbor-ticket-conditions pt-3 mb-6">
                      <span className="text-[11px] font-semibold block uppercase tracking-wider">
                        {t.pricing.conditionsTitle}
                      </span>
                      <p className="text-xs mt-1 italic">
                        {tier.conditions[lang]}
                      </p>
                    </div>
                  )}
                </div>

                {/* Book Action Button */}
                <div className="harbor-ticket-action pt-4">
                  <button
                    type="button"
                    onClick={() => onBookRate(tier.id)}
                    className="w-full py-3 text-sm font-bold tracking-wide transition-all"
                  >
                    {t.pricing.bookThis}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Policy & Transparent Terms Note */}
        <div className="harbor-manifest mt-14 p-6 sm:p-8">
          <h4 className="font-heading text-lg font-bold mb-4">
            {t.pricing.notesTitle}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
            {t.pricing.notes.map((note, index) => (
              <div key={index} className="flex items-start gap-2.5 p-3.5">
                <Anchor className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
