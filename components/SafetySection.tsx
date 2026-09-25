'use client';

import React from 'react';
import { Language } from '@/lib/types';
import { translations } from '@/lib/translations';

interface SafetySectionProps {
  lang: Language;
}

export function SafetySection({ lang }: SafetySectionProps) {
  const t = translations[lang];

  return (
    <section id="seguridad" className="py-24 bg-[#0a1017] relative text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#162230] border border-[#c5a059]/40 text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-3">
            {t.safety.badge}
          </span>
          <h2
            id="safety-heading"
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white"
          >
            {t.safety.title}
          </h2>
          <div className="w-20 h-1 bg-[#d4af37] mx-auto my-4 rounded-full" />
          <p className="text-base sm:text-lg text-gray-300">
            {t.safety.subtitle}
          </p>
        </div>

        {/* Safety Highlights Grid - Authentic editorial style with numbered standards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#111923] border border-[#c5a059]/30 rounded-2xl p-7 shadow-lg hover:border-[#c5a059] transition-colors">
            <span className="font-heading text-3xl font-bold text-[#c5a059] block mb-3">
              01
            </span>
            <h3 className="font-heading text-xl font-bold text-white mb-2">
              {lang === 'es' ? 'Sistema de Doble Cable Redundante' : 'Redundant Dual-Cable Security'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {lang === 'es'
                ? 'Cada participante se conecta a dos cables de acero aeronáutico galvanizado independientes capaces de soportar más de 20,000 libras de tensión cada uno.'
                : 'Each rider is clipped into two independent aircraft-grade galvanized steel cables, each engineered to withstand over 20,000 lbs of tensile load.'}
            </p>
          </div>

          <div className="bg-[#111923] border border-[#c5a059]/30 rounded-2xl p-7 shadow-lg hover:border-[#c5a059] transition-colors">
            <span className="font-heading text-3xl font-bold text-[#c5a059] block mb-3">
              02
            </span>
            <h3 className="font-heading text-xl font-bold text-white mb-2">
              {lang === 'es' ? 'Equipamiento Profesional Petzl' : 'Petzl Commercial Grade Gear'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {lang === 'es'
                ? 'Arneses de cuerpo entero, poleas tándem de alta velocidad, cascos ventilados y mosquetones de triple seguro con certificación internacional UIAA y CE.'
                : 'Full-body harnesses, high-speed dual pulleys, ventilated helmets, and triple-locking carabiners adhering to UIAA and CE international certifications.'}
            </p>
          </div>

          <div className="bg-[#111923] border border-[#c5a059]/30 rounded-2xl p-7 shadow-lg hover:border-[#c5a059] transition-colors">
            <span className="font-heading text-3xl font-bold text-[#c5a059] block mb-3">
              03
            </span>
            <h3 className="font-heading text-xl font-bold text-white mb-2">
              {lang === 'es' ? 'Guías Nativos Bilingües Certificados' : 'Certified Local Bilingual Guides'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {lang === 'es'
                ? 'Dos guías asignados por cada cable: un guía de despegue y un guía de recepción con frenado por gravedad asistido. Cero esfuerzo físico para el visitante.'
                : 'Two dedicated guides on every cable: one launch specialist and one receiver for gravity brake assistance. Zero physical braking strain on the guest.'}
            </p>
          </div>
        </div>

        {/* Safety Parameters & Rules Breakdown */}
        <div className="bg-[#121a24] border border-[#c5a059]/40 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <h3 className="font-heading text-2xl font-bold text-[#d4af37] mb-6">
            {t.safety.rulesTitle}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-4 bg-[#0d141d] rounded-xl border border-gray-800">
              <span className="font-bold text-white text-sm block mb-1">
                {lang === 'es' ? 'Límites de Peso' : 'Weight Limits'}
              </span>
              <p className="text-xs text-gray-300 leading-relaxed">
                {t.safety.weightNotice}
              </p>
            </div>

            <div className="p-4 bg-[#0d141d] rounded-xl border border-gray-800">
              <span className="font-bold text-white text-sm block mb-1">
                {lang === 'es' ? 'Calzado Obligatorio' : 'Required Footwear'}
              </span>
              <p className="text-xs text-gray-300 leading-relaxed">
                {t.safety.footwearNotice}
              </p>
            </div>

            <div className="p-4 bg-[#0d141d] rounded-xl border border-gray-800">
              <span className="font-bold text-white text-sm block mb-1">
                {lang === 'es' ? 'Política por Clima' : 'Rain & Weather Policy'}
              </span>
              <p className="text-xs text-gray-300 leading-relaxed">
                {t.safety.weatherNotice}
              </p>
            </div>

            <div className="p-4 bg-[#0d141d] rounded-xl border border-gray-800">
              <span className="font-bold text-white text-sm block mb-1">
                {lang === 'es' ? 'Salud y Restricciones Médicas' : 'Medical Considerations'}
              </span>
              <p className="text-xs text-gray-300 leading-relaxed">
                {t.safety.medicalNotice}
              </p>
            </div>

            <div className="p-4 bg-[#0d141d] rounded-xl border border-gray-800">
              <span className="font-bold text-white text-sm block mb-1">
                {lang === 'es' ? 'Acompañamiento y Tándem' : 'Guide Assist & Tandem'}
              </span>
              <p className="text-xs text-gray-300 leading-relaxed">
                {t.safety.guidesNotice}
              </p>
            </div>

            <div className="p-4 bg-[#0d141d] rounded-xl border border-gray-800">
              <span className="font-bold text-white text-sm block mb-1">
                {lang === 'es' ? 'Inspecciones Diarias' : 'Daily Line Inspections'}
              </span>
              <p className="text-xs text-gray-300 leading-relaxed">
                {lang === 'es'
                  ? 'Cada mañana a las 7:00 AM nuestros jefes de seguridad recorren los 9 cables antes de recibir a los primeros visitantes.'
                  : 'Every morning at 7:00 AM our safety supervisors test run all 9 cables before the first adventurers arrive.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
