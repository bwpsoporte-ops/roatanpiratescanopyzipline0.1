'use client';

import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, X } from 'lucide-react';
import { Language, SiteConfig } from '@/lib/types';
import { translations } from '@/lib/translations';

interface QuickActionsProps {
  lang: Language;
  siteConfig: SiteConfig;
  onBookClick: () => void;
}

export function QuickActions({ lang, siteConfig, onBookClick }: QuickActionsProps) {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const t = translations[lang];

  const rawWhatsapp = siteConfig.whatsapp.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${rawWhatsapp}?text=${encodeURIComponent(
    lang === 'es'
      ? '¡Hola! Quisiera información y consultar disponibilidad para Pirates of the Caribbean Zipline en Roatán.'
      : 'Hello! I would like information and check availability for Pirates of the Caribbean Zipline in Roatan.'
  )}`;

  return (
    <>
      {/* Floating Actions for Desktop / Tablet */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:flex flex-col items-end gap-3">
        {/* Floating Tooltip bubble */}
        {tooltipVisible && (
          <div className="bg-[#111923] border border-[#c5a059] text-gray-200 text-xs px-3.5 py-2 rounded-xl shadow-xl max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center justify-between gap-2">
            <span>
              {lang === 'es'
                ? '¿Preguntas sobre tu crucero o reserva? ¡Escríbenos!'
                : 'Questions about your ship or booking? Chat with us!'}
            </span>
            <button
              type="button"
              onClick={() => setTooltipVisible(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Quick Call Button */}
          <a
            href={`tel:${siteConfig.phone}`}
            title={lang === 'es' ? 'Llamar' : 'Call us'}
            className="w-11 h-11 rounded-full bg-[#121b27] border border-[#c5a059]/40 text-[#ffd778] hover:bg-[#1a2636] flex items-center justify-center shadow-lg transition-transform hover:scale-105"
          >
            <Phone className="w-4 h-4" />
          </a>

          {/* Quick Email Button */}
          <a
            href={`mailto:${siteConfig.email}`}
            title={lang === 'es' ? 'Enviar correo' : 'Send email'}
            className="w-11 h-11 rounded-full bg-[#121b27] border border-[#c5a059]/40 text-[#ffd778] hover:bg-[#1a2636] flex items-center justify-center shadow-lg transition-transform hover:scale-105"
          >
            <Mail className="w-4 h-4" />
          </a>

          {/* Primary WhatsApp Floating Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            id="floating-whatsapp-btn"
            onMouseEnter={() => setTooltipVisible(true)}
            aria-label="WhatsApp"
            className="relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 border-2 border-white/20"
          >
            <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border border-white" />
            </span>
          </a>
        </div>
      </div>

      {/* Fixed Bottom Action Bar for Mobile Phones */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090e15]/95 backdrop-blur-md border-t border-[#c5a059]/40 p-2.5 flex items-center gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          id="mobile-bottom-whatsapp-btn"
          className="flex-1 py-2.5 px-3 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>WhatsApp</span>
        </a>

        <button
          type="button"
          id="mobile-bottom-book-btn"
          onClick={onBookClick}
          className="btn-wine-red flex-1 py-2.5 px-3 rounded-xl font-bold text-xs text-center shadow"
        >
          {t.nav.bookNow}
        </button>
      </div>
    </>
  );
}
