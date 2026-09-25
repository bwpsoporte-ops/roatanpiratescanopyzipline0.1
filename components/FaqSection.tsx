'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Language, FaqItem } from '@/lib/types';
import { translations } from '@/lib/translations';

interface FaqSectionProps {
  lang: Language;
  faqs: FaqItem[];
}

export function FaqSection({ lang, faqs }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const t = translations[lang];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-[#090e15] relative text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#162230] border border-[#c5a059]/40 text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-3">
            {t.faq.badge}
          </span>
          <h2
            id="faq-heading"
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white"
          >
            {t.faq.title}
          </h2>
          <div className="w-20 h-1 bg-[#d4af37] mx-auto my-4 rounded-full" />
          <p className="text-base sm:text-lg text-gray-300">
            {t.faq.subtitle}
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.id}
                className="bg-[#101822] border border-[#c5a059]/30 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 text-white hover:text-[#d4af37] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-base sm:text-lg font-bold">
                    {faq.question[lang]}
                  </span>
                  <div className="p-1 rounded-full bg-[#162230] text-[#d4af37] shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-gray-800 pt-4 animate-in fade-in duration-200">
                    {faq.answer[lang]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
